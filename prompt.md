Você é um Arquiteto de Software e Desenvolvedor Sênior especializado em Python, Flask, PostgreSQL, SQLAlchemy, testes automatizados e arquitetura REST.

Sua tarefa é implementar uma API REST completa para um sistema de agendamento de oficinas mecânicas.

## Objetivo do Sistema

O sistema tem como objetivo automatizar o processo de agendamento de serviços automotivos, permitindo que clientes visualizem horários disponíveis e realizem agendamentos online, enquanto oficinas gerenciam sua agenda administrativa.

## Stack Obrigatória

* Python 3.12+
* Flask
* Flask-SQLAlchemy
* PostgreSQL
* Alembic (migrações)
* Pytest (testes automatizados)
* JWT para autenticação
* Docker e Docker Compose
* Arquitetura em camadas
* Princípios SOLID
* Padrões GoF descritos abaixo

---

# Funcionalidades Obrigatórias

## Usuários

Existem dois tipos de usuário:

* Cliente
* Oficina

Ambos possuem autenticação.

### RF01

Permitir cadastro e autenticação de clientes e oficinas.

---

## Veículos

### RF02

Permitir cadastro de veículos utilizando placa.

Cada veículo deve pertencer a um cliente.

---

## Serviços

### RF03

Exibir os serviços oferecidos pela oficina.

---

## Horários

### RF04

Permitir consulta de horários disponíveis.

---

## Agendamentos

### RF05

Permitir realização de agendamentos.

### RF06

Permitir consulta dos agendamentos do cliente.

### RF07

Permitir cancelamento de agendamentos futuros.

### RF08

Permitir que oficinas visualizem todos os agendamentos.

### RF09

Permitir que oficinas criem, editem e cancelem agendamentos.

### RF10

Armazenar histórico de agendamentos.

---

# Regras de Negócio Obrigatórias

RN01:
Um mesmo horário não pode ser reservado por mais de um cliente.

RN02:
Apenas horários disponíveis podem ser agendados.

RN03:
Todo agendamento deve estar associado a um veículo cadastrado.

RN04:
O cancelamento só pode ocorrer antes da data e horário do atendimento.

RN05:
Apenas oficinas podem gerenciar a agenda.

RN06:
Serviços que exijam análise prévia ou orçamento personalizado não podem ser agendados automaticamente.

RN07:
Todo agendamento deve registrar data e hora de criação.

---

# Estados do Agendamento

Implementar máquina de estados utilizando padrão State.

Estados:

* PENDENTE
* CONFIRMADO
* EM_ANDAMENTO
* CONCLUIDO
* CANCELADO

Definir transições válidas entre estados.

---

# Modelo de Domínio

Criar entidades semelhantes às seguintes:

## Usuario (abstrata)

Campos:

* id
* nome
* email
* senha_hash
* tipo_usuario

Subclasses:

* Cliente
* Oficina

## Veiculo

Campos:

* id
* placa
* modelo
* marca
* ano
* cliente_id

## Servico

Campos:

* id
* nome
* descricao
* duracao
* exige_analise_previa

## HorarioDisponivel

Campos:

* id
* oficina_id
* data_hora_inicio
* data_hora_fim
* disponivel

## Agendamento

Campos:

* id
* cliente_id
* oficina_id
* veiculo_id
* servico_id
* horario_id
* status
* data_criacao

## HistoricoAgendamento

Campos:

* id
* agendamento_id
* status_anterior
* status_novo
* data_evento

---

# Arquitetura Obrigatória

Utilizar arquitetura em camadas:

project/
├── app/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   ├── schemas/
│   ├── exceptions/
│   ├── factories/
│   ├── states/
│   ├── facade/
│   └── config/
├── tests/
├── migrations/
└── run.py

---

# Padrões de Projeto Obrigatórios

## Factory Method

Utilizar para criação de usuários.

Exemplo:

* ClienteFactory
* OficinaFactory

Evitar if/else espalhados para criação de usuários.

---

## Facade

Criar uma camada AgendamentoFacade responsável por:

* validar horário
* validar veículo
* validar serviço
* criar agendamento
* registrar histórico

Os controllers não devem conter regra de negócio.

---

## State

Implementar os estados do agendamento através de classes específicas.

Evitar grandes blocos if/else.

---

# API REST

Implementar endpoints RESTful.

Exemplos:

POST /auth/register
POST /auth/login

GET /veiculos
POST /veiculos

GET /servicos
POST /servicos

GET /horarios
POST /horarios

GET /agendamentos
POST /agendamentos

PUT /agendamentos/{id}
DELETE /agendamentos/{id}

GET /historico/{agendamento_id}

---

# Banco de Dados

Utilizar PostgreSQL.

Criar migrations utilizando Alembic.

Criar índices apropriados.

Garantir integridade referencial com foreign keys.

Criar restrições que impeçam agendamentos duplicados para o mesmo horário.

---

# Tratamento de Erros

Implementar tratamento global de exceções.

Criar exceções específicas:

* UsuarioNaoEncontradoException
* HorarioIndisponivelException
* VeiculoNaoEncontradoException
* ServicoNaoPermitidoException
* AgendamentoInvalidoException
* TransicaoEstadoInvalidaException

Retornar respostas padronizadas:

{
"error": true,
"message": "Descrição do erro",
"details": {}
}

Utilizar códigos HTTP adequados:

* 400
* 401
* 403
* 404
* 409
* 422
* 500

---

# Testes Automatizados

Cobertura mínima: 80%

Implementar:

## Testes Unitários

* Services
* Factories
* States
* Facade

## Testes de Integração

* Endpoints REST
* Persistência PostgreSQL

## Testes de Regras de Negócio

Validar:

* horário duplicado
* cancelamento após horário
* transições inválidas de estado
* criação de agendamento sem veículo

Utilizar pytest e fixtures.

Criar banco isolado para testes.

---

# Qualidade de Código

Seguir:

* SOLID
* Clean Code
* Type Hints
* Docstrings
* Repository Pattern
* Service Layer Pattern

---

# Entregáveis

Gerar:

1. Estrutura completa do projeto.
2. Código-fonte.
3. Models SQLAlchemy.
4. Migrations Alembic.
5. Controllers Flask.
6. Services.
7. Repositories.
8. Factories.
9. State Pattern.
10. Facade Pattern.
11. Testes automatizados.
12. Dockerfile.
13. docker-compose.yml.
14. requirements.txt.
15. README com instruções de execução.

Antes de gerar código, apresente o diagrama da arquitetura proposta e explique como cada requisito funcional e regra de negócio será atendido.