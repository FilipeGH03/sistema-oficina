from app.models.oficina import Oficina
from .usuario_factory import UsuarioFactory


class OficinaFactory(UsuarioFactory):
    def criar(self, dados: dict) -> Oficina:
        oficina = Oficina(
            nome=dados["nome"],
            email=dados["email"],
            cnpj=dados["cnpj"],
            telefone=dados.get("telefone"),
            endereco=dados.get("endereco"),
            horario_funcionamento=dados.get("horario_funcionamento"),
        )
        oficina.set_senha(dados["senha"])
        return oficina
