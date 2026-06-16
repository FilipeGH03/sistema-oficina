import { api } from "./client";
import type { Veiculo } from "@/types";

export const veiculosApi = {
  listar: () => api.get<Veiculo[]>("/veiculos").then((r) => r.data),
  criar: (data: Omit<Veiculo, "id" | "cliente_id">) =>
    api.post<Veiculo>("/veiculos", data).then((r) => r.data),
  remover: (id: string) => api.delete(`/veiculos/${id}`).then((r) => r.data),
};
