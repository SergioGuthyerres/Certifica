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


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    yield


app = FastAPI(title="Certifica API", lifespan=lifespan)