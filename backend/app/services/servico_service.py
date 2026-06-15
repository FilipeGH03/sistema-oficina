from app.models.servico import Servico
from app.repositories.servico_repository import ServicoRepository
from app.exceptions import ServicoNaoPermitidoException, AgendamentoInvalidoException


class ServicoService:
    def __init__(self):
        self._repo = ServicoRepository()

    def listar(self, oficina_id=None) -> list[Servico]:
        if oficina_id:
            return self._repo.get_by_oficina(oficina_id)
        return self._repo.get_all()

    def criar(self, dados: dict, oficina_id) -> Servico:
        servico = Servico(
            nome=dados["nome"],
            descricao=dados.get("descricao"),
            duracao=dados["duracao"],
            exige_analise_previa=dados.get("exige_analise_previa", False),
            oficina_id=oficina_id,
        )
        self._repo.save(servico)
        self._repo.commit()
        return servico

    def validar_agendavel(self, servico_id) -> Servico:
        servico = self._repo.get_by_id(servico_id)
        if not servico:
            raise AgendamentoInvalidoException("Serviço não encontrado")
        if servico.exige_analise_previa:
            raise ServicoNaoPermitidoException()
        return servico
