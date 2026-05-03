#!/usr/bin/env node
// Brain Lint — valida frontmatter obrigatório, índices e freshness do Brain.
// Uso: node scripts/brain-lint.mjs [--strict]

import { readdir, readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { argv } from "node:process";

const ROOT = process.cwd();
const STRICT = argv.includes("--strict");
const ERRORS = [];
const WARNINGS = [];

const REQUIRED_POST_FIELDS = [
  "title", "description", "slug", "date", "status", "schema_type",
  "primary_keyword", "search_intent", "target_persona",
  "proprietary_claims", "author",
];
const REQUIRED_SITE_FIELDS = [
  "title", "description", "slug", "updated", "status", "schema_type",
  "primary_keyword", "search_intent", "category",
];
const FRESHNESS_DAYS = 30;

await checkBrainCore();
await checkContent("content/posts", REQUIRED_POST_FIELDS);
await checkContent("content/site", REQUIRED_SITE_FIELDS);

console.log(`\nBrain Lint: ${ERRORS.length} erro(s), ${WARNINGS.length} warning(s)`);
for (const w of WARNINGS) console.log(`  ⚠️  ${w}`);
for (const e of ERRORS) console.log(`  ❌  ${e}`);

if (STRICT && ERRORS.length > 0) process.exit(1);

// ============================================================================

async function checkBrainCore() {
  const required = [
    "brain/index.md",
    "brain/tom-de-voz.md",
    "brain/personas.md",
    "brain/glossario/index.md",
    "brain/tecnologia/index.md",
    "brain/backlog.md",
  ];
  for (const f of required) {
    if (!existsSync(join(ROOT, f))) {
      ERRORS.push(`${f} não existe`);
      continue;
    }
    await checkFreshness(f);
  }
  if (!existsSync(join(ROOT, "brain/DESIGN.md"))) {
    WARNINGS.push("brain/DESIGN.md não existe — rode /design-init");
  }
}

async function checkFreshness(path) {
  const s = await stat(join(ROOT, path));
  const ageDays = (Date.now() - s.mtimeMs) / 86400000;
  if (ageDays > FRESHNESS_DAYS) {
    WARNINGS.push(`${path}: ${Math.round(ageDays)} dias sem atualização (>${FRESHNESS_DAYS}d)`);
  }
}

async function checkContent(dir, requiredFields) {
  const full = join(ROOT, dir);
  if (!existsSync(full)) return;
  const indexPath = join(full, "index.md");
  if (!existsSync(indexPath)) {
    WARNINGS.push(`${dir}/index.md não existe`);
  }
  let entries;
  try { entries = await readdir(full); } catch { return; }
  for (const entry of entries) {
    if (!entry.endsWith(".md") || entry === "index.md" || entry.startsWith("_")) continue;
    const filePath = join(full, entry);
    const content = await readFile(filePath, "utf8");
    const fm = parseFrontmatter(content);
    if (!fm) {
      ERRORS.push(`${dir}/${entry}: frontmatter ausente`);
      continue;
    }
    for (const field of requiredFields) {
      if (!(field in fm) || fm[field] === "" || fm[field] === null) {
        ERRORS.push(`${dir}/${entry}: campo obrigatório '${field}' ausente ou vazio`);
      }
    }
    if (Array.isArray(fm.proprietary_claims) && fm.proprietary_claims.length < 3) {
      ERRORS.push(`${dir}/${entry}: proprietary_claims precisa de pelo menos 3 itens (tem ${fm.proprietary_claims.length})`);
    }
  }
}

function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const out = {};
  let currentArrayKey = null;
  for (const line of m[1].split("\n")) {
    if (currentArrayKey && line.match(/^\s*-\s/)) {
      out[currentArrayKey].push(line.replace(/^\s*-\s/, "").trim().replace(/^["']|["']$/g, ""));
      continue;
    }
    currentArrayKey = null;
    const kv = line.match(/^([a-z_]+):\s*(.*)$/);
    if (!kv) continue;
    const [, k, v] = kv;
    if (v === "" || v === "[]") {
      out[k] = v === "[]" ? [] : "";
      if (v === "") currentArrayKey = k;
      if (currentArrayKey) out[k] = [];
    } else {
      out[k] = v.replace(/^["']|["']$/g, "");
    }
  }
  return out;
}
