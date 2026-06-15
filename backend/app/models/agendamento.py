import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, UniqueConstraint, Uuid
from sqlalchemy.orm import relationship
from app.config.database import db


class Agendamento(db.Model):
    __tablename__ = "agendamentos"
    __table_args__ = (
        UniqueConstraint("horario_id", name="uq_agendamento_horario"),
    )

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cliente_id = Column(Uuid(as_uuid=True), ForeignKey("clientes.id"), nullable=False, index=True)
    oficina_id = Column(Uuid(as_uuid=True), ForeignKey("oficinas.id"), nullable=False, index=True)
    veiculo_id = Column(Uuid(as_uuid=True), ForeignKey("veiculos.id"), nullable=False)
    servico_id = Column(Uuid(as_uuid=True), ForeignKey("servicos.id"), nullable=False)
    horario_id = Column(Uuid(as_uuid=True), ForeignKey("horarios_disponiveis.id"), nullable=False, unique=True)
    status = Column(String(30), nullable=False, default="PENDENTE")
    observacoes = Column(Text, nullable=True)
    data_criacao = Column(DateTime, nullable=False, default=datetime.utcnow)

    cliente = relationship("Cliente", back_populates="agendamentos")
    oficina = relationship("Oficina", back_populates="agendamentos")
    veiculo = relationship("Veiculo", back_populates="agendamentos")
    servico = relationship("Servico", back_populates="agendamentos")
    horario = relationship("HorarioDisponivel", back_populates="agendamento")
    historico = relationship("HistoricoAgendamento", back_populates="agendamento", cascade="all, delete-orphan")
