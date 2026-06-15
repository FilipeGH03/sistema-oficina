from app.models.agendamento import Agendamento
from app.config.database import db
from .base_repository import BaseRepository


class AgendamentoRepository(BaseRepository[Agendamento]):
    def __init__(self):
        super().__init__(Agendamento)

    def get_by_cliente(self, cliente_id) -> list[Agendamento]:
        return (
            db.session.query(Agendamento)
            .filter_by(cliente_id=cliente_id)
            .order_by(Agendamento.data_criacao.desc())
            .all()
        )

    def get_by_oficina(self, oficina_id) -> list[Agendamento]:
        return (
            db.session.query(Agendamento)
            .filter_by(oficina_id=oficina_id)
            .order_by(Agendamento.data_criacao.desc())
            .all()
        )

    def get_all(self) -> list[Agendamento]:
        return db.session.query(Agendamento).order_by(Agendamento.data_criacao.desc()).all()
