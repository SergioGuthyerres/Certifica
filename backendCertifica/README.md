# Backend — Certifica API

API REST construída com FastAPI, SQLModel e PostgreSQL assíncrono via asyncpg.

## Estrutura

```
backendCertifica/
├── Dockerfile
├── requirements.txt
├── .env.example
├── alembic.ini
├── alembic/
│   ├── env.py          # Configuração async para migrations
│   └── versions/       # Arquivos de migration gerados
└── app/
    ├── main.py         # Entrypoint FastAPI + lifespan
    └── dependencies.py # Engine, sessão e criação de tabelas
```

---

## Variáveis de ambiente

Copie o arquivo de exemplo e ajuste os valores:

```bash
cp .env.example .env
```

| Variável          | Descrição                              | Padrão                                                                    |
|-------------------|----------------------------------------|---------------------------------------------------------------------------|
| `POSTGRES_USER`   | Usuário do banco                       | `certifica`                                                               |
| `POSTGRES_PASSWORD` | Senha do banco                       | `certifica_secret`                                                        |
| `POSTGRES_DB`     | Nome do banco                          | `certifica_db`                                                            |
| `DATABASE_URL`    | String de conexão async (asyncpg)      | `postgresql+asyncpg://certifica:certifica_secret@localhost:5432/certifica_db` |

> **Atenção:** Para rodar dentro do Docker, troque `localhost` por `db` (nome do serviço) na `DATABASE_URL`.

---

## Rodar com Docker (recomendado)

A partir da **raiz do repositório**:

```bash
docker compose up -d backend
```

A API ficará disponível em `http://localhost:8000`.  
Documentação interativa: `http://localhost:8000/docs`.

---

## Rodar localmente (sem Docker)

### Pré-requisitos

- Python 3.12+
- PostgreSQL 16 rodando localmente (ou via Docker só o serviço `db`)

### Subir apenas o banco via Docker

```bash
# A partir da raiz do repositório
docker compose up -d db
```

### Configurar o ambiente Python

```bash
cd backendCertifica

# Criar e ativar o ambiente virtual
python -m venv .venv

# Linux / Mac
source .venv/bin/activate

# Windows
.venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt
```

### Configurar as variáveis de ambiente

```bash
cp .env.example .env
# Edite .env conforme necessário — mantenha DATABASE_URL com 'localhost'
```

### Rodar as migrations

```bash
alembic upgrade head
```

### Iniciar o servidor

```bash
uvicorn app.main:app --reload
```

Backend disponível em `http://localhost:8000`.

---

## Criar uma nova migration

Após alterar ou criar um model:

```bash
alembic revision --autogenerate -m "descricao_da_mudanca"
alembic upgrade head
```

> Certifique-se de importar seus models em `alembic/env.py` para que o autogenerate os detecte.
