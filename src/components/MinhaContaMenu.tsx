import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";

type ModalKind = "nome" | "email" | "senha" | null;

export function MinhaContaMenu() {
  const { perfil, user, isAdmin, updateNome, updateEmail, updatePassword } = useAuth();
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState<ModalKind>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const item: React.CSSProperties = {
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "10px 14px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 14,
    color: "#2b2b2b",
    textDecoration: "none",
    fontFamily: "inherit",
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="font-display font-semibold text-sm text-[#7C1638] hover:text-[#68112F] transition-colors"
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        Minha conta ▾
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            minWidth: 200,
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: 8,
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            zIndex: 100,
            overflow: "hidden",
          }}
        >
          <button style={item} onClick={() => { setModal("nome"); setOpen(false); }}>Alterar nome</button>
          <button style={item} onClick={() => { setModal("email"); setOpen(false); }}>Alterar e-mail</button>
          <button style={item} onClick={() => { setModal("senha"); setOpen(false); }}>Alterar senha</button>
          {isAdmin && (
            <a href="/admin/redacao" style={{ ...item, borderTop: "1px solid #f0eeeb", color: "#7C1638", fontWeight: 600 }}>
              Painel de redação
            </a>
          )}
        </div>
      )}

      {modal === "nome" && (
        <EditModal
          title="Alterar nome"
          label="Nome"
          initial={perfil?.nome ?? ""}
          onClose={() => setModal(null)}
          onSave={async (v) => { await updateNome(v); }}
        />
      )}
      {modal === "email" && (
        <EditModal
          title="Alterar e-mail"
          label="Novo e-mail"
          type="email"
          initial={user?.email ?? ""}
          onClose={() => setModal(null)}
          onSave={async (v) => { await updateEmail(v); }}
          hint="Você pode precisar confirmar o novo endereço por e-mail."
        />
      )}
      {modal === "senha" && (
        <EditModal
          title="Alterar senha"
          label="Nova senha"
          type="password"
          initial=""
          minLength={6}
          onClose={() => setModal(null)}
          onSave={async (v) => { await updatePassword(v); }}
        />
      )}
    </div>
  );
}

function EditModal({
  title, label, initial, onClose, onSave, type = "text", minLength, hint,
}: {
  title: string;
  label: string;
  initial: string;
  onClose: () => void;
  onSave: (v: string) => Promise<void>;
  type?: string;
  minLength?: number;
  hint?: string;
}) {
  const [value, setValue] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSave(value);
      setOk(true);
      setTimeout(onClose, 900);
    } catch (err: any) {
      setError(err?.message || "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16,
      }}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        style={{ background: "#fff", borderRadius: 8, padding: 24, width: "100%", maxWidth: 420 }}
      >
        <h2 style={{ margin: 0, marginBottom: 16, color: "#7C1638", fontSize: 20, fontWeight: 700 }}>{title}</h2>
        <label style={{ display: "block", fontSize: 13, color: "#595959", marginBottom: 6 }}>{label}</label>
        <input
          type={type}
          required
          minLength={minLength}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          style={{ width: "100%", padding: 10, fontSize: 15, border: "1px solid #ddd", borderRadius: 4, boxSizing: "border-box" }}
        />
        {hint && <p style={{ fontSize: 12, color: "#818181", marginTop: 6 }}>{hint}</p>}
        {error && <p style={{ color: "#b00020", fontSize: 13, marginTop: 8 }}>{error}</p>}
        {ok && <p style={{ color: "#0a7d3a", fontSize: 13, marginTop: 8 }}>Atualizado com sucesso.</p>}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
          <button type="button" onClick={onClose} style={{ padding: "10px 16px", background: "#f0eeeb", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14 }}>
            Cancelar
          </button>
          <button type="submit" disabled={loading} style={{ padding: "10px 16px", background: "#7C1638", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
            {loading ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
