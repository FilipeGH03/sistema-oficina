import uuid
from datetime import date
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from marshmallow import ValidationError
from app.services.horario_service import HorarioService
from app.schemas.horario_schema import HorarioCreateSchema, HorarioResponseSchema
from app.exceptions import AcessoNegadoException

horario_bp = Blueprint("horarios", __name__, url_prefix="/horarios")
_service = HorarioService()
_create_schema = HorarioCreateSchema()
_response_schema = HorarioResponseSchema(many=True)
_response_one_schema = HorarioResponseSchema()


@horario_bp.get("")
def listar():
    oficina_id = request.args.get("oficina_id")
    data_str = request.args.get("data")

    if not oficina_id:
        return jsonify({"error": True, "message": "Parâmetro oficina_id é obrigatório"}), 400

    data = date.fromisoformat(data_str) if data_str else None
    horarios = _service.listar_disponiveis(uuid.UUID(oficina_id), data)
    return jsonify(_response_schema.dump(horarios)), 200


@horario_bp.post("")
@jwt_required()
def criar():
    claims = get_jwt()
    if claims.get("tipo_usuario") != "oficina":
        raise AcessoNegadoException("Apenas oficinas podem criar horários")

    oficina_id = uuid.UUID(get_jwt_identity())
    try:
        dados = _create_schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({"error": True, "message": "Dados inválidos", "details": e.messages}), 400

    horario = _service.criar(dados, oficina_id)
    return jsonify(_response_one_schema.dump(horario)), 201


@horario_bp.delete("/<uuid:horario_id>")
@jwt_required()
def remover(horario_id: uuid.UUID):
    claims = get_jwt()
    if claims.get("tipo_usuario") != "oficina":
        raise AcessoNegadoException()

    oficina_id = uuid.UUID(get_jwt_identity())
    _service.remover(horario_id, oficina_id)
    return jsonify({"message": "Horário removido com sucesso"}), 200
