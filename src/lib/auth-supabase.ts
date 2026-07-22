import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON } from "./blog";

export const supabaseExt = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "almore-ext-auth",
  },
});

export type Papel = "admin" | "comum" | string;

export type Perfil = {
  id: string;
  email: string | null;
  nome: string | null;
  papel: Papel;
};
