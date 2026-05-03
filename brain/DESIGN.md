# DESIGN.md

> ⚠️ Este arquivo está em estado **placeholder**. Rode `/design-init` (10 perguntas) para gerar um design system único antes de mexer em UI.

## Por que este arquivo é importante

DESIGN.md é a fonte canônica das decisões visuais do projeto. Sem ele, qualquer agente vai recair no default do Tailwind/shadcn — gradientes coloridos, purple/blue, ícones do Heroicons, shadows pesadas, cards arredondados de 8px — e o resultado vira AI slop genérico.

`/design-init` força decisões **opinativas** que tornam o design único: arquétipo de marca, mood em adjetivos, paleta com hex, antipadrões explícitos do que **não** fazer.

## O que vai aqui depois do `/design-init`

- Resumo do design system em prosa
- Tipografia (família, escala, weights)
- Cores (paleta com hex, uso de cada)
- Espaçamento (escala)
- Componentes (cards, buttons, forms — princípios)
- Motion (timing functions, durações)
- Antipadrões explícitos (com justificativa)

## Tokens

Tokens consumíveis pelo `/web` ficam em `brain/DESIGN.tokens.json` após o init.
