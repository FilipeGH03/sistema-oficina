from app.models.veiculo import Veiculo
from app.repositories.veiculo_repository import VeiculoRepository
from app.exceptions import VeiculoNaoEncontradoException, AgendamentoInvalidoException


class VeiculoService:
    def __init__(self):
        self._repo = VeiculoRepository()

    def listar_por_cliente(self, cliente_id) -> list[Veiculo]:
        return self._repo.get_by_cliente(cliente_id)

    def cadastrar(self, dados: dict, cliente_id) -> Veiculo:
        if self._repo.get_by_placa(dados["placa"]):
            raise AgendamentoInvalidoException("Placa já cadastrada no sistema")
        veiculo = Veiculo(
            placa=dados["placa"].upper(),
            modelo=dados["modelo"],
            marca=dados["marca"],
            ano=dados["ano"],
            cliente_id=cliente_id,
        )
        self._repo.save(veiculo)
        self._repo.commit()
        return veiculo

    def remover(self, veiculo_id, cliente_id) -> None:
        veiculo = self._repo.get_by_id_and_cliente(veiculo_id, cliente_id)
        if not veiculo:
            raise VeiculoNaoEncontradoException()
        self._repo.delete(veiculo)
        self._repo.commit()

    def validar_pertence_cliente(self, veiculo_id, cliente_id) -> Veiculo:
        veiculo = self._repo.get_by_id_and_cliente(veiculo_id, cliente_id)
        if not veiculo:
            raise VeiculoNaoEncontradoException()
        return veiculo
