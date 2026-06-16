import { useNavigate } from "react-router-dom";
import {
  CalendarCheck, Clock, Shield, Zap, ChevronRight,
  Star, Wrench, Car, Users, BarChart3, ArrowRight,
} from "lucide-react";
import { FloatingNav } from "@/components/FloatingNav";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: CalendarCheck,
    title: "Agendamento Online",
    desc: "Agende serviços em minutos, sem ligações ou espera. Disponível 24h por dia.",
    color: "from-blue-500 to-blue-600",
    glow: "shadow-blue-500/20",
  },
  {
    icon: Clock,
    title: "Horários em Tempo Real",
    desc: "Veja disponibilidade atualizada ao vivo e escolha o melhor horário para você.",
    color: "from-cyan-500 to-cyan-600",
    glow: "shadow-cyan-500/20",
  },
  {
    icon: Shield,
    title: "Segurança Garantida",
    desc: "Seus dados protegidos com autenticação JWT e comunicação criptografada.",
    color: "from-indigo-500 to-indigo-600",
    glow: "shadow-indigo-500/20",
  },
  {
    icon: BarChart3,
    title: "Gestão Completa",
    desc: "Oficinas têm painel completo com histórico, métricas e controle total da agenda.",
    color: "from-purple-500 to-purple-600",
    glow: "shadow-purple-500/20",
  },
];

const steps = [
  { num: "01", title: "Crie sua conta", desc: "Cadastre-se como cliente ou oficina em menos de 1 minuto." },
  { num: "02", title: "Escolha o serviço", desc: "Navegue pelos serviços disponíveis e escolha o ideal." },
  { num: "03", title: "Confirme o horário", desc: "Selecione data, horário e seu veículo. Pronto!" },
];

const stats = [
  { value: "10k+", label: "Agendamentos", icon: CalendarCheck },
  { value: "500+", label: "Oficinas", icon: Wrench },
  { value: "15k+", label: "Clientes", icon: Users },
  { value: "98%", label: "Satisfação", icon: Star },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">
      <FloatingNav />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Grid background */}
        <div className="absolute inset-0 bg-grid opacity-40" />
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-medium text-cyan-300">Plataforma de agendamento automotivo</span>
          </div>

          <div className="flex justify-center mb-6 animate-float">
            <Logo size="xl" />
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-none mb-6 tracking-tight">
            Sua oficina,{" "}
            <span className="gradient-text">no seu tempo.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Agende serviços automotivos online, sem complicação. Clientes e oficinas conectados
            de forma simples, rápida e segura.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="gradient"
              size="xl"
              className="w-full sm:w-auto animate-pulse-glow"
              onClick={() => navigate("/register")}
            >
              <Car className="w-5 h-5" />
              Sou Cliente
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="w-full sm:w-auto border-slate-600 hover:border-blue-500/50"
              onClick={() => navigate("/register")}
            >
              <Wrench className="w-5 h-5" />
              Sou Oficina
            </Button>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-2xl p-4 text-center">
                <s.icon className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="cyan" className="mb-4">Funcionalidades</Badge>
            <h2 className="text-4xl font-black text-white mb-4">
              Tudo que você precisa,{" "}
              <span className="gradient-text">em um lugar só</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Uma plataforma completa que conecta clientes às melhores oficinas com tecnologia de ponta.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <Card key={f.title} className="group relative overflow-hidden border-slate-800/60 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1">
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg ${f.glow}`}>
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-100 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 px-4 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="default" className="mb-4">Como Funciona</Badge>
            <h2 className="text-4xl font-black text-white mb-4">
              Simples assim — <span className="gradient-text">3 passos</span>
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-blue-500/40 via-cyan-500/40 to-transparent hidden sm:block" />
            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-6 items-start group">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
                      <span className="text-xl font-black text-white">{step.num}</span>
                    </div>
                  </div>
                  <div className="glass rounded-2xl p-5 flex-1 hover:border-blue-500/30 transition-colors">
                    <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
                    <p className="text-slate-400 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── About / CTA ── */}
      <section id="about" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="gradient-border rounded-3xl p-1">
            <div className="bg-slate-900 rounded-3xl p-10 text-center">
              <Logo size="lg" className="justify-center mb-6" />
              <h2 className="text-4xl font-black text-white mb-4">
                Pronto para começar?
              </h2>
              <p className="text-slate-400 max-w-md mx-auto mb-8">
                Junte-se a milhares de clientes e oficinas que já transformaram
                a experiência de agendamento automotivo.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button variant="gradient" size="lg" onClick={() => navigate("/register")}>
                  Criar conta gratuita
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate("/login")}>
                  Já tenho uma conta
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800/60 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-sm text-slate-500">
            © 2025 AutoAgenda. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Termos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
