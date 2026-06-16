import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, History, ChevronDown, Search } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { agendamentosApi } from "@/api/agendamentos";
import { formatDateTime } from "@/lib/utils";
import type { Agendamento, StatusAgendamento, HistoricoAgendamento } from "@/types";

const ACOES: { label: string; value: "confirmar" | "iniciar" | "concluir" | "cancelar"; variant: "default" | "destructive" | "secondary" | "purple" }[] = [
  { label: "Confirmar", value: "confirmar", variant: "default" },
  { label: "Iniciar", value: "iniciar", variant: "purple" },
  { label: "Concluir", value: "concluir", variant: "secondary" },
  { label: "Cancelar", value: "cancelar", variant: "destructive" },
];

export default function AgendamentosOficina() {
  const qc = useQueryClient();
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<StatusAgendamento | "TODOS">("TODOS");
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

  const atualizarMutation = useMutation({
    mutationFn: ({ id, acao }: { id: string; acao: "confirmar" | "iniciar" | "concluir" | "cancelar" }) =>
      agendamentosApi.atualizarStatus(id, acao),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["agendamentos"] });
      toast.success("Status atualizado com sucesso!");
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg ?? "Erro ao atualizar status.");
    },
  });

  const filtrados = (agendamentos as Agendamento[]).filter((a) => {
    const matchStatus = filtroStatus === "TODOS" || a.status === filtroStatus;
    const matchBusca = !busca || a.id.toLowerCase().includes(busca.toLowerCase());
    return matchStatus && matchBusca;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Agendamentos</h1>
          <p className="text-slate-400 text-sm mt-0.5">Gerencie todos os agendamentos da oficina</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Buscar por ID..."
              className="pl-9"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <Select value={filtroStatus} onValueChange={(v) => setFiltroStatus(v as StatusAgendamento | "TODOS")}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos</SelectItem>
              <SelectItem value="PENDENTE">Pendente</SelectItem>
              <SelectItem value="CONFIRMADO">Confirmado</SelectItem>
              <SelectItem value="EM_ANDAMENTO">Em Andamento</SelectItem>
              <SelectItem value="CONCLUIDO">Concluído</SelectItem>
              <SelectItem value="CANCELADO">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {filtrados.length} agendamento{filtrados.length !== 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              </div>
            ) : filtrados.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                Nenhum agendamento encontrado.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Data Criação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtrados.map((ag: Agendamento) => (
                    <TableRow key={ag.id}>
                      <TableCell className="font-mono text-xs text-slate-400">#{ag.id.slice(0, 8)}</TableCell>
                      <TableCell className="text-sm">{formatDateTime(ag.data_criacao)}</TableCell>
                      <TableCell><StatusBadge status={ag.status} /></TableCell>
                      <TableCell>
                        <div className="flex gap-1.5 flex-wrap">
                          {ACOES.filter((a) => {
                            const transitions: Record<StatusAgendamento, string[]> = {
                              PENDENTE: ["confirmar", "cancelar"],
                              CONFIRMADO: ["iniciar", "cancelar"],
                              EM_ANDAMENTO: ["concluir"],
                              CONCLUIDO: [],
                              CANCELADO: [],
                            };
                            return transitions[ag.status]?.includes(a.value);
                          }).map((acao) => (
                            <Button
                              key={acao.value}
                              size="sm"
                              variant={acao.variant as "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "gradient"}
                              className="h-7 text-xs"
                              disabled={atualizarMutation.isPending}
                              onClick={() => atualizarMutation.mutate({ id: ag.id, acao: acao.value })}
                            >
                              {acao.label}
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-7" onClick={() => setHistoricoId(ag.id)}>
                          <History className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!historicoId} onOpenChange={(o) => !o && setHistoricoId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Histórico — #{historicoId?.slice(0, 8)}</DialogTitle>
          </DialogHeader>
          {loadingHistorico ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-blue-400" /></div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {(historico as HistoricoAgendamento[]).map((h) => (
                <div key={h.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40">
                  <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm">
                      {h.status_anterior && (
                        <>
                          <Badge variant="secondary" className="text-xs">{h.status_anterior}</Badge>
                          <ChevronDown className="w-3 h-3 text-slate-500 -rotate-90" />
                        </>
                      )}
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
