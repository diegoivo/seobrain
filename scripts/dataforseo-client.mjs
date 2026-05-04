#!/usr/bin/env node
// DataForSEO shared client — auth, retry, rate limit, output writers.
// Skills /keywords-volume, /competitor-pages, /competitor-keywords usam este client.
// Falha cedo com mensagem clara se credenciais ausentes.

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname } from "node:path";

const BASE_URL = "https://api.dataforseo.com/v3";
const MAX_RETRIES = 4;
const RETRY_DELAYS_MS = [250, 500, 1000, 2000];
const DEFAULT_CONCURRENCY = 5;

export class DataForSEOError extends Error {
  constructor(message, { status, body } = {}) {
    super(message);
    this.name = "DataForSEOError";
    this.status = status;
    this.body = body;
  }
}

export function loadCredentials() {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  if (!login || !password) {
    const msg = [
      "❌ DataForSEO não configurado.",
      "",
      "Forma mais rápida: rode /dataforseo-config (ou: node ../../scripts/dataforseo-config.mjs).",
      "Sobe um form local que valida e grava as credenciais em .env.local.",
      "",
      "Manual: crie conta em https://app.dataforseo.com/register, pegue API Login/Password",
      "em Dashboard → API Access, e adicione em .env.local:",
      "  DATAFORSEO_LOGIN=seu_api_login",
      "  DATAFORSEO_PASSWORD=sua_api_password",
    ].join("\n");
    throw new DataForSEOError(msg, { status: 0 });
  }
  return { login, password };
}

function authHeader({ login, password }) {
  const creds = Buffer.from(`${login}:${password}`).toString("base64");
  return `Basic ${creds}`;
}

function logSafeCredentials({ login }) {
  const masked = login.length > 6 ? `${login.slice(0, 3)}***${login.slice(-3)}` : "***";
  console.log(`[dataforseo] auth as ${masked}`);
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function request(method, endpoint, payload, opts = {}) {
  const creds = opts.creds ?? loadCredentials();
  if (opts.verbose !== false && !opts.creds) logSafeCredentials(creds);

  const url = `${BASE_URL}${endpoint}`;
  const init = {
    method,
    headers: {
      Authorization: authHeader(creds),
    },
  };
  if (payload !== undefined && payload !== null) {
    init.headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(payload);
  }

  let lastError;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, init);

      if (res.status === 429) {
        const wait = RETRY_DELAYS_MS[attempt] ?? 2000;
        if (opts.verbose !== false) console.log(`[dataforseo] 429 rate limit, aguardando ${wait}ms`);
        await sleep(wait);
        continue;
      }

      const json = await res.json();

      if (!res.ok || json.status_code >= 40000) {
        throw new DataForSEOError(`API erro: ${json.status_message ?? res.statusText}`, {
          status: res.status,
          body: json,
        });
      }

      return json;
    } catch (err) {
      lastError = err;
      if (err instanceof DataForSEOError && err.status >= 400 && err.status < 500 && err.status !== 429) {
        throw err;
      }
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAYS_MS[attempt] ?? 2000);
      }
    }
  }
  throw lastError ?? new DataForSEOError("Máximo de retries atingido");
}

export async function callDataForSEO(endpoint, payload, opts = {}) {
  return request("POST", endpoint, payload, opts);
}

export async function getDataForSEO(endpoint, opts = {}) {
  return request("GET", endpoint, null, opts);
}

export async function validateCredentials(credsOverride, opts = {}) {
  const creds = credsOverride ?? loadCredentials();
  try {
    const json = await request("GET", "/appendix/user_data", null, { ...opts, creds, verbose: false });
    const userData = json.tasks?.[0]?.result?.[0]?.user_info ?? json.tasks?.[0]?.result?.[0] ?? {};
    const balance = userData.money?.balance ?? userData.money?.total ?? null;
    return { ok: true, balance, raw: json };
  } catch (err) {
    return {
      ok: false,
      error: err.message,
      status: err.status ?? null,
      hint: err.status === 401
        ? "Credenciais inválidas. Use API Login/Password (Dashboard → API Access), não email/senha do site."
        : null,
    };
  }
}

export async function taskPost(enginePath, tasks, opts = {}) {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    throw new DataForSEOError("taskPost: tasks deve ser array não-vazio");
  }
  if (tasks.length > 100) {
    throw new DataForSEOError(`taskPost: máximo 100 tasks por chamada (recebido ${tasks.length})`);
  }
  const json = await callDataForSEO(`/${enginePath}/task_post`, tasks, opts);
  return (json.tasks ?? []).map(t => ({
    id: t.id,
    statusCode: t.status_code,
    statusMessage: t.status_message,
    cost: t.cost ?? 0,
    data: t.data ?? {},
  }));
}

