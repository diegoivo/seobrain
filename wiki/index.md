---
title: Wiki — agentic-seo-kit
tags: [moc, index]
updated: 2026-05-02
---

# Wiki da marca

Esta wiki é a memória do projeto. Funciona como vault do Obsidian (use
`[[wikilinks]]` à vontade) e ao mesmo tempo como contexto que skills/agents
leem antes de gerar qualquer artefato.

> **Regra**: agents só **leem** desta pasta. Quem escreve aqui é você. A skill
> `wiki` é a única exceção, e mesmo assim só atua quando invocada explicitamente.

## Mapa

### Tecnologia
- [[tecnologia/stack]] — decisões de stack (Next.js SSG vs Payload, Tailwind, MDX)
- [[tecnologia/seo-tecnico]] — JSON-LD, sitemap, robots, Open Graph
- [[tecnologia/performance]] — como o kit garante PageSpeed 100
- [[tecnologia/deploy]] — Vercel preview, produção, domínio próprio

### Conteúdo
- [[conteudo/principios]] — 10+ princípios proprietários do método
- [[conteudo/pov-da-marca]] — POVs proprietários (template para você preencher)
- [[conteudo/voz-pt-br]] — regras de voz brasileira (sem PT-PT, sem gerundismo)
- [[conteudo/jargao-banido]] — vocabulário de IA proibido
- [[conteudo/glossario]] — termos do método com definição curta

## Como usar

1. Abra esta pasta no Obsidian (Open folder as vault → aponte para `wiki/`).
2. Antes de pedir um post, refine `[[conteudo/principios]]` e `[[conteudo/pov-da-marca]]`
   para a sua marca. Sem POVs claros, a skill `conteudo` recusa escrever.
3. Quando uma decisão técnica for tomada, registre em `tecnologia/`. Os agents
   vão consultar antes de propor mudanças.

## Convenções

- Frontmatter mínimo: `title`, `tags`, `updated`.
- Slug do arquivo em kebab-case sem acento.
- Use `[[wikilinks]]` para conectar notas. Evite links absolutos.
- Mantenha cada nota curta e opinionada (≤300 linhas). Quebre em sub-notas se crescer.
