import { GridContainer, GridCol } from "@/components/grid";

export const metadata = { title: "Componentes" };

export default function Components() {
  return (
    <GridContainer>
      <GridCol span={4} spanMd={8} spanLg={10}>
        <p className="eyebrow mb-6">Brandbook · Componentes</p>
        <h1 className="mb-8">Primitivos editoriais.</h1>
        <p className="prose" style={{ marginBottom: "var(--space-12)" }}>
          O framework não vem com biblioteca de UI inflada. Primitivos definidos
          como classes CSS em <code>globals.css</code>. Cada um pode ser
          estilizado pós-<code>/design-init</code> sem mudar o markup.
        </p>

        <h2 className="mb-6">Botões</h2>
        <p
          className="prose"
          style={{ marginBottom: "var(--space-6)", maxWidth: "100%" }}
        >
          Detalhes completos em <a href="/brandbook/botoes">Botões e ações</a>.
          Aqui ficam só os 2 primitivos canônicos.
        </p>
        <div
          style={{
            display: "flex",
            gap: "var(--space-4)",
            marginBottom: "var(--space-12)",
            flexWrap: "wrap",
          }}
        >
          <button type="button" className="btn-accent">
            Primário (.btn-accent)
          </button>
          <button type="button" className="btn-ghost">
            Secundário (.btn-ghost)
          </button>
        </div>

        <h2 className="mb-6">Eyebrow</h2>
        <p className="eyebrow" style={{ marginBottom: "var(--space-12)" }}>
          Categoria · Editorial — .eyebrow
        </p>

        <h2 className="mb-6">Blockquote</h2>
        <article className="prose" style={{ marginBottom: "var(--space-12)" }}>
          <blockquote>
            Sites de marca sofrem três doenças: layout AI-slop, mobile
            improvisado e componentes desalinhados. A cura é um único grid
            global com spacing canônico.
          </blockquote>
        </article>

        <h2 className="mb-6">Inline code</h2>
        <p className="prose" style={{ marginBottom: "var(--space-12)" }}>
          Use <code>--space-N</code> para qualquer padding/margin. Nunca
          hardcode valores que não sejam múltiplos de 4.
        </p>

        <h2 className="mb-6">Callouts</h2>
        <div
          style={{ display: "grid", gap: "var(--space-4)", marginBottom: "var(--space-12)" }}
        >
          <aside
            role="note"
            style={{
              borderInlineStart: "3px solid var(--color-accent)",
              padding: "var(--space-4) var(--space-6)",
              background: "color-mix(in srgb, var(--color-fg) 3%, transparent)",
              borderRadius: "0.25rem",
            }}
          >
            <p className="eyebrow" style={{ marginBottom: "var(--space-1)" }}>
              Note
            </p>
            <p style={{ margin: 0 }}>
              Use callouts para regras críticas, não para destacar parágrafos
              fofos. Se precisa destacar, edita o parágrafo.
            </p>
          </aside>
          <aside
            role="note"
            style={{
              borderInlineStart: "3px solid var(--color-muted)",
              padding: "var(--space-4) var(--space-6)",
              background: "color-mix(in srgb, var(--color-fg) 3%, transparent)",
              borderRadius: "0.25rem",
            }}
          >
            <p className="eyebrow" style={{ marginBottom: "var(--space-1)" }}>
              Tip
            </p>
            <p style={{ margin: 0 }}>
              Variantes: <code>note</code>, <code>tip</code>, <code>warning</code>,{" "}
              <code>example</code>. Compatíveis com sintaxe Obsidian{" "}
              <code>&gt; [!warning]</code> em arquivos do brain.
            </p>
          </aside>
        </div>

        <h2 className="mb-6">Tabela</h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "var(--space-12)",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Coluna</th>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Tipo</th>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Default</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["nome", "string", "—"],
              ["created", "date", "TEMPLATE"],
              ["status", "enum", "template"],
            ].map((row) => (
              <tr key={row[0]} style={{ borderBottom: "1px solid var(--color-border)" }}>
                {row.map((c, i) => (
                  <td key={i} style={{ padding: "var(--space-3)", fontSize: "var(--text-sm)", fontFamily: i === 1 ? "var(--font-mono)" : "inherit" }}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="mb-6">Badge / Pill</h2>
        <div
          style={{
            display: "flex",
            gap: "var(--space-3)",
            flexWrap: "wrap",
            marginBottom: "var(--space-12)",
          }}
        >
          {[
            { label: "template", muted: true },
            { label: "initialized", muted: false },
            { label: "Em desenvolvimento", muted: true },
          ].map((b) => (
            <span
              key={b.label}
              style={{
                fontSize: "var(--text-xs)",
                padding: "var(--space-1) var(--space-3)",
                border: `1px solid var(${b.muted ? "--color-border" : "--color-fg"})`,
                color: `var(${b.muted ? "--color-muted" : "--color-fg"})`,
                borderRadius: "999px",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.02em",
              }}
            >
              {b.label}
            </span>
          ))}
        </div>

        <h2 className="mb-6">Foco visível (a11y)</h2>
        <p style={{ marginBottom: "var(--space-4)" }}>
          Todos os elementos focáveis recebem outline canônico (2px accent,
          offset 3px). Tente <kbd>Tab</kbd>:
        </p>
        <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap", marginBottom: "var(--space-12)" }}>
          <a href="#main" className="btn-ghost">
            Link focável
          </a>
          <button type="button" className="btn-ghost">
            Botão focável
          </button>
          <input
            type="text"
            placeholder="Input focável"
            style={{
              padding: "var(--space-3) var(--space-4)",
              border: "1px solid var(--color-border)",
              borderRadius: "0.25rem",
              fontFamily: "inherit",
            }}
          />
        </div>
      </GridCol>
    </GridContainer>
  );
}
