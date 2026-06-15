import pytest
from unittest.mock import MagicMock, patch
from app.exceptions import AgendamentoInvalidoException, ServicoNaoPermitidoException
from app.services.servico_service import ServicoService
from app.services.veiculo_service import VeiculoService


# ── ServicoService ────────────────────────────────────────────────────────
def test_validar_agendavel_servico_sem_analise(app):
    with app.app_context():
        svc = ServicoService.__new__(ServicoService)
        svc._repo = MagicMock()
        mock_servico = MagicMock()
        mock_servico.exige_analise_previa = False
        svc._repo.get_by_id.return_value = mock_servico
        result = svc.validar_agendavel("some-id")
        assert result == mock_servico


def test_validar_agendavel_servico_com_analise_lanca_excecao(app):
    with app.app_context():
        svc = ServicoService.__new__(ServicoService)
        svc._repo = MagicMock()
        mock_servico = MagicMock()
        mock_servico.exige_analise_previa = True
        svc._repo.get_by_id.return_value = mock_servico
        with pytest.raises(ServicoNaoPermitidoException):
            svc.validar_agendavel("some-id")


def test_validar_agendavel_servico_nao_encontrado(app):
    with app.app_context():
        svc = ServicoService.__new__(ServicoService)
        svc._repo = MagicMock()
        svc._repo.get_by_id.return_value = None
        with pytest.raises(AgendamentoInvalidoException):
            svc.validar_agendavel("nao-existe")


# ── VeiculoService ────────────────────────────────────────────────────────
def test_validar_pertence_cliente_encontrado(app):
    with app.app_context():
        svc = VeiculoService.__new__(VeiculoService)
        svc._repo = MagicMock()
        veiculo_mock = MagicMock()
        svc._repo.get_by_id_and_cliente.return_value = veiculo_mock
        result = svc.validar_pertence_cliente("vid", "cid")
        assert result == veiculo_mock


def test_validar_pertence_cliente_nao_encontrado(app):
    from app.exceptions import VeiculoNaoEncontradoException
    with app.app_context():
        svc = VeiculoService.__new__(VeiculoService)
        svc._repo = MagicMock()
        svc._repo.get_by_id_and_cliente.return_value = None
        with pytest.raises(VeiculoNaoEncontradoException):
            svc.validar_pertence_cliente("vid", "cid")
