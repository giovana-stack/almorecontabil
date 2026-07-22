export const SUPABASE_URL = "https://adgcnounhstuqwpvfpgp.supabase.co";
export const SUPABASE_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkZ2Nub3VuaHN0dXF3cHZmcGdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NjEzMDksImV4cCI6MjEwMDEzNzMwOX0.SPPob6NXrKVimnaTqy_HLEn8l1LZla2gUjfF2y_jrA8";
export const REST_ARTIGOS = `${SUPABASE_URL}/rest/v1/blog_artigos`;
export const SITE_URL = "https://almorecontabilidade.com.br";

export const restHeaders = {
  apikey: SUPABASE_ANON,
  Authorization: `Bearer ${SUPABASE_ANON}`,
};

export type Artigo = {
  id: string | number;
  artigo_titulo: string | null;
  artigo_corpo: string | null;
  status: string;
  criado_em: string;
  publicado_em: string | null;
};

export function slugify(text: string): string {
  return (text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function articlePath(a: Pick<Artigo, "id" | "artigo_titulo">): string {
  return `/blog/${a.id}-${slugify(a.artigo_titulo || "")}`;
}

export function extractIdFromSlug(slug: string): string {
  // id is UUID (may contain hyphens) or numeric. The slug is `<id>-<title-slug>`.
  // Match UUID first, else leading digits, else fallback to everything before first hyphen.
  const uuid = slug.match(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
  );
  if (uuid) return uuid[0];
  const num = slug.match(/^\d+/);
  if (num) return num[0];
  return slug.split("-")[0];
}

export function excerpt(text: string | null, max = 180): string {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max).trimEnd() + "…" : clean;
}

export function formatDate(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}
