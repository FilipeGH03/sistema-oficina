import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Uuid
from sqlalchemy.orm import relationship
from app.config.database import db


class HistoricoAgendamento(db.Model):
    __tablename__ = "historico_agendamentos"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agendamento_id = Column(Uuid(as_uuid=True), ForeignKey("agendamentos.id"), nullable=False, index=True)
    status_anterior = Column(String(30), nullable=True)
    status_novo = Column(String(30), nullable=False)
    data_evento = Column(DateTime, nullable=False, default=datetime.utcnow)

    agendamento = relationship("Agendamento", back_populates="historico")
