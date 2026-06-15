import os
from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from app.config.settings import config_map
from app.config.database import init_db
from app.exceptions.domain import BaseAppException


def create_app(env: str | None = None) -> Flask:
    env = env or os.getenv("FLASK_ENV", "development")
    app = Flask(__name__)
    app.config.from_object(config_map[env])

    init_db(app)

    jwt = JWTManager(app)

    _register_blueprints(app)
    _register_error_handlers(app)

    return app


def _register_blueprints(app: Flask) -> None:
    from app.controllers.auth_controller import auth_bp
    from app.controllers.veiculo_controller import veiculo_bp
    from app.controllers.servico_controller import servico_bp
    from app.controllers.horario_controller import horario_bp
    from app.controllers.agendamento_controller import agendamento_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(veiculo_bp)
    app.register_blueprint(servico_bp)
    app.register_blueprint(horario_bp)
    app.register_blueprint(agendamento_bp)


def _register_error_handlers(app: Flask) -> None:
    @app.errorhandler(BaseAppException)
    def handle_domain_exception(e: BaseAppException):
        return jsonify(e.to_dict()), e.status_code

    @app.errorhandler(404)
    def not_found(_e):
        return jsonify({"error": True, "message": "Recurso não encontrado", "details": {}}), 404

    @app.errorhandler(405)
    def method_not_allowed(_e):
        return jsonify({"error": True, "message": "Método não permitido", "details": {}}), 405

    @app.errorhandler(500)
    def internal_error(_e):
        return jsonify({"error": True, "message": "Erro interno do servidor", "details": {}}), 500
