from app.exceptions import TransicaoEstadoInvalidaException
from .estado_agendamento import EstadoAgendamento


class EstadoCancelado(EstadoAgendamento):
    def nome(self) -> str:
        return "CANCELADO"

    def confirmar(self, agendamento) -> None:
        raise TransicaoEstadoInvalidaException("Agendamento cancelado não pode ser confirmado")

    def iniciar(self, agendamento) -> None:
        raise TransicaoEstadoInvalidaException("Agendamento cancelado não pode ser iniciado")

    def concluir(self, agendamento) -> None:
        raise TransicaoEstadoInvalidaException("Agendamento cancelado não pode ser concluído")

    def cancelar(self, agendamento) -> None:
        raise TransicaoEstadoInvalidaException("Agendamento já está cancelado")
