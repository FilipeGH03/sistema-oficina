from .usuario_schema import RegisterSchema, LoginSchema, UsuarioResponseSchema
from .veiculo_schema import VeiculoCreateSchema, VeiculoResponseSchema
from .servico_schema import ServicoCreateSchema, ServicoResponseSchema
from .horario_schema import HorarioCreateSchema, HorarioResponseSchema
from .agendamento_schema import (
    AgendamentoCreateSchema,
    AgendamentoUpdateSchema,
    AgendamentoResponseSchema,
    HistoricoResponseSchema,
)

__all__ = [
    "RegisterSchema", "LoginSchema", "UsuarioResponseSchema",
    "VeiculoCreateSchema", "VeiculoResponseSchema",
    "ServicoCreateSchema", "ServicoResponseSchema",
    "HorarioCreateSchema", "HorarioResponseSchema",
    "AgendamentoCreateSchema", "AgendamentoUpdateSchema",
    "AgendamentoResponseSchema", "HistoricoResponseSchema",
]
