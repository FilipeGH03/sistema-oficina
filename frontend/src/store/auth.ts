import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState, Usuario } from "@/types";
import { jwtDecode } from "./jwtDecode";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token: string, user: Usuario) =>
        set({ token, user, isAuthenticated: true }),

      clearAuth: () =>
        set({ token: null, user: null, isAuthenticated: false }),
    }),
    { name: "auth-storage" }
  )
);

// Decode JWT to extract user info after login
export function decodeUserFromToken(token: string): Usuario {
  const payload = jwtDecode(token) as {
    sub: string;
    tipo_usuario: string;
    nome: string;
  };
  return {
    id: payload.sub,
    nome: payload.nome,
    email: "",
    tipo_usuario: payload.tipo_usuario as "cliente" | "oficina",
  };
}
