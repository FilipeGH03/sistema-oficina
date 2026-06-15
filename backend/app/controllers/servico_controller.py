import uuid
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from marshmallow import ValidationError
from app.services.servico_service import ServicoService
from app.schemas.servico_schema import ServicoCreateSchema, ServicoResponseSchema
from app.exceptions import AcessoNegadoException

servico_bp = Blueprint("servicos", __name__, url_prefix="/servicos")
_service = ServicoService()
_create_schema = ServicoCreateSchema()
_response_schema = ServicoResponseSchema(many=True)
_response_one_schema = ServicoResponseSchema()


@servico_bp.get("")
def listar():
    oficina_id = request.args.get("oficina_id")
    servicos = _service.listar(oficina_id)
    return jsonify(_response_schema.dump(servicos)), 200


@servico_bp.post("")
@jwt_required()
def criar():
    claims = get_jwt()
    if claims.get("tipo_usuario") != "oficina":
        raise AcessoNegadoException("Apenas oficinas podem cadastrar serviços")

    oficina_id = uuid.UUID(get_jwt_identity())
    try:
        dados = _create_schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({"error": True, "message": "Dados inválidos", "details": e.messages}), 400

    servico = _service.criar(dados, oficina_id)
    return jsonify(_response_one_schema.dump(servico)), 201
