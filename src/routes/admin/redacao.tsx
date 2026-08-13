import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useRef } from "react";
import { RichEditor } from "@/components/RichEditor";
import { CapaCropper, parseCapaPos, formatCapaPos, type CapaPos } from "@/components/CapaCropper";
import { restHeaders as baseHeaders, REST_ARTIGOS as REST, uploadBlogImage, htmlToText, formatDate, gerarAltComIA } from "@/lib/blog";
import { useAuth } from "@/lib/auth-context";
import { supabaseExt } from "@/lib/auth-supabase";


export const Route = createFileRoute("/admin/redacao")({
  head: () => ({
    meta: [
      { title: "Redação — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: RedacaoGate,
});

function RedacaoGate() {
  const { loading, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!user || !isAdmin) navigate({ to: "/", replace: true });
  }, [loading, user, isAdmin, navigate]);
  if (loading) {
    return <div style={{ minHeight: "100vh", background: "#F5F3F0", display: "flex", alignItems: "center", justifyContent: "center", color: "#595959" }}>Carregando…</div>;
  }
  if (!user || !isAdmin) return null;
  return <RedacaoPage />;
}

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
  artigo_capa_pos: string | null;
  capas_sugeridas: string | null;

  status: string;
  criado_em: string;
  publicado_em: string | null;
  agendado_para: string | null;
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
        .slice(0, 6);
    }
  } catch {
    // ignore
  }
  return [];
}


