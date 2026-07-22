import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/minha-conta")({
  head: () => ({
    meta: [
      { title: "Minha conta — Almore" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: MinhaContaPage,
});

function MinhaContaPage() {
  const { user, perfil, isAdmin, loading, signOut, updateNome } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login", replace: true });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#818181" }}>
        Carregando…
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F5F3F0" }}>
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #eee",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <a href="/" className="font-display font-semibold text-sm text-[#7C1638] hover:text-[#68112F]">
          ← Voltar ao site
        </a>
        <button
          onClick={() => signOut()}
          className="font-display font-semibold text-sm text-[#7C1638] hover:text-[#68112F]"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          Sair
        </button>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
        <h1 className="font-display" style={{ fontSize: 36, fontWeight: 700, color: "#7C1638", margin: 0 }}>
          Minha conta
        </h1>
        <p style={{ color: "#595959", marginTop: 8, marginBottom: 32 }}>
          {user.email}
        </p>

        {isAdmin && (
          <a
            href="/admin/redacao"
            className="font-display font-semibold"
            style={{
              display: "inline-block",
              padding: "12px 20px",
              background: "#7C1638",
              color: "#fff",
              borderRadius: 6,
              textDecoration: "none",
              marginBottom: 32,
              fontSize: 14,
            }}
          >
            Painel de redação →
          </a>
        )}

        <SectionCard
          title="Alterar nome"
          label="Nome"
          initial={perfil?.nome ?? ""}
          onSave={updateNome}
        />
      </main>
    </div>
  );
}

function SectionCard({
  title,
  label,
  initial,
  onSave,
  type = "text",
  minLength,
  hint,
  clearAfterSave = false,
}: {
  title: string;
  label: string;
  initial: string;
  onSave: (v: string) => Promise<void>;
  type?: string;
  minLength?: number;
  hint?: string;
  clearAfterSave?: boolean;
}) {
  const [value, setValue] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  useEffect(() => { setValue(initial); }, [initial]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOk(false);
    setLoading(true);
    try {
      await onSave(value);
      setOk(true);
      if (clearAfterSave) setValue("");
      setTimeout(() => setOk(false), 2500);
    } catch (err: any) {
      setError(err?.message || "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      style={{
        background: "#fff",
        border: "1px solid #eee",
        borderRadius: 8,
        padding: 24,
        marginBottom: 16,
      }}
    >
      <h2 className="font-display" style={{ margin: 0, marginBottom: 12, color: "#2b2b2b", fontSize: 18, fontWeight: 700 }}>
        {title}
      </h2>
      <label style={{ display: "block", fontSize: 13, color: "#595959", marginBottom: 6 }}>{label}</label>
      <input
        type={type}
        required
        minLength={minLength}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          fontSize: 15,
          border: "1px solid #ddd",
          borderRadius: 4,
          boxSizing: "border-box",
        }}
      />
      {hint && <p style={{ fontSize: 12, color: "#818181", marginTop: 6 }}>{hint}</p>}
      {error && <p style={{ color: "#b00020", fontSize: 13, marginTop: 8 }}>{error}</p>}
      {ok && <p style={{ color: "#0a7d3a", fontSize: 13, marginTop: 8 }}>Atualizado com sucesso.</p>}
      <div style={{ marginTop: 16, textAlign: "right" }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            background: "#7C1638",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: loading ? "default" : "pointer",
            fontSize: 14,
            fontWeight: 600,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Salvando…" : "Salvar"}
        </button>
      </div>
    </form>
  );
}
