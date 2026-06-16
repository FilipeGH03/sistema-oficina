import { api } from "./client";
import type { Agendamento, HistoricoAgendamento } from "@/types";

export const agendamentosApi = {
  listar: () => api.get<Agendamento[]>("/agendamentos").then((r) => r.data),

  criar: (data: {
    veiculo_id: string;
    servico_id: string;
    horario_id: string;
    observacoes?: string;
  }) => api.post<Agendamento>("/agendamentos", data).then((r) => r.data),

  atualizarStatus: (
    id: string,
    acao: "confirmar" | "iniciar" | "concluir" | "cancelar"
  ) => api.put<Agendamento>(`/agendamentos/${id}`, { acao }).then((r) => r.data),

  cancelar: (id: string) =>
    api.delete<Agendamento>(`/agendamentos/${id}`).then((r) => r.data),

  historico: (agendamento_id: string) =>
    api
      .get<HistoricoAgendamento[]>(`/agendamentos/historico/${agendamento_id}`)
      .then((r) => r.data),
};
