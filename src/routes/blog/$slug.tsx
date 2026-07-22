import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import {
  REST_ARTIGOS,
  restHeaders,
  extractIdFromSlug,
  excerpt,
  formatDate,
  SITE_URL,
  DEFAULT_OG_IMAGE,
  articlePath,
  type Artigo,
} from "@/lib/blog";
import { Comentarios } from "@/components/Comentarios";

async function fetchArtigo(slug: string): Promise<Artigo> {
  const id = extractIdFromSlug(slug);
  const res = await fetch(
    `${REST_ARTIGOS}?id=eq.${encodeURIComponent(id)}&status=eq.publicado&select=id,artigo_titulo,artigo_corpo,artigo_capa,artigo_capa_alt,publicado_em,status,criado_em&limit=1`,
    { headers: restHeaders }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const rows: Artigo[] = await res.json();
  if (!rows.length) throw notFound();
  return rows[0];
}

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => fetchArtigo(params.slug),
  head: ({ params, loaderData }) => {
    const title = loaderData?.artigo_titulo || "Artigo";
    const desc = excerpt(loaderData?.artigo_corpo ?? null, 160);
    const url = `${SITE_URL}${articlePath({ id: loaderData?.id ?? params.slug.split("-")[0], artigo_titulo: title })}`;
    const image = loaderData?.artigo_capa || DEFAULT_OG_IMAGE;
    return {
      meta: [
        { title: `${title} — Almore Inteligência Contábil` },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  notFoundComponent: () => (
    <div style={{ minHeight: "100vh", background: "#F5F3F0", padding: "80px 20px", textAlign: "center" }}>
      <h1 className="font-display" style={{ color: "#7C1638", fontSize: 32 }}>
        Artigo não encontrado
      </h1>
      <p style={{ color: "#595959", marginTop: 12 }}>
        Este artigo pode ter sido removido ou ainda não está publicado.
      </p>
      <Link to="/blog" style={{ color: "#7C1638", fontWeight: 600 }}>
        ← Voltar ao blog
      </Link>
    </div>
  ),
  component: BlogArticle,
});

function BlogArticle() {
  const artigo = Route.useLoaderData();

  return (
    <div style={{ minHeight: "100vh", background: "#F5F3F0" }}>
      <header
        style={{
          background: "#7C1638",
          color: "#fff",
          padding: "48px 20px",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Link
            to="/blog"
            style={{ color: "#fff", opacity: 0.85, fontSize: 14, textDecoration: "none" }}
          >
            ← Blog
          </Link>
          <div
            style={{
              marginTop: 20,
              fontSize: 13,
              opacity: 0.9,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {formatDate(artigo.publicado_em)}
          </div>
          <h1
            className="font-display"
            style={{
              fontSize: 40,
              fontWeight: 700,
              margin: "10px 0 0",
              lineHeight: 1.2,
            }}
          >
            {artigo.artigo_titulo}
          </h1>
        </div>
      </header>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "48px 20px 80px" }}>
        {artigo.artigo_capa && (
          <div
            style={{
              width: "100%",
              aspectRatio: "16 / 9",
              overflow: "hidden",
              borderRadius: 8,
              marginBottom: 28,
              background: "#F5F3F0",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            <img
              src={artigo.artigo_capa}
              alt={artigo.artigo_capa_alt || artigo.artigo_titulo || ""}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        )}

        <article
          className="blog-content"
          style={{
            background: "#fff",
            padding: "40px 36px",
            borderRadius: 8,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            fontSize: 17,
            lineHeight: 1.75,
            color: "#2b2b2b",
          }}
          dangerouslySetInnerHTML={{ __html: artigo.artigo_corpo || "" }}
        />

        <Comentarios artigoId={artigo.id} />

        <div style={{ marginTop: 32, textAlign: "center" }}>
          <Link
            to="/blog"
            style={{
              color: "#7C1638",
              fontWeight: 600,
              textDecoration: "none",
              fontSize: 15,
            }}
          >
            ← Ver mais artigos
          </Link>
        </div>
      </main>
    </div>
  );
}
