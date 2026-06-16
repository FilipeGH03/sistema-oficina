import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Car, Plus, Trash2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { veiculosApi } from "@/api/veiculos";

export default function MeusVeiculos() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ placa: "", modelo: "", marca: "", ano: "" });

  const { data: veiculos = [], isLoading } = useQuery({
    queryKey: ["veiculos"],
    queryFn: veiculosApi.listar,
  });

  const criarMutation = useMutation({
    mutationFn: () =>
      veiculosApi.criar({ placa: form.placa.toUpperCase(), modelo: form.modelo, marca: form.marca, ano: Number(form.ano) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["veiculos"] });
      toast.success("Veículo cadastrado com sucesso!");
      setOpen(false);
      setForm({ placa: "", modelo: "", marca: "", ano: "" });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg ?? "Erro ao cadastrar veículo.");
    },
  });

  const removerMutation = useMutation({
    mutationFn: veiculosApi.remover,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["veiculos"] });
      toast.success("Veículo removido.");
    },
    onError: () => toast.error("Erro ao remover veículo."),
  });

  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [f]: e.target.value }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Meus Veículos</h1>
            <p className="text-slate-400 text-sm mt-0.5">Gerencie os veículos vinculados à sua conta</p>
          </div>
          <Button variant="gradient" onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4" /> Adicionar Veículo
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : veiculos.length === 0 ? (
          <Card className="border-dashed border-slate-700">
            <CardContent className="flex flex-col items-center py-16">
              <Car className="w-16 h-16 text-slate-600 mb-4" />
              <h3 className="text-slate-300 font-semibold mb-2">Nenhum veículo cadastrado</h3>
              <p className="text-slate-500 text-sm mb-6 text-center">
                Adicione seus veículos para poder realizar agendamentos.
              </p>
              <Button variant="gradient" onClick={() => setOpen(true)}>
                <Plus className="w-4 h-4" /> Adicionar Primeiro Veículo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {veiculos.map((v) => (
              <Card key={v.id} className="group hover:border-slate-700 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Car className="w-5 h-5 text-white" />
                    </div>
                    <button
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      onClick={() => {
                        if (confirm("Remover este veículo?")) removerMutation.mutate(v.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-bold text-slate-100 text-lg">{v.marca} {v.modelo}</h3>
                  <p className="text-slate-400 text-sm mt-0.5">{v.ano}</p>
                  <div className="mt-3 inline-flex items-center gap-1.5 bg-slate-800 rounded-lg px-3 py-1">
                    <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest">{v.placa}</span>
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
            <DialogTitle>Adicionar Veículo</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => { e.preventDefault(); criarMutation.mutate(); }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <Label>Placa</Label>
                <Input placeholder="ABC1D23" value={form.placa} onChange={set("placa")} required maxLength={8} />
              </div>
              <div className="space-y-1.5">
                <Label>Marca</Label>
                <Input placeholder="Toyota" value={form.marca} onChange={set("marca")} required />
              </div>
              <div className="space-y-1.5">
                <Label>Modelo</Label>
                <Input placeholder="Corolla" value={form.modelo} onChange={set("modelo")} required />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Ano</Label>
                <Input type="number" placeholder="2023" value={form.ano} onChange={set("ano")} required min="1900" max="2100" />
              </div>
            </div>

            {criarMutation.isError && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 rounded-xl p-3 border border-red-500/20">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Erro ao cadastrar veículo.
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" variant="gradient" disabled={criarMutation.isPending}>
                {criarMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Adicionar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
