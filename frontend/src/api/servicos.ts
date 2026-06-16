import { api } from "./client";
import type { Servico } from "@/types";

export const servicosApi = {
  listar: (oficina_id?: string) =>
    api
      .get<Servico[]>("/servicos", { params: oficina_id ? { oficina_id } : {} })
      .then((r) => r.data),

  criar: (data: Omit<Servico, "id" | "oficina_id">) =>
    api.post<Servico>("/servicos", data).then((r) => r.data),
};
