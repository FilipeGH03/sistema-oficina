from sqlalchemy import Column, String, ForeignKey, Uuid
from sqlalchemy.orm import relationship
from app.config.database import db
from .usuario import Usuario


class Cliente(Usuario):
    __tablename__ = "clientes"

    id = Column(Uuid(as_uuid=True), ForeignKey("usuarios.id"), primary_key=True)
    cpf = Column(String(14), unique=True, nullable=False)
    telefone = Column(String(20), nullable=True)

    veiculos = relationship("Veiculo", back_populates="cliente", cascade="all, delete-orphan")
    agendamentos = relationship("Agendamento", back_populates="cliente")

    __mapper_args__ = {"polymorphic_identity": "cliente"}
