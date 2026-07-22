import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabaseExt, type Perfil } from "./auth-supabase";

type AuthState = {
  loading: boolean;
  user: User | null;
  session: Session | null;
  perfil: Perfil | null;
  papel: string | null;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, nome: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateNome: (nome: string) => Promise<void>;
  updateEmail: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  refreshPerfil: () => Promise<void>;
};

const Ctx = createContext<AuthState | null>(null);

async function loadPerfil(user: User): Promise<Perfil | null> {
  const { data, error } = await supabaseExt
    .from("perfis")
    .select("id, email, nome, papel")
    .eq("id", user.id)
    .maybeSingle();
  if (error) {
    console.warn("[auth] erro ao carregar perfil:", error.message);
    return null;
  }
  return (data as Perfil | null) ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabaseExt.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (data.session?.user) {
        const p = await loadPerfil(data.session.user);
        if (!mounted) return;
        setPerfil(p);
      }
      setLoading(false);
    });

    const { data: sub } = supabaseExt.auth.onAuthStateChange(async (_event, s) => {
      setSession(s);
      if (s?.user) {
        const p = await loadPerfil(s.user);
        setPerfil(p);
      } else {
        setPerfil(null);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabaseExt.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, nome: string) => {
    const { data, error } = await supabaseExt.auth.signUp({ email, password });
    if (error) {
      console.warn("[auth] signUp falhou:", error.message);
      throw new Error("Não foi possível criar a conta");
    }
    const uid = data.user?.id;
    if (!uid) return;

    let hasSession = !!data.session;
    if (!hasSession) {
      const { data: signInData } = await supabaseExt.auth.signInWithPassword({ email, password });
      hasSession = !!signInData.session;
    }
    if (!hasSession) return;

    const { error: pErr } = await supabaseExt
      .from("perfis")
      .insert({ id: uid, email, nome, papel: "comum" });
    if (pErr && !/duplicate|already/i.test(pErr.message)) {
      console.warn("[auth] erro ao criar perfil:", pErr.message);
    }
  };

  const signOut = async () => {
    await supabaseExt.auth.signOut();
  };

  const refreshPerfil = async () => {
    if (session?.user) {
      const p = await loadPerfil(session.user);
      setPerfil(p);
    }
  };

  const updateNome = async (nome: string) => {
    if (!session?.user) throw new Error("Não autenticado");
    const { error } = await supabaseExt
      .from("perfis")
      .update({ nome })
      .eq("id", session.user.id);
    if (error) throw new Error("Não foi possível atualizar o nome");
    await refreshPerfil();
  };

  const updateEmail = async (email: string) => {
    const { data: sessionData } = await supabaseExt.auth.getSession();
    if (!sessionData.session) throw new Error("Sessão expirada. Faça login novamente.");
    const { data, error } = await supabaseExt.auth.updateUser({ email });
    if (error) throw new Error(error.message || "Não foi possível atualizar o e-mail");
    if (!data?.user) throw new Error("Resposta inválida do servidor ao atualizar e-mail");
  };

  const updatePassword = async (password: string) => {
    const { data: sessionData } = await supabaseExt.auth.getSession();
    if (!sessionData.session) throw new Error("Sessão expirada. Faça login novamente.");
    const { data, error } = await supabaseExt.auth.updateUser({ password });
    if (error) throw new Error(error.message || "Não foi possível atualizar a senha");
    if (!data?.user) throw new Error("Resposta inválida do servidor ao atualizar a senha");
  };

  const user = session?.user ?? null;
  const papel = perfil?.papel ?? null;

  return (
    <Ctx.Provider
      value={{
        loading,
        session,
        user,
        perfil,
        papel,
        isAdmin: papel === "admin",
        signIn,
        signUp,
        signOut,
        updateNome,
        updateEmail,
        updatePassword,
        refreshPerfil,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth(): AuthState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return v;
}
