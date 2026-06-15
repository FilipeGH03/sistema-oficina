from app.exceptions import TransicaoEstadoInvalidaException
from .estado_agendamento import EstadoAgendamento


class EstadoConfirmado(EstadoAgendamento):
    def nome(self) -> str:
        return "CONFIRMADO"

    def confirmar(self, agendamento) -> None:
        raise TransicaoEstadoInvalidaException("Agendamento já está confirmado")

    def iniciar(self, agendamento) -> None:
        agendamento.status = "EM_ANDAMENTO"

    def concluir(self, agendamento) -> None:
        raise TransicaoEstadoInvalidaException("Agendamento confirmado deve ser iniciado antes de concluir")

    def cancelar(self, agendamento) -> None:
        agendamento.status = "CANCELADO"
