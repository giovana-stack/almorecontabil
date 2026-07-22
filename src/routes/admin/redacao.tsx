import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";

export const Route = createFileRoute("/admin/redacao")({
  head: () => ({
    meta: [
      { title: "Redação — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: RedacaoPage,
});

const SUPABASE_URL = "https://adgcnounhstuqwpvfpgp.supabase.co";
const SUPABASE_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkZ2Nub3VuaHN0dXF3cHZmcGdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NjEzMDksImV4cCI6MjEwMDEzNzMwOX0.SPPob6NXrKVimnaTqy_HLEn8l1LZla2gUjfF2y_jrA8";
const REST = `${SUPABASE_URL}/rest/v1/blog_artigos`;

const baseHeaders = {
  apikey: SUPABASE_ANON,
  Authorization: `Bearer ${SUPABASE_ANON}`,
};

type Artigo = {
  id: string | number;
  noticia_titulo: string | null;
  noticia_fonte: string | null;
  noticia_link: string | null;
  angulos: string | null;
  artigo_titulo: string | null;
  artigo_corpo: string | null;
  status: string;
  criado_em: string;
  publicado_em: string | null;
};

type Tab = "novo" | "escrito" | "publicado";

function formatDate(iso: string | null): string {
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

function RedacaoPage() {
  const [tab, setTab] = useState<Tab>("novo");
  const [items, setItems] = useState<Artigo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Artigo | null>(null);
  const [titulo, setTitulo] = useState("");
  const [corpo, setCorpo] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const orderBy = tab === "publicado" ? "publicado_em.desc" : "criado_em.desc";
      const res = await fetch(
        `${REST}?status=eq.${tab}&order=${orderBy}&select=*`,
        { headers: baseHeaders }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setItems(await res.json());
    } catch (e: any) {
      setError(e.message || "Erro ao carregar");
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    load();
  }, [load]);

  const openEditor = (item: Artigo) => {
    setSelected(item);
    setTitulo(item.artigo_titulo || "");
    setCorpo(item.artigo_corpo || "");
  };

  const patchIt = async (
    id: Artigo["id"],
    body: Record<string, unknown>,
    kind: string,
    removeFromList: boolean
  ) => {
    setSaving(kind);
    try {
      const res = await fetch(`${REST}?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          ...baseHeaders,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (removeFromList) {
        setItems((prev) => prev.filter((x) => x.id !== id));
      } else {
        setItems((prev) =>
          prev.map((x) => (x.id === id ? ({ ...x, ...body } as Artigo) : x))
        );
      }
      setSelected(null);
    } catch (e: any) {
      alert(`Erro: ${e.message}`);
    } finally {
      setSaving(null);
    }
  };

  const deleteIt = async (id: Artigo["id"]) => {
    if (!confirm("Tem certeza que deseja excluir? Esta ação não pode ser desfeita.")) return;
    setSaving("excluir");
    try {
      const res = await fetch(`${REST}?id=eq.${id}`, {
        method: "DELETE",
        headers: { ...baseHeaders, Prefer: "return=minimal" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setItems((prev) => prev.filter((x) => x.id !== id));
      setSelected(null);
    } catch (e: any) {
      alert(`Erro: ${e.message}`);
    } finally {
      setSaving(null);
    }
  };

  // Novos
  const salvarRascunho = () =>
    selected &&
    patchIt(
      selected.id,
      { artigo_titulo: titulo, artigo_corpo: corpo, status: "escrito" },
      "rascunho",
      true
    );
  const descartar = () => {
    if (!selected) return;
    if (!confirm("Descartar este artigo?")) return;
    patchIt(selected.id, { status: "descartado" }, "descartar", true);
  };

  // Escritos
  const salvarAlteracoes = () =>
    selected &&
    patchIt(
      selected.id,
      { artigo_titulo: titulo, artigo_corpo: corpo },
      "alteracoes",
      false
    );
  const publicar = () => {
    if (!selected) return;
    if (!confirm("Publicar este artigo?")) return;
    patchIt(
      selected.id,
      {
        artigo_titulo: titulo,
        artigo_corpo: corpo,
        status: "publicado",
        publicado_em: new Date().toISOString(),
      },
      "publicar",
      true
    );
  };
  const voltarParaNovos = () =>
    selected && patchIt(selected.id, { status: "novo" }, "voltar", true);

  // Publicados
  const despublicar = () => {
    if (!selected) return;
    if (!confirm("Despublicar este artigo?")) return;
    patchIt(selected.id, { status: "escrito" }, "despublicar", true);
  };

  const tabBtn = (t: Tab, label: string) => (
    <button
      onClick={() => {
        setTab(t);
        setSelected(null);
      }}
      style={{
        padding: "10px 20px",
        background: tab === t ? "#7C1638" : "transparent",
        color: tab === t ? "#fff" : "#595959",
        border: tab === t ? "none" : "1px solid #ddd",
        borderRadius: 6,
        cursor: "pointer",
        fontSize: 14,
        fontWeight: 500,
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F5F3F0", padding: "32px 20px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <header style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#7C1638", margin: 0 }}>Redação</h1>
          <button onClick={load} style={btnPrimary}>Recarregar</button>
        </header>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {tabBtn("novo", "Novos")}
          {tabBtn("escrito", "Escritos")}
          {tabBtn("publicado", "Publicados")}
        </div>

        {loading && <p>Carregando…</p>}
        {error && <p style={{ color: "#b00" }}>Erro: {error}</p>}
        {!loading && !error && items.length === 0 && (
          <p style={{ color: "#595959" }}>Nenhum artigo.</p>
        )}

        <div style={{ display: "grid", gap: 16 }}>
          {items.map((item) => {
            const actions = (
              <div
                style={{ display: "flex", gap: 8, flexShrink: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={() => openEditor(item)} style={btnOutlineSm}>
                  Editar
                </button>
                <button onClick={() => deleteIt(item.id)} disabled={!!saving} style={btnDangerSm}>
                  Excluir
                </button>
              </div>
            );

            if (tab === "novo") {
              return (
                <article key={item.id} onClick={() => openEditor(item)} style={cardStyle}>
                  <div style={cardHeaderStyle}>
                    <h2 style={{ margin: "0 0 8px", fontSize: 18, color: "#111", flex: 1 }}>
                      {item.noticia_titulo || "(sem título)"}
                    </h2>
                    {actions}
                  </div>
                  <div style={{ fontSize: 13, color: "#818181", marginBottom: 10 }}>
                    <strong>{item.noticia_fonte || "—"}</strong>
                    {item.noticia_link && (
                      <>
                        {" · "}
                        <a
                          href={item.noticia_link}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{ color: "#7C1638" }}
                        >
                          abrir notícia
                        </a>
                      </>
                    )}
                  </div>
                  {item.angulos && <pre style={preStyle}>{item.angulos}</pre>}
                </article>
              );
            }
            if (tab === "escrito") {
              return (
                <article key={item.id} onClick={() => openEditor(item)} style={cardStyle}>
                  <div style={cardHeaderStyle}>
                    <h2 style={{ margin: "0 0 8px", fontSize: 18, color: "#111", flex: 1 }}>
                      {item.artigo_titulo || "(sem título)"}
                    </h2>
                    {actions}
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: "#595959", lineHeight: 1.5 }}>
                    {(item.artigo_corpo || "").slice(0, 260)}
                    {(item.artigo_corpo || "").length > 260 ? "…" : ""}
                  </p>
                </article>
              );
            }
            // publicado
            return (
              <article key={item.id} onClick={() => openEditor(item)} style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <h2 style={{ margin: "0 0 6px", fontSize: 18, color: "#111", flex: 1 }}>
                    {item.artigo_titulo || "(sem título)"}
                  </h2>
                  {actions}
                </div>
                <div style={{ fontSize: 13, color: "#818181" }}>
                  Publicado em {formatDate(item.publicado_em)}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: 24,
            overflow: "auto",
            zIndex: 50,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "#fff", maxWidth: 900, width: "100%", borderRadius: 8, padding: 28, marginTop: 20 }}
          >
            {(selected.noticia_fonte || selected.noticia_link) && (
              <div style={{ marginBottom: 16, fontSize: 13, color: "#818181" }}>
                <strong>{selected.noticia_fonte}</strong>
                {selected.noticia_link && (
                  <>
                    {" · "}
                    <a href={selected.noticia_link} target="_blank" rel="noreferrer" style={{ color: "#7C1638" }}>
                      {selected.noticia_titulo}
                    </a>
                  </>
                )}
              </div>
            )}

            {selected.angulos && (
              <details style={{ marginBottom: 20 }}>
                <summary style={{ cursor: "pointer", color: "#595959", fontSize: 14 }}>
                  Ver ângulos sugeridos
                </summary>
                <pre style={{ ...preStyle, background: "#F5F3F0", padding: 12, borderRadius: 4, marginTop: 8 }}>
                  {selected.angulos}
                </pre>
              </details>
            )}

            <label style={labelStyle}>Título do artigo</label>
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Corpo do artigo</label>
            <textarea value={corpo} onChange={(e) => setCorpo(e.target.value)} rows={18} style={textareaStyle} />

            <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => deleteIt(selected.id)}
                disabled={!!saving}
                style={btnDanger}
              >
                {saving === "excluir" ? "Excluindo…" : "Excluir"}
              </button>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button onClick={() => setSelected(null)} style={btnGhost}>Cancelar</button>

                {tab === "novo" && (
                  <>
                    <button onClick={descartar} disabled={!!saving} style={btnOutline}>
                      {saving === "descartar" ? "Descartando…" : "Descartar"}
                    </button>
                    <button onClick={salvarRascunho} disabled={!!saving} style={btnPrimary}>
                      {saving === "rascunho" ? "Salvando…" : "Salvar rascunho"}
                    </button>
                  </>
                )}

                {tab === "escrito" && (
                  <>
                    <button onClick={voltarParaNovos} disabled={!!saving} style={btnOutline}>
                      {saving === "voltar" ? "Movendo…" : "Voltar para novos"}
                    </button>
                    <button onClick={salvarAlteracoes} disabled={!!saving} style={btnOutline}>
                      {saving === "alteracoes" ? "Salvando…" : "Salvar alterações"}
                    </button>
                    <button onClick={publicar} disabled={!!saving} style={btnPrimary}>
                      {saving === "publicar" ? "Publicando…" : "Publicar"}
                    </button>
                  </>
                )}

                {tab === "publicado" && (
                  <>
                    <button onClick={despublicar} disabled={!!saving} style={btnOutline}>
                      {saving === "despublicar" ? "Despublicando…" : "Despublicar"}
                    </button>
                    <button onClick={salvarAlteracoes} disabled={!!saving} style={btnPrimary}>
                      {saving === "alteracoes" ? "Salvando…" : "Salvar alterações"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderLeft: "4px solid #7C1638",
  padding: 20,
  borderRadius: 6,
  cursor: "pointer",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};
const preStyle: React.CSSProperties = {
  whiteSpace: "pre-wrap",
  fontFamily: "inherit",
  fontSize: 14,
  color: "#595959",
  margin: 0,
};
const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, color: "#595959", marginBottom: 6 };
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 10,
  fontSize: 16,
  border: "1px solid #ddd",
  borderRadius: 4,
  marginBottom: 16,
  boxSizing: "border-box",
};
const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: 12,
  fontSize: 15,
  border: "1px solid #ddd",
  borderRadius: 4,
  fontFamily: "inherit",
  lineHeight: 1.55,
  boxSizing: "border-box",
  resize: "vertical",
};
const btnGhost: React.CSSProperties = {
  padding: "10px 18px",
  background: "transparent",
  border: "1px solid #ccc",
  borderRadius: 6,
  cursor: "pointer",
};
const btnOutline: React.CSSProperties = {
  padding: "10px 18px",
  background: "#fff",
  color: "#7C1638",
  border: "1px solid #7C1638",
  borderRadius: 6,
  cursor: "pointer",
};
const btnPrimary: React.CSSProperties = {
  padding: "10px 18px",
  background: "#7C1638",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 14,
};
const btnDanger: React.CSSProperties = {
  padding: "10px 18px",
  background: "#fff",
  color: "#b00020",
  border: "1px solid #b00020",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 14,
};
const cardHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
};
const btnOutlineSm: React.CSSProperties = {
  padding: "6px 12px",
  background: "#fff",
  color: "#7C1638",
  border: "1px solid #7C1638",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 13,
};
const btnDangerSm: React.CSSProperties = {
  padding: "6px 12px",
  background: "#fff",
  color: "#b00020",
  border: "1px solid #b00020",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 13,
};
