import { api } from "./client";
import type { Usuario } from "@/types";

export interface RegisterPayload {
  nome: string;
  email: string;
  senha: string;
  tipo_usuario: "cliente" | "oficina";
  cpf?: string;
  telefone?: string;
  cnpj?: string;
  endereco?: string;
  horario_funcionamento?: string;
}

export const authApi = {
  register: (data: RegisterPayload) =>
    api.post<Usuario>("/auth/register", data).then((r) => r.data),

  login: (email: string, senha: string) =>
    api
      .post<{ access_token: string }>("/auth/login", { email, senha })
      .then((r) => r.data),
};
