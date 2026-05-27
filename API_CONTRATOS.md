# CERTIFICA — Contratos de API

> **Como usar este documento:**
> Antes de criar uma tela, o membro de front lê o contrato da rota correspondente e mocka a resposta no `src/services/api.ts`.
> Antes de criar um endpoint, o membro de back segue exatamente o formato definido aqui.
> Qualquer mudança neste documento precisa ser proposta no Trello antes de ser implementada.

---

## Índice

- [Convenções gerais](#convenções-gerais)
- [Autenticação](#autenticação)
- [Eventos](#eventos)
- [Inscrições](#inscrições)
- [Presença](#presença)
- [Certificados](#certificados)
- [Validação pública](#validação-pública)

---

## Convenções gerais

**URL base:** `http://localhost:8000`

**Autenticação:** rotas protegidas exigem o header:
```
Authorization: Bearer <token>
```

**Formato de datas:** `YYYY-MM-DD` (ex: `2024-11-15`)

**Respostas de erro seguem sempre o mesmo formato:**
```json
{
  "erro": "Mensagem descrevendo o problema"
}
```

**Códigos HTTP usados:**

| Código | Significado |
|--------|-------------|
| `200` | OK — requisição bem-sucedida |
| `201` | Criado — recurso criado com sucesso |
| `400` | Requisição inválida — campo faltando ou formato errado |
| `401` | Não autenticado — token ausente ou inválido |
| `403` | Sem permissão — usuário não tem acesso a este recurso |
| `404` | Não encontrado |
| `409` | Conflito — recurso já existe (ex: e-mail duplicado) |
| `422` | Erro de validação — dados enviados não passaram na validação |

---

## Autenticação

### `POST /auth/cadastro`

Cria uma nova conta. Não requer token.

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "minhasenha123",
  "tipo": "participante"
}
```

| Campo | Tipo | Obrigatório | Observação |
|-------|------|-------------|------------|
| `nome` | string | sim | mínimo 2 caracteres |
| `email` | string | sim | deve ser único no sistema |
| `senha` | string | sim | mínimo 6 caracteres |
| `tipo` | string | sim | `"organizador"` ou `"participante"` |

**Resposta `201`:**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com",
  "tipo": "participante"
}
```

**Erros possíveis:**
- `400` — campo obrigatório ausente
- `409` — e-mail já cadastrado

---

### `POST /auth/login`

Autentica o usuário e retorna um token JWT. Não requer token.

**Body:**
```json
{
  "email": "joao@email.com",
  "senha": "minhasenha123"
}
```

**Resposta `200`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "tipo": "participante"
  }
}
```

**Erros possíveis:**
- `400` — campo ausente
- `401` — e-mail ou senha incorretos

---

### `GET /auth/me`

Retorna os dados do usuário autenticado. Requer token.

**Resposta `200`:**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com",
  "tipo": "participante"
}
```

**Erros possíveis:**
- `401` — token ausente ou inválido

---

## Eventos

### `POST /eventos`

Cria um novo evento. Requer token de **organizador**.

**Body:**
```json
{
  "nome": "Semana da Computação 2024",
  "descricao": "Evento anual do curso de Computação.",
  "data": "2024-11-15",
  "local": "Auditório Principal",
  "carga_horaria": 20,
  "percentual_minimo": 75
}
```

| Campo | Tipo | Obrigatório | Observação |
|-------|------|-------------|------------|
| `nome` | string | sim | |
| `descricao` | string | não | pode ser omitido |
| `data` | string | sim | formato `YYYY-MM-DD` |
| `local` | string | sim | |
| `carga_horaria` | number | sim | em horas inteiras |
| `percentual_minimo` | number | sim | entre 1 e 100 |

**Resposta `201`:**
```json
{
  "id": 1,
  "nome": "Semana da Computação 2024",
  "descricao": "Evento anual do curso de Computação.",
  "data": "2024-11-15",
  "local": "Auditório Principal",
  "carga_horaria": 20,
  "percentual_minimo": 75,
  "status": "rascunho",
  "organizador_id": 3
}
```

> `status` começa sempre como `"rascunho"`. Inscrições só abrem quando o organizador acionar a rota específica.

**Erros possíveis:**
- `400` — campo obrigatório ausente
- `403` — usuário não é organizador

---

### `GET /eventos`

Lista todos os eventos com inscrições abertas. Não requer token.

**Resposta `200`:**
```json
[
  {
    "id": 1,
    "nome": "Semana da Computação 2024",
    "data": "2024-11-15",
    "local": "Auditório Principal",
    "carga_horaria": 20,
    "status": "aberto"
  }
]
```

> Retorna apenas eventos com `status = "aberto"`. Eventos em rascunho ou encerrados não aparecem aqui.

---

### `GET /eventos/{id}`

Retorna os detalhes de um evento específico. Não requer token.

**Resposta `200`:**
```json
{
  "id": 1,
  "nome": "Semana da Computação 2024",
  "descricao": "Evento anual do curso de Computação.",
  "data": "2024-11-15",
  "local": "Auditório Principal",
  "carga_horaria": 20,
  "percentual_minimo": 75,
  "status": "aberto",
  "organizador_id": 3
}
```

**Erros possíveis:**
- `404` — evento não encontrado

---

### `PATCH /eventos/{id}/status`

Abre, fecha ou encerra um evento. Requer token do **organizador dono do evento**.

**Body:**
```json
{
  "status": "aberto"
}
```

| Valor de `status` | O que faz |
|-------------------|-----------|
| `"aberto"` | Abre inscrições — participantes podem se inscrever |
| `"encerrado"` | Encerra o evento — dispara o cálculo de presença e geração de certificados |

**Resposta `200`:**
```json
{
  "id": 1,
  "status": "encerrado",
  "certificados_gerados": 12
}
```

> O campo `certificados_gerados` só aparece quando `status` for `"encerrado"`. Nos demais casos retorna apenas `id` e `status`.

**Erros possíveis:**
- `403` — usuário não é o organizador deste evento
- `404` — evento não encontrado

---

### `GET /eventos/{id}/inscritos`

Lista todos os inscritos de um evento com o status de presença de cada um. Requer token do **organizador dono do evento**.

**Resposta `200`:**
```json
[
  {
    "inscricao_id": 10,
    "usuario_id": 5,
    "nome": "Maria Souza",
    "email": "maria@email.com",
    "status": "confirmado",
    "presente": false
  }
]
```

**Erros possíveis:**
- `403` — usuário não é o organizador deste evento
- `404` — evento não encontrado

---

## Inscrições

### `POST /eventos/{id}/inscricoes`

Inscreve o usuário autenticado no evento. Requer token de **participante**.

Não tem body — o usuário inscrito é o próprio dono do token.

**Resposta `201`:**
```json
{
  "inscricao_id": 10,
  "evento_id": 1,
  "usuario_id": 5,
  "status": "inscrito",
  "presente": false
}
```

**Erros possíveis:**
- `400` — inscrições fechadas para este evento
- `403` — usuário não é participante
- `404` — evento não encontrado
- `409` — usuário já está inscrito neste evento

---

### `GET /inscricoes/minhas`

Lista todas as inscrições do usuário autenticado. Requer token de **participante**.

**Resposta `200`:**
```json
[
  {
    "inscricao_id": 10,
    "evento_id": 1,
    "nome_evento": "Semana da Computação 2024",
    "data_evento": "2024-11-15",
    "status": "confirmado",
    "presente": true
  }
]
```

---

## Presença

### `PATCH /inscricoes/{inscricao_id}/presenca`

Marca ou desmarca a presença de um participante. Requer token do **organizador dono do evento** ao qual a inscrição pertence.

**Body:**
```json
{
  "presente": true
}
```

**Resposta `200`:**
```json
{
  "inscricao_id": 10,
  "usuario_id": 5,
  "nome": "Maria Souza",
  "presente": true
}
```

**Erros possíveis:**
- `403` — usuário não é o organizador deste evento
- `404` — inscrição não encontrada

---

## Certificados

### `GET /certificados/meus`

Lista todos os certificados do usuário autenticado. Requer token de **participante**.

**Resposta `200`:**
```json
[
  {
    "id": 7,
    "evento_id": 1,
    "nome_evento": "Semana da Computação 2024",
    "carga_horaria": 20,
    "emitido_em": "2024-11-16",
    "codigo_verificacao": "a3f8c21d-94b1-4e67-b3d2-0f1e2c3a4b5d"
  }
]
```

---

### `GET /certificados/{id}/download`

Faz o download do PDF do certificado. Requer token do **dono do certificado**.

**Resposta `200`:** arquivo PDF binário.

```
Content-Type: application/pdf
Content-Disposition: attachment; filename="certificado_semana_comp_2024.pdf"
```

**Erros possíveis:**
- `403` — certificado não pertence ao usuário autenticado
- `404` — certificado não encontrado

---

## Validação pública

### `GET /validar/{codigo}`

Verifica se um certificado é válido a partir do código UUID. **Não requer token** — é uma página pública.

**Resposta `200`:**
```json
{
  "valido": true,
  "nome_participante": "Maria Souza",
  "nome_evento": "Semana da Computação 2024",
  "data_evento": "2024-11-15",
  "carga_horaria": 20,
  "emitido_em": "2024-11-16"
}
```

**Resposta `404`:**
```json
{
  "valido": false,
  "erro": "Certificado não encontrado"
}
```

---

## Resumo das rotas

| Método | Rota | Descrição | Quem pode usar |
|--------|------|-----------|----------------|
| `POST` | `/auth/cadastro` | Criar conta | Público |
| `POST` | `/auth/login` | Fazer login | Público |
| `GET` | `/auth/me` | Ver dados do usuário logado | Autenticado |
| `POST` | `/eventos` | Criar evento | Organizador |
| `GET` | `/eventos` | Listar eventos abertos | Público |
| `GET` | `/eventos/{id}` | Ver detalhes de um evento | Público |
| `PATCH` | `/eventos/{id}/status` | Abrir ou encerrar evento | Organizador dono |
| `GET` | `/eventos/{id}/inscritos` | Ver lista de inscritos e presença | Organizador dono |
| `POST` | `/eventos/{id}/inscricoes` | Se inscrever em um evento | Participante |
| `GET` | `/inscricoes/minhas` | Ver minhas inscrições | Participante |
| `PATCH` | `/inscricoes/{inscricao_id}/presenca` | Marcar/desmarcar presença | Organizador dono |
| `GET` | `/certificados/meus` | Ver meus certificados | Participante |
| `GET` | `/certificados/{id}/download` | Baixar PDF do certificado | Dono do certificado |
| `GET` | `/validar/{codigo}` | Validar certificado por código | Público |
