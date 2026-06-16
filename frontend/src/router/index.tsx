import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import LandingPage from "@/pages/Landing/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

import ClienteDashboard from "@/pages/cliente/ClienteDashboard";
import MeusAgendamentos from "@/pages/cliente/MeusAgendamentos";
import NovoAgendamento from "@/pages/cliente/NovoAgendamento";
import MeusVeiculos from "@/pages/cliente/MeusVeiculos";

import OficinaDashboard from "@/pages/oficina/OficinaDashboard";
import AgendamentosOficina from "@/pages/oficina/AgendamentosOficina";
import GerenciarHorarios from "@/pages/oficina/GerenciarHorarios";
import GerenciarServicos from "@/pages/oficina/GerenciarServicos";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },

  {
    element: <ProtectedRoute requiredRole="cliente" />,
    children: [
      { path: "/cliente", element: <ClienteDashboard /> },
      { path: "/cliente/agendamentos", element: <MeusAgendamentos /> },
      { path: "/cliente/novo-agendamento", element: <NovoAgendamento /> },
      { path: "/cliente/veiculos", element: <MeusVeiculos /> },
    ],
  },

  {
    element: <ProtectedRoute requiredRole="oficina" />,
    children: [
      { path: "/oficina", element: <OficinaDashboard /> },
      { path: "/oficina/agendamentos", element: <AgendamentosOficina /> },
      { path: "/oficina/horarios", element: <GerenciarHorarios /> },
      { path: "/oficina/servicos", element: <GerenciarServicos /> },
    ],
  },

  { path: "*", element: <LandingPage /> },
]);
