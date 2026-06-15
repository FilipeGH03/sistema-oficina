from app.models.servico import Servico
from app.config.database import db
from .base_repository import BaseRepository


class ServicoRepository(BaseRepository[Servico]):
    def __init__(self):
        super().__init__(Servico)

    def get_by_oficina(self, oficina_id) -> list[Servico]:
        return db.session.query(Servico).filter_by(oficina_id=oficina_id).all()

    def get_all(self) -> list[Servico]:
        return db.session.query(Servico).all()
