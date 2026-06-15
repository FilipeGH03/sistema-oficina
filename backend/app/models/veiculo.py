import uuid
from sqlalchemy import Column, String, Integer, ForeignKey, Uuid
from sqlalchemy.orm import relationship
from app.config.database import db


class Veiculo(db.Model):
    __tablename__ = "veiculos"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    placa = Column(String(10), nullable=False, unique=True, index=True)
    modelo = Column(String(100), nullable=False)
    marca = Column(String(100), nullable=False)
    ano = Column(Integer, nullable=False)
    cliente_id = Column(Uuid(as_uuid=True), ForeignKey("clientes.id"), nullable=False)

    cliente = relationship("Cliente", back_populates="veiculos")
    agendamentos = relationship("Agendamento", back_populates="veiculo")
