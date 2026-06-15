import pytest
from app.factories.usuario_factory import UsuarioFactory
from app.factories.cliente_factory import ClienteFactory
from app.factories.oficina_factory import OficinaFactory
from app.models.cliente import Cliente
from app.models.oficina import Oficina


CLIENTE_DADOS = {
    "nome": "Ana", "email": "ana@test.com", "senha": "abc123",
    "cpf": "11122233344", "telefone": "11900000000",
}

OFICINA_DADOS = {
    "nome": "Oficina X", "email": "x@test.com", "senha": "abc123",
    "cnpj": "12345678000195", "endereco": "Rua B, 5", "horario_funcionamento": "08-17",
}


def test_factory_retorna_cliente():
    factory = UsuarioFactory.get_factory("cliente")
    assert isinstance(factory, ClienteFactory)


def test_factory_retorna_oficina():
    factory = UsuarioFactory.get_factory("oficina")
    assert isinstance(factory, OficinaFactory)


def test_tipo_invalido_lanca_erro():
    with pytest.raises(ValueError):
        UsuarioFactory.get_factory("admin")


def test_cliente_factory_cria_instancia(app):
    with app.app_context():
        factory = ClienteFactory()
        cliente = factory.criar(CLIENTE_DADOS)
        assert isinstance(cliente, Cliente)
        assert cliente.email == "ana@test.com"
        assert cliente.cpf == "11122233344"
        assert cliente.senha_hash != "abc123"


def test_oficina_factory_cria_instancia(app):
    with app.app_context():
        factory = OficinaFactory()
        oficina = factory.criar(OFICINA_DADOS)
        assert isinstance(oficina, Oficina)
        assert oficina.cnpj == "12345678000195"
        assert oficina.senha_hash != "abc123"


def test_senha_hash_verificacao(app):
    with app.app_context():
        factory = ClienteFactory()
        cliente = factory.criar(CLIENTE_DADOS)
        assert cliente.verificar_senha("abc123")
        assert not cliente.verificar_senha("errada")
