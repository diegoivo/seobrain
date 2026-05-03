---
name: brain-lint
description: Valida o Brain — frontmatter obrigatório nos posts/páginas, índices presentes, freshness de arquivos core (>30 dias warning). Roda scripts/brain-lint.mjs. Use antes de PRs de conteúdo, ou periodicamente para detectar drift.
allowed-tools:
  - Bash
  - Read
---

# Brain Lint

Validação mecânica do Brain.

## Quando rodar

- Antes de PR de conteúdo (gate manual).
- Após `update-brain` (sanity check).
- Periodicamente (semanal) — detecta arquivos parados há >30 dias.

## Como rodar

```bash
node scripts/brain-lint.mjs            # warnings + erros, exit 0
node scripts/brain-lint.mjs --strict   # exit 1 se erros (uso em CI)
```

## O que valida

### Erros (bloqueiam em --strict)
- `brain/index.md`, `brain/tom-de-voz.md`, `brain/personas.md`, `brain/glossario/index.md`, `brain/tecnologia/index.md`, `brain/backlog.md` existem.
- Posts e páginas têm frontmatter completo.
- `proprietary_claims[]` tem ≥3 itens.

### Warnings (não bloqueiam)
- `brain/DESIGN.md` ausente — sugere `/design-init`.
- Arquivos do Brain core com >30 dias sem mtime — sugere revisão.
- `content/posts/index.md` ou `content/site/index.md` ausentes.

## Output

Resumo no console + exit code conforme `--strict`.
