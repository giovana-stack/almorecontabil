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
import { SiteNavbar } from "@/components/SiteNavbar";

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
    <div style={{ minHeight: "100vh", background: "#F5F3F0" }}>
      <SiteNavbar />
      <div style={{ padding: "80px 20px", textAlign: "center" }}>
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
    </div>
  ),
  component: BlogArticle,
});

function BlogArticle() {
  const artigo = Route.useLoaderData();
  const hasCapa = !!artigo.artigo_capa;

  return (
    <div style={{ minHeight: "100vh", background: "#F5F3F0" }}>
      <SiteNavbar />


      {/* Hero banner: capa + título sobreposto */}
      <section
        style={{
          position: "relative",
          width: "100%",
          minHeight: hasCapa ? 420 : 220,
          background: hasCapa ? "#2a0710" : "#7C1638",
          overflow: "hidden",
        }}
      >
        {hasCapa && (
          <>
            <img
              src={artigo.artigo_capa!}
              alt={artigo.artigo_capa_alt || artigo.artigo_titulo || ""}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            {/* Overlay preto para legibilidade do texto branco */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.75) 100%)",
              }}
            />

            {/* Voltar ao Blog — discreto, sobre o overlay */}
            <div
              style={{
                position: "absolute",
                top: 20,
                left: "50%",
                transform: "translateX(-50%)",
                width: "100%",
                maxWidth: 900,
                padding: "0 20px",
                zIndex: 2,
              }}
            >
              <Link
                to="/blog"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: "rgba(255,255,255,0.92)",
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                  textShadow: "none",
                }}
              >
                ← Voltar ao Blog
              </Link>
            </div>
          </>
        )}


        <div
          style={{
            position: "relative",
            maxWidth: 900,
            margin: "0 auto",
            padding: hasCapa ? "80px 20px 56px" : "56px 20px",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            minHeight: "inherit",
          }}
        >
          <h1
            className="font-display blog-hero-title"
            style={{
              fontSize: "clamp(28px, 5vw, 46px)",
              fontWeight: 700,
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            {artigo.artigo_titulo}
          </h1>
          <div
            style={{
              marginTop: 14,
              fontSize: 13,
              opacity: 0.95,
              textTransform: "uppercase",
              letterSpacing: 0.6,
            }}
          >

            {formatDate(artigo.publicado_em)}
          </div>
        </div>
      </section>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "48px 20px 80px" }}>
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
