from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.dependencies import get_session
from app.models.models_db import EventoDB
from app.schemas import EventoCreate, EventoRead, EventoUpdate

router = APIRouter(prefix="/eventos", tags=["Eventos"])


@router.post("/", response_model=EventoRead)
async def criar_evento(dados: EventoCreate, session: AsyncSession = Depends(get_session)):
    evento = EventoDB(**dados.model_dump())
    session.add(evento)
    await session.commit()
    await session.refresh(evento)
    return evento


@router.get("/", response_model=list[EventoRead])
async def listar_eventos(
    status: str | None = None, session: AsyncSession = Depends(get_session)
):
    query = select(EventoDB)
    if status:
        query = query.where(EventoDB.status == status)
    result = await session.exec(query)
    return result.all()


@router.get("/{evento_id}", response_model=EventoRead)
async def obter_evento(evento_id: int, session: AsyncSession = Depends(get_session)):
    evento = await session.get(EventoDB, evento_id)
    if not evento:
        raise HTTPException(status_code=404, detail="Evento não encontrado")
    return evento


@router.put("/{evento_id}", response_model=EventoRead)
async def atualizar_evento(
    evento_id: int, dados: EventoUpdate, session: AsyncSession = Depends(get_session)
):
    evento = await session.get(EventoDB, evento_id)
    if not evento:
        raise HTTPException(status_code=404, detail="Evento não encontrado")
    for campo, valor in dados.model_dump(exclude_unset=True).items():
        setattr(evento, campo, valor)
    session.add(evento)
    await session.commit()
    await session.refresh(evento)
    return evento


@router.delete("/{evento_id}")
async def deletar_evento(evento_id: int, session: AsyncSession = Depends(get_session)):
    evento = await session.get(EventoDB, evento_id)
    if not evento:
        raise HTTPException(status_code=404, detail="Evento não encontrado")
    await session.delete(evento)
    await session.commit()
    return {"ok": True}