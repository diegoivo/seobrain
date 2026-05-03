import { GridContainer, GridCol } from "@/components/grid";
import { TemplateBanner } from "@/components/brandbook/TemplateBanner";

export const metadata = { title: "Imagens" };

const RATIOS = [
  { ratio: "16 / 9",   label: "Hero / cover wide", use: "Hero desktop, capa de post horizontal" },
  { ratio: "4 / 3",    label: "Card editorial",   use: "Listagem de posts, mídia mista" },
  { ratio: "1 / 1",    label: "Avatar / square",  use: "Avatar social, OG fallback square, thumb compacta" },
  { ratio: "1.91 / 1", label: "OG image",         use: "1200×630, social link preview" },
];

export default function Imagens() {
  return (
    <GridContainer>
      <GridCol span={4} spanMd={8} spanLg={10}>
        <p className="eyebrow mb-6">Brandbook · Imagens</p>
        <h1 className="mb-8">Estilo, formato, peso, alt.</h1>
        <p className="prose" style={{ marginBottom: "var(--space-12)" }}>
          Estilo e seleção: decisão da marca <code>[M]</code>. Formato, proporções
          e peso: regras canônicas <code>[F]</code>. Skill operacional:{" "}
          <code>/setup-images</code> e <code>/seo-imagens</code>.
        </p>
        <TemplateBanner
          variant="template"
          message="Pré-onboard, mostramos só as proporções e regras técnicas. Pós-/setup-images, esta seção também documenta a fonte escolhida (Unsplash/Pexels com query default ou OpenAI) e exemplos extraídos do brain."
        />

        <h2 className="mb-6">Estilo (decisão da marca)</h2>
        <p className="prose" style={{ marginBottom: "var(--space-6)", maxWidth: "100%" }}>
          Pós-<code>/onboard</code>, esta seção lista 3-5 referências visuais
          (mood-board) que definem o que &quot;parece da marca&quot;. Formato livre:
          links pra Pinterest board, Are.na, ou imagens em <code>web/public/refs/</code>.
        </p>
        <p className="prose" style={{ marginBottom: "var(--space-12)" }}>
          Antipadrões universais (banidos por construção):
        </p>
        <ul className="prose" style={{ marginBottom: "var(--space-12)" }}>
          <li>Foto de stock genérica de equipe sorrindo em escritório com glass walls.</li>
          <li>Mockup de iPhone flutuando com gradient atrás.</li>
          <li>Render 3D abstrato de objetos flutuantes com lighting de showroom.</li>
          <li>Drone footage de cidade não-relacionada à marca.</li>
          <li>Diagrama de venn ou fluxograma colorido sem dados reais.</li>
        </ul>

        <h2 className="mb-6">Formato (canônico)</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "var(--space-12)" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Formato</th>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Quando</th>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Notas</th>
            </tr>
          </thead>
          <tbody>
            {[
              { f: "SVG",  q: "Logo, ícones, ilustrações vetoriais", n: "Inline preferido. Se externo, <Image unoptimized />" },
              { f: "AVIF", q: "Foto fotográfica grande (hero, OG)",  n: "60-80% menor que JPEG mesma qualidade" },
              { f: "WebP", q: "Foto média, fallback de AVIF",        n: "Suporte universal moderno" },
              { f: "JPEG", q: "Fallback legacy",                     n: "Apenas se AVIF/WebP indisponíveis" },
              { f: "PNG",  q: "Capturas com texto, transparência",   n: "Não use pra fotos — peso 5-10x WebP" },
            ].map((row) => (
              <tr key={row.f} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td style={{ padding: "var(--space-3)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>{row.f}</td>
                <td style={{ padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>{row.q}</td>
                <td style={{ padding: "var(--space-3)", fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>{row.n}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="mb-6">Proporções</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "var(--space-6)",
            marginBottom: "var(--space-12)",
          }}
        >
          {RATIOS.map((r) => (
            <div
              key={r.ratio}
              style={{
                border: "1px solid var(--color-border)",
                borderRadius: "0.5rem",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  aspectRatio: r.ratio,
                  background: "color-mix(in srgb, var(--color-fg) 8%, transparent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-md)",
                  color: "var(--color-muted)",
                }}
              >
                {r.ratio}
              </div>
              <div style={{ padding: "var(--space-3) var(--space-4)" }}>
                <p style={{ margin: 0, fontSize: "var(--text-sm)", fontWeight: 500 }}>{r.label}</p>
                <p style={{ margin: "var(--space-1) 0 0", fontSize: "var(--text-xs)", color: "var(--color-muted)" }}>
                  {r.use}
                </p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mb-6">Peso</h2>
        <ul className="prose" style={{ marginBottom: "var(--space-12)" }}>
          <li><strong>Hero / cover</strong>: ≤ 250kb (AVIF) / 350kb (WebP).</li>
          <li><strong>Card / inline</strong>: ≤ 100kb.</li>
          <li><strong>Avatar / icon</strong>: ≤ 30kb (PNG transparente) ou inline SVG.</li>
          <li><strong>Lazy loading</strong>: <code>loading=&quot;lazy&quot;</code> em tudo abaixo da dobra. <code>priority</code> só na imagem do hero (LCP).</li>
        </ul>

        <h2 className="mb-6">Alt text</h2>
        <p className="prose" style={{ marginBottom: "var(--space-6)", maxWidth: "100%" }}>
          Toda imagem não-decorativa precisa de alt descritivo. Imagem
          puramente decorativa: <code>alt=&quot;&quot;</code> (string vazia, não
          omitido).
        </p>
        <ul className="prose">
          <li>✓ <em>&quot;Maria Silva, fundadora da Lab, sentada em mesa de madeira com café&quot;</em></li>
          <li>✗ <em>&quot;imagem de pessoa&quot;</em> — genérico demais</li>
          <li>✗ <em>&quot;foto de Maria&quot;</em> — não diz o que importa visualmente</li>
          <li>Skill <code>/seo-imagens</code> valida alt por imagem.</li>
        </ul>
      </GridCol>
    </GridContainer>
  );
}
