import pytest


def test_register_cliente(client, db, cliente_data):
    resp = client.post("/auth/register", json=cliente_data)
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["email"] == cliente_data["email"]
    assert data["tipo_usuario"] == "cliente"


def test_register_oficina(client, db, oficina_data):
    resp = client.post("/auth/register", json=oficina_data)
    assert resp.status_code == 201
    assert resp.get_json()["tipo_usuario"] == "oficina"


def test_register_email_duplicado(client, db, cliente_data):
    client.post("/auth/register", json=cliente_data)
    resp = client.post("/auth/register", json=cliente_data)
    assert resp.status_code == 422


def test_register_tipo_invalido(client, db):
    resp = client.post("/auth/register", json={
        "nome": "X", "email": "x@x.com", "senha": "abc123", "tipo_usuario": "admin"
    })
    assert resp.status_code == 400


def test_login_sucesso(client, db, cliente_data):
    client.post("/auth/register", json=cliente_data)
    resp = client.post("/auth/login", json={"email": cliente_data["email"], "senha": cliente_data["senha"]})
    assert resp.status_code == 200
    assert "access_token" in resp.get_json()


def test_login_senha_errada(client, db, cliente_data):
    client.post("/auth/register", json=cliente_data)
    resp = client.post("/auth/login", json={"email": cliente_data["email"], "senha": "errada"})
    assert resp.status_code == 404


def test_login_usuario_inexistente(client, db):
    resp = client.post("/auth/login", json={"email": "nao@existe.com", "senha": "abc"})
    assert resp.status_code == 404
