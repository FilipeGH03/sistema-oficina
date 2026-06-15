from app.models.agendamento import Agendamento
from app.repositories.agendamento_repository import AgendamentoRepository
from app.repositories.historico_repository import HistoricoRepository
from app.services.horario_service import HorarioService
from app.services.veiculo_service import VeiculoService
from app.services.servico_service import ServicoService
from app.repositories.horario_repository import HorarioRepository


class AgendamentoFacade:
    """Orquestra a criação de agendamentos garantindo todas as regras de negócio."""

    def __init__(self):
        self._agendamento_repo = AgendamentoRepository()
        self._historico_repo = HistoricoRepository()
        self._horario_service = HorarioService()
        self._veiculo_service = VeiculoService()
        self._servico_service = ServicoService()
        self._horario_repo = HorarioRepository()

    def criar_agendamento(self, dados: dict, cliente_id) -> Agendamento:
        # RN02 + RN01: horário deve existir e estar disponível
        horario = self._horario_service.validar_disponivel(dados["horario_id"])

        # RN03: veículo deve pertencer ao cliente
        self._veiculo_service.validar_pertence_cliente(dados["veiculo_id"], cliente_id)

        # RN06: serviço não pode exigir análise prévia
        servico = self._servico_service.validar_agendavel(dados["servico_id"])

        # RN07: data_criacao preenchida automaticamente pelo model
        agendamento = Agendamento(
            cliente_id=cliente_id,
            oficina_id=horario.oficina_id,
            veiculo_id=dados["veiculo_id"],
            servico_id=servico.id,
            horario_id=horario.id,
            status="PENDENTE",
            observacoes=dados.get("observacoes"),
        )
        self._agendamento_repo.save(agendamento)

        # Marca horário como indisponível
        self._horario_repo.marcar_indisponivel(horario.id)

        # RF10: registra histórico inicial
        self._historico_repo.registrar(agendamento.id, None, "PENDENTE")

        self._agendamento_repo.commit()
        return agendamento
