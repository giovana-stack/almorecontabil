import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { REST_ARTIGOS, restHeaders, slugify } from "@/lib/blog";

const BASE_URL = "https://almorecontabilidade.com.br";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/blog", changefreq: "daily", priority: "0.8" },
        ];

        try {
          const res = await fetch(
            `${REST_ARTIGOS}?status=eq.publicado&order=publicado_em.desc&select=id,artigo_titulo,publicado_em`,
            { headers: restHeaders },
          );
          if (res.ok) {
            const artigos = (await res.json()) as Array<{
              id: string | number;
              artigo_titulo: string | null;
              publicado_em: string | null;
            }>;
            for (const a of artigos) {
              entries.push({
                path: `/blog/${a.id}-${slugify(a.artigo_titulo || "")}`,
                lastmod: a.publicado_em ? new Date(a.publicado_em).toISOString() : undefined,
                changefreq: "monthly",
                priority: "0.7",
              });
            }
          }
        } catch (err) {
          console.error("[sitemap] failed to load artigos", err);
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
