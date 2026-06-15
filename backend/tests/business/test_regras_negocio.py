import uuid
import pytest
from datetime import datetime, timedelta
from tests.conftest import auth_header, register_and_login


def _setup_completo(client, cliente_data, oficina_data, delta_hours=24):
    oficina_token = register_and_login(client, oficina_data)
    cliente_token = register_and_login(client, cliente_data)

    inicio = datetime.utcnow() + timedelta(hours=delta_hours)
    fim = inicio + timedelta(hours=1)
    horario = client.post("/horarios", json={
        "data_hora_inicio": inicio.isoformat(),
        "data_hora_fim": fim.isoformat(),
    }, headers=auth_header(oficina_token)).get_json()

    servico = client.post("/servicos", json={
        "nome": "Alinhamento", "duracao": 45, "exige_analise_previa": False,
    }, headers=auth_header(oficina_token)).get_json()

    veiculo = client.post("/veiculos", json={
        "placa": f"RN{uuid.uuid4().hex[:5].upper()}",
        "modelo": "Gol", "marca": "VW", "ano": 2019,
    }, headers=auth_header(cliente_token)).get_json()

    return cliente_token, oficina_token, horario, servico, veiculo


# RN01 + RN02 — Horário duplicado/indisponível
def test_rn01_horario_nao_pode_ser_reservado_duas_vezes(client, db, cliente_data, oficina_data):
    import uuid as _uuid
    cliente_data2 = {**cliente_data, "email": f"c2_{_uuid.uuid4().hex[:4]}@test.com", "cpf": "11111111111"}
    cli1, ofic, horario, servico, veiculo1 = _setup_completo(client, cliente_data, oficina_data)
    cli2 = register_and_login(client, cliente_data2)
    veiculo2 = client.post("/veiculos", json={
        "placa": f"ZZ{_uuid.uuid4().hex[:5].upper()}", "modelo": "Ka", "marca": "Ford", "ano": 2021,
    }, headers=auth_header(cli2)).get_json()

    r1 = client.post("/agendamentos", json={
        "horario_id": horario["id"], "veiculo_id": veiculo1["id"], "servico_id": servico["id"],
    }, headers=auth_header(cli1))
    assert r1.status_code == 201

    r2 = client.post("/agendamentos", json={
        "horario_id": horario["id"], "veiculo_id": veiculo2["id"], "servico_id": servico["id"],
    }, headers=auth_header(cli2))
    assert r2.status_code == 409


# RN03 — Veículo deve pertencer ao cliente
def test_rn03_cliente_nao_pode_agendar_veiculo_de_outro(client, db, cliente_data, oficina_data):
    import uuid as _uuid
    cli1, ofic, horario, servico, veiculo = _setup_completo(client, cliente_data, oficina_data)
    cliente_data2 = {**cliente_data, "email": f"c2_{_uuid.uuid4().hex[:4]}@test.com", "cpf": "22222222222"}
    cli2 = register_and_login(client, cliente_data2)

    resp = client.post("/agendamentos", json={
        "horario_id": horario["id"], "veiculo_id": veiculo["id"], "servico_id": servico["id"],
    }, headers=auth_header(cli2))
    assert resp.status_code == 404


# RN04 — Cancelamento após horário
def test_rn04_nao_pode_cancelar_apos_horario(client, db, cliente_data, oficina_data):
    cli, ofic, horario, servico, veiculo = _setup_completo(client, cliente_data, oficina_data, delta_hours=48)

    ag_resp = client.post("/agendamentos", json={
        "horario_id": horario["id"], "veiculo_id": veiculo["id"], "servico_id": servico["id"],
    }, headers=auth_header(cli))
    ag_id = ag_resp.get_json()["id"]

    # Simula horário passado diretamente no banco
    from app.config.database import db as _db
    from app.models.horario_disponivel import HorarioDisponivel
    from app.models.agendamento import Agendamento
    from app import create_app
    app = create_app("testing")
    with app.app_context():
        ag = _db.session.get(Agendamento, uuid.UUID(ag_id))
        if ag:
            h = _db.session.get(HorarioDisponivel, ag.horario_id)
            if h:
                h.data_hora_inicio = datetime.utcnow() - timedelta(hours=1)
                _db.session.commit()

    resp = client.delete(f"/agendamentos/{ag_id}", headers=auth_header(cli))
    assert resp.status_code == 422


# RN05 — Apenas oficinas gerenciam
def test_rn05_cliente_nao_pode_atualizar_status(client, db, cliente_data, oficina_data):
    cli, ofic, horario, servico, veiculo = _setup_completo(client, cliente_data, oficina_data)
    ag_resp = client.post("/agendamentos", json={
        "horario_id": horario["id"], "veiculo_id": veiculo["id"], "servico_id": servico["id"],
    }, headers=auth_header(cli))
    ag_id = ag_resp.get_json()["id"]

    resp = client.put(f"/agendamentos/{ag_id}", json={"acao": "confirmar"}, headers=auth_header(cli))
    assert resp.status_code == 403


# RN06 — Serviço com análise prévia
def test_rn06_servico_com_analise_nao_pode_ser_agendado(client, db, cliente_data, oficina_data):
    cli, ofic, horario, _, veiculo = _setup_completo(client, cliente_data, oficina_data)
    servico_analise = client.post("/servicos", json={
        "nome": "Revisão Completa", "duracao": 120, "exige_analise_previa": True,
    }, headers=auth_header(ofic)).get_json()

    resp = client.post("/agendamentos", json={
        "horario_id": horario["id"], "veiculo_id": veiculo["id"], "servico_id": servico_analise["id"],
    }, headers=auth_header(cli))
    assert resp.status_code == 422


# Transições inválidas de estado
def test_transicao_invalida_pendente_para_concluido(client, db, cliente_data, oficina_data):
    cli, ofic, horario, servico, veiculo = _setup_completo(client, cliente_data, oficina_data)
    ag_resp = client.post("/agendamentos", json={
        "horario_id": horario["id"], "veiculo_id": veiculo["id"], "servico_id": servico["id"],
    }, headers=auth_header(cli))
    ag_id = ag_resp.get_json()["id"]

    resp = client.put(f"/agendamentos/{ag_id}", json={"acao": "concluir"}, headers=auth_header(ofic))
    assert resp.status_code == 422
