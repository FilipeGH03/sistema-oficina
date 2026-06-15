import uuid
import pytest
from datetime import datetime, timedelta
from tests.conftest import auth_header, register_and_login


def _criar_horario(client, token, delta_hours=24):
    inicio = datetime.utcnow() + timedelta(hours=delta_hours)
    fim = inicio + timedelta(hours=1)
    resp = client.post("/horarios", json={
        "data_hora_inicio": inicio.isoformat(),
        "data_hora_fim": fim.isoformat(),
    }, headers=auth_header(token))
    return resp.get_json()


def _criar_servico(client, token):
    resp = client.post("/servicos", json={
        "nome": "Troca de óleo",
        "duracao": 30,
        "exige_analise_previa": False,
    }, headers=auth_header(token))
    return resp.get_json()


def _criar_veiculo(client, token):
    resp = client.post("/veiculos", json={
        "placa": f"ABC{uuid.uuid4().hex[:4].upper()}",
        "modelo": "Civic",
        "marca": "Honda",
        "ano": 2020,
    }, headers=auth_header(token))
    return resp.get_json()


def test_criar_agendamento(client, db, cliente_data, oficina_data):
    oficina_token = register_and_login(client, oficina_data)
    cliente_token = register_and_login(client, cliente_data)

    horario = _criar_horario(client, oficina_token)
    servico = _criar_servico(client, oficina_token)
    veiculo = _criar_veiculo(client, cliente_token)

    resp = client.post("/agendamentos", json={
        "horario_id": horario["id"],
        "veiculo_id": veiculo["id"],
        "servico_id": servico["id"],
    }, headers=auth_header(cliente_token))

    assert resp.status_code == 201
    data = resp.get_json()
    assert data["status"] == "PENDENTE"


def test_agendamento_horario_duplicado(client, db, cliente_data, oficina_data):
    import uuid as _uuid
    cliente_data2 = {**cliente_data, "email": f"c2_{_uuid.uuid4().hex[:4]}@test.com", "cpf": "98765432100"}

    oficina_token = register_and_login(client, oficina_data)
    cliente_token = register_and_login(client, cliente_data)
    cliente2_token = register_and_login(client, cliente_data2)

    horario = _criar_horario(client, oficina_token)
    servico = _criar_servico(client, oficina_token)
    veiculo1 = _criar_veiculo(client, cliente_token)
    veiculo2 = _criar_veiculo(client, cliente2_token)

    payload = {"horario_id": horario["id"], "servico_id": servico["id"]}

    r1 = client.post("/agendamentos", json={**payload, "veiculo_id": veiculo1["id"]},
                     headers=auth_header(cliente_token))
    assert r1.status_code == 201

    r2 = client.post("/agendamentos", json={**payload, "veiculo_id": veiculo2["id"]},
                     headers=auth_header(cliente2_token))
    assert r2.status_code == 409


def test_listar_agendamentos_cliente(client, db, cliente_data, oficina_data):
    oficina_token = register_and_login(client, oficina_data)
    cliente_token = register_and_login(client, cliente_data)

    horario = _criar_horario(client, oficina_token)
    servico = _criar_servico(client, oficina_token)
    veiculo = _criar_veiculo(client, cliente_token)

    client.post("/agendamentos", json={
        "horario_id": horario["id"],
        "veiculo_id": veiculo["id"],
        "servico_id": servico["id"],
    }, headers=auth_header(cliente_token))

    resp = client.get("/agendamentos", headers=auth_header(cliente_token))
    assert resp.status_code == 200
    assert len(resp.get_json()) >= 1


def test_oficina_atualiza_status(client, db, cliente_data, oficina_data):
    oficina_token = register_and_login(client, oficina_data)
    cliente_token = register_and_login(client, cliente_data)

    horario = _criar_horario(client, oficina_token)
    servico = _criar_servico(client, oficina_token)
    veiculo = _criar_veiculo(client, cliente_token)

    ag_resp = client.post("/agendamentos", json={
        "horario_id": horario["id"],
        "veiculo_id": veiculo["id"],
        "servico_id": servico["id"],
    }, headers=auth_header(cliente_token))
    ag_id = ag_resp.get_json()["id"]

    resp = client.put(f"/agendamentos/{ag_id}", json={"acao": "confirmar"},
                      headers=auth_header(oficina_token))
    assert resp.status_code == 200
    assert resp.get_json()["status"] == "CONFIRMADO"


def test_cancelar_agendamento_futuro(client, db, cliente_data, oficina_data):
    oficina_token = register_and_login(client, oficina_data)
    cliente_token = register_and_login(client, cliente_data)

    horario = _criar_horario(client, oficina_token, delta_hours=48)
    servico = _criar_servico(client, oficina_token)
    veiculo = _criar_veiculo(client, cliente_token)

    ag_resp = client.post("/agendamentos", json={
        "horario_id": horario["id"],
        "veiculo_id": veiculo["id"],
        "servico_id": servico["id"],
    }, headers=auth_header(cliente_token))
    ag_id = ag_resp.get_json()["id"]

    resp = client.delete(f"/agendamentos/{ag_id}", headers=auth_header(cliente_token))
    assert resp.status_code == 200
    assert resp.get_json()["status"] == "CANCELADO"