type Tab = "novo" | "pronto" | "agendado" | "publicado";

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
  const [capaPos, setCapaPos] = useState<CapaPos>({ x: 50, y: 50 });
  const [uploadingCapa, setUploadingCapa] = useState(false);

  const [saving, setSaving] = useState<string | null>(null);
  const [agendadoPara, setAgendadoPara] = useState("");
  const [gerando, setGerando] = useState(false);
  const [gerandoAltCapa, setGerandoAltCapa] = useState(false);
  const [altCapaErro, setAltCapaErro] = useState<string | null>(null);
  const capaInputRef = useRef<HTMLInputElement>(null);

  const handleGerarAltCapa = async () => {
    if (!capa || gerandoAltCapa) return;
    setGerandoAltCapa(true);
    setAltCapaErro(null);
    try {
      const alt = await gerarAltComIA(capa, titulo || "");
      setCapaAlt(alt);
    } catch (err: any) {
      console.error("[redacao] Falha ao gerar alt capa:", err);
      setAltCapaErro(err.message || "Não foi possível gerar o alt, tente novamente ou escreva manualmente.");
    } finally {
      setGerandoAltCapa(false);
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabaseExt.auth.getSession();
      const headers: Record<string, string> = { ...baseHeaders };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      let orderBy = tab === "publicado" ? "publicado_em.desc" : "criado_em.desc";
      if (tab === "agendado") orderBy = "agendado_para.asc";
      
      let statusFilter = `status=eq.${tab}`;
      const url = `${REST}?${statusFilter}&order=${orderBy}&select=*`;
      
      const res = await fetch(url, { headers });
      const rawData = await res.json();
      
      console.log(`[redacao] tab=${tab} url=${url} status=${res.status} count=${rawData?.length}`);
      if (!res.ok) {
        console.error("[redacao] erro na query:", rawData);
        throw new Error(`HTTP ${res.status}: ${rawData?.message || "Erro desconhecido"}`);
      }
      setItems(rawData || []);
    } catch (e: any) {
      console.error("[redacao] exception ao carregar:", e);
      setError(e.message || "Erro ao carregar");
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [selected]);


  const openEditor = (item: Artigo) => {
    setSelected(item);
    setTitulo(item.artigo_titulo || "");
    setCorpo(item.artigo_corpo || "");
    setCapa(item.artigo_capa || "");
    setCapaAlt(item.artigo_capa_alt || "");
    setCapaPos(parseCapaPos(item.artigo_capa_pos));
    setAgendadoPara(item.agendado_para ? item.agendado_para.slice(0, 16) : "");
  };

  const onPickCapa = async (file: File) => {
    setUploadingCapa(true);
    try {
      const url = await uploadBlogImage(file);
      setCapa(url);
      setCapaPos({ x: 50, y: 50 });

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
  ): Promise<boolean> => {
    setSaving(kind);
    try {
      const { data: { session } } = await supabaseExt.auth.getSession();
      const headers: Record<string, string> = {
        ...baseHeaders,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const res = await fetch(`${REST}?id=eq.${id}`, {
        method: "PATCH",
        headers,
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
      return true;
    } catch (e: any) {
      alert(`Erro: ${e.message}`);
      return false;
    } finally {
      setSaving(null);
    }
  };

  const deleteIt = async (id: Artigo["id"]) => {
    if (!confirm("Tem certeza que deseja excluir? Esta ação não pode ser desfeita.")) return;
    setSaving("excluir");
    try {
      const { data: { session } } = await supabaseExt.auth.getSession();
      const headers: Record<string, string> = { ...baseHeaders, Prefer: "return=minimal" };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const res = await fetch(`${REST}?id=eq.${id}`, {
        method: "DELETE",
        headers,
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
  const descartar = () => {
    if (!selected) return;
    if (!confirm("Descartar este artigo?")) return;
    patchIt(selected.id, { status: "descartado" }, "descartar", true);
  };
  const publicar = async () => {
    if (!selected) return;
    if (!confirm("Publicar este artigo?")) return;
    const id = selected.id;
    const ok = await patchIt(
      id,
      {
        artigo_titulo: titulo,
        artigo_corpo: corpo,
        artigo_capa: capa || null,
        artigo_capa_alt: capaAlt || null,
        artigo_capa_pos: capa ? formatCapaPos(capaPos) : null,

        status: "publicado",
        publicado_em: new Date().toISOString(),
        agendado_para: null,
      },
      "publicar",
      true
    );
    if (ok) {
      fetch(
        `https://script.google.com/macros/s/AKfycbxUyhnNvO8_q7iBXEUiTm1t9-c48wBb4mvZ7hAwYNCgwiBizQ9o7C_ro4NYpkBckgEv2g/exec?senha=eet5tpnz&postar=${encodeURIComponent(String(id))}`,
        { method: "GET", mode: "no-cors" }
      ).catch(() => {});
    }
  };

  // Publicados
  const salvarAlteracoes = () => {
    if (!selected) return;
    const body: any = {
      artigo_titulo: titulo,
      artigo_corpo: corpo,
      artigo_capa: capa || null,
      artigo_capa_alt: capaAlt || null,
      artigo_capa_pos: capa ? formatCapaPos(capaPos) : null,
    };
    if (agendadoPara) {
      body.agendado_para = new Date(agendadoPara).toISOString();
      body.status = "agendado";
    } else {
      // Se não tem agendamento e já estava publicado, mantemos publicado
      // Se era agendado e limpou, volta para pronto (isso só aconteceria se tab fosse alterado, mas por segurança:)
      body.agendado_para = null;
      if (selected.status === "agendado") body.status = "pronto";
    }
    patchIt(
      selected.id,
      body,
      "alteracoes",
      agendadoPara ? true : false
    );
  };
  const despublicar = () => {
    if (!selected) return;
    if (!confirm("Despublicar este artigo?")) return;
    patchIt(selected.id, { status: "pronto" }, "despublicar", true);
  };

  const salvarPronto = () => {
    if (!selected) return;
    const body: any = {
      artigo_titulo: titulo,
      artigo_corpo: corpo,
      artigo_capa: capa || null,
      artigo_capa_alt: capaAlt || null,
      artigo_capa_pos: capa ? formatCapaPos(capaPos) : null,
    };
    if (agendadoPara) {
      body.agendado_para = new Date(agendadoPara).toISOString();
      body.status = "agendado";
    } else {
      body.agendado_para = null;
      body.status = "pronto";
    }
    patchIt(selected.id, body, "salvar-pronto", true);
  };

  const publicarRapido = async (item: Artigo) => {
    if (!confirm("Publicar este artigo agora?")) return;
    const ok = await patchIt(
      item.id,
      {
        status: "publicado",
        publicado_em: new Date().toISOString(),
        agendado_para: null,
      },
      "publicar",
      true
    );
    if (ok) {
      fetch(
        `https://script.google.com/macros/s/AKfycbxUyhnNvO8_q7iBXEUiTm1t9-c48wBb4mvZ7hAwYNCgwiBizQ9o7C_ro4NYpkBckgEv2g/exec?senha=eet5tpnz&postar=${encodeURIComponent(String(item.id))}`,
        { method: "GET", mode: "no-cors" }
      ).catch(() => {});
    }
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
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {gerando && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#595959", fontSize: 14 }}>
                <span
                  style={{
                    width: 14,
                    height: 14,
                    border: "2px solid #7C1638",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Gerando artigos... a lista será atualizada em instantes
              </span>
            )}
            <button
              onClick={() => {
                if (gerando) return;
                setGerando(true);
                fetch(
                  "https://script.google.com/macros/s/AKfycbxUyhnNvO8_q7iBXEUiTm1t9-c48wBb4mvZ7hAwYNCgwiBizQ9o7C_ro4NYpkBckgEv2g/exec?senha=eet5tpnz",
                  { method: "GET", mode: "no-cors" }
                ).catch((err: any) => {
                  alert(`Erro ao gerar artigos: ${err.name || "Erro desconhecido"} - ${err.message || ""}`);
                });
                setTimeout(() => {
                  load();
                  setGerando(false);
                }, 90000);
              }}
              disabled={gerando}
              style={{ ...btnOutline, opacity: gerando ? 0.6 : 1, cursor: gerando ? "not-allowed" : "pointer" }}
            >
              {gerando ? "Gerando…" : "Gerar artigos agora"}
            </button>
            <button onClick={load} style={btnPrimary}>Recarregar</button>
          </div>
        </header>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {tabBtn("novo", "Novos")}
          {tabBtn("pronto", "Prontos")}
          {tabBtn("agendado", "Agendados")}
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
                  <div style={{ fontSize: 13, color: "#818181", marginBottom: 10, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ background: "#7C1638", color: "#fff", padding: "2px 6px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                      Coletado em {formatDate(item.criado_em)}
                    </span>
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

            if (tab === "pronto" || tab === "agendado") {
              return (
                <article key={item.id} onClick={() => openEditor(item)} style={cardStyle}>
                  <div style={cardHeaderStyle}>
                    <h2 style={{ margin: "0 0 8px", fontSize: 18, color: "#111", flex: 1 }}>
                      {item.artigo_titulo || "(sem título)"}
                    </h2>
                    <div
                      style={{ display: "flex", gap: 8, flexShrink: 0 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button 
                        onClick={() => publicarRapido(item)} 
                        disabled={!!saving} 
                        style={btnPrimarySm}
                      >
                        {saving === "publicar" ? "..." : "Publicar"}
                      </button>
                      <button onClick={() => openEditor(item)} style={btnOutlineSm}>
                        Editar
                      </button>
                      <button onClick={() => deleteIt(item.id)} disabled={!!saving} style={btnDangerSm}>
                        Excluir
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: "#818181", display: "flex", gap: 8, alignItems: "center" }}>
                    {item.status === "agendado" ? (
                      <span style={{ background: "#68112F", color: "#fff", padding: "2px 6px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                        Agendado para {new Date(item.agendado_para!).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    ) : (
                      "Salvo em Prontos"
                    )}
                  </div>
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
            style={{ background: "#fff", maxWidth: 900, width: "100%", borderRadius: 8, padding: 28, marginTop: 20, position: "relative" }}
          >
            <button
              type="button"
              aria-label="Fechar editor"
              onClick={() => setSelected(null)}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "transparent",
                border: "none",
                fontSize: 22,
                lineHeight: 1,
                cursor: "pointer",
                color: "#595959",
                padding: "4px 8px",
                borderRadius: 4,
              }}
            >
              ×
            </button>

            {(selected.noticia_fonte || selected.noticia_link || selected.status === "novo") && (
              <div style={{ marginBottom: 16, fontSize: 13, color: "#818181", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                {selected.status === "novo" && (
                  <span style={{ background: "#7C1638", color: "#fff", padding: "2px 6px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                    Coletado em {formatDate(selected.criado_em)}
                  </span>
                )}
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
                <div style={{ marginBottom: 10 }}>
                  <CapaCropper src={capa} alt={capaAlt} value={capaPos} onChange={setCapaPos} />
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
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
                    {sugeridas.map((s) => {
                      const active = capa === s.url;
                      return (
                        <button
                          key={s.url}
                          type="button"
                          onClick={() => {
                            setCapa(s.url);
                            setCapaPos({ x: 50, y: 50 });
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
            <div style={{ display: "flex", gap: 8, alignItems: "stretch", marginBottom: altCapaErro ? 6 : 16 }}>
              <input
                value={capaAlt}
                onChange={(e) => setCapaAlt(e.target.value)}
                placeholder="Descreva a imagem de capa para acessibilidade e SEO"
                style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
              />
              <button
                type="button"
                onClick={handleGerarAltCapa}
                disabled={!capa || gerandoAltCapa}
                title={!capa ? "Envie uma capa primeiro" : "Gerar alt com IA"}
                style={{
                  ...btnOutline,
                  whiteSpace: "nowrap",
                  opacity: !capa || gerandoAltCapa ? 0.6 : 1,
                  cursor: !capa || gerandoAltCapa ? "not-allowed" : "pointer",
                }}
              >
                {gerandoAltCapa ? "Gerando…" : "Gerar alt com IA"}
              </button>
            </div>
            {altCapaErro && (
              <div style={{ color: "#b00020", fontSize: 13, marginBottom: 16 }}>{altCapaErro}</div>
            )}

            <label style={labelStyle}>Corpo do artigo</label>
            <div style={{ marginBottom: 16 }}>
              <RichEditor value={corpo} onChange={setCorpo} contextTitle={titulo} />
            </div>

            <label style={labelStyle}>Agendar publicação para (opcional)</label>
            <input
              type="datetime-local"
              value={agendadoPara}
              onChange={(e) => setAgendadoPara(e.target.value)}
              style={{ ...inputStyle, maxWidth: 300 }}
            />

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
                    <button onClick={salvarPronto} disabled={!!saving} style={btnPrimary}>
                      {saving === "salvar-pronto"
                        ? "Salvando…"
                        : agendadoPara
                          ? "Agendar publicação"
                          : "Pronto para publicar"}
                    </button>
                  </>
                )}

                {tab === "pronto" && (
                  <>
                    <button onClick={descartar} disabled={!!saving} style={btnOutline}>
                      {saving === "descartar" ? "Descartar" : "Descartar"}
                    </button>
                    <button onClick={salvarPronto} disabled={!!saving} style={btnOutline}>
                      {saving === "salvar-pronto"
                        ? "Salvando…"
                        : agendadoPara
                          ? "Atualizar agendamento"
                          : "Salvar alterações"}
                    </button>
                    <button onClick={publicar} disabled={!!saving} style={btnPrimary}>
                      {saving === "publicar" ? "Publicando…" : "Publicar agora"}
                    </button>
                  </>
                )}

                {tab === "publicado" && (
                  <>
                    <button onClick={despublicar} disabled={!!saving} style={btnOutline}>
                      {saving === "despublicar" ? "Despublicando…" : "Voltar para Prontos"}
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
