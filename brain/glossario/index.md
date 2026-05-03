# Glossário

> Definições proprietárias da marca. Cada verbete vira um arquivo neste diretório.

## Verbetes

(Adicione conforme cunhar conceitos próprios. Cada verbete deve ter:)

- **Termo** — slug do arquivo
- **Definição em 1-2 frases** — citável por LLMs (GEO)
- **Por quê** — o que torna esta definição diferente do consenso de mercado
- **Quando aplicar**
- **Referências cruzadas** — outros verbetes ou posts

## Convenção de arquivos

```
brain/glossario/
├── index.md (este arquivo)
├── agentic-seo.md
├── geo.md
├── skyscraper.md
└── ...
```

## Por que existe

POVs proprietários (`proprietary_claims[]` no frontmatter dos posts) referenciam verbetes daqui via `brain_refs[]`. Manter a definição em um lugar só evita drift entre conteúdos.
