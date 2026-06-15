from sqlalchemy import Column, String, ForeignKey, Uuid
from sqlalchemy.orm import relationship
from app.config.database import db
from .usuario import Usuario


class Oficina(Usuario):
    __tablename__ = "oficinas"

    id = Column(Uuid(as_uuid=True), ForeignKey("usuarios.id"), primary_key=True)
    cnpj = Column(String(18), unique=True, nullable=False)
    telefone = Column(String(20), nullable=True)
    endereco = Column(String(255), nullable=True)
    horario_funcionamento = Column(String(100), nullable=True)

    servicos = relationship("Servico", back_populates="oficina", cascade="all, delete-orphan")
    horarios = relationship("HorarioDisponivel", back_populates="oficina", cascade="all, delete-orphan")
    agendamentos = relationship("Agendamento", back_populates="oficina")

    __mapper_args__ = {"polymorphic_identity": "oficina"}
