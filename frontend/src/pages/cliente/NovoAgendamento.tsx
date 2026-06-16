import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Wrench, Clock, Car, CheckCircle2, ChevronRight,
  Loader2, AlertCircle, CalendarDays,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { servicosApi } from "@/api/servicos";
import { horariosApi } from "@/api/horarios";
import { veiculosApi } from "@/api/veiculos";
import { agendamentosApi } from "@/api/agendamentos";
import { formatDateTime, cn } from "@/lib/utils";
import type { Servico, HorarioDisponivel, Veiculo } from "@/types";

const STEPS = ["Serviço", "Horário", "Veículo", "Confirmação"];

export default function NovoAgendamento() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedServico, setSelectedServico] = useState<Servico | null>(null);
  const [selectedHorario, setSelectedHorario] = useState<HorarioDisponivel | null>(null);
  const [selectedVeiculo, setSelectedVeiculo] = useState<Veiculo | null>(null);
  const [observacoes, setObservacoes] = useState("");
  const [dataFiltro, setDataFiltro] = useState("");

  const { data: servicos = [], isLoading: loadingServicos } = useQuery({
    queryKey: ["servicos"],
    queryFn: () => servicosApi.listar(),
  });

  const { data: horarios = [], isLoading: loadingHorarios } = useQuery({
    queryKey: ["horarios", selectedServico?.oficina_id, dataFiltro],
    queryFn: () => horariosApi.listar(selectedServico!.oficina_id, dataFiltro || undefined),
    enabled: !!selectedServico,
  });

  const { data: veiculos = [], isLoading: loadingVeiculos } = useQuery({
    queryKey: ["veiculos"],
    queryFn: veiculosApi.listar,
  });

  const criarMutation = useMutation({
    mutationFn: () =>
      agendamentosApi.criar({
        veiculo_id: selectedVeiculo!.id,
        servico_id: selectedServico!.id,
        horario_id: selectedHorario!.id,
        observacoes: observacoes || undefined,
      }),
    onSuccess: () => {
      toast.success("Agendamento realizado com sucesso!");
      navigate("/cliente/agendamentos");
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg ?? "Erro ao criar agendamento.");
    },
  });

  const servicosAgendaveis = (servicos as Servico[]).filter((s) => !s.exige_analise_previa);

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Novo Agendamento</h1>
          <p className="text-slate-400 text-sm mt-0.5">Siga os passos para agendar seu serviço</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                i < step ? "bg-green-500 text-white" :
                i === step ? "bg-blue-600 text-white" :
                "bg-slate-800 text-slate-500"
              )}>
                {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span className={cn(
                "text-xs font-medium hidden sm:block",
                i === step ? "text-white" : "text-slate-500"
              )}>{s}</span>
              {i < STEPS.length - 1 && (
                <div className={cn("flex-1 h-px", i < step ? "bg-green-500/40" : "bg-slate-800")} />
              )}
            </div>
          ))}
        </div>

        {/* Step 0: Serviço */}
        {step === 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Wrench className="w-5 h-5 text-blue-400" /> Selecionar Serviço
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingServicos ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-blue-400" /></div>
              ) : servicosAgendaveis.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-8">Nenhum serviço disponível para agendamento online.</p>
              ) : (
                <div className="space-y-2">
                  {servicosAgendaveis.map((s: Servico) => (
                    <button
                      key={s.id}
                      onClick={() => { setSelectedServico(s); setSelectedHorario(null); }}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border transition-all",
                        selectedServico?.id === s.id
                          ? "border-blue-500/60 bg-blue-500/10"
                          : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-slate-200">{s.nome}</p>
                          {s.descricao && <p className="text-xs text-slate-400 mt-0.5">{s.descricao}</p>}
                        </div>
                        <Badge variant="secondary">{s.duracao} min</Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <div className="flex justify-end mt-4">
                <Button variant="gradient" disabled={!selectedServico} onClick={() => setStep(1)}>
                  Próximo <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Horário */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarDays className="w-5 h-5 text-cyan-400" /> Selecionar Horário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 space-y-1.5">
                <Label>Filtrar por data (opcional)</Label>
                <Input type="date" value={dataFiltro} onChange={(e) => setDataFiltro(e.target.value)} />
              </div>
              {loadingHorarios ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-blue-400" /></div>
              ) : horarios.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">Nenhum horário disponível.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  {(horarios as HorarioDisponivel[]).map((h) => (
                    <button
                      key={h.id}
                      onClick={() => setSelectedHorario(h)}
                      className={cn(
                        "p-3 rounded-xl border text-left transition-all",
                        selectedHorario?.id === h.id
                          ? "border-blue-500/60 bg-blue-500/10"
                          : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                      )}
                    >
                      <p className="text-sm font-medium text-slate-200">{formatDateTime(h.data_hora_inicio)}</p>
                    </button>
                  ))}
                </div>
              )}
              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => setStep(0)}>Voltar</Button>
                <Button variant="gradient" disabled={!selectedHorario} onClick={() => setStep(2)}>
                  Próximo <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Veículo */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Car className="w-5 h-5 text-purple-400" /> Selecionar Veículo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingVeiculos ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-blue-400" /></div>
              ) : veiculos.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">Você não tem veículos cadastrados.</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate("/cliente/veiculos")}>
                    Cadastrar veículo
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {(veiculos as Veiculo[]).map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVeiculo(v)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3",
                        selectedVeiculo?.id === v.id
                          ? "border-blue-500/60 bg-blue-500/10"
                          : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                      )}
                    >
                      <Car className="w-5 h-5 text-cyan-400 shrink-0" />
                      <div>
                        <p className="font-medium text-slate-200">{v.marca} {v.modelo}</p>
                        <p className="text-xs text-slate-400">{v.placa} · {v.ano}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => setStep(1)}>Voltar</Button>
                <Button variant="gradient" disabled={!selectedVeiculo} onClick={() => setStep(3)}>
                  Próximo <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Confirmação */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2 className="w-5 h-5 text-green-400" /> Confirmar Agendamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-5">
                {[
                  { label: "Serviço", value: selectedServico?.nome, icon: Wrench },
                  { label: "Horário", value: selectedHorario ? formatDateTime(selectedHorario.data_hora_inicio) : "", icon: Clock },
                  { label: "Veículo", value: selectedVeiculo ? `${selectedVeiculo.marca} ${selectedVeiculo.modelo} — ${selectedVeiculo.placa}` : "", icon: Car },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40">
                    <item.icon className="w-4 h-4 text-blue-400 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500">{item.label}</p>
                      <p className="text-sm font-medium text-slate-200">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5 mb-4">
                <Label>Observações (opcional)</Label>
                <Textarea
                  placeholder="Descreva o problema ou observações adicionais..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>Voltar</Button>
                <Button
                  variant="gradient"
                  onClick={() => criarMutation.mutate()}
                  disabled={criarMutation.isPending}
                >
                  {criarMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Confirmar Agendamento
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
