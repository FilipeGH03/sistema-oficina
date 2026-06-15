from app.models.cliente import Cliente
from .usuario_factory import UsuarioFactory


class ClienteFactory(UsuarioFactory):
    def criar(self, dados: dict) -> Cliente:
        cliente = Cliente(
            nome=dados["nome"],
            email=dados["email"],
            cpf=dados["cpf"],
            telefone=dados.get("telefone"),
        )
        cliente.set_senha(dados["senha"])
        return cliente
