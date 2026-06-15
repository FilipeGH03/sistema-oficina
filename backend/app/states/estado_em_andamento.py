from app.exceptions import TransicaoEstadoInvalidaException
from .estado_agendamento import EstadoAgendamento


class EstadoEmAndamento(EstadoAgendamento):
    def nome(self) -> str:
        return "EM_ANDAMENTO"

    def confirmar(self, agendamento) -> None:
        raise TransicaoEstadoInvalidaException("Agendamento já está em andamento")

    def iniciar(self, agendamento) -> None:
        raise TransicaoEstadoInvalidaException("Agendamento já está em andamento")

    def concluir(self, agendamento) -> None:
        agendamento.status = "CONCLUIDO"

    def cancelar(self, agendamento) -> None:
        raise TransicaoEstadoInvalidaException("Agendamento em andamento não pode ser cancelado")
