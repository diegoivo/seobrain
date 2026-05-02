# agentic-seo-kit

Kit open-source para criar sites **Next.js SSG com PageSpeed 100** e conteúdo
PT-BR otimizado para **SEO Agêntico**.

Criado por [Diego Ivo](https://github.com/diegoivo) na
[Conversion](https://conversion.com.br) como parte do movimento brasileiro de
SEO Agêntico.

## Quickstart (5 passos, ~30 min)

```bash
git clone https://github.com/diegoivo/agentic-seo-kit meu-site
cd meu-site
npm install
```

Depois, abra o repo no seu agent (Claude Code, Codex, Cursor, etc.) e rode
em sequência:

```
/design   Marca de fintech para PMEs, sóbria mas humana
/scaffold
/conteudo Como escolher uma agência de SEO Agêntico para B2B
/publicar
```

Cada comando aciona uma skill em `.claude/skills/`. Se o seu host não suporta
slash commands, peça em linguagem natural:

> "Siga `.claude/skills/conteudo/SKILL.md` para escrever um artigo sobre X"

## O que vem dentro

| Pasta | Para quê |
|---|---|
| `app/` | Next.js 15 App Router, SSG via `output: 'export'` |
| `lib/` | Helpers (`content`, `seo`, `site-config`) |
| `components/` | `SiteHeader`, `SiteFooter` (UI mínima) |
| `content/` | Posts MDX (1 post seed incluído) |
| `wiki/` | **Memória do projeto** — vault Obsidian-friendly |
| `.claude/skills/` | Skills do kit (`design-taste`, `scaffold-ssg`, `conteudo`, `publicar`, `wiki`, `scaffold-payload`) |
| `.claude/commands/` | Slash commands shim para Claude Code |
| `DESIGN.md` + `DESIGN.tokens.json` | Design system (regenerável por `/design`) |
| `AGENTS.md` | Orquestrador — leitura obrigatória para qualquer agent |

## Wiki como memória

`wiki/` é vault Obsidian-friendly. Abra a pasta no Obsidian (Open folder as
vault) e edite as notas:

- `wiki/conteudo/principios.md` — 10+ princípios editoriais
- `wiki/conteudo/pov-da-marca.md` — POVs proprietários (preencha para sua marca)
- `wiki/conteudo/voz-pt-br.md` — regras de voz brasileira
- `wiki/tecnologia/stack.md` — decisões de stack

Skills do kit **leem** a wiki antes de gerar qualquer artefato. Sem 3 POVs
claros em `pov-da-marca.md` aplicáveis ao tema, a skill `conteudo` recusa
escrever.

## Stack (default = SSG)

- **Next.js 15** App Router, React 19, TypeScript estrito
- **Tailwind 3.4** com tokens via `DESIGN.tokens.json`
- **MDX** para posts (`next-mdx-remote/rsc` + `gray-matter`)
- **`next/font/google`** para fontes (zero `<link>`)
- **Output**: `export` estático → qualquer CDN serve

Para sites grandes (>50 posts ou >3 autores), há caminho alternativo
`scaffold-payload` — não-default, exige confirmação. Ver
`.claude/skills/scaffold-payload/SKILL.md`.

## Scripts

```bash
npm run dev        # dev server local
npm run build      # build estático para out/
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

## PageSpeed 100 por construção

- Fontes via `next/font` (sem CLS).
- Imagens via `next/image` com `unoptimized: true` (export estático).
- Zero JS de terceiros na home.
- Tailwind purge automático.
- HTML estático servido por CDN.

Métricas alvo: Performance 100, Accessibility 100, Best Practices ≥95, SEO 100.
Ver `wiki/tecnologia/performance.md` para diagnóstico se cair.

## SEO técnico incluído

- JSON-LD `Organization` na home.
- JSON-LD `Article` em posts.
- `app/sitemap.ts` (estático).
- `app/robots.ts` (estático).
- Open Graph e Twitter Card via Metadata API.
- Trailing slash consistente (`trailingSlash: true`).

## Como o método se diferencia

1. **Wiki primeiro, web depois** — memória de marca antes de pesquisar fora.
2. **POV proprietário > consenso** — sem 3 POVs claros, não escreve.
3. **PT-BR estrito** — hard-checks contra PT-PT, gerundismo, voz passiva, AI slop.
4. **PageSpeed 100 não-negociável** — pré-condição para citação por LLMs.

## Contribuindo

Issues e PRs bem-vindos. Se você evoluir o método, considere documentar em
`wiki/` e abrir PR.

## Licença

MIT. Use, fork, adapte.
