from .auth_controller import auth_bp
from .veiculo_controller import veiculo_bp
from .servico_controller import servico_bp
from .horario_controller import horario_bp
from .agendamento_controller import agendamento_bp

__all__ = ["auth_bp", "veiculo_bp", "servico_bp", "horario_bp", "agendamento_bp"]
