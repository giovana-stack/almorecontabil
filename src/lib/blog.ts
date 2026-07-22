export const SUPABASE_URL = "https://adgcnounhstuqwpvfpgp.supabase.co";
export const SUPABASE_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkZ2Nub3VuaHN0dXF3cHZmcGdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NjEzMDksImV4cCI6MjEwMDEzNzMwOX0.SPPob6NXrKVimnaTqy_HLEn8l1LZla2gUjfF2y_jrA8";
export const REST_ARTIGOS = `${SUPABASE_URL}/rest/v1/blog_artigos`;
export const STORAGE_BUCKET = "blog-imagens";
export const STORAGE_UPLOAD_URL = `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}`;
export const STORAGE_PUBLIC_URL = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}`;
export const SITE_URL = "https://almorecontabilidade.com.br";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

export const restHeaders = {
  apikey: SUPABASE_ANON,
  Authorization: `Bearer ${SUPABASE_ANON}`,
};

export type Artigo = {
  id: string | number;
  artigo_titulo: string | null;
  artigo_corpo: string | null;
  artigo_capa?: string | null;
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
  const uuid = slug.match(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
  );
  if (uuid) return uuid[0];
  const num = slug.match(/^\d+/);
  if (num) return num[0];
  return slug.split("-")[0];
}

export function htmlToText(html: string | null): string {
  if (!html) return "";
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export function excerpt(text: string | null, max = 180): string {
  const clean = htmlToText(text);
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

export async function uploadBlogImage(file: File): Promise<string> {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const res = await fetch(`${STORAGE_UPLOAD_URL}/${path}`, {
    method: "POST",
    headers: {
      ...restHeaders,
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "true",
      "Cache-Control": "3600",
    },
    body: file,
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Upload falhou (${res.status}): ${t}`);
  }
  return `${STORAGE_PUBLIC_URL}/${path}`;
}
