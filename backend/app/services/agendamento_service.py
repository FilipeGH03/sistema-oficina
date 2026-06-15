from datetime import datetime
from app.models.agendamento import Agendamento
from app.repositories.agendamento_repository import AgendamentoRepository
from app.repositories.horario_repository import HorarioRepository
from app.repositories.historico_repository import HistoricoRepository
from app.states import get_estado
from app.exceptions import AgendamentoInvalidoException, AcessoNegadoException


class AgendamentoService:
    def __init__(self):
        self._repo = AgendamentoRepository()
        self._horario_repo = HorarioRepository()
        self._historico_repo = HistoricoRepository()

    def listar_por_cliente(self, cliente_id) -> list[Agendamento]:
        return self._repo.get_by_cliente(cliente_id)

    def listar_por_oficina(self, oficina_id) -> list[Agendamento]:
        return self._repo.get_by_oficina(oficina_id)

    def cancelar(self, agendamento_id, usuario_id: str, tipo_usuario: str) -> Agendamento:
        agendamento = self._repo.get_by_id(agendamento_id)
        if not agendamento:
            raise AgendamentoInvalidoException("Agendamento não encontrado")

        if tipo_usuario == "cliente" and str(agendamento.cliente_id) != str(usuario_id):
            raise AcessoNegadoException()

        if agendamento.horario.data_hora_inicio <= datetime.utcnow():
            raise AgendamentoInvalidoException("Cancelamento só é permitido antes do horário do atendimento")

        status_anterior = agendamento.status
        estado = get_estado(agendamento.status)
        estado.cancelar(agendamento)

        self._horario_repo.marcar_disponivel(agendamento.horario_id)
        self._historico_repo.registrar(agendamento.id, status_anterior, agendamento.status)
        self._repo.commit()
        return agendamento

    def atualizar_status(self, agendamento_id, acao: str, oficina_id) -> Agendamento:
        agendamento = self._repo.get_by_id(agendamento_id)
        if not agendamento:
            raise AgendamentoInvalidoException("Agendamento não encontrado")

        if str(agendamento.oficina_id) != str(oficina_id):
            raise AcessoNegadoException()

        status_anterior = agendamento.status
        estado = get_estado(agendamento.status)

        acoes = {
            "confirmar": estado.confirmar,
            "iniciar": estado.iniciar,
            "concluir": estado.concluir,
            "cancelar": estado.cancelar,
        }
        fn = acoes.get(acao)
        if fn is None:
            raise AgendamentoInvalidoException(f"Ação '{acao}' inválida")

        fn(agendamento)
        self._historico_repo.registrar(agendamento.id, status_anterior, agendamento.status)
        self._repo.commit()
        return agendamento
