from abc import ABC, abstractmethod
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.agendamento import Agendamento


class EstadoAgendamento(ABC):
    """Interface abstrata do padrão State para agendamentos."""

    @abstractmethod
    def confirmar(self, agendamento: "Agendamento") -> None: ...

    @abstractmethod
    def iniciar(self, agendamento: "Agendamento") -> None: ...

    @abstractmethod
    def concluir(self, agendamento: "Agendamento") -> None: ...

    @abstractmethod
    def cancelar(self, agendamento: "Agendamento") -> None: ...

    @abstractmethod
    def nome(self) -> str: ...
