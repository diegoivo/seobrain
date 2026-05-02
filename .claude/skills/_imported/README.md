# Skills importadas (referências, não duplicadas)

Esta pasta contém **ponteiros** para skills do ecossistema que o kit
agentic-seo-kit invoca, sem duplicar código. Cada arquivo `.md` aqui descreve
qual skill global é usada por qual skill do kit.

## Filosofia

Skills do plugin Vercel e do skills.do são mantidas externamente. Replicá-las
aqui geraria divergência. Em vez disso:

1. Skills do kit (`conteudo`, `scaffold-ssg`, etc.) tentam invocar a skill
   externa via `Skill tool` no host.
2. Se indisponível, executam fallback inline (passos manuais documentados na
   própria SKILL.md).

## Mapa de dependências

| Skill do kit | Skills externas que invoca (em ordem) |
|---|---|
| `design-taste` | `stitch-design-taste`, `frontend-design`, `high-end-visual-design`, `brandbook` |
| `scaffold-ssg` | nenhuma — implementação completa inline |
| `scaffold-payload` | `vercel:vercel-payload`, `payload`, `vercel-payload` |
| `publicar` | `vercel:deploy`, `deploy-to-vercel`, `vercel-cli-with-tokens` |
| `conteudo` | nenhuma — usa WebSearch nativo do host |
| `wiki` | nenhuma |

## Skills externas relevantes (referência)

### Vercel
- `vercel:deploy` — deploy preview/prod via plugin oficial.
- `vercel:vercel-cli` — guia do Vercel CLI.
- `vercel:nextjs` — best practices Next.js App Router.
- `vercel:vercel-payload` — Payload v3 em Vercel com Neon.
- `vercel:knowledge-update` — corrige conhecimento desatualizado sobre Vercel.

### Payload
- `payload` — collections, fields, hooks, access control.
- `vercel-payload` — debugging cold starts e seed em Payload + Vercel.

### Frontend / Design
- `frontend-design` — interfaces production-grade.
- `stitch-design-taste` — design system semântico para Google Stitch.
- `high-end-visual-design` — bloqueia defaults genéricos de IA.
- `brandbook` — brand identity completo.

### QA / Testing
- `qa` — QA testing automatizado com fix.
- `qa-only` — QA report-only.
- `browse` / `gstack` — headless browser para verificação.

### Outras
- `audit-website` — audit SEO via squirrelscan.
- `benchmark` — performance regression detection.
- `web-design-guidelines` — Web Interface Guidelines compliance check.

## Por que não copiar para dentro do kit?

- **Divergência**: skills externas evoluem. Cópia local fica obsoleta.
- **Tamanho**: skills somam dezenas de MB. Kit precisa ser leve para `git clone`.
- **Licença**: nem toda skill global tem licença permissiva para redistribuição.

A regra é: **kit invoca, não duplica**. Fallback inline é o seguro de vida
quando o host não tem a skill externa.
