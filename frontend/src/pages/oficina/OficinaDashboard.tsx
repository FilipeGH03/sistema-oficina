import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, Wrench, Plus, TrendingUp, Users, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { agendamentosApi } from "@/api/agendamentos";
import { horariosApi } from "@/api/horarios";
import { servicosApi } from "@/api/servicos";
import { useAuthStore } from "@/store/auth";
import { formatDateTime } from "@/lib/utils";
import type { Agendamento } from "@/types";

export default function OficinaDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: agendamentos = [], isLoading } = useQuery({
    queryKey: ["agendamentos"],
    queryFn: agendamentosApi.listar,
  });

  const { data: horarios = [] } = useQuery({
    queryKey: ["horarios", user?.id],
    queryFn: () => horariosApi.listar(user!.id),
    enabled: !!user?.id,
  });

  const { data: servicos = [] } = useQuery({
    queryKey: ["servicos", user?.id],
    queryFn: () => servicosApi.listar(user?.id),
    enabled: !!user?.id,
  });

  const stats = {
    total: agendamentos.length,
    pendentes: agendamentos.filter((a: Agendamento) => a.status === "PENDENTE").length,
    emAndamento: agendamentos.filter((a: Agendamento) => a.status === "EM_ANDAMENTO").length,
    horariosLivres: (horarios as unknown[]).length,
    servicos: (servicos as unknown[]).length,
  };

  const recentes = [...agendamentos].slice(0, 6);

  const statCards = [
    { label: "Total de Agendamentos", value: stats.total, icon: Calendar, color: "from-blue-600 to-blue-500", shadow: "shadow-blue-500/20" },
    { label: "Aguardando Atenção", value: stats.pendentes, icon: Clock, color: "from-amber-600 to-amber-500", shadow: "shadow-amber-500/20" },
    { label: "Em Andamento", value: stats.emAndamento, icon: TrendingUp, color: "from-purple-600 to-purple-500", shadow: "shadow-purple-500/20" },
    { label: "Serviços Ativos", value: stats.servicos, icon: Wrench, color: "from-cyan-600 to-cyan-500", shadow: "shadow-cyan-500/20" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {user?.nome} 🔧
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">Painel de controle da oficina</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/oficina/horarios")}>
              <Clock className="w-4 h-4" /> Horários
            </Button>
            <Button variant="gradient" size="sm" onClick={() => navigate("/oficina/agendamentos")}>
              <Calendar className="w-4 h-4" /> Agendamentos
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <Card key={s.label} className="border-slate-800/60 overflow-hidden">
              <CardContent className="p-5">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 shadow-lg ${s.shadow}`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-3xl font-black text-white mb-1">{s.value}</div>
                <p className="text-xs text-slate-400">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Agendamentos Recentes</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate("/oficina/agendamentos")}>
                  Ver todos
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                  </div>
                ) : recentes.length === 0 ? (
                  <div className="text-center py-10">
                    <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">Nenhum agendamento ainda.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentes.map((ag: Agendamento) => (
                      <div key={ag.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/60 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-slate-200">#{ag.id.slice(0, 8)}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{formatDateTime(ag.data_criacao)}</p>
                        </div>
                        <StatusBadge status={ag.status} />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick actions */}
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Ações Rápidas</CardTitle></CardHeader>
              <CardContent className="pt-0 space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/oficina/horarios")}>
                  <Plus className="w-4 h-4 text-cyan-400" /> Novo Horário
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/oficina/servicos")}>
                  <Wrench className="w-4 h-4 text-blue-400" /> Novo Serviço
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/oficina/agendamentos")}>
                  <Users className="w-4 h-4 text-purple-400" /> Ver Clientes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Visão Geral</CardTitle></CardHeader>
              <CardContent className="pt-0 space-y-3">
                {[
                  { label: "Horários disponíveis", value: stats.horariosLivres, color: "text-cyan-400" },
                  { label: "Serviços cadastrados", value: stats.servicos, color: "text-blue-400" },
                  { label: "Pendentes de ação", value: stats.pendentes, color: "text-amber-400" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
                    <span className="text-sm text-slate-400">{item.label}</span>
                    <span className={`text-lg font-bold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
