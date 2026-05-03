---
name: artigo
description: Escreve um artigo PT-BR seguindo Brain (tom de voz, personas, glossário) + Skyscraper + GEO embutido + frontmatter completo. Roda intent-analyst antes de definir forma. Pergunta proprietary_claims se ausentes. Use quando o usuário pedir "escrever artigo", "criar post", "novo conteúdo", "blog post".
allowed-tools:
  - Read
  - Write
  - WebSearch
  - WebFetch
  - Grep
---

# Artigo

Pipeline completo de criação de artigo seguindo a filosofia do kit.

## Pipeline

### 1. Brain primeiro
- Leia `brain/index.md`, `brain/tom-de-voz.md`, `brain/personas.md`.
- Leia o(s) verbete(s) relevante(s) em `brain/glossario/`.
- Liste o que o brain diz sobre o tema **antes** de qualquer pesquisa externa.

### 2. Confirmar o tópico e os 3 POVs proprietários
- Confirme o tópico, persona-alvo e objetivo de negócio.
- Pergunte: **"Quais 3 opiniões fortes você tem sobre este tema?"** (se não houver `proprietary_claims` registrados no brain).
- Documente as respostas — vão para `proprietary_claims[]` no frontmatter.

### 3. Análise de intenção (skill `intent-analyst`)
- Roda `intent-analyst` com a query/tópico.
- Confirma com o usuário a intenção dominante e a forma recomendada.

### 4. Pesquisa de SERP (Skyscraper)
- Web search dos top 10 resultados para a query.
- Identifica:
  - Estrutura média (palavras, headings, recursos).
  - Gaps que ninguém preenche.
  - O que pode ser superado em ~20% extensão e profundidade (apenas se intenção justificar).

### 5. Estrutura
- H1: keyword principal mais à esquerda + capitalização brasileira.
- H2 inicial: resumo do conceito.
- TL;DR no início (2-3 frases citáveis por LLMs — GEO).
- H2/H3 como **perguntas** quando intenção for informacional (GEO).
- FAQs ao final (geram FAQPage schema).

### 6. Redação
- Tom de voz seguindo `brain/tom-de-voz.md`.
- Frases curtas (≤25 palavras), parágrafos enxutos (3-4 frases).
- Voz ativa.
- Antivícios de IA banidos.
- Capitalização brasileira em todos os headings.
- Pelo menos 3 estatísticas com fonte+data (GEO).
- Quotes de especialistas com credenciais (GEO).
- Internal linking ≥3 (consultar `content/posts/index.md` e `content/site/index.md`).

### 7. Imagens (skill `seo-imagens`)
- Sugerir e/ou validar imagens conforme checklist.
- Alt descritivo, formato correto, peso ≤100kb.

### 8. Frontmatter completo
Use o template `content/posts/_template.md`. Campos críticos:

```yaml
title:                  # 30-60 chars, contém primary_keyword
description:            # 120-160 chars
slug:                   # kebab-case
date:                   # ISO 8601
status: draft           # draft | published
canonical:              # URL absoluta
schema_type:            # Article | BlogPosting | HowTo | FAQPage
primary_keyword:
secondary_keywords: []
search_intent:          # do intent-analyst
target_persona:         # ref a brain/personas.md
brain_refs: []          # paths para verbetes do glossário
proprietary_claims: []  # mínimo 3 — POV proprietário
author:                 # ref a brain/autores/<slug>.md
tldr:                   # 2-3 frases citáveis (GEO)
faq: []                 # FAQPage schema
og_image:
og_image_alt:
internal_links: []
cluster:
```

### 9. Validação on-page (skill `seo-onpage`)
Roda checklist de URL/H1/intro/visuais/links antes de publicar.

### 10. Indexação no `content/posts/index.md`
Adiciona o post à lista cronológica com link, data e categoria.

## Output

Arquivo `.md` em `content/posts/<slug>.md` com `status: draft`. Apresenta ao usuário para revisão. Após `/aprovado`, dispara `update-brain` que pode promover `status: published` (com nova confirmação).
