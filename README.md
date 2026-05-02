# agentic-seo-kit

> Kit open source para criar um site Next.js SSG com PageSpeed 100 e conteúdo PT-BR otimizado para SEO Agêntico em poucos minutos.

**Por [Diego Ivo](https://github.com/diegoivo), na [Conversion](https://conversion.com.br)**. Open source MIT.

Se sua empresa precisa implementar SEO Agêntico em escala (+500 funcionários, ICP enterprise), [fale com o time da Conversion](mailto:contato@conversion.com.br).

## O que faz

4 comandos, executados sequencialmente em qualquer agente compatível com `AGENTS.md`:

```
/design   <descreva a vibe da marca>
/scaffold
/conteudo <tema do post>
/publicar
```

Resultado: site Next.js publicado no Vercel preview, com PageSpeed 100, design system próprio (gerado por [stitch-design-taste](https://github.com/anthropics/skill-stitch-design-taste)), e 1 artigo PT-BR otimizado seguindo o método.

## Pré-requisitos

- [Node.js 22 ou 24 LTS](https://nodejs.org)
- Git
- Um agente compatível com `AGENTS.md`:
  - [Antigravity](https://antigravity.google) (free tier, recomendado para começar)
  - [Claude Code](https://claude.ai/code)
  - [Codex CLI](https://github.com/openai/codex), Cursor, Aider, ou similar
- Conta gratuita no [Vercel](https://vercel.com) (login no primeiro `/publicar`)

## Quick start

```bash
git clone https://github.com/diegoivo/agentic-seo-kit meu-site
cd meu-site
npm install
```

Abra o agente da sua escolha apontando para esse diretório e rode os 4 comandos em sequência. Cada um leva 2-5 minutos.

## O que NÃO fazemos (anti-AI-slop)

Para criar autoridade visual real, este kit recusa os patterns que gritam "AI-generated":

- ❌ Inter, Roboto, Arial, system-ui como font (use General Sans, Geist, Manrope, ou outras curadas)
- ❌ Gradient roxo/violeta/indigo no background
- ❌ 3 cards uniformes lado-a-lado com ícones em círculos coloridos
- ❌ Border-radius bubbly em tudo
- ❌ #000000 e #FFFFFF puros
- ❌ Copy genérica ("Welcome to...", "Your all-in-one...", "Unlock the power of...")
- ❌ Vocabulário de IA: delve, crucial, robust, comprehensive, tapestry, etc.

Lista completa em `AGENTS.md`.

## Defaults seguros

Quando você não sabe que vibe quer, `/design` seleciona randomicamente de:
- **10 paletas curadas** (Editorial Bege, Linho Frio, Pedra, Manhã, Indigo Klein, Carvão, Tofu, Branco Cru, Pó de Café, Areia)
- **10 font pairs curados** (todos via `next/font/google`, zero Inter)

Cada combinação é testada para contrast AA+ e segue o spec [DESIGN.md open source](https://mindwiredai.com/2026/04/23/design-md-is-now-open-source/) do Google.

## Stack

- [Next.js](https://nextjs.org) App Router (SSG via `output: 'export'`)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) (componentes mínimos: button, card, badge)
- [Vercel](https://vercel.com) para deploy preview
- [next/font/google](https://nextjs.org/docs/app/api-reference/components/font) + [next/image](https://nextjs.org/docs/app/api-reference/components/image) para Lighthouse 100

## O método (resumo)

10-20 princípios em [`content/_principios.md`](./content/_principios.md). Os mais importantes:

1. **Wiki primeiro, web depois** — POV proprietário antes de pesquisa externa
2. **Skyscraper por padrão, intenção manda na forma**
3. **POV proprietário > consenso** — 3-5 posições que só esta marca sustenta
4. **Domínio próprio: linkagem interna primeiro**
5. **Anti-jargão**, **citações verificáveis**, **PT-BR sempre**
6. **JSON-LD Article + Organization** em toda página

## Comunidade

Versão público-facing em construção. Acesso à comunidade para alunos da [masterclass de SEO Agêntico da Conversion](https://conversion.com.br) (gratuita).

## Licença

[MIT](./LICENSE). Use, fork, adapte, ensine. Se evoluir o método, considere abrir PR.

## Contribuindo

PRs bem-vindos. Para mudanças no método (princípios PT-BR, paletas, prompts), abra issue antes para discutir.
