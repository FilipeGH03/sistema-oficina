import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Clock, Plus, Trash2, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { horariosApi } from "@/api/horarios";
import { useAuthStore } from "@/store/auth";
import { formatDateTime } from "@/lib/utils";
import type { HorarioDisponivel } from "@/types";

export default function GerenciarHorarios() {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [dataFiltro, setDataFiltro] = useState("");
  const [form, setForm] = useState({ inicio: "", fim: "" });

  const { data: horarios = [], isLoading } = useQuery({
    queryKey: ["horarios", user?.id, dataFiltro],
    queryFn: () => horariosApi.listar(user!.id, dataFiltro || undefined),
    enabled: !!user?.id,
  });

  const criarMutation = useMutation({
    mutationFn: () =>
      horariosApi.criar({
        data_hora_inicio: new Date(form.inicio).toISOString(),
        data_hora_fim: new Date(form.fim).toISOString(),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["horarios"] });
      toast.success("Horário criado com sucesso!");
      setOpen(false);
      setForm({ inicio: "", fim: "" });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg ?? "Erro ao criar horário.");
    },
  });

  const removerMutation = useMutation({
    mutationFn: horariosApi.remover,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["horarios"] });
      toast.success("Horário removido.");
    },
    onError: () => toast.error("Erro ao remover horário."),
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Horários Disponíveis</h1>
            <p className="text-slate-400 text-sm mt-0.5">Gerencie os horários abertos para agendamento</p>
          </div>
          <Button variant="gradient" onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4" /> Novo Horário
          </Button>
        </div>

        {/* Date filter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Calendar className="w-4 h-4" />
            Filtrar por data:
          </div>
          <Input
            type="date"
            value={dataFiltro}
            onChange={(e) => setDataFiltro(e.target.value)}
            className="w-48"
          />
          {dataFiltro && (
            <Button variant="ghost" size="sm" onClick={() => setDataFiltro("")}>
              Limpar
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : (horarios as HorarioDisponivel[]).length === 0 ? (
          <Card className="border-dashed border-slate-700">
            <CardContent className="flex flex-col items-center py-16">
              <Clock className="w-14 h-14 text-slate-600 mb-4" />
              <h3 className="text-slate-300 font-semibold mb-2">Nenhum horário cadastrado</h3>
              <p className="text-slate-500 text-sm mb-6">Crie horários disponíveis para que clientes possam agendar.</p>
              <Button variant="gradient" onClick={() => setOpen(true)}>
                <Plus className="w-4 h-4" /> Criar Primeiro Horário
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(horarios as HorarioDisponivel[]).map((h) => (
              <Card key={h.id} className="group hover:border-slate-700 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={h.disponivel ? "success" : "destructive"}>
                        {h.disponivel ? "Livre" : "Reservado"}
                      </Badge>
                      {h.disponivel && (
                        <button
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          onClick={() => {
                            if (confirm("Remover este horário?")) removerMutation.mutate(h.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      {formatDateTime(h.data_hora_inicio)}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      até {formatDateTime(h.data_hora_fim)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Horário Disponível</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); criarMutation.mutate(); }} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Data e Hora de Início</Label>
              <Input
                type="datetime-local"
                value={form.inicio}
                onChange={(e) => setForm((f) => ({ ...f, inicio: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Data e Hora de Fim</Label>
              <Input
                type="datetime-local"
                value={form.fim}
                onChange={(e) => setForm((f) => ({ ...f, fim: e.target.value }))}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" variant="gradient" disabled={criarMutation.isPending}>
                {criarMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Criar Horário
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
