from app.models.veiculo import Veiculo
from app.config.database import db
from .base_repository import BaseRepository


class VeiculoRepository(BaseRepository[Veiculo]):
    def __init__(self):
        super().__init__(Veiculo)

    def get_by_cliente(self, cliente_id) -> list[Veiculo]:
        return db.session.query(Veiculo).filter_by(cliente_id=cliente_id).all()

    def get_by_placa(self, placa: str) -> Veiculo | None:
        return db.session.query(Veiculo).filter_by(placa=placa).first()

    def get_by_id_and_cliente(self, veiculo_id, cliente_id) -> Veiculo | None:
        return (
            db.session.query(Veiculo)
            .filter_by(id=veiculo_id, cliente_id=cliente_id)
            .first()
        )
