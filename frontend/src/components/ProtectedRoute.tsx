import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import type { TipoUsuario } from "@/types";

interface ProtectedRouteProps {
  requiredRole?: TipoUsuario;
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (requiredRole && user?.tipo_usuario !== requiredRole) {
    const fallback = user?.tipo_usuario === "oficina" ? "/oficina" : "/cliente";
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}
