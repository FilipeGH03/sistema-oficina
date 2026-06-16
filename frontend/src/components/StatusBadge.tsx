import { Badge } from "@/components/ui/badge";
import type { StatusAgendamento } from "@/types";

const statusConfig: Record<
  StatusAgendamento,
  { label: string; variant: "default" | "warning" | "success" | "destructive" | "purple" | "secondary" }
> = {
  PENDENTE: { label: "Pendente", variant: "warning" },
  CONFIRMADO: { label: "Confirmado", variant: "default" },
  EM_ANDAMENTO: { label: "Em Andamento", variant: "purple" },
  CONCLUIDO: { label: "Concluído", variant: "success" },
  CANCELADO: { label: "Cancelado", variant: "destructive" },
};

export function StatusBadge({ status }: { status: StatusAgendamento }) {
  const config = statusConfig[status] ?? { label: status, variant: "secondary" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
