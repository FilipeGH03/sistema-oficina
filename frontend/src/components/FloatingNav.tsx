import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, UserPlus } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#features", label: "Funcionalidades" },
  { href: "#how-it-works", label: "Como Funciona" },
  { href: "#about", label: "Sobre" },
];

export function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dashboardPath = user?.tipo_usuario === "oficina" ? "/oficina" : "/cliente";

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/60 shadow-2xl shadow-black/40"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="shrink-0">
            <Logo size="sm" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-slate-400 hover:text-slate-100 transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Button variant="gradient" size="sm" onClick={() => navigate(dashboardPath)}>
                Meu Painel
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                  <LogIn className="w-4 h-4" />
                  Entrar
                </Button>
                <Button variant="gradient" size="sm" onClick={() => navigate("/register")}>
                  <UserPlus className="w-4 h-4" />
                  Cadastrar
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-slate-800">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              {isAuthenticated ? (
                <Button variant="gradient" onClick={() => navigate(dashboardPath)}>
                  Meu Painel
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => navigate("/login")}>
                    Entrar
                  </Button>
                  <Button variant="gradient" onClick={() => navigate("/register")}>
                    Cadastrar
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
