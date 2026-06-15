from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from app.services.auth_service import AuthService
from app.schemas.usuario_schema import RegisterSchema, LoginSchema

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")
_service = AuthService()
_register_schema = RegisterSchema()
_login_schema = LoginSchema()


@auth_bp.post("/register")
def register():
    try:
        dados = _register_schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({"error": True, "message": "Dados inválidos", "details": e.messages}), 400

    usuario = _service.registrar(dados)
    return jsonify({"id": str(usuario.id), "nome": usuario.nome, "email": usuario.email, "tipo_usuario": usuario.tipo_usuario}), 201


@auth_bp.post("/login")
def login():
    try:
        dados = _login_schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({"error": True, "message": "Dados inválidos", "details": e.messages}), 400

    token = _service.login(dados["email"], dados["senha"])
    return jsonify({"access_token": token}), 200
