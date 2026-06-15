import uuid
from sqlalchemy import Column, Boolean, DateTime, ForeignKey, Uuid
from sqlalchemy.orm import relationship
from app.config.database import db


class HorarioDisponivel(db.Model):
    __tablename__ = "horarios_disponiveis"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    oficina_id = Column(Uuid(as_uuid=True), ForeignKey("oficinas.id"), nullable=False, index=True)
    data_hora_inicio = Column(DateTime(timezone=False), nullable=False, index=True)
    data_hora_fim = Column(DateTime(timezone=False), nullable=False)
    disponivel = Column(Boolean, default=True, nullable=False)

    oficina = relationship("Oficina", back_populates="horarios")
    agendamento = relationship("Agendamento", back_populates="horario", uselist=False)
