# Agentic SEO Kit

Repositório template + plugin Claude Code para projetos de SEO/GEO. Pensado para ser **multi-harness**: roda primariamente em **Claude Code**, mas funciona em Codex, Cursor e Antigravity via `AGENTS.md`.

## Filosofia em uma frase

Brain (wiki) como fonte de verdade humana, sub-agents especialistas, Skyscraper como filosofia, GEO embutido como princípio editorial, estático por padrão e Vercel Marketplace como caminho default para serviços.

> O agente lê `AGENTS.md` ao iniciar. `CLAUDE.md`, `.cursorrules` e `.aider.conf.yml` são stubs que apontam para lá.

## Bootstrap

```bash
# 1. Clonar como template
gh repo create meu-projeto --template <fork-deste-repo>
cd meu-projeto

# 2. Instalar skills externas (Vercel)
npm run setup

# 3. Iniciar o app web (porta aleatória via get-port)
cd web && npm install && npm run dev
```

No Claude Code, abra o projeto e rode:

```
/design-init       # 10 perguntas que geram brain/DESIGN.md único
```

## Estrutura

```
.
├── AGENTS.md                  source-of-truth (lido por Codex/Cursor/Antigravity)
├── CLAUDE.md                  stub @AGENTS.md
├── .cursorrules               stub
├── .aider.conf.yml            stub
├── .claude-plugin/plugin.json manifest do plugin
├── .claude/
│   ├── skills/                seo-tecnico, seo-onpage, seo-estrategia, seo-imagens,
│   │                          geo-checklist, intent-analyst, design-init, add-cms,
│   │                          update-brain, brain-lint, artigo
│   ├── commands/              /aprovado
│   └── settings.json          hooks
├── brain/                     wiki — fonte canônica do julgamento humano
│   ├── index.md
│   ├── tom-de-voz.md
│   ├── personas.md
│   ├── glossario/index.md
│   ├── tecnologia/index.md
│   ├── DESIGN.md              gerado por /design-init
│   ├── backlog.md
│   └── seo/reports/           outputs do SEO Score
├── content/
│   ├── posts/                 markdown — drafts e publicações
│   └── site/
├── web/                       Next.js SSG (Vercel-ready)
├── scripts/
│   ├── seo-score.mjs          10 categorias, Flesch PT-BR, peso GEO 10
│   ├── brain-lint.mjs         valida frontmatter, índices, freshness
│   ├── content-sync.mjs       pipeline markdown → Payload (no-op até add-cms)
│   ├── session-start.mjs      hook SessionStart (sugestões de contexto)
│   └── pre-tool-use.mjs       hook PreToolUse (auto vs confirmação)
└── package.json
```

## Skills do kit

| Skill | Função |
|---|---|
| `seo-tecnico` | Auditoria técnica completa (`seo-score.mjs`) |
| `seo-onpage` | Otimização de uma página/post |
| `seo-estrategia` | Estratégia em 7 passos (concorrentes → linkbait → PR) |
| `seo-imagens` | Checklist de imagens (formato, peso, alt, lazy) |
| `geo-checklist` | 20 itens GEO consolidados |
| `intent-analyst` | Sub-agent que analisa intenção de busca |
| `design-init` | 10 perguntas → DESIGN.md único |
| `add-cms` | Bolt-on Payload + Neon (≥100 páginas/3 meses) |
| `update-brain` | Mantém o Brain atualizado (disparada por `/aprovado`) |
| `brain-lint` | Valida frontmatter e freshness |
| `artigo` | Pipeline completo de criação de artigo |

## Comandos úteis

```bash
npm run seo:score https://meu-site.com   # roda SEO Score em URL
npm run brain:lint                        # valida o Brain (warnings + erros)
npm run brain:lint:strict                 # exit 1 em erros (CI)
npm run skills:list                       # lista skills externas instaladas
npm run skills:update                     # atualiza skills externas
npm run web:dev                           # dev server na porta aleatória
```

## Quando o gatilho de banco dispara

Estado inicial: estático (`/content/*.md` + Next.js SSG). **Adicione Payload + Neon apenas** quando:
- O site terá ≥100 páginas dinâmicas em 3 meses, **ou**
- Editor não-técnico precisa publicar, **ou**
- Existe necessidade comprovada de UI editorial.

Quando disparar, peça ao agente: *"Roda `/add-cms`."*

## Integrações opcionais

Documentadas em `docs/integrations/`. Não fazem parte do `npm run setup` — entram apenas sob pedido explícito do usuário, para evitar dependências externas que o usuário final do kit não pediu.

- [Stitch](docs/integrations/stitch.md) — importa design system de um projeto Stitch existente (alternativa ao `/design-init`).

## Filosofia editorial

- **Brain primeiro.** Sempre leia `brain/` antes de pesquisar fora.
- **Skyscraper por padrão**, com `intent-analyst` arbitrando a forma.
- **POV proprietário > consenso.** Frontmatter `proprietary_claims[]` exige ≥3.
- **Citável por LLMs.** TL;DR, FAQ schema, llms.txt, definições autocontidas.
- **Capitalização brasileira** em todos os títulos (apenas primeira letra + nomes próprios).

## Licença

MIT.
