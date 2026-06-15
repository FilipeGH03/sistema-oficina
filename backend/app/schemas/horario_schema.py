from marshmallow import Schema, fields, validates_schema, ValidationError


class HorarioCreateSchema(Schema):
    data_hora_inicio = fields.DateTime(required=True)
    data_hora_fim = fields.DateTime(required=True)

    @validates_schema
    def validate_intervalo(self, data, **kwargs):
        if data["data_hora_fim"] <= data["data_hora_inicio"]:
            raise ValidationError("data_hora_fim deve ser posterior a data_hora_inicio")


class HorarioResponseSchema(Schema):
    id = fields.UUID()
    oficina_id = fields.UUID()
    data_hora_inicio = fields.DateTime()
    data_hora_fim = fields.DateTime()
    disponivel = fields.Bool()
