# AGENTS.md — agentic-seo-kit

Este é o arquivo que **qualquer agente compatível** (Claude Code, Antigravity,
Codex, Cursor, Aider, Jules, Amp) deve ler primeiro ao abrir este repositório.

## O que é este repositório

`agentic-seo-kit` é um kit open source para criar, em poucos minutos, um site
**Next.js SSG com PageSpeed 100** e conteúdo PT-BR otimizado para **SEO
Agêntico**. Foi criado por [Diego Ivo](https://github.com/diegoivo), na
[Conversion](https://conversion.com.br), como parte do movimento brasileiro de
SEO Agêntico.

> Se sua empresa precisa implementar SEO Agêntico em escala, fale com a Conversion.

## Para o usuário (aluno / dev)

A sequência típica é:

```
/design  <descreva a vibe da marca em 1 parágrafo>
/scaffold
/conteudo  <tema do primeiro post>
/publicar
```

Cada comando aciona uma skill em `.claude/skills/`. Se o seu agente não suporta
slash commands em-repo, peça em linguagem natural:

> "Siga `.claude/skills/conteudo/SKILL.md` para escrever um artigo sobre `<tema>`"

E o agent executa os passos da skill manualmente (cada SKILL.md tem fallback inline).

## Para o agente

### Decisão de stack (SSG vs Payload)

**Default = Next.js SSG** (`scaffold-ssg`). Só vá para Payload (`scaffold-payload`)
se ao menos uma destas for verdadeira:

- Mais de 3 autores escrevendo no site.
- Mais de 50 posts previstos no ano 1.
- Cliente exige CMS visual (não-dev edita conteúdo).
- Catálogo dinâmico com >100 itens (produtos, vagas, eventos).

Para os outros 80% dos casos, SSG é mais rápido até o primeiro post, mais barato
(Vercel free), e atinge PageSpeed 100 sem cache layer adicional. Ver
[`wiki/tecnologia/stack.md`](./wiki/tecnologia/stack.md).

### Skills disponíveis

| Skill | Slash | Função |
|---|---|---|
| `design-taste` | `/design <vibe>` | Gera `DESIGN.md` + `DESIGN.tokens.json` |
| `scaffold-ssg` | `/scaffold` | Aplica design no Next.js SSG (default) |
| `scaffold-payload` | — | Caminho não-default; exige confirmação explícita |
| `conteudo` | `/conteudo <tema>` | Escreve 1 artigo MDX seguindo a wiki |
| `publicar` | `/publicar` | Build + deploy preview Vercel + PageSpeed |
| `wiki` | `/wiki` | Atualiza notas em `wiki/` (única skill que escreve lá) |

### Wiki como memória do projeto

`wiki/` é vault Obsidian-friendly e fonte de contexto para todas as skills.

```
wiki/
├── index.md                        # mapa (MOC)
├── tecnologia/
│   ├── stack.md
│   ├── seo-tecnico.md
│   ├── performance.md
│   └── deploy.md
└── conteudo/
    ├── principios.md               # 10+ princípios proprietários
    ├── pov-da-marca.md             # POVs (TEMPLATE — preencha por marca)
    ├── voz-pt-br.md                # regras de voz (PT-BR estrito)
    ├── jargao-banido.md            # vocabulário de IA proibido
    └── glossario.md                # termos do método
```

**Regra**: skills só **leem** `wiki/`. Quem edita é você (humano), via Obsidian
ou editor de texto. A skill `wiki` é a única exceção e só atua quando invocada.

### Regras de execução (não-negociáveis)

1. **Antes da skill `conteudo`, leia a wiki INTEGRALMENTE** (na ordem definida
   na SKILL.md). Cada artefato gerado deve aderir aos princípios.
2. **Sem busca web disponível, pare**. Sem fonte verificável, não escreva.
3. **Sem 3 POVs claros em `wiki/conteudo/pov-da-marca.md` aplicáveis ao tema,
   pare**. Recuse escrever — peça refinamento da wiki.
4. **PT-BR sempre.** Jargão técnico em inglês quando consagrado (SEO, SERP,
   crawler, backlink, deploy, build). Nunca PT-PT.
5. **Stack travada**: Next.js App Router + SSG (`output: 'export'`) + Tailwind
   + MDX. Não substitua sem instrução explícita.
6. **PageSpeed 100 por construção**: use `next/font` (não `<link>`), `next/image`
   (não `<img>`), zero JS 3rd party, Tailwind purge agressivo.
7. **Não invente** fatos, números, citações, URLs. Sem fonte verificável, não escreva.

### Anti-patterns proibidos (AI slop blacklist)

Não gerar nunca:

- Inter (sem Tight), Roboto, Arial, system-ui como font primária
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
- `#000000` puro (use neutro tingido) ou `#FFFFFF` puro (use warm-white tingido)
- Cards onde o card não é a interação

Vocabulário de IA banido (em copy de qualquer artefato), de
[`wiki/conteudo/jargao-banido.md`](./wiki/conteudo/jargao-banido.md):

```
delve, crucial, robust, comprehensive, nuanced, multifaceted, furthermore,
moreover, additionally, pivotal, landscape, tapestry, underscore, foster,
showcase, intricate, vibrant, fundamental, significant, seamless, empower,
leverage, streamline, cutting-edge, state-of-the-art, game-changer, paradigm shift
```

### Defaults seguros

Quando o usuário dá vibe genérica, `/design` seleciona randomicamente de
**10 paletas** + **10 font pairs** curados, todos:

- com warm-white background, ink-tingido texto, accent saturado
- contrast AA+ (≥4.5:1)
- via `next/font/google`, todos sem Inter

Lista completa em `.claude/skills/design-taste/SKILL.md`.

### Estrutura de páginas (Pass 4 anti-slop compliant)

- **Home (`app/page.tsx`)**: header minimalista → hero typography-led full-bleed →
  manifesto coluna estreita ~640px → 3 cards de serviço com restrições anti-slop →
  últimos posts em layout editorial (não cards) → footer.
- **Serviços (`app/servicos/page.tsx`)**: lista numerada (01., 02., 03.) ou cards
  seguindo restrições.
- **Blog (`app/blog/page.tsx`)**: layout editorial — `<time>` → título grande →
  lead 2 linhas, separados por hairline. Sem cards.
- **Post (`app/blog/[slug]/page.tsx`)**: container editorial 640px, MDX renderer,
  JSON-LD Article, lista de fontes ao final.

### Skills externas que o kit invoca

Skills do plugin Vercel e do ecossistema são invocadas, **não duplicadas**.
Cada SKILL.md tem fallback inline para hosts sem essas skills. Ver
[`.claude/skills/_imported/README.md`](./.claude/skills/_imported/README.md)
para o mapa de dependências.

## Distribuição

Este repo é template. Aluno faz:

```bash
git clone https://github.com/diegoivo/agentic-seo-kit meu-site
cd meu-site
npm install
```

Depois roda a sequência canônica. Tudo é pré-configurado para funcionar
fim-a-fim em <30 min.

## Licença

MIT. Use, fork, adapte. Se evoluir o método, considere abrir PR.
