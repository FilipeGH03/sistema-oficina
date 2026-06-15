import uuid
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from marshmallow import ValidationError
from app.facade.agendamento_facade import AgendamentoFacade
from app.services.agendamento_service import AgendamentoService
from app.repositories.historico_repository import HistoricoRepository
from app.schemas.agendamento_schema import (
    AgendamentoCreateSchema,
    AgendamentoUpdateSchema,
    AgendamentoResponseSchema,
    HistoricoResponseSchema,
)
from app.exceptions import AcessoNegadoException

agendamento_bp = Blueprint("agendamentos", __name__, url_prefix="/agendamentos")
_facade = AgendamentoFacade()
_service = AgendamentoService()
_historico_repo = HistoricoRepository()
_create_schema = AgendamentoCreateSchema()
_update_schema = AgendamentoUpdateSchema()
_response_schema = AgendamentoResponseSchema(many=True)
_response_one_schema = AgendamentoResponseSchema()
_historico_schema = HistoricoResponseSchema(many=True)


@agendamento_bp.get("")
@jwt_required()
def listar():
    claims = get_jwt()
    usuario_id = uuid.UUID(get_jwt_identity())
    tipo = claims.get("tipo_usuario")

    if tipo == "cliente":
        agendamentos = _service.listar_por_cliente(usuario_id)
    else:
        agendamentos = _service.listar_por_oficina(usuario_id)

    return jsonify(_response_schema.dump(agendamentos)), 200


@agendamento_bp.post("")
@jwt_required()
def criar():
    claims = get_jwt()
    if claims.get("tipo_usuario") != "cliente":
        raise AcessoNegadoException("Apenas clientes podem realizar agendamentos")

    cliente_id = uuid.UUID(get_jwt_identity())
    try:
        dados = _create_schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({"error": True, "message": "Dados inválidos", "details": e.messages}), 400

    agendamento = _facade.criar_agendamento(dados, cliente_id)
    return jsonify(_response_one_schema.dump(agendamento)), 201


@agendamento_bp.put("/<uuid:agendamento_id>")
@jwt_required()
def atualizar(agendamento_id: uuid.UUID):
    claims = get_jwt()
    if claims.get("tipo_usuario") != "oficina":
        raise AcessoNegadoException("Apenas oficinas podem atualizar o status de agendamentos")

    oficina_id = uuid.UUID(get_jwt_identity())
    try:
        dados = _update_schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({"error": True, "message": "Dados inválidos", "details": e.messages}), 400

    agendamento = _service.atualizar_status(agendamento_id, dados["acao"], oficina_id)
    return jsonify(_response_one_schema.dump(agendamento)), 200


@agendamento_bp.delete("/<uuid:agendamento_id>")
@jwt_required()
def cancelar(agendamento_id: uuid.UUID):
    claims = get_jwt()
    usuario_id = uuid.UUID(get_jwt_identity())
    tipo = claims.get("tipo_usuario")

    agendamento = _service.cancelar(agendamento_id, usuario_id, tipo)
    return jsonify(_response_one_schema.dump(agendamento)), 200


@agendamento_bp.get("/historico/<uuid:agendamento_id>")
@jwt_required()
def historico(agendamento_id: uuid.UUID):
    historico = _historico_repo.get_by_agendamento(agendamento_id)
    return jsonify(_historico_schema.dump(historico)), 200
