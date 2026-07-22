import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  REST_ARTIGOS,
  restHeaders,
  articlePath,
  excerpt,
  formatDate,
  SITE_URL,
  type Artigo,
} from "@/lib/blog";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — Almore Inteligência Contábil" },
      {
        name: "description",
        content:
          "Artigos e análises sobre contabilidade, tributos e gestão financeira para empresas.",
      },
      { property: "og:title", content: "Blog — Almore Inteligência Contábil" },
      {
        property: "og:description",
        content:
          "Artigos e análises sobre contabilidade, tributos e gestão financeira para empresas.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/blog` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/blog` }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const [items, setItems] = useState<Artigo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${REST_ARTIGOS}?status=eq.publicado&order=publicado_em.desc&select=id,artigo_titulo,artigo_corpo,publicado_em`,
          { headers: restHeaders }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setItems(await res.json());
      } catch (e: any) {
        setError(e.message || "Erro ao carregar");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#F5F3F0" }}>
      <header
        style={{
          background: "#7C1638",
          color: "#fff",
          padding: "56px 20px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <a
            href="/"
            style={{ color: "#fff", opacity: 0.8, fontSize: 14, textDecoration: "none" }}
          >
            ← Voltar ao site
          </a>
          <h1
            className="font-display"
            style={{ fontSize: 44, fontWeight: 700, margin: "16px 0 8px" }}
          >
            Blog
          </h1>
          <p style={{ opacity: 0.9, fontSize: 17, margin: 0 }}>
            Análises e conteúdo da Almore Inteligência Contábil.
          </p>
        </div>
      </header>

      <main style={{ maxWidth: 820, margin: "0 auto", padding: "48px 20px" }}>
        {loading && <p style={{ color: "#595959" }}>Carregando…</p>}
        {error && <p style={{ color: "#b00" }}>Erro: {error}</p>}
        {!loading && !error && items.length === 0 && (
          <p style={{ color: "#595959" }}>Nenhum artigo publicado ainda.</p>
        )}

        <div style={{ display: "grid", gap: 20 }}>
          {items.map((a) => (
            <Link
              key={a.id}
              to="/blog/$slug"
              params={{ slug: articlePath(a).replace("/blog/", "") }}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <article
                style={{
                  background: "#fff",
                  borderLeft: "4px solid #7C1638",
                  padding: 24,
                  borderRadius: 6,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  transition: "box-shadow .2s, transform .2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: "#818181",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    marginBottom: 8,
                  }}
                >
                  {formatDate(a.publicado_em)}
                </div>
                <h2
                  className="font-display"
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#68112F",
                    margin: "0 0 10px",
                    lineHeight: 1.25,
                  }}
                >
                  {a.artigo_titulo || "(sem título)"}
                </h2>
                <p style={{ margin: 0, color: "#595959", lineHeight: 1.6, fontSize: 15 }}>
                  {excerpt(a.artigo_corpo, 220)}
                </p>
                <div
                  style={{
                    marginTop: 14,
                    color: "#7C1638",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  Ler artigo →
                </div>
              </article>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
