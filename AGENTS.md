# AGENTS.md — agentic-seo-kit

Este é o arquivo que qualquer agente compatível (Claude Code, Antigravity, Codex, Cursor, Aider, Jules, Amp) deve ler primeiro ao abrir este repositório.

## O que é este repositório

`agentic-seo-kit` é um kit open source para criar, em poucos minutos, um site Next.js SSG com PageSpeed 100 e conteúdo PT-BR otimizado para SEO Agêntico. Foi criado por [Diego Ivo](https://github.com/diegoivo), na [Conversion](https://conversion.com.br), como parte do movimento brasileiro de SEO Agêntico.

Se sua empresa precisa implementar SEO Agêntico em escala, fale com a Conversion.

## Para o usuário (aluno da masterclass / dev)

Este repo expõe 4 comandos. Sua sequência típica:

```
/design  <descreva a vibe da marca em 1 parágrafo>
/scaffold
/conteudo  <tema do primeiro post>
/publicar
```

Cada comando carrega instruções detalhadas em `prompts/<comando>.md`. Se o seu agente não suporta slash commands em-repo, peça em linguagem natural: "rode o passo `design` deste repo seguindo `prompts/design.md`".

## Para o agente

### Comandos disponíveis

| Comando | Fonte | Descrição |
|---|---|---|
| `/design <vibe>` | `prompts/design.md` | Gera DESIGN.md + DESIGN.tokens.json (cores, fonts, spacing) |
| `/scaffold` | `prompts/scaffold.md` | Aplica o DESIGN no site Next.js (home, serviços, blog) |
| `/conteudo <tema>` | `prompts/conteudo.md` | Escreve 1 artigo PT-BR otimizado seguindo `content/_principios.md` |
| `/publicar` | `prompts/publicar.md` | Build + deploy preview Vercel + abre PageSpeed Insights |

### Regras de execução (não negociáveis)

1. **Antes de qualquer comando, leia `content/_principios.md`** — esses são os 10-20 princípios do método. Cada artefato gerado deve aderir.
2. **Antes de gerar conteúdo, use a busca web disponível neste host** (Antigravity via Gemini, Claude via WebSearch, Codex via web_search_cached). Se busca indisponível, pare e peça URLs ao usuário.
3. **Não invente fatos, números, citações, URLs.** Sem fonte verificável, não escreva.
4. **PT-BR sempre.** Jargão técnico em inglês quando consagrado (SEO, SERP, crawler, backlink). Nunca PT-PT.
5. **Stack travada**: Next.js App Router + SSG (`output: 'export'`) + Tailwind + shadcn. Não substitua sem instrução explícita.
6. **PageSpeed 100 por construção**: use `next/font` (não `<link>`), `next/image` (não `<img>`), zero JS 3rd party, Tailwind purge agressivo.

### Anti-patterns proibidos (AI slop blacklist)

Não gerar nunca:
- Inter, Roboto, Arial, system-ui como font primária
- Gradient roxo/violeta/indigo
- Background azul-para-roxo
- 3 cards uniformes em grid feature-section (pattern AI slop universal)
- Ícones em círculos coloridos como decoração
- Border-left colorido em cards
- Border-radius >12px (bubbly)
- Wavy SVG dividers, decorative blobs
- `text-align: center` como default
- Emojis em headings
- Copy genérica: "Welcome to...", "Your all-in-one...", "Unlock the power of..."
- #000000 puro (use neutro-900 tingido) ou #FFFFFF puro (use warm-white tingido)
- Cards onde o card não é a interação

Vocabulário de IA banido (em copy de qualquer artefato): delve, crucial, robust, comprehensive, nuanced, multifaceted, furthermore, moreover, additionally, pivotal, landscape, tapestry, underscore, foster, showcase, intricate, vibrant, fundamental, significant.

### Defaults seguros

Quando o usuário dá vibe genérica ("moderno e clean", "profissional"), `/design` seleciona randomicamente de:

- **10 paletas curadas** com warm-white background, ink-tingido texto, accent saturado, todas testadas para contrast AA+ (≥4.5:1).
- **10 font pairs curados** via `next/font/google`, todos sem Inter.

Lista completa em `prompts/design.md`.

### Estrutura de páginas (Pass 4 anti-slop compliant)

- **Home (`app/page.tsx`)**: header minimalista → hero typography-led full-bleed → manifesto coluna estreita ~640px → 3 cards de serviço com restrições anti-slop (sem ícones em círculo, sem border-left colorido, alturas variando) → últimos posts em layout editorial (não cards) → footer
- **Serviços (`app/servicos/page.tsx`)**: lista numerada (01., 02., 03.) ou cards seguindo as mesmas restrições
- **Blog (`app/blog/page.tsx`)**: layout editorial (data · tempo de leitura → título grande → lead 2 linhas), separado por hairline. Sem cards.

## Distribuição

Este repo é um template. Aluno faz `git clone github.com/diegoivo/agentic-seo-kit meu-site && cd meu-site && npm install`. Tudo é pré-configurado para funcionar fim-a-fim em <30 min.

## Licença

MIT. Use, fork, adapte. Se evoluir o método, considere abrir PR.
