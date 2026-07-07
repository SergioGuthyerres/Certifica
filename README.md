# CERTIFICA

Sistema de gerenciamento de eventos com emissão de certificados.

## Descrição
O Certifica é um sistema de gerenciamento de eventos que automatiza esse fluxo: cadastro de eventos e atividades, inscrição de participantes, registro de frequência e emissão automática de certificados para quem atinge a carga horária mínima exigida (75%).


## Integrantes

- Ester Martins
- Bruno Vital
- Sérgio Guthyerres
- Rafael Carvalho

## Funcionalidades


- Cadastro de usuários com três perfis distintos: Participante, Organizador e Palestrante
- Cadastro de locais e eventos, com definição de carga horária e status
- Cadastro de atividades vinculadas a um evento, associadas a um palestrante
- Inscrição de participantes em eventos, com validação de duplicidade
- Registro de frequência (horas) por inscrição, com aprovação automática ao atingir 75% da carga horária
- Emissão de certificado com código de validação único, apenas para inscrições aprovadas
- Consulta e validação pública de certificados pelo código

## Conceitos de POO utilizados
- Classes e objetos
- Encapsulamento
- Herança
- Polimorfismo
- Associação
- Agregação
- Composição

## Diagramas de Classes
O diagrama de classes (PlantUML) está na pasta [`diagramas-UML/`](./diagramas-UML).
 
Para gerar a imagem do diagrama:
```bash
python diagramas-UML/gerar_diagrama.py
```


## Arquitetura

```
certificaRepo/
├── docker-compose.yml          # Orquestra DB + Backend
├── backendCertifica/           # API FastAPI (Python)
│   ├── Dockerfile
│   ├── app/
│   │   ├── main.py             # Entrypoint FastAPI
│   │   └── dependencies.py     # Engine async + sessão PostgreSQL
│   └── alembic/                # Migrations
└── frontendCertifica/          # SPA React + TypeScript
```

| Camada    | Tecnologia                    |
|-----------|-------------------------------|
| Backend   | FastAPI + SQLModel            |
| ORM       | SQLAlchemy (async) + asyncpg  |
| Banco     | PostgreSQL 16                 |
| Frontend  | React + Vite + TypeScript     |
| Infra     | Docker + Docker Compose       |

---

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) >= 24
- [Docker Compose](https://docs.docker.com/compose/) >= 2.20 (já incluso no Docker Desktop)

---

## Rodar o projeto completo com Docker

```bash
# 1. Clone o repositório
git clone <URL>
cd certificaRepo

# 2. (Opcional) Crie um .env na raiz para sobrescrever credenciais padrão
cp backendCertifica/.env.example .env

# 3. Suba os serviços (banco + backend)
docker compose up -d

# 4. Acompanhe os logs
docker compose logs -f
```

| Serviço  | URL                        |
|----------|----------------------------|
| Backend  | http://localhost:8000      |
| Docs API | http://localhost:8000/docs |
| Banco    | localhost:5432             |

Para parar:

```bash
docker compose down
```

Para remover também os dados do banco:

```bash
docker compose down -v
```

---

## Frontend (desenvolvimento local)

```bash
cd frontendCertifica
npm install
npm run dev
```

Disponível em `http://localhost:5173`.

---

## Regras do projeto

- Nunca commitar direto na `main`
- Uma branch por feature
- Todo consumo de API deve passar por `src/services/api.ts`
- Abrir PR antes de mergear