export async function pollTasksReady(enginePath, taskIds, opts = {}) {
  const wanted = new Set(taskIds);
  const found = new Map();
  const intervalMs = opts.intervalMs ?? 10000;
  const timeoutMs = opts.timeoutMs ?? 5 * 60 * 1000;
  const start = Date.now();
  let firstWait = opts.firstWaitMs ?? 5000;
  if (firstWait > 0) await sleep(firstWait);

  while (found.size < wanted.size) {
    if (Date.now() - start > timeoutMs) {
      const missing = [...wanted].filter(id => !found.has(id));
      throw new DataForSEOError(
        `pollTasksReady: timeout após ${timeoutMs}ms — ${missing.length} task(s) ainda em fila`,
        { body: { missing } },
      );
    }
    const json = await getDataForSEO(`/${enginePath}/tasks_ready`, opts);
    for (const task of json.tasks ?? []) {
      for (const r of task.result ?? []) {
        if (wanted.has(r.id) && !found.has(r.id)) {
          found.set(r.id, {
            id: r.id,
            endpointAdvanced: r.endpoint_advanced,
            endpointRegular: r.endpoint_regular,
            endpointHtml: r.endpoint_html,
          });
        }
      }
    }
    if (found.size < wanted.size) {
      if (opts.verbose !== false) {
        console.log(`[dataforseo] ${found.size}/${wanted.size} tasks prontas, aguardando ${intervalMs}ms`);
      }
      await sleep(intervalMs);
    }
  }
  return [...found.values()];
}

export async function fetchTaskResult(endpointPath, opts = {}) {
  // endpointPath chega como "/v3/serp/google/organic/task_get/advanced/<id>"
  // BASE_URL já tem "/v3", então removemos o prefixo se vier completo.
  const normalized = endpointPath.startsWith("/v3/") ? endpointPath.slice(3) : endpointPath;
  return getDataForSEO(normalized, opts);
}

export async function pLimit(concurrency, items, fn) {
  const results = [];
  let cursor = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const idx = cursor++;
      results[idx] = await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return results;
}

export function defaultLocale() {
  return {
    location_code: Number(process.env.DATAFORSEO_LOCATION_CODE ?? 2076),
    language_code: process.env.DATAFORSEO_LANGUAGE_CODE ?? "pt",
  };
}

export function ensureDir(filepath) {
  const dir = dirname(filepath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

export function writeOutputs(basePath, { md, csv, json }) {
  ensureDir(basePath);
  if (md) writeFileSync(`${basePath}.md`, md, "utf8");
  if (csv) writeFileSync(`${basePath}.csv`, csv, "utf8");
  if (json) writeFileSync(`${basePath}.json`, JSON.stringify(json, null, 2), "utf8");
}

export function rowsToCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = v => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map(h => escape(row[h])).join(","));
  }
  return lines.join("\n");
}

export function rowsToMarkdown(rows, { title, intro } = {}) {
  if (!rows.length) return `# ${title ?? "Resultado"}\n\nSem dados.\n`;
  const headers = Object.keys(rows[0]);
  const lines = [];
  if (title) lines.push(`# ${title}`, "");
  if (intro) lines.push(intro, "");
  lines.push(`| ${headers.join(" | ")} |`);
  lines.push(`| ${headers.map(() => "---").join(" | ")} |`);
  for (const row of rows) {
    lines.push(`| ${headers.map(h => row[h] ?? "").join(" | ")} |`);
  }
  return lines.join("\n") + "\n";
}

export function estimateCost(operation, count = 1, opts = {}) {
  const PRICES = {
    "keywords-volume": 0.05,
    "competitor-pages": 0.30,
    "competitor-keywords": 0.30,
  };

  // SERP batch async (Standard Normal): top 10 = $0.0006, cada página adicional (10) = 75% do base = $0.00045.
  // Cap de depth = 200 (Set/2025, após Google matar num=100).
  if (operation === "serp-batch") {
    const depth = Math.min(opts.depth ?? 200, 200);
    const priority = opts.priority ?? 1; // 1=normal, 2=high
    const base = priority === 2 ? 0.0012 : 0.0006;
    const extraPages = Math.max(0, Math.ceil((depth - 10) / 10));
    const unit = base + extraPages * (base * 0.75);
    return { unit, total: unit * count, currency: "USD", depth, pages: 1 + extraPages };
  }

  const unit = PRICES[operation] ?? 0;
  return { unit, total: unit * count, currency: "USD" };
}

export function printCostPreview(operation, count, items, opts = {}) {
  const cost = estimateCost(operation, count, opts);
  const detail = cost.pages
    ? ` (${count} keywords × ${cost.pages} págs × $${cost.unit.toFixed(5)})`
    : ` (${count} × $${cost.unit.toFixed(2)})`;
  console.log(`[dataforseo] custo estimado: ~$${cost.total.toFixed(4)} ${cost.currency}${detail}`);
  if (items && items.length <= 10) {
    console.log(`[dataforseo] queries: ${items.join(", ")}`);
  }
  return cost;
}

export function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

export function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
