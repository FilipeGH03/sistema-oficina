from marshmallow import Schema, fields, validate, validates, ValidationError


class RegisterSchema(Schema):
    nome = fields.Str(required=True, validate=validate.Length(min=2, max=120))
    email = fields.Email(required=True)
    senha = fields.Str(required=True, validate=validate.Length(min=6), load_only=True)
    tipo_usuario = fields.Str(required=True, validate=validate.OneOf(["cliente", "oficina"]))
    # cliente
    cpf = fields.Str(load_default=None)
    telefone = fields.Str(load_default=None)
    # oficina
    cnpj = fields.Str(load_default=None)
    endereco = fields.Str(load_default=None)
    horario_funcionamento = fields.Str(load_default=None)

    @validates("cpf")
    def validate_cpf(self, value):
        if value and len(value.replace(".", "").replace("-", "")) != 11:
            raise ValidationError("CPF inválido")


class LoginSchema(Schema):
    email = fields.Email(required=True)
    senha = fields.Str(required=True, load_only=True)


class UsuarioResponseSchema(Schema):
    id = fields.UUID(dump_default=None)
    nome = fields.Str()
    email = fields.Email()
    tipo_usuario = fields.Str()
