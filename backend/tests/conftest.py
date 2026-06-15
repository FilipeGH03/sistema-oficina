import uuid
import pytest
from app import create_app
from app.config.database import db as _db


@pytest.fixture(scope="session")
def app():
    application = create_app("testing")
    with application.app_context():
        _db.create_all()
        yield application
        _db.drop_all()


@pytest.fixture(scope="function")
def db(app):
    yield _db
    _db.session.rollback()
    for table in reversed(_db.metadata.sorted_tables):
        _db.session.execute(table.delete())
    _db.session.commit()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def cliente_data():
    suffix = uuid.uuid4().hex[:6]
    return {
        "nome": "João Silva",
        "email": f"joao_{suffix}@test.com",
        "senha": "senha123",
        "tipo_usuario": "cliente",
        "cpf": "12345678901",
        "telefone": "11999999999",
    }


@pytest.fixture
def oficina_data():
    suffix = uuid.uuid4().hex[:6]
    return {
        "nome": "Oficina Top",
        "email": f"oficina_{suffix}@test.com",
        "senha": "senha123",
        "tipo_usuario": "oficina",
        "cnpj": "12345678000195",
        "endereco": "Rua A, 100",
        "horario_funcionamento": "08:00-18:00",
    }


def register_and_login(client, dados):
    client.post("/auth/register", json=dados)
    resp = client.post("/auth/login", json={"email": dados["email"], "senha": dados["senha"]})
    return resp.get_json()["access_token"]


@pytest.fixture
def cliente_token(client, cliente_data, db):
    return register_and_login(client, cliente_data)


@pytest.fixture
def oficina_token(client, oficina_data, db):
    return register_and_login(client, oficina_data)


def auth_header(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}
