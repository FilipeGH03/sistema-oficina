import uuid
import bcrypt
from sqlalchemy import Column, String, Uuid
from app.config.database import db


class Usuario(db.Model):
    __tablename__ = "usuarios"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nome = Column(String(120), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    senha_hash = Column(String(255), nullable=False)
    tipo_usuario = Column(String(20), nullable=False)

    __mapper_args__ = {
        "polymorphic_on": tipo_usuario,
        "polymorphic_identity": "usuario",
    }

    def set_senha(self, senha: str) -> None:
        self.senha_hash = bcrypt.hashpw(senha.encode(), bcrypt.gensalt()).decode()

    def verificar_senha(self, senha: str) -> bool:
        return bcrypt.checkpw(senha.encode(), self.senha_hash.encode())
