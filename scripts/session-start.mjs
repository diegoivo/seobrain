#!/usr/bin/env node
// SessionStart hook — injeta contexto inicial no Claude Code.
// Imprime no stdout informações que o agent deve considerar antes de qualquer trabalho.

import { existsSync, statSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const FRESHNESS_DAYS = 30;
const messages = [];

// 1. Brain index
const brainIndex = join(ROOT, "brain/index.md");
if (existsSync(brainIndex)) {
  const ageDays = (Date.now() - statSync(brainIndex).mtimeMs) / 86400000;
  if (ageDays > FRESHNESS_DAYS) {
    messages.push(`📚 brain/index.md tem ${Math.round(ageDays)} dias sem atualização. Considere uma revisão geral.`);
  }
} else {
  messages.push("📚 brain/index.md não existe ainda. Inicialize o Brain antes de iniciar tarefas substantivas.");
}

// 2. DESIGN.md
const design = join(ROOT, "brain/DESIGN.md");
if (!existsSync(design)) {
  messages.push("🎨 brain/DESIGN.md ausente. Rode /design-init (10 perguntas) antes de mexer em UI.");
}

// 3. External skills age
const skillsLock = join(ROOT, ".claude/skills-lock.json");
if (existsSync(skillsLock)) {
  const ageDays = (Date.now() - statSync(skillsLock).mtimeMs) / 86400000;
  if (ageDays > FRESHNESS_DAYS) {
    messages.push(`🧰 Skills externas com ${Math.round(ageDays)} dias sem update. Quando conveniente: npm run skills:update`);
  }
}

if (messages.length === 0) {
  process.exit(0);
}

console.log("\n--- Agentic SEO Kit — checks de contexto ---");
for (const m of messages) console.log(m);
console.log("---\n");
