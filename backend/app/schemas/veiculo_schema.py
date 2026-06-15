from marshmallow import Schema, fields, validate


class VeiculoCreateSchema(Schema):
    placa = fields.Str(required=True, validate=validate.Length(min=7, max=8))
    modelo = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    marca = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    ano = fields.Int(required=True, validate=validate.Range(min=1900, max=2100))


class VeiculoResponseSchema(Schema):
    id = fields.UUID()
    placa = fields.Str()
    modelo = fields.Str()
    marca = fields.Str()
    ano = fields.Int()
    cliente_id = fields.UUID()
