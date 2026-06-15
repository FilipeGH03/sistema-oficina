import pytest
from unittest.mock import MagicMock
from app.states import get_estado
from app.exceptions import TransicaoEstadoInvalidaException


def make_agendamento(status: str):
    ag = MagicMock()
    ag.status = status
    return ag


# ── PENDENTE ──────────────────────────────────────────────────────────────
def test_pendente_pode_confirmar():
    ag = make_agendamento("PENDENTE")
    get_estado("PENDENTE").confirmar(ag)
    assert ag.status == "CONFIRMADO"


def test_pendente_pode_cancelar():
    ag = make_agendamento("PENDENTE")
    get_estado("PENDENTE").cancelar(ag)
    assert ag.status == "CANCELADO"


def test_pendente_nao_pode_iniciar():
    with pytest.raises(TransicaoEstadoInvalidaException):
        get_estado("PENDENTE").iniciar(make_agendamento("PENDENTE"))


def test_pendente_nao_pode_concluir():
    with pytest.raises(TransicaoEstadoInvalidaException):
        get_estado("PENDENTE").concluir(make_agendamento("PENDENTE"))


# ── CONFIRMADO ────────────────────────────────────────────────────────────
def test_confirmado_pode_iniciar():
    ag = make_agendamento("CONFIRMADO")
    get_estado("CONFIRMADO").iniciar(ag)
    assert ag.status == "EM_ANDAMENTO"


def test_confirmado_pode_cancelar():
    ag = make_agendamento("CONFIRMADO")
    get_estado("CONFIRMADO").cancelar(ag)
    assert ag.status == "CANCELADO"


def test_confirmado_nao_pode_confirmar():
    with pytest.raises(TransicaoEstadoInvalidaException):
        get_estado("CONFIRMADO").confirmar(make_agendamento("CONFIRMADO"))


# ── EM_ANDAMENTO ──────────────────────────────────────────────────────────
def test_em_andamento_pode_concluir():
    ag = make_agendamento("EM_ANDAMENTO")
    get_estado("EM_ANDAMENTO").concluir(ag)
    assert ag.status == "CONCLUIDO"


def test_em_andamento_nao_pode_cancelar():
    with pytest.raises(TransicaoEstadoInvalidaException):
        get_estado("EM_ANDAMENTO").cancelar(make_agendamento("EM_ANDAMENTO"))


# ── CONCLUIDO ─────────────────────────────────────────────────────────────
def test_concluido_bloqueia_todas_transicoes():
    for acao in ["confirmar", "iniciar", "concluir", "cancelar"]:
        with pytest.raises(TransicaoEstadoInvalidaException):
            getattr(get_estado("CONCLUIDO"), acao)(make_agendamento("CONCLUIDO"))


# ── CANCELADO ─────────────────────────────────────────────────────────────
def test_cancelado_bloqueia_todas_transicoes():
    for acao in ["confirmar", "iniciar", "concluir", "cancelar"]:
        with pytest.raises(TransicaoEstadoInvalidaException):
            getattr(get_estado("CANCELADO"), acao)(make_agendamento("CANCELADO"))


def test_get_estado_invalido():
    with pytest.raises(ValueError):
        get_estado("INEXISTENTE")
