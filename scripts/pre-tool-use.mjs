#!/usr/bin/env node
// PreToolUse hook — diferencia mudanças auto vs com confirmação.
// Lê o input JSON do hook via stdin, decide aprovar ou pedir confirmação.

import { readFileSync } from "node:fs";

const AUTO_PATHS = [
  /^brain\//,
  /^content\/.*\/_template\.md$/,
  /^content\/(posts|site)\/.*\.md$/,
  /^\.cache\//,
];

const CONFIRM_PATHS = [
  /^package\.json$/,
  /^package-lock\.json$/,
  /^pnpm-lock\.yaml$/,
  /migrations?\//,
  /^web\/payload\.config\./,
  /^\.github\//,
  /^\.claude\/settings\.json$/,
];

let input = "";
try {
  input = readFileSync(0, "utf8");
} catch {
  process.exit(0);
}

let payload;
try {
  payload = JSON.parse(input);
} catch {
  process.exit(0);
}

const filePath = payload?.tool_input?.file_path ?? payload?.tool_input?.path ?? "";
if (!filePath) process.exit(0);

const rel = filePath.replace(process.cwd() + "/", "");

if (CONFIRM_PATHS.some(rx => rx.test(rel))) {
  // Não bloqueia, mas anota — Claude Code mostra ao usuário.
  console.error(`⚠️  Mudança em path crítico (${rel}). Confirme com o usuário antes de prosseguir.`);
}

process.exit(0);
