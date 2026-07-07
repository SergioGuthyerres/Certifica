
#Camada de PERSISTÊNCIA do projeto Certifica.

from datetime import datetime
from typing import List, Optional

from sqlmodel import Field, Relationship, SQLModel

__all__ = [
    "LocalDB",
    "UsuarioDB",
    "EventoDB",
    "AtividadeDB",
    "InscricaoDB",
    "CertificadoDB",
]
 
# Local
class LocalDB(SQLModel, table=True):
    __tablename__ = "locais"

    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str
    capacidade: int
    endereco: str

    eventos: List["EventoDB"] = Relationship(back_populates="local")


class UsuarioDB(SQLModel, table=True):
    __tablename__ = "usuarios"

    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str
    email: str = Field(unique=True, index=True)

    # Discriminador: "participante" | "organizador" | "palestrante"
    tipo: str

    # Campos específicos de cada tipo (ficam nulos quando não se aplicam)
    matricula: Optional[str] = Field(default=None, unique=True)
    departamento: Optional[str] = Field(default=None)
    mini_curriculo: Optional[str] = Field(default=None)

    inscricoes: List["InscricaoDB"] = Relationship(back_populates="participante")
    atividades: List["AtividadeDB"] = Relationship(back_populates="palestrante")

# Evento

class EventoDB(SQLModel, table=True):
    __tablename__ = "eventos"

    id: Optional[int] = Field(default=None, primary_key=True)
    titulo: str
    carga_horaria: int
    status: str = Field(default="Aberto")

    local_id: Optional[int] = Field(default=None, foreign_key="locais.id")
    local: Optional[LocalDB] = Relationship(back_populates="eventos")

    atividades: List["AtividadeDB"] = Relationship(back_populates="evento")
    inscricoes: List["InscricaoDB"] = Relationship(back_populates="evento")


# Atividade (composição: pertence a um Evento)

class AtividadeDB(SQLModel, table=True):
    __tablename__ = "atividades"

    id: Optional[int] = Field(default=None, primary_key=True)
    titulo: str
    carga_horaria: int

    evento_id: Optional[int] = Field(default=None, foreign_key="eventos.id")
    evento: Optional[EventoDB] = Relationship(back_populates="atividades")

    palestrante_id: Optional[int] = Field(default=None, foreign_key="usuarios.id")
    palestrante: Optional[UsuarioDB] = Relationship(back_populates="atividades")


# Inscricao (associação Participante <-> Evento)

class InscricaoDB(SQLModel, table=True):
    __tablename__ = "inscricoes"

    id: Optional[int] = Field(default=None, primary_key=True)
    frequencia_horas: int = Field(default=0)
    aprovado: bool = Field(default=False)

    participante_id: Optional[int] = Field(default=None, foreign_key="usuarios.id")
    participante: Optional[UsuarioDB] = Relationship(back_populates="inscricoes")

    evento_id: Optional[int] = Field(default=None, foreign_key="eventos.id")
    evento: Optional[EventoDB] = Relationship(back_populates="inscricoes")

    certificado: Optional["CertificadoDB"] = Relationship(back_populates="inscricao")


# Certificado (dependência: só existe se a inscrição foi aprovada)

class CertificadoDB(SQLModel, table=True):
    __tablename__ = "certificados"

    id: Optional[int] = Field(default=None, primary_key=True)
    data_emissao: datetime = Field(default_factory=datetime.now)
    codigo_validacao: str = Field(unique=True, index=True)

    inscricao_id: Optional[int] = Field(
        default=None, foreign_key="inscricoes.id", unique=True
    )
    inscricao: Optional[InscricaoDB] = Relationship(back_populates="certificado")