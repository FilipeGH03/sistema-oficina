class BaseAppException(Exception):
    status_code: int = 500
    message: str = "Erro interno do servidor"

    def __init__(self, message: str | None = None):
        self.message = message or self.__class__.message
        super().__init__(self.message)

    def to_dict(self) -> dict:
        return {"error": True, "message": self.message, "details": {}}


class UsuarioNaoEncontradoException(BaseAppException):
    status_code = 404
    message = "Usuário não encontrado"


class HorarioIndisponivelException(BaseAppException):
    status_code = 409
    message = "Horário indisponível ou já reservado"


class VeiculoNaoEncontradoException(BaseAppException):
    status_code = 404
    message = "Veículo não encontrado ou não pertence ao cliente"


class ServicoNaoPermitidoException(BaseAppException):
    status_code = 422
    message = "Serviço exige análise prévia e não pode ser agendado automaticamente"


class AgendamentoInvalidoException(BaseAppException):
    status_code = 422
    message = "Agendamento inválido"


class TransicaoEstadoInvalidaException(BaseAppException):
    status_code = 422
    message = "Transição de estado inválida"


class AcessoNegadoException(BaseAppException):
    status_code = 403
    message = "Acesso negado"
