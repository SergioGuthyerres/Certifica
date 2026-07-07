from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.models.models_db import (
    AtividadeDB,
    CertificadoDB,
    EventoDB,
    InscricaoDB,
    LocalDB,
    UsuarioDB,
)
from app.dependencies import create_db_and_tables
from app.routers import atividades, certificados, eventos, inscricoes, locais, usuarios


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    yield


app = FastAPI(title="Certifica API", lifespan=lifespan)

app.include_router(usuarios.router)
app.include_router(locais.router)
app.include_router(eventos.router)
app.include_router(atividades.router)
app.include_router(inscricoes.router)
app.include_router(certificados.router)