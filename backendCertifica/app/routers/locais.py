from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.dependencies import get_session
from app.models.models_db import LocalDB
from app.schemas import LocalCreate, LocalRead

router = APIRouter(prefix="/locais", tags=["Locais"])


@router.post("/", response_model=LocalRead)
async def criar_local(dados: LocalCreate, session: AsyncSession = Depends(get_session)):
    local = LocalDB(**dados.model_dump())
    session.add(local)
    await session.commit()
    await session.refresh(local)
    return local


@router.get("/", response_model=list[LocalRead])
async def listar_locais(session: AsyncSession = Depends(get_session)):
    result = await session.exec(select(LocalDB))
    return result.all()


@router.get("/{local_id}", response_model=LocalRead)
async def obter_local(local_id: int, session: AsyncSession = Depends(get_session)):
    local = await session.get(LocalDB, local_id)
    if not local:
        raise HTTPException(status_code=404, detail="Local não encontrado")
    return local


@router.delete("/{local_id}")
async def deletar_local(local_id: int, session: AsyncSession = Depends(get_session)):
    local = await session.get(LocalDB, local_id)
    if not local:
        raise HTTPException(status_code=404, detail="Local não encontrado")
    await session.delete(local)
    await session.commit()
    return {"ok": True}