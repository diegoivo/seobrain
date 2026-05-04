---
name: rank-tracker
description: Monitor de posições orgânicas no Google. Adiciona keywords a uma lista monitorada e, sob invocação manual, puxa SERP via DataForSEO batch async (depth=200, máximo desde Set/2025), salva snapshots datados, gera report com diff vs último snapshot (subiu/desceu/entrou top 10/saiu top 100). Sub-comandos: add, remove, list, update, history. Use quando o usuário pedir "monitorar posição", "rank tracker", "tracking de keyword", "ver posição no Google", "como estou ranqueando". Pilar Dados. Pré-condição: DataForSEO configurado (rode /dataforseo-config se faltar).
allowed-tools:
  - Read
  - Write
  - Bash
---

# /rank-tracker — monitor de posições orgânicas

Acompanha posição de keywords selecionadas no Google ao longo do tempo. **Update manual** — você decide a cadência (semanal, quinzenal). Usa **modo batch async** do DataForSEO (Standard Normal queue): cap de 200 resultados, custo $0.00915/keyword no máximo.

## Sub-comandos

```bash
rank-tracker add "kw1, kw2"        # adiciona à lista (não chama API)
rank-tracker remove "kw1"          # remove da lista (não chama API)
rank-tracker list                  # estado atual + última posição + delta
rank-tracker update                # puxa SERP, salva snapshot, gera report
rank-tracker history "kw1"         # série temporal de uma keyword
rank-tracker --help                # ajuda
```

Flags em `update`:
- `--domain=foo.com.br` — override do target domain (default: lê de `brain/config.md`)
- `--strict-subdomain` — só match exato (default: aceita `blog.foo.com.br` se target é `foo.com.br`)
- `--no-confirm` — pula prompt de custo (use só em automação)

## Pré-requisitos

1. **DataForSEO configurado.** `.env.local` com `DATAFORSEO_LOGIN` + `DATAFORSEO_PASSWORD`. Sem isso: aborta com instrução pra rodar `/dataforseo-config`.
2. **Target domain.** Lê `brain/config.md` campo "Domínio Definitivo" (fallback: temporário Vercel). Sem nenhum dos dois: aceita via `--domain=`.
3. **Projeto ativo.** Rodar de `projects/<nome>/`.

## Storage

```
brain/seo/data/rank-tracker/
├── keywords.json              # lista monitorada (single source of truth)
├── history/
│   └── 2026-05-03.json        # snapshot por dia (idempotente: roda 2× sobrescreve)
└── reports/
    ├── 2026-05-03.md          # diff humano por bucket
    ├── 2026-05-03.csv         # planilha plana
    └── 2026-05-03.json        # estruturado (automação)
```

`keywords.json`:
```json
{
  "version": 1,
  "target_domain": "exemplo.com.br",
  "locale": { "location_code": 2076, "language_code": "pt" },
  "keywords": [
    { "keyword": "seo agentico", "added_at": "2026-05-03" }
  ]
}
```

## Pipeline do `update`

1. **Carrega lista** `keywords.json`. Aborta se vazio.
2. **Resolve target domain** (flag → `keywords.json` → `brain/config.md`).
3. **Cost preview obrigatório:**
   ```
   [rank-tracker] target: exemplo.com.br
   [rank-tracker] locale: 2076 / pt
   [rank-tracker] depth: 200 (máx DataForSEO desde Set/2025)
   [dataforseo] custo estimado: ~$0.4575 USD (50 keywords × 20 págs × $0.00915)
   Continuar? [s/N]
   ```
4. **Submete batches** de até 100 tasks em `POST /v3/serp/google/organic/task_post` com `depth=200`.
5. **Polling** em `GET /v3/serp/google/organic/tasks_ready` (10s entre polls, timeout 5min).
6. **Fetch resultados** em `GET /v3/serp/google/organic/task_get/advanced/{id}` (concorrência 5).
7. **Match de domínio:** normaliza (strip protocol/www/trailing slash/lowercase). Aceita subdomínios por padrão; `--strict-subdomain` desliga.
8. **Snapshot** em `history/<YYYY-MM-DD>.json`. Sobrescreve se mesmo dia (idempotente).
9. **Diff vs snapshot anterior cronológico** (último arquivo em `history/` que não seja hoje). Buckets:
   - `entered_top_10` — entrou no top 10
   - `improved` — subiu de posição (sem cruzar top 10)
   - `unchanged` — mesma posição
   - `declined` — desceu
   - `dropped_top_100` — caiu fora do top 100
   - `new` — adicionada à lista após último snapshot
   - `not_ranked` — não rankeada antes nem depois
10. **Triple report** (md + csv + json) em `reports/<YYYY-MM-DD>.{md,csv,json}`.
11. **Sumário no terminal:** custo real, top 3 subidas, top 3 quedas.

## Pricing (Standard Normal queue)

Atualizado em Set/2025 (Google matou `num=100`):

| Depth | Páginas | Custo/keyword |
|---|---|---|
| 10 | 1 | $0.0006 |
| 100 | 10 | $0.00465 |
| 200 (máx) | 20 | $0.00915 |

50 keywords × depth 200 = **$0.46/check**. Semanal = **~$2/mês**. Default da skill: 200 (máximo).

## Erros e edge cases

| Erro | Ação |
|---|---|
| Credenciais ausentes | Aborta apontando `/dataforseo-config` |
| Lista vazia em `update` | Aborta. Sugere `rank-tracker add` |
| Sem target_domain | Aborta. Lista 2 caminhos: `brain/config.md` ou `--domain=` |
| Task fica "in queue" >5min | `pollTasksReady` timeout. Reporta IDs pendentes (recuperáveis em até 3 dias) |
| Keyword sem rankeamento | `position=null`, marca como "não rankeada" no report |
| Domínio com www / subdomain | Normalização automática. `--strict-subdomain` para match exato |
| Roda 2× no mesmo dia | Sobrescreve snapshot. Diff continua usando snapshot anterior cronológico (não o sobrescrito) |

## Cadência sugerida

- **Semanal** — captura tendências sem ruído de variação diária. Custo desprezível.
- **Diária** — só se monitorando movimento de campanha específica.
- Pra cron / automação futura: combinar com skill `/loop` (ex.: `/loop 7d /rank-tracker update --no-confirm`).

## Princípios

- **Manual é feature, não bug.** Você decide quando puxar — sem custo escondido.
- **Cost preview obrigatório.** Sempre. Skip só com `--no-confirm` explícito.
- **Idempotência diária.** Re-rodar no mesmo dia não duplica nem corrompe.
- **Diff humano.** Report em buckets compreensíveis em 5s, não tabela crua.
- **Triple output.** md (humano) + csv (planilha) + json (automação).
- **Reaproveita o client.** Tudo via `scripts/dataforseo-client.mjs` — auth, retry, rate limit já testados.
