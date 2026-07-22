import { useAuth } from "@/lib/auth-context";
import logoBordeaux from "@/assets/almore-logo.png.asset.json";

export function SiteNavbar() {
  const { user, signOut } = useAuth();

  function handleFalar(e: React.MouseEvent) {
    const el = typeof document !== "undefined" ? document.getElementById("contato") : null;
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // else: allow default navigation to "/#contato"
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[#f0eeeb]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center">
          <img src={logoBordeaux.url} alt="Almore Inteligência Contábil" className="h-9 w-auto" />
        </a>
        <div className="flex items-center gap-5">
          <a
            href="/"
            className="font-display font-semibold text-sm text-[#7C1638] hover:text-[#68112F] transition-colors"
          >
            Home
          </a>
          <a
            href="/blog"
            className="font-display font-semibold text-sm text-[#7C1638] hover:text-[#68112F] transition-colors"
          >
            Blog
          </a>
          {user ? (
            <div className="flex items-center gap-3">
              <a
                href="/minha-conta"
                className="font-display font-semibold text-sm text-[#7C1638] hover:text-[#68112F] transition-colors"
              >
                Minha conta
              </a>
              <button
                onClick={() => signOut()}
                className="font-display font-semibold text-sm text-[#7C1638] hover:text-[#68112F] transition-colors"
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                Sair
              </button>
            </div>
          ) : (
            <a
              href="/login"
              className="font-display font-semibold text-sm text-[#7C1638] hover:text-[#68112F] transition-colors"
            >
              Entrar
            </a>
          )}
          <a
            href="/#contato"
            onClick={handleFalar}
            className="btn-primary font-display font-semibold text-sm px-5 py-2.5 rounded-md"
          >
            Falar com a Almore
          </a>
        </div>
      </div>
    </header>
  );
}
