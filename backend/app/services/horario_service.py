from datetime import date
from app.models.horario_disponivel import HorarioDisponivel
from app.repositories.horario_repository import HorarioRepository
from app.exceptions import HorarioIndisponivelException, AgendamentoInvalidoException


class HorarioService:
    def __init__(self):
        self._repo = HorarioRepository()

    def listar_disponiveis(self, oficina_id, data: date | None = None) -> list[HorarioDisponivel]:
        return self._repo.get_disponiveis(oficina_id, data)

    def criar(self, dados: dict, oficina_id) -> HorarioDisponivel:
        horario = HorarioDisponivel(
            oficina_id=oficina_id,
            data_hora_inicio=dados["data_hora_inicio"],
            data_hora_fim=dados["data_hora_fim"],
            disponivel=True,
        )
        self._repo.save(horario)
        self._repo.commit()
        return horario

    def remover(self, horario_id, oficina_id) -> None:
        horario = self._repo.get_by_id(horario_id)
        if not horario or str(horario.oficina_id) != str(oficina_id):
            raise AgendamentoInvalidoException("Horário não encontrado")
        self._repo.delete(horario)
        self._repo.commit()

    def validar_disponivel(self, horario_id) -> HorarioDisponivel:
        horario = self._repo.get_by_id(horario_id)
        if not horario or not horario.disponivel:
            raise HorarioIndisponivelException()
        return horario
