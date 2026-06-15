from app.exceptions import TransicaoEstadoInvalidaException
from .estado_agendamento import EstadoAgendamento


class EstadoPendente(EstadoAgendamento):
    def nome(self) -> str:
        return "PENDENTE"

    def confirmar(self, agendamento) -> None:
        agendamento.status = "CONFIRMADO"

    def iniciar(self, agendamento) -> None:
        raise TransicaoEstadoInvalidaException("Agendamento pendente não pode ser iniciado diretamente")

    def concluir(self, agendamento) -> None:
        raise TransicaoEstadoInvalidaException("Agendamento pendente não pode ser concluído")

    def cancelar(self, agendamento) -> None:
        agendamento.status = "CANCELADO"
