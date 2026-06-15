from marshmallow import Schema, fields, validate


class AgendamentoCreateSchema(Schema):
    veiculo_id = fields.UUID(required=True)
    servico_id = fields.UUID(required=True)
    horario_id = fields.UUID(required=True)
    observacoes = fields.Str(load_default=None)


class AgendamentoUpdateSchema(Schema):
    acao = fields.Str(
        required=True,
        validate=validate.OneOf(["confirmar", "iniciar", "concluir", "cancelar"]),
    )


class AgendamentoResponseSchema(Schema):
    id = fields.UUID()
    cliente_id = fields.UUID()
    oficina_id = fields.UUID()
    veiculo_id = fields.UUID()
    servico_id = fields.UUID()
    horario_id = fields.UUID()
    status = fields.Str()
    observacoes = fields.Str()
    data_criacao = fields.DateTime()


class HistoricoResponseSchema(Schema):
    id = fields.UUID()
    agendamento_id = fields.UUID()
    status_anterior = fields.Str(allow_none=True)
    status_novo = fields.Str()
    data_evento = fields.DateTime()
