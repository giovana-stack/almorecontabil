import { useEffect, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { supabaseExt } from "@/lib/auth-supabase";
import { useAuth } from "@/lib/auth-context";

type Comentario = {
  id: string;
  artigo_id: string;
  autor_id: string | null;
  autor_email: string | null;
  corpo: string;
  resposta_a: string | null;
  criado_em: string;
};

function emailHandle(email: string | null): string {
  if (!email) return "Anônimo";
  const at = email.indexOf("@");
  return at > 0 ? email.slice(0, at) : email;
}

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function Comentarios({ artigoId }: { artigoId: string | number }) {
  const { user, isAdmin } = useAuth();
  const [items, setItems] = useState<Comentario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [corpo, setCorpo] = useState("");
  const [sending, setSending] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyCorpo, setReplyCorpo] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabaseExt
      .from("comentarios")
      .select("id, artigo_id, autor_id, autor_email, corpo, resposta_a, criado_em")
      .eq("artigo_id", String(artigoId))
      .order("criado_em", { ascending: true });
    if (error) setError(error.message);
    setItems((data as Comentario[]) ?? []);
    setLoading(false);
  }, [artigoId]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !corpo.trim()) return;
    setSending(true);
    const { error } = await supabaseExt.from("comentarios").insert({
      artigo_id: String(artigoId),
      autor_id: user.id,
      autor_email: user.email,
      corpo: corpo.trim(),
    });
    setSending(false);
    if (error) {
      alert("Não foi possível enviar o comentário.");
      return;
    }
    setCorpo("");
    load();
  };

  const submitReply = async (parentId: string) => {
    if (!user || !replyCorpo.trim()) return;
    const { error } = await supabaseExt.from("comentarios").insert({
      artigo_id: String(artigoId),
      autor_id: user.id,
      autor_email: user.email,
      corpo: replyCorpo.trim(),
      resposta_a: parentId,
    });
    if (error) {
      alert("Não foi possível enviar a resposta.");
      return;
    }
    setReplyCorpo("");
    setReplyTo(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Excluir este comentário?")) return;
    const { error } = await supabaseExt.from("comentarios").delete().eq("id", id);
    if (error) {
      alert("Não foi possível excluir.");
      return;
    }
    load();
  };

  const canDelete = (c: Comentario) => !!user && (isAdmin || c.autor_id === user.id);

  const parents = items.filter((c) => !c.resposta_a);
  const childrenOf = (id: string) => items.filter((c) => c.resposta_a === id);

  const renderComment = (c: Comentario, isReply = false) => (
    <div
      key={c.id}
      style={{
        background: "#fff",
        padding: 16,
        borderRadius: 8,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        marginBottom: 12,
        marginLeft: isReply ? 24 : 0,
        borderLeft: isReply ? "3px solid #7C1638" : "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
        <strong style={{ color: "#7C1638", fontSize: 14 }}>{emailHandle(c.autor_email)}</strong>
        <span style={{ color: "#818181", fontSize: 12 }}>{formatDateTime(c.criado_em)}</span>
      </div>
      <p style={{ margin: "8px 0 0", color: "#2b2b2b", fontSize: 15, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
        {c.corpo}
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
        {user && !isReply && (
          <button
            type="button"
            onClick={() => { setReplyTo(replyTo === c.id ? null : c.id); setReplyCorpo(""); }}
            style={linkBtn}
          >
            {replyTo === c.id ? "Cancelar" : "Responder"}
          </button>
        )}
        {canDelete(c) && (
          <button type="button" onClick={() => remove(c.id)} style={{ ...linkBtn, color: "#b00020" }}>
            Excluir
          </button>
        )}
      </div>
      {replyTo === c.id && user && (
        <div style={{ marginTop: 12 }}>
          <textarea
            value={replyCorpo}
            onChange={(e) => setReplyCorpo(e.target.value)}
            rows={3}
            placeholder="Escreva sua resposta…"
            style={textarea}
          />
          <div style={{ marginTop: 8, textAlign: "right" }}>
            <button type="button" onClick={() => submitReply(c.id)} disabled={!replyCorpo.trim()} style={btnPrimary}>
              Enviar resposta
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section style={{ marginTop: 40 }}>
      <h2 className="font-display" style={{ color: "#7C1638", fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
        Comentários {items.length > 0 && <span style={{ color: "#818181", fontWeight: 400, fontSize: 18 }}>({items.length})</span>}
      </h2>

      {user ? (
        <form onSubmit={submit} style={{ background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginBottom: 24 }}>
          <textarea
            value={corpo}
            onChange={(e) => setCorpo(e.target.value)}
            rows={4}
            placeholder="Escreva um comentário…"
            style={textarea}
            required
          />
          <div style={{ marginTop: 10, textAlign: "right" }}>
            <button type="submit" disabled={sending || !corpo.trim()} style={btnPrimary}>
              {sending ? "Enviando…" : "Comentar"}
            </button>
          </div>
        </form>
      ) : (
        <div style={{ background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginBottom: 24, textAlign: "center", color: "#595959" }}>
          <Link to="/login" style={{ color: "#7C1638", fontWeight: 600, textDecoration: "none" }}>
            Faça login para comentar
          </Link>
        </div>
      )}

      {loading && <p style={{ color: "#818181" }}>Carregando comentários…</p>}
      {error && <p style={{ color: "#b00020" }}>{error}</p>}
      {!loading && !error && parents.length === 0 && (
        <p style={{ color: "#818181" }}>Ainda não há comentários. Seja o primeiro.</p>
      )}

      {parents.map((p) => (
        <div key={p.id}>
          {renderComment(p)}
          {childrenOf(String(p.id)).map((child) => renderComment(child, true))}
        </div>
      ))}
    </section>
  );
}

const textarea: React.CSSProperties = {
  width: "100%",
  padding: 10,
  fontSize: 15,
  border: "1px solid #ddd",
  borderRadius: 6,
  fontFamily: "inherit",
  resize: "vertical",
  boxSizing: "border-box",
};
const btnPrimary: React.CSSProperties = {
  padding: "10px 18px",
  background: "#7C1638",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 600,
};
const linkBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#7C1638",
  cursor: "pointer",
  fontSize: 13,
  padding: 0,
  fontWeight: 600,
};
