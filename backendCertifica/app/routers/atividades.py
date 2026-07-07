from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.dependencies import get_session
from app.models.models_db import AtividadeDB, EventoDB, UsuarioDB
from app.schemas import AtividadeCreate, AtividadeRead

router = APIRouter(prefix="/atividades", tags=["Atividades"])


@router.post("/", response_model=AtividadeRead)
async def criar_atividade(
    dados: AtividadeCreate, session: AsyncSession = Depends(get_session)
):
    evento = await session.get(EventoDB, dados.evento_id)
    if not evento:
        raise HTTPException(status_code=404, detail="Evento não encontrado")

    if dados.palestrante_id is not None:
        palestrante = await session.get(UsuarioDB, dados.palestrante_id)
        if not palestrante or palestrante.tipo != "palestrante":
            raise HTTPException(
                status_code=422, detail="palestrante_id não corresponde a um Palestrante"
            )

    atividade = AtividadeDB(**dados.model_dump())
    session.add(atividade)
    await session.commit()
    await session.refresh(atividade)
    return atividade


@router.get("/", response_model=list[AtividadeRead])
async def listar_atividades(
    evento_id: int | None = None, session: AsyncSession = Depends(get_session)
):
    query = select(AtividadeDB)
    if evento_id:
        query = query.where(AtividadeDB.evento_id == evento_id)
    result = await session.exec(query)
    return result.all()


@router.get("/{atividade_id}", response_model=AtividadeRead)
async def obter_atividade(
    atividade_id: int, session: AsyncSession = Depends(get_session)
):
    atividade = await session.get(AtividadeDB, atividade_id)
    if not atividade:
        raise HTTPException(status_code=404, detail="Atividade não encontrada")
    return atividade


@router.delete("/{atividade_id}")
async def deletar_atividade(
    atividade_id: int, session: AsyncSession = Depends(get_session)
):
    atividade = await session.get(AtividadeDB, atividade_id)
    if not atividade:
        raise HTTPException(status_code=404, detail="Atividade não encontrada")
    await session.delete(atividade)
    await session.commit()
    return {"ok": True}