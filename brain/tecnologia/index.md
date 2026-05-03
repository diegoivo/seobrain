# Tecnologia

> Última atualização: 2026-05-02

## Stack atual

### Default (estado inicial)
- **Next.js** (App Router, SSG por padrão) em `/web`
- **shadcn/ui** para componentes
- **Vercel** para deploy + Vercel Marketplace para serviços externos
- **Sem banco de dados.** Conteúdo em `/content/*.md`.

### Quando o gatilho dispara (≥100 páginas/3 meses)
- **Payload CMS** em `/web`
- **Neon Postgres** via Vercel Marketplace
- Pipeline: `content/*.md (drafts) → content-sync → Payload (publicado)`

## Decisão sobre banco — registro

| Data | Estado | Justificativa |
|---|---|---|
| 2026-05-02 | Estático (sem CMS) | Estado inicial. Gatilho não disparou. |

Atualize esta tabela quando rodar a skill `add-cms`.

## Princípios

1. **Vercel é a plataforma padrão.** Todo serviço externo (banco, auth, storage, email) deve vir do Vercel Marketplace para unificar billing e env vars.
2. **Estático antes de dinâmico.** Markdown vence enquanto o site for pequeno.
3. **Pré-renderização sempre que possível.** ISR só quando necessário.
4. **Portas aleatórias** em dev (use `get-port`).

## Bibliotecas e ferramentas

- `get-port` — porta dev aleatória.
- `skills` (Vercel Labs) — instalação e update de skills externas.
- Scripts próprios: `seo-score`, `brain-lint`, `content-sync`.

## Skills externas instaladas (via `npx skills add`)

Documentadas em `.claude/skills-lock.json`. O `npm run setup` instala apenas:

```
npx skills add vercel-labs/agent-skills
```

Skills externas adicionais entram **sob demanda explícita**, dentro do fluxo de uma skill própria do kit:

- `payloadcms/skills --skill payload` — instalado pela skill `add-cms` quando o gatilho de banco disparar (ver §7.1 do AGENTS.md).
- Outras integrações opcionais ficam documentadas em `docs/integrations/`.
