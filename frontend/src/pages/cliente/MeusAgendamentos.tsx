import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, XCircle, History, Loader2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { agendamentosApi } from "@/api/agendamentos";
import { formatDateTime } from "@/lib/utils";
import type { Agendamento, StatusAgendamento, HistoricoAgendamento } from "@/types";

const STATUS_FILTERS: { label: string; value: StatusAgendamento | "TODOS" }[] = [
  { label: "Todos", value: "TODOS" },
  { label: "Pendentes", value: "PENDENTE" },
  { label: "Confirmados", value: "CONFIRMADO" },
  { label: "Em Andamento", value: "EM_ANDAMENTO" },
  { label: "Concluídos", value: "CONCLUIDO" },
  { label: "Cancelados", value: "CANCELADO" },
];

export default function MeusAgendamentos() {
  const qc = useQueryClient();
  const [filtro, setFiltro] = useState<StatusAgendamento | "TODOS">("TODOS");
  const [historicoId, setHistoricoId] = useState<string | null>(null);

  const { data: agendamentos = [], isLoading } = useQuery({
    queryKey: ["agendamentos"],
    queryFn: agendamentosApi.listar,
  });

  const { data: historico = [], isLoading: loadingHistorico } = useQuery({
    queryKey: ["historico", historicoId],
    queryFn: () => agendamentosApi.historico(historicoId!),
    enabled: !!historicoId,
  });

  const cancelarMutation = useMutation({
    mutationFn: agendamentosApi.cancelar,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["agendamentos"] });
      toast.success("Agendamento cancelado.");
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg ?? "Erro ao cancelar.");
    },
  });

  const filtrados = agendamentos.filter(
    (a: Agendamento) => filtro === "TODOS" || a.status === filtro
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Meus Agendamentos</h1>
          <p className="text-slate-400 text-sm mt-0.5">Histórico completo dos seus agendamentos</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFiltro(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                filtro === f.value
                  ? "bg-blue-600 text-white border-blue-500"
                  : "bg-slate-800/60 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : filtrados.length === 0 ? (
          <Card className="border-dashed border-slate-700">
            <CardContent className="flex flex-col items-center py-16">
              <Calendar className="w-14 h-14 text-slate-600 mb-4" />
              <p className="text-slate-400">Nenhum agendamento encontrado.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtrados.map((ag: Agendamento) => (
              <Card key={ag.id} className="hover:border-slate-700 transition-colors">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-500">#{ag.id.slice(0, 8)}</span>
                        <StatusBadge status={ag.status} />
                      </div>
                      <p className="text-sm text-slate-400">
                        Criado em {formatDateTime(ag.data_criacao)}
                      </p>
                      {ag.observacoes && (
                        <p className="text-xs text-slate-500 italic">"{ag.observacoes}"</p>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setHistoricoId(ag.id)}
                      >
                        <History className="w-4 h-4" />
                        Histórico
                      </Button>
                      {(ag.status === "PENDENTE" || ag.status === "CONFIRMADO") && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                          onClick={() => {
                            if (confirm("Cancelar este agendamento?")) {
                              cancelarMutation.mutate(ag.id);
                            }
                          }}
                          disabled={cancelarMutation.isPending}
                        >
                          <XCircle className="w-4 h-4" />
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Historico Dialog */}
      <Dialog open={!!historicoId} onOpenChange={(o) => !o && setHistoricoId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Histórico do Agendamento</DialogTitle>
          </DialogHeader>
          {loadingHistorico ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {(historico as HistoricoAgendamento[]).map((h) => (
                <div key={h.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40">
                  <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm">
                      {h.status_anterior ? (
                        <>
                          <Badge variant="secondary" className="text-xs">{h.status_anterior}</Badge>
                          <ChevronDown className="w-3 h-3 text-slate-500 rotate-[-90deg]" />
                        </>
                      ) : null}
                      <Badge variant="default" className="text-xs">{h.status_novo}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{formatDateTime(h.data_evento)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
