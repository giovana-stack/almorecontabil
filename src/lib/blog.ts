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
  artigo_capa_alt?: string | null;
  artigo_capa_pos?: string | null;
  linkedin_post?: string | null;
  status: string;
  criado_em: string;
  publicado_em: string | null;
  agendado_para?: string | null;
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

async function imageUrlToBase64(url: string): Promise<{ base64: string; mimeType: string }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Falha ao ler imagem (${res.status})`);
  const blob = await res.blob();
  const mimeType = blob.type || "image/jpeg";
  const buf = await blob.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)) as any);
  }
  return { base64: btoa(bin), mimeType };
}

export async function gerarAltComIA(imageUrl: string, contexto: string): Promise<string> {
  const { base64, mimeType } = await imageUrlToBase64(imageUrl);
  // Use text/plain para evitar preflight CORS no Apps Script
  const res = await fetch(
    "https://script.google.com/macros/s/AKfycbxUyhnNvO8_q7iBXEUiTm1t9-c48wBb4mvZ7hAwYNCgwiBizQ9o7C_ro4NYpkBckgEv2g/exec?senha=eet5tpnz&alt=1",
    {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ imagem: base64, mimeType, contexto: contexto || "" }),
    }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json().catch(() => null as any);
  const alt = data && typeof data.alt === "string" ? data.alt.trim() : "";
  if (!alt) throw new Error("Resposta sem alt");
  return alt;
}
