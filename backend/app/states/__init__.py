from .estado_agendamento import EstadoAgendamento
from .estado_pendente import EstadoPendente
from .estado_confirmado import EstadoConfirmado
from .estado_em_andamento import EstadoEmAndamento
from .estado_concluido import EstadoConcluido
from .estado_cancelado import EstadoCancelado

_STATE_MAP: dict[str, type[EstadoAgendamento]] = {
    "PENDENTE": EstadoPendente,
    "CONFIRMADO": EstadoConfirmado,
    "EM_ANDAMENTO": EstadoEmAndamento,
    "CONCLUIDO": EstadoConcluido,
    "CANCELADO": EstadoCancelado,
}


def get_estado(status: str) -> EstadoAgendamento:
    cls = _STATE_MAP.get(status)
    if cls is None:
        raise ValueError(f"Status desconhecido: {status}")
    return cls()


__all__ = [
    "EstadoAgendamento",
    "EstadoPendente",
    "EstadoConfirmado",
    "EstadoEmAndamento",
    "EstadoConcluido",
    "EstadoCancelado",
    "get_estado",
]
