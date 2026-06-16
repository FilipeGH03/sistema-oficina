import { api } from "./client";
import type { HorarioDisponivel } from "@/types";

export const horariosApi = {
  listar: (oficina_id: string, data?: string) =>
    api
      .get<HorarioDisponivel[]>("/horarios", {
        params: { oficina_id, ...(data ? { data } : {}) },
      })
      .then((r) => r.data),

  criar: (data: { data_hora_inicio: string; data_hora_fim: string }) =>
    api.post<HorarioDisponivel>("/horarios", data).then((r) => r.data),

  remover: (id: string) => api.delete(`/horarios/${id}`).then((r) => r.data),
};
