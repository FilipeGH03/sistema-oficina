import uuid
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from marshmallow import ValidationError
from app.services.veiculo_service import VeiculoService
from app.schemas.veiculo_schema import VeiculoCreateSchema, VeiculoResponseSchema
from app.exceptions import AcessoNegadoException

veiculo_bp = Blueprint("veiculos", __name__, url_prefix="/veiculos")
_service = VeiculoService()
_create_schema = VeiculoCreateSchema()
_response_schema = VeiculoResponseSchema(many=True)
_response_one_schema = VeiculoResponseSchema()


def _require_cliente():
    claims = get_jwt()
    if claims.get("tipo_usuario") != "cliente":
        raise AcessoNegadoException("Apenas clientes podem gerenciar veículos")
    return uuid.UUID(get_jwt_identity())


@veiculo_bp.get("")
@jwt_required()
def listar():
    cliente_id = _require_cliente()
    veiculos = _service.listar_por_cliente(cliente_id)
    return jsonify(_response_schema.dump(veiculos)), 200


@veiculo_bp.post("")
@jwt_required()
def cadastrar():
    cliente_id = _require_cliente()
    try:
        dados = _create_schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({"error": True, "message": "Dados inválidos", "details": e.messages}), 400

    veiculo = _service.cadastrar(dados, cliente_id)
    return jsonify(_response_one_schema.dump(veiculo)), 201


@veiculo_bp.delete("/<uuid:veiculo_id>")
@jwt_required()
def remover(veiculo_id: uuid.UUID):
    cliente_id = _require_cliente()
    _service.remover(veiculo_id, cliente_id)
    return jsonify({"message": "Veículo removido com sucesso"}), 200
