from app.models.historico_agendamento import HistoricoAgendamento
from app.config.database import db
from .base_repository import BaseRepository


class HistoricoRepository(BaseRepository[HistoricoAgendamento]):
    def __init__(self):
        super().__init__(HistoricoAgendamento)

    def registrar(self, agendamento_id, status_anterior: str | None, status_novo: str) -> HistoricoAgendamento:
        historico = HistoricoAgendamento(
            agendamento_id=agendamento_id,
            status_anterior=status_anterior,
            status_novo=status_novo,
        )
        return self.save(historico)

    def get_by_agendamento(self, agendamento_id) -> list[HistoricoAgendamento]:
        return (
            db.session.query(HistoricoAgendamento)
            .filter_by(agendamento_id=agendamento_id)
            .order_by(HistoricoAgendamento.data_evento.asc())
            .all()
        )
