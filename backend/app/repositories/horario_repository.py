from datetime import date, datetime, timedelta
from app.models.horario_disponivel import HorarioDisponivel
from app.config.database import db
from .base_repository import BaseRepository


class HorarioRepository(BaseRepository[HorarioDisponivel]):
    def __init__(self):
        super().__init__(HorarioDisponivel)

    def get_disponiveis(self, oficina_id, data: date | None = None) -> list[HorarioDisponivel]:
        query = db.session.query(HorarioDisponivel).filter_by(
            oficina_id=oficina_id, disponivel=True
        )
        if data:
            inicio_dia = datetime(data.year, data.month, data.day, 0, 0, 0)
            fim_dia = inicio_dia + timedelta(days=1)
            query = query.filter(
                HorarioDisponivel.data_hora_inicio >= inicio_dia,
                HorarioDisponivel.data_hora_inicio < fim_dia,
            )
        return query.order_by(HorarioDisponivel.data_hora_inicio).all()

    def marcar_indisponivel(self, horario_id) -> None:
        horario = self.get_by_id(horario_id)
        if horario:
            horario.disponivel = False
            db.session.flush()

    def marcar_disponivel(self, horario_id) -> None:
        horario = self.get_by_id(horario_id)
        if horario:
            horario.disponivel = True
            db.session.flush()
