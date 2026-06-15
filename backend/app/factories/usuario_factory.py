from abc import ABC, abstractmethod
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.usuario import Usuario


class UsuarioFactory(ABC):
    """Factory Method abstrata para criação de usuários."""

    @abstractmethod
    def criar(self, dados: dict) -> "Usuario": ...

    @staticmethod
    def get_factory(tipo: str) -> "UsuarioFactory":
        from .cliente_factory import ClienteFactory
        from .oficina_factory import OficinaFactory

        factories: dict[str, "UsuarioFactory"] = {
            "cliente": ClienteFactory(),
            "oficina": OficinaFactory(),
        }
        factory = factories.get(tipo)
        if factory is None:
            raise ValueError(f"Tipo de usuário inválido: {tipo}")
        return factory
