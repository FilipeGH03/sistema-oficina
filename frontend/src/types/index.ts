export type TipoUsuario = "cliente" | "oficina";

export type StatusAgendamento =
  | "PENDENTE"
  | "CONFIRMADO"
  | "EM_ANDAMENTO"
  | "CONCLUIDO"
  | "CANCELADO";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo_usuario: TipoUsuario;
}

export interface AuthState {
  token: string | null;
  user: Usuario | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: Usuario) => void;
  clearAuth: () => void;
}

export interface Veiculo {
  id: string;
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  cliente_id: string;
}

export interface Servico {
  id: string;
  nome: string;
  descricao: string | null;
  duracao: number;
  exige_analise_previa: boolean;
  oficina_id: string;
}

export interface HorarioDisponivel {
  id: string;
  oficina_id: string;
  data_hora_inicio: string;
  data_hora_fim: string;
  disponivel: boolean;
}

export interface Agendamento {
  id: string;
  cliente_id: string;
  oficina_id: string;
  veiculo_id: string;
  servico_id: string;
  horario_id: string;
  status: StatusAgendamento;
  observacoes: string | null;
  data_criacao: string;
}

export interface HistoricoAgendamento {
  id: string;
  agendamento_id: string;
  status_anterior: string | null;
  status_novo: string;
  data_evento: string;
}

export interface ApiError {
  error: boolean;
  message: string;
  details: Record<string, unknown>;
}
