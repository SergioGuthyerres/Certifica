# CERTIFICA

Sistema de gerenciamento de eventos com emissão de certificados.

## Tecnologias

### Frontend
- React
- Vite
- TypeScript

### Backend
- FastAPI
- SQLModel
- SQLite

---

# Como rodar o projeto

## 1. Clonar o repositório

```bash
git clone URL
```

---

# FRONTEND

## Entrar na pasta

```bash
cd frontend
```

## Instalar dependências

```bash
npm install
```

## Rodar o projeto

```bash
npm run dev
```

O frontend ficará disponível em:

```txt
http://localhost:5173
```

---

# BACKEND

## Entrar na pasta

```bash
cd backend
```

## Criar ambiente virtual

### Linux / Mac

```bash
python -m venv .venv
```

### Windows

```bash
python -m venv .venv
```

---

## Ativar ambiente virtual

### Linux / Mac

```bash
source .venv/bin/activate
```

### Windows

```bash
.venv\Scripts\activate
```

---

## Instalar dependências

```bash
pip install -r requirements.txt
```

---

## Rodar migrations

```bash
alembic upgrade head
```

---

## Rodar servidor

```bash
uvicorn app.main:app --reload
```

Backend disponível em:

```txt
http://localhost:8000
```

---

# Regras do projeto

- Nunca commitar direto na main
- Uma branch por feature
- Todo consumo de API deve passar por `src/services/api.ts`
- Abrir PR antes de mergear
