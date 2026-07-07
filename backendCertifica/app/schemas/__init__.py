from datetime import datetime
from typing import Optional

from sqlmodel import SQLModel


# Local
class LocalCreate(SQLModel):
    nome: str
    capacidade: int
    endereco: str


class LocalRead(LocalCreate):
    id: int


# Usuario
class UsuarioCreate(SQLModel):
    nome: str
    email: str
    tipo: str 
    matricula: Optional[str] = None
    departamento: Optional[str] = None
    mini_curriculo: Optional[str] = None


class UsuarioUpdate(SQLModel):
    nome: Optional[str] = None
    email: Optional[str] = None
    matricula: Optional[str] = None
    departamento: Optional[str] = None
    mini_curriculo: Optional[str] = None


class UsuarioRead(SQLModel):
    id: int
    nome: str
    email: str
    tipo: str
    matricula: Optional[str] = None
    departamento: Optional[str] = None
    mini_curriculo: Optional[str] = None


# Evento
class EventoCreate(SQLModel):
    titulo: str
    carga_horaria: int
    local_id: Optional[int] = None


class EventoUpdate(SQLModel):
    titulo: Optional[str] = None
    carga_horaria: Optional[int] = None
    status: Optional[str] = None
    local_id: Optional[int] = None


class EventoRead(SQLModel):
    id: int
    titulo: str
    carga_horaria: int
    status: str
    local_id: Optional[int] = None


# Atividade
class AtividadeCreate(SQLModel):
    titulo: str
    carga_horaria: int
    evento_id: int
    palestrante_id: Optional[int] = None


class AtividadeRead(SQLModel):
    id: int
    titulo: str
    carga_horaria: int
    evento_id: Optional[int] = None
    palestrante_id: Optional[int] = None


# Inscricao
class InscricaoCreate(SQLModel):
    participante_id: int
    evento_id: int


class InscricaoRead(SQLModel):
    id: int
    frequencia_horas: int
    aprovado: bool
    participante_id: Optional[int] = None
    evento_id: Optional[int] = None


class FrequenciaAdd(SQLModel):
    horas: int


# Certificado
class CertificadoRead(SQLModel):
    id: int
    data_emissao: datetime
    codigo_validacao: str
    inscricao_id: Optional[int] = None