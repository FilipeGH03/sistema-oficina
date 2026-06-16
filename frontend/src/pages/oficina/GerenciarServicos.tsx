import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Wrench, Plus, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { servicosApi } from "@/api/servicos";
import { useAuthStore } from "@/store/auth";
import type { Servico } from "@/types";

interface ServicoForm {
  nome: string;
  descricao: string;
  duracao: string;
  exige_analise_previa: boolean;
}

const EMPTY: ServicoForm = { nome: "", descricao: "", duracao: "60", exige_analise_previa: false };

export default function GerenciarServicos() {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ServicoForm>(EMPTY);

  const { data: servicos = [], isLoading } = useQuery({
    queryKey: ["servicos", user?.id],
    queryFn: () => servicosApi.listar(user?.id),
    enabled: !!user?.id,
  });

  const criarMutation = useMutation({
    mutationFn: () =>
      servicosApi.criar({
        nome: form.nome,
        descricao: form.descricao || null,
        duracao: Number(form.duracao),
        exige_analise_previa: form.exige_analise_previa,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["servicos"] });
      toast.success("Serviço criado com sucesso!");
      setOpen(false);
      setForm(EMPTY);
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg ?? "Erro ao criar serviço.");
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Serviços</h1>
            <p className="text-slate-400 text-sm mt-0.5">Gerencie os serviços oferecidos pela oficina</p>
          </div>
          <Button variant="gradient" onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4" /> Novo Serviço
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : (servicos as Servico[]).length === 0 ? (
          <Card className="border-dashed border-slate-700">
            <CardContent className="flex flex-col items-center py-16">
              <Wrench className="w-14 h-14 text-slate-600 mb-4" />
              <h3 className="text-slate-300 font-semibold mb-2">Nenhum serviço cadastrado</h3>
              <p className="text-slate-500 text-sm mb-6">Adicione os serviços que sua oficina oferece.</p>
              <Button variant="gradient" onClick={() => setOpen(true)}>
                <Plus className="w-4 h-4" /> Criar Primeiro Serviço
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(servicos as Servico[]).map((s) => (
              <Card key={s.id} className="hover:border-slate-700 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                      <Wrench className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-200 truncate">{s.nome}</p>
                      {s.descricao && (
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{s.descricao}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary">{s.duracao} min</Badge>
                    {s.exige_analise_previa ? (
                      <Badge variant="warning" className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Análise prévia
                      </Badge>
                    ) : (
                      <Badge variant="success">Agendamento online</Badge>
                    )}
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
            <DialogTitle>Novo Serviço</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              criarMutation.mutate();
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label>Nome do Serviço *</Label>
              <Input
                placeholder="Ex: Troca de óleo"
                value={form.nome}
                onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Descrição (opcional)</Label>
              <Input
                placeholder="Breve descrição do serviço..."
                value={form.descricao}
                onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Duração (minutos) *</Label>
              <Input
                type="number"
                min={1}
                max={480}
                value={form.duracao}
                onChange={(e) => setForm((f) => ({ ...f, duracao: e.target.value }))}
                required
              />
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <input
                type="checkbox"
                id="analise"
                checked={form.exige_analise_previa}
                onChange={(e) => setForm((f) => ({ ...f, exige_analise_previa: e.target.checked }))}
                className="mt-0.5 w-4 h-4 rounded accent-blue-500 cursor-pointer"
              />
              <div>
                <label htmlFor="analise" className="text-sm font-medium text-slate-200 cursor-pointer">
                  Exige análise prévia
                </label>
                <p className="text-xs text-slate-500 mt-0.5">
                  Serviço só pode ser agendado presencialmente após avaliação técnica.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" variant="gradient" disabled={criarMutation.isPending}>
                {criarMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Criar Serviço
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
