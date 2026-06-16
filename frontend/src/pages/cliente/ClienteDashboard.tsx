import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Car, Plus, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { agendamentosApi } from "@/api/agendamentos";
import { veiculosApi } from "@/api/veiculos";
import { useAuthStore } from "@/store/auth";
import { formatDateTime } from "@/lib/utils";
import type { Agendamento } from "@/types";

export default function ClienteDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: agendamentos = [], isLoading } = useQuery({
    queryKey: ["agendamentos"],
    queryFn: agendamentosApi.listar,
  });

  const { data: veiculos = [] } = useQuery({
    queryKey: ["veiculos"],
    queryFn: veiculosApi.listar,
  });

  const stats = {
    pendentes: agendamentos.filter((a: Agendamento) => a.status === "PENDENTE").length,
    confirmados: agendamentos.filter((a: Agendamento) => a.status === "CONFIRMADO").length,
    concluidos: agendamentos.filter((a: Agendamento) => a.status === "CONCLUIDO").length,
    cancelados: agendamentos.filter((a: Agendamento) => a.status === "CANCELADO").length,
  };

  const recentes = [...agendamentos].slice(0, 5);

  const statCards = [
    { label: "Pendentes", value: stats.pendentes, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    { label: "Confirmados", value: stats.confirmados, icon: Calendar, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
    { label: "Concluídos", value: stats.concluidos, icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
    { label: "Cancelados", value: stats.cancelados, icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Olá, {user?.nome?.split(" ")[0]} 👋
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">Gerencie seus agendamentos e veículos</p>
          </div>
          <Button variant="gradient" onClick={() => navigate("/cliente/novo-agendamento")}>
            <Plus className="w-4 h-4" />
            Novo Agendamento
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <Card key={s.label} className={`border ${s.bg}`}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-slate-400">{s.label}</span>
                  <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
                </div>
                <div className="text-3xl font-black text-white">{s.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent agendamentos */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Agendamentos Recentes</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate("/cliente/agendamentos")}>
                  Ver todos
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                  </div>
                ) : recentes.length === 0 ? (
                  <div className="text-center py-10">
                    <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">Nenhum agendamento ainda</p>
                    <Button variant="gradient" size="sm" className="mt-4" onClick={() => navigate("/cliente/novo-agendamento")}>
                      Fazer primeiro agendamento
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentes.map((ag: Agendamento) => (
                      <div key={ag.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/60 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-slate-200">
                            Agendamento #{ag.id.slice(0, 8)}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {formatDateTime(ag.data_criacao)}
                          </p>
                        </div>
                        <StatusBadge status={ag.status} />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick actions + vehicles */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/cliente/novo-agendamento")}>
                  <Plus className="w-4 h-4 text-blue-400" /> Novo Agendamento
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/cliente/veiculos")}>
                  <Car className="w-4 h-4 text-cyan-400" /> Meus Veículos
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/cliente/agendamentos")}>
                  <Calendar className="w-4 h-4 text-purple-400" /> Ver Agendamentos
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Meus Veículos</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {veiculos.length === 0 ? (
                  <div className="text-center py-4">
                    <Car className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Nenhum veículo cadastrado</p>
                    <Button variant="ghost" size="sm" className="mt-2 text-blue-400" onClick={() => navigate("/cliente/veiculos")}>
                      + Adicionar veículo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {veiculos.slice(0, 3).map((v) => (
                      <div key={v.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-800/40">
                        <Car className="w-4 h-4 text-cyan-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-200 truncate">{v.marca} {v.modelo}</p>
                          <p className="text-xs text-slate-500">{v.placa} · {v.ano}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
