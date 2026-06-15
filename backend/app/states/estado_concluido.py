from app.exceptions import TransicaoEstadoInvalidaException
from .estado_agendamento import EstadoAgendamento


class EstadoConcluido(EstadoAgendamento):
    def nome(self) -> str:
        return "CONCLUIDO"

    def confirmar(self, agendamento) -> None:
        raise TransicaoEstadoInvalidaException("Agendamento já foi concluído")

    def iniciar(self, agendamento) -> None:
        raise TransicaoEstadoInvalidaException("Agendamento já foi concluído")

    def concluir(self, agendamento) -> None:
        raise TransicaoEstadoInvalidaException("Agendamento já foi concluído")

    def cancelar(self, agendamento) -> None:
        raise TransicaoEstadoInvalidaException("Agendamento concluído não pode ser cancelado")
