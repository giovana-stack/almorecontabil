import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — Almore" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      if (mode === "login") {
        await signIn(email, password);
        navigate({ to: "/" });
      } else {
        await signUp(email, password, nome.trim());
        setInfo(
          "Conta criada. Se a confirmação por e-mail estiver ativa, verifique sua caixa de entrada antes de entrar."
        );
        setMode("login");
      }
    } catch (err: any) {
      setError(err?.message || "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F5F3F0", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#fff", padding: 32, borderRadius: 8, width: "100%", maxWidth: 420, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <h1 style={{ margin: 0, marginBottom: 8, color: "#7C1638", fontSize: 24, fontWeight: 700 }}>
          {mode === "login" ? "Entrar" : "Criar conta"}
        </h1>
        <p style={{ margin: 0, marginBottom: 20, color: "#818181", fontSize: 14 }}>
          {mode === "login" ? "Acesse sua conta Almore." : "Registre uma nova conta."}
        </p>

        <form onSubmit={onSubmit}>
          <label style={label}>E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={input}
            autoComplete="email"
          />
          <label style={label}>Senha</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={input}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />

          {error && <p style={{ color: "#b00020", fontSize: 13, margin: "8px 0" }}>{error}</p>}
          {info && <p style={{ color: "#0a7d3a", fontSize: 13, margin: "8px 0" }}>{info}</p>}

          <button type="submit" disabled={loading} style={btnPrimary}>
            {loading ? "Aguarde…" : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <div style={{ marginTop: 16, fontSize: 14, color: "#595959", textAlign: "center" }}>
          {mode === "login" ? (
            <>
              Não tem conta?{" "}
              <button type="button" onClick={() => { setMode("signup"); setError(null); setInfo(null); }} style={linkBtn}>
                Criar conta
              </button>
            </>
          ) : (
            <>
              Já tem conta?{" "}
              <button type="button" onClick={() => { setMode("login"); setError(null); setInfo(null); }} style={linkBtn}>
                Entrar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const label: React.CSSProperties = { display: "block", fontSize: 13, color: "#595959", marginBottom: 6 };
const input: React.CSSProperties = {
  width: "100%",
  padding: 10,
  fontSize: 15,
  border: "1px solid #ddd",
  borderRadius: 4,
  marginBottom: 14,
  boxSizing: "border-box",
};
const btnPrimary: React.CSSProperties = {
  width: "100%",
  padding: "12px 18px",
  background: "#7C1638",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 15,
  fontWeight: 600,
  marginTop: 4,
};
const linkBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#7C1638",
  cursor: "pointer",
  fontSize: 14,
  padding: 0,
  textDecoration: "underline",
};
