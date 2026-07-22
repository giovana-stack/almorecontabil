import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useRef } from "react";
import { RichEditor } from "@/components/RichEditor";
import { restHeaders as baseHeaders, REST_ARTIGOS as REST, uploadBlogImage, htmlToText, formatDate } from "@/lib/blog";

export const Route = createFileRoute("/admin/redacao")({
  head: () => ({
    meta: [
      { title: "Redação — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: RedacaoPage,
});

type Artigo = {
  id: string | number;
  noticia_titulo: string | null;
  noticia_fonte: string | null;
  noticia_link: string | null;
  angulos: string | null;
  artigo_titulo: string | null;
  artigo_corpo: string | null;
  artigo_capa: string | null;
  artigo_capa_alt: string | null;
  capas_sugeridas: string | null;
  status: string;
  criado_em: string;
  publicado_em: string | null;
};

type CapaSugerida = { url: string; alt: string };

function parseCapasSugeridas(raw: unknown): CapaSugerida[] {
  if (!raw) return [];
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (Array.isArray(parsed)) {
      return parsed
        .map((item): CapaSugerida | null => {
          if (typeof item === "string" && item) return { url: item, alt: "" };
          if (item && typeof item === "object" && typeof (item as any).url === "string") {
            return { url: (item as any).url, alt: typeof (item as any).alt === "string" ? (item as any).alt : "" };
          }
          return null;
        })
        .filter((v): v is CapaSugerida => !!v && !!v.url)
        .slice(0, 3);
    }
  } catch {
    // ignore
  }
  return [];
}


type Tab = "novo" | "escrito" | "publicado";

function RedacaoPage() {
  const [tab, setTab] = useState<Tab>("novo");
  const [items, setItems] = useState<Artigo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Artigo | null>(null);
  const [titulo, setTitulo] = useState("");
  const [corpo, setCorpo] = useState("");
  const [capa, setCapa] = useState<string>("");
  const [capaAlt, setCapaAlt] = useState<string>("");
  const [uploadingCapa, setUploadingCapa] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [gerando, setGerando] = useState(false);
  const capaInputRef = useRef<HTMLInputElement>(null);

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
    setCapa(item.artigo_capa || "");
    setCapaAlt(item.artigo_capa_alt || "");
  };

  const onPickCapa = async (file: File) => {
    setUploadingCapa(true);
    try {
      const url = await uploadBlogImage(file);
      setCapa(url);
    } catch (e: any) {
      alert(`Erro no upload: ${e.message}`);
    } finally {
      setUploadingCapa(false);
    }
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

  const publishIt = async (id: Artigo["id"]) => {
    if (!confirm("Publicar este artigo?")) return;
    setSaving("publicar-card");
    try {
      const res = await fetch(`${REST}?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          ...baseHeaders,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          status: "publicado",
          publicado_em: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setItems((prev) => prev.filter((x) => x.id !== id));
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
      { artigo_titulo: titulo, artigo_corpo: corpo, artigo_capa: capa || null, artigo_capa_alt: capaAlt || null, status: "escrito" },
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
      { artigo_titulo: titulo, artigo_corpo: corpo, artigo_capa: capa || null, artigo_capa_alt: capaAlt || null },
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
        artigo_capa: capa || null,
        artigo_capa_alt: capaAlt || null,
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
        <header style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#7C1638", margin: 0 }}>Redação</h1>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={() => {
                if (gerando) return;
                setGerando(true);
                try {
                  fetch(
                    "https://script.google.com/macros/s/AKfycbxUyhnNvO8_q7iBXEUiTm1t9-c48wBb4mvZ7hAwYNCgwiBizQ9o7C_ro4NYpkBckgEv2g/exec?senha=eet5tpnz",
                    { method: "GET", mode: "no-cors" }
                  ).catch(() => {});
                } finally {
                  alert("Geração disparada. Aguarde 1-2 minutos e clique em Recarregar para ver os novos artigos.");
                  setTimeout(() => setGerando(false), 5000);
                }
              }}
              disabled={gerando}
              style={{ ...btnOutline, opacity: gerando ? 0.6 : 1, cursor: gerando ? "not-allowed" : "pointer" }}
            >
              {gerando ? "Disparado…" : "Gerar artigos agora"}
            </button>
            <button onClick={load} style={btnPrimary}>Recarregar</button>
          </div>
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
                {tab === "escrito" && (
                  <button onClick={() => publishIt(item.id)} disabled={!!saving} style={btnPrimarySm}>
                    Publicar
                  </button>
                )}
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
                    {htmlToText(item.artigo_corpo).slice(0, 260)}
                    {htmlToText(item.artigo_corpo).length > 260 ? "…" : ""}
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

            <label style={labelStyle}>Imagem de capa</label>
            <div style={{ marginBottom: 16 }}>
              {capa && (
                <div style={{ marginBottom: 10, aspectRatio: "16 / 9", width: "100%", overflow: "hidden", borderRadius: 6, background: "#F5F3F0" }}>
                  <img src={capa} alt="Capa" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              )}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button type="button" onClick={() => capaInputRef.current?.click()} disabled={uploadingCapa} style={btnOutline}>
                  {uploadingCapa ? "Enviando…" : capa ? "Trocar capa" : "Enviar capa"}
                </button>
                {capa && (
                  <button type="button" onClick={() => setCapa("")} style={btnGhost}>
                    Remover
                  </button>
                )}
              </div>
              <input
                ref={capaInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onPickCapa(f);
                  e.target.value = "";
                }}
              />
            </div>

            {(() => {
              const sugeridas = parseCapasSugeridas(selected.capas_sugeridas);
              if (sugeridas.length === 0) return null;
              return (
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Capas sugeridas</label>
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${sugeridas.length}, 1fr)`, gap: 10 }}>
                    {sugeridas.map((s) => {
                      const active = capa === s.url;
                      return (
                        <button
                          key={s.url}
                          type="button"
                          onClick={() => {
                            setCapa(s.url);
                            if (s.alt) setCapaAlt(s.alt);
                          }}
                          style={{
                            padding: 0,
                            border: active ? "3px solid #7C1638" : "1px solid #ddd",
                            borderRadius: 6,
                            overflow: "hidden",
                            cursor: "pointer",
                            aspectRatio: "16 / 9",
                            background: "#F5F3F0",
                          }}
                          title={active ? "Capa selecionada" : "Usar esta capa"}
                        >
                          <img
                            src={s.url}
                            alt={s.alt || "Capa sugerida"}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          />
                        </button>
                      );
                    })}

                  </div>
                </div>
              );
            })()}

            <label style={labelStyle}>Texto alternativo da capa (alt)</label>
            <input
              value={capaAlt}
              onChange={(e) => setCapaAlt(e.target.value)}
              placeholder="Descreva a imagem de capa para acessibilidade e SEO"
              style={inputStyle}
            />


            <label style={labelStyle}>Corpo do artigo</label>
            <div style={{ marginBottom: 16 }}>
              <RichEditor value={corpo} onChange={setCorpo} />
            </div>

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
const btnPrimarySm: React.CSSProperties = {
  padding: "6px 12px",
  background: "#7C1638",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 13,
};
