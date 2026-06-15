import uuid
import pytest
from unittest.mock import MagicMock, patch
from app.exceptions import (
    HorarioIndisponivelException,
    VeiculoNaoEncontradoException,
    ServicoNaoPermitidoException,
)


CLIENTE_ID = uuid.uuid4()
HORARIO_ID = uuid.uuid4()
VEICULO_ID = uuid.uuid4()
SERVICO_ID = uuid.uuid4()

DADOS = {
    "horario_id": HORARIO_ID,
    "veiculo_id": VEICULO_ID,
    "servico_id": SERVICO_ID,
}


def _make_facade():
    from app.facade.agendamento_facade import AgendamentoFacade
    facade = AgendamentoFacade.__new__(AgendamentoFacade)
    facade._agendamento_repo = MagicMock()
    facade._historico_repo = MagicMock()
    facade._horario_repo = MagicMock()
    facade._horario_service = MagicMock()
    facade._veiculo_service = MagicMock()
    facade._servico_service = MagicMock()
    return facade


def test_facade_lanca_se_horario_indisponivel(app):
    with app.app_context():
        facade = _make_facade()
        facade._horario_service.validar_disponivel.side_effect = HorarioIndisponivelException()
        with pytest.raises(HorarioIndisponivelException):
            facade.criar_agendamento(DADOS, CLIENTE_ID)


def test_facade_lanca_se_veiculo_invalido(app):
    with app.app_context():
        facade = _make_facade()
        horario_mock = MagicMock()
        horario_mock.oficina_id = uuid.uuid4()
        horario_mock.id = HORARIO_ID
        facade._horario_service.validar_disponivel.return_value = horario_mock
        facade._veiculo_service.validar_pertence_cliente.side_effect = VeiculoNaoEncontradoException()
        with pytest.raises(VeiculoNaoEncontradoException):
            facade.criar_agendamento(DADOS, CLIENTE_ID)


def test_facade_lanca_se_servico_exige_analise(app):
    with app.app_context():
        facade = _make_facade()
        horario_mock = MagicMock()
        horario_mock.oficina_id = uuid.uuid4()
        horario_mock.id = HORARIO_ID
        facade._horario_service.validar_disponivel.return_value = horario_mock
        facade._veiculo_service.validar_pertence_cliente.return_value = MagicMock()
        facade._servico_service.validar_agendavel.side_effect = ServicoNaoPermitidoException()
        with pytest.raises(ServicoNaoPermitidoException):
            facade.criar_agendamento(DADOS, CLIENTE_ID)
