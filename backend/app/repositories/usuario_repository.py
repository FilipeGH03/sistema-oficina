from app.models.usuario import Usuario
from app.config.database import db
from .base_repository import BaseRepository


class UsuarioRepository(BaseRepository[Usuario]):
    def __init__(self):
        super().__init__(Usuario)

    def get_by_email(self, email: str) -> Usuario | None:
        return db.session.query(Usuario).filter_by(email=email).first()
