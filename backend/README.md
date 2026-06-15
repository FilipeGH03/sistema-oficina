# Sistema de Agendamento de Oficina Mecânica — Backend

API REST desenvolvida com Flask, PostgreSQL, SQLAlchemy e padrões GoF.

## Stack

- Python 3.12+
- Flask 3.1 + Flask-JWT-Extended + Flask-Migrate
- PostgreSQL 16
- SQLAlchemy 2.0 + Alembic
- Marshmallow (validação/serialização)
- Pytest + pytest-cov (testes)
- Docker + Docker Compose

## Arquitetura

```
app/
├── controllers/   # Blueprints Flask — apenas HTTP
├── services/      # Regras de negócio simples
├── repositories/  # Acesso a dados (Repository Pattern)
├── models/        # SQLAlchemy ORM
├── schemas/       # Marshmallow — validação e serialização
├── exceptions/    # Exceções de domínio
├── factories/     # GoF Factory Method — criação de usuários
├── states/        # GoF State — máquina de estados do agendamento
├── facade/        # GoF Facade — orquestração do agendamento
└── config/        # Configurações e database
```

## Rodando com Docker (recomendado)

```bash
cp .env.example .env
docker compose up --build
```

A API ficará disponível em `http://localhost:5000`.

## Rodando localmente

### Pré-requisitos

- Python 3.12+
- PostgreSQL rodando em localhost:5432

### Configuração

```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edite .env com suas credenciais
```

### Banco de dados

```bash
# Criar banco no PostgreSQL
createdb oficina_db
createdb oficina_test_db

# Rodar migrations
flask db upgrade
```

### Executar

```bash
python run.py
```

## Rodando os testes

```bash
# Com banco de teste rodando:
pytest

# Com cobertura detalhada:
pytest --cov=app --cov-report=html
```

## Endpoints

### Auth
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/register` | Cadastrar cliente ou oficina |
| POST | `/auth/login` | Autenticar e obter JWT |

### Veículos (cliente autenticado)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/veiculos` | Listar veículos do cliente |
| POST | `/veiculos` | Cadastrar veículo |
| DELETE | `/veiculos/{id}` | Remover veículo |

### Serviços
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/servicos` | Listar serviços (público) |
| POST | `/servicos` | Criar serviço (só oficina) |

### Horários
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/horarios?oficina_id=&data=` | Listar horários disponíveis |
| POST | `/horarios` | Criar horário (só oficina) |
| DELETE | `/horarios/{id}` | Remover horário (só oficina) |

### Agendamentos
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/agendamentos` | Listar (cliente: os seus; oficina: todos) |
| POST | `/agendamentos` | Criar agendamento (cliente) |
| PUT | `/agendamentos/{id}` | Atualizar status (só oficina) |
| DELETE | `/agendamentos/{id}` | Cancelar |
| GET | `/agendamentos/historico/{id}` | Histórico de transições |

### Ações disponíveis no PUT `/agendamentos/{id}`
```json
{ "acao": "confirmar" }
{ "acao": "iniciar" }
{ "acao": "concluir" }
{ "acao": "cancelar" }
```

### Formato de registro

**Cliente:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123",
  "tipo_usuario": "cliente",
  "cpf": "12345678901",
  "telefone": "11999999999"
}
```

**Oficina:**
```json
{
  "nome": "Oficina Top",
  "email": "contato@oficina.com",
  "senha": "senha123",
  "tipo_usuario": "oficina",
  "cnpj": "12345678000195",
  "endereco": "Rua A, 100",
  "horario_funcionamento": "08:00-18:00"
}
```

## Padrões GoF implementados

### Factory Method
`UsuarioFactory.get_factory("cliente")` retorna `ClienteFactory`, `"oficina"` retorna `OficinaFactory`. Sem if/else no código de negócio.

### State
Cada status do agendamento é uma classe (`EstadoPendente`, `EstadoConfirmado`, etc.) com métodos `confirmar()`, `iniciar()`, `concluir()`, `cancelar()`. Transições inválidas lançam `TransicaoEstadoInvalidaException`.

### Facade
`AgendamentoFacade.criar_agendamento()` orquestra: validar horário → validar veículo → validar serviço → criar agendamento → marcar horário → registrar histórico. Controllers não contêm regras de negócio.

## Regras de negócio

| RN | Implementação |
|----|---------------|
| RN01 — horário único | `UNIQUE(horario_id)` + verificação em `HorarioService` |
| RN02 — só disponíveis | `HorarioService.validar_disponivel()` |
| RN03 — veículo do cliente | `VeiculoService.validar_pertence_cliente()` |
| RN04 — cancelar só futuro | Comparação `data_hora_inicio > datetime.utcnow()` |
| RN05 — só oficina gerencia | Verificação de `tipo_usuario` no JWT |
| RN06 — sem análise prévia | `ServicoService.validar_agendavel()` |
| RN07 — data de criação | `default=datetime.utcnow` no model |
