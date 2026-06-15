from marshmallow import Schema, fields, validate


class ServicoCreateSchema(Schema):
    nome = fields.Str(required=True, validate=validate.Length(min=2, max=150))
    descricao = fields.Str(load_default=None)
    duracao = fields.Int(required=True, validate=validate.Range(min=1))
    exige_analise_previa = fields.Bool(load_default=False)


class ServicoResponseSchema(Schema):
    id = fields.UUID()
    nome = fields.Str()
    descricao = fields.Str()
    duracao = fields.Int()
    exige_analise_previa = fields.Bool()
    oficina_id = fields.UUID()
