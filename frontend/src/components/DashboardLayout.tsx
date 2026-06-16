import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Calendar, Car, Wrench, Clock, ListOrdered,
  LogOut, Menu, X, ChevronRight,
} from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const clienteNav: NavItem[] = [
  { href: "/cliente", label: "Dashboard", icon: LayoutDashboard },
  { href: "/cliente/agendamentos", label: "Meus Agendamentos", icon: Calendar },
  { href: "/cliente/novo-agendamento", label: "Novo Agendamento", icon: ChevronRight },
  { href: "/cliente/veiculos", label: "Meus Veículos", icon: Car },
];

const oficinaNav: NavItem[] = [
  { href: "/oficina", label: "Dashboard", icon: LayoutDashboard },
  { href: "/oficina/agendamentos", label: "Agendamentos", icon: ListOrdered },
  { href: "/oficina/horarios", label: "Horários", icon: Clock },
  { href: "/oficina/servicos", label: "Serviços", icon: Wrench },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, clearAuth } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = user?.tipo_usuario === "oficina" ? oficinaNav : clienteNav;

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-slate-800">
        <Logo size="sm" />
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                )}
              >
                <item.icon className={cn("w-4.5 h-4.5", active ? "text-blue-400" : "")} />
                {item.label}
                {active && <ChevronRight className="ml-auto w-3.5 h-3.5 text-blue-400" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/40 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
            {user?.nome?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{user?.nome}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.tipo_usuario}</p>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start text-slate-400" onClick={handleLogout}>
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-slate-900/60 border-r border-slate-800 backdrop-blur-sm">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-10 w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-slate-800 bg-slate-900/40 backdrop-blur-sm flex items-center px-4 gap-3 shrink-0">
          <button
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <Separator orientation="vertical" className="h-5 lg:hidden" />
          <div className="flex-1" />
          <span className="text-sm text-slate-400 hidden sm:block">
            Olá, <span className="text-slate-200 font-medium">{user?.nome?.split(" ")[0]}</span>
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
