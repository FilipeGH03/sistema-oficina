import uuid
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, Text, Uuid
from sqlalchemy.orm import relationship
from app.config.database import db


class Servico(db.Model):
    __tablename__ = "servicos"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nome = Column(String(150), nullable=False)
    descricao = Column(Text, nullable=True)
    duracao = Column(Integer, nullable=False)
    exige_analise_previa = Column(Boolean, default=False, nullable=False)
    oficina_id = Column(Uuid(as_uuid=True), ForeignKey("oficinas.id"), nullable=False)

    oficina = relationship("Oficina", back_populates="servicos")
    agendamentos = relationship("Agendamento", back_populates="servico")
