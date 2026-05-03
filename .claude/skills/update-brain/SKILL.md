---
name: update-brain
description: Atualiza o Brain (wiki em brain/) com aprendizados, decisões e mudanças da última tarefa. Disparada pelo slash command /aprovado. Atualiza brain/index.md, brain/backlog.md e adiciona/atualiza arquivos relevantes (tecnologia, glossário, etc).
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
---

# Update Brain

Roda ao final de cada tarefa aprovada. Mantém o Brain como source-of-truth atualizada.

## Quando dispara

- Slash command `/aprovado` é digitado pelo usuário após o agent dizer "Tarefa concluída: [resumo]. Aprove com /aprovado para documentar no Brain, ou diga o que ajustar."
- Manualmente: `/aprovado <comentário opcional>`.

## Passos

1. **Levante o que mudou** na sessão:
   - Diff de git (`git diff main...HEAD --stat`).
   - Arquivos novos/editados.
   - Decisões registradas na conversa.

2. **Atualize `brain/index.md`**:
   - Data da última atualização (ISO 8601).
   - Resumo executivo do que mudou.
   - Quando relevante, posicionamento, domínio, porta dev.

3. **Atualize arquivos específicos** conforme necessário:
   - `brain/tecnologia/index.md` — se a stack mudou.
   - `brain/glossario/<verbete>.md` — se um conceito proprietário foi cunhado.
   - `brain/backlog.md` — riscar itens concluídos, anotar pendências surgidas.
   - `brain/seo/reports/` — se rodou seo-score.
   - `content/posts/index.md` ou `content/site/index.md` — se publicou conteúdo.

4. **Pergunte sobre skills**:
   - "Esta tarefa pareceu repetível. Quer transformar em skill?"
   - Se sim, sugira nome + descrição e crie em `.claude/skills/<name>/SKILL.md`.

5. **Confirmação final**:
   - Mostre o diff das mudanças no Brain.
   - Pergunte: "Brain atualizado. Algo mais a registrar?"

## Princípios

- **Não duplique.** Se um fato já existe em outro arquivo, referencie em vez de copiar.
- **Datas absolutas** (ISO 8601), nunca relativas.
- **Por quê + Como aplicar** — quando registrar uma decisão ou regra, inclua a justificativa e quando ela vale.
- **Atualize, não acumule.** Se uma decisão antiga foi superada, marque como "superada por [link]" e mova para um histórico, não deixe duas verdades concorrentes.
