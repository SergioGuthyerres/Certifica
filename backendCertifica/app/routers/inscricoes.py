from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.dependencies import get_session
from app.models.models_db import EventoDB, InscricaoDB, UsuarioDB
from app.schemas import FrequenciaAdd, InscricaoCreate, InscricaoRead

router = APIRouter(prefix="/inscricoes", tags=["Inscrições"])

PERCENTUAL_APROVACAO = 0.75


@router.post("/", response_model=InscricaoRead)
async def criar_inscricao(
    dados: InscricaoCreate, session: AsyncSession = Depends(get_session)
):
    participante = await session.get(UsuarioDB, dados.participante_id)
    if not participante or participante.tipo != "participante":
        raise HTTPException(
            status_code=422, detail="participante_id não corresponde a um Participante"
        )

    evento = await session.get(EventoDB, dados.evento_id)
    if not evento:
        raise HTTPException(status_code=404, detail="Evento não encontrado")

    #evita inscrição duplicada do mesmo participante no mesmo evento
    existente = await session.exec(
        select(InscricaoDB).where(
            InscricaoDB.participante_id == dados.participante_id,
            InscricaoDB.evento_id == dados.evento_id,
        )
    )
    if existente.first():
        raise HTTPException(
            status_code=409, detail="Participante já inscrito neste evento"
        )

    inscricao = InscricaoDB(**dados.model_dump())
    session.add(inscricao)
    await session.commit()
    await session.refresh(inscricao)
    return inscricao


@router.get("/", response_model=list[InscricaoRead])
async def listar_inscricoes(
    evento_id: int | None = None,
    participante_id: int | None = None,
    session: AsyncSession = Depends(get_session),
):
    query = select(InscricaoDB)
    if evento_id:
        query = query.where(InscricaoDB.evento_id == evento_id)
    if participante_id:
        query = query.where(InscricaoDB.participante_id == participante_id)
    result = await session.exec(query)
    return result.all()


@router.get("/{inscricao_id}", response_model=InscricaoRead)
async def obter_inscricao(
    inscricao_id: int, session: AsyncSession = Depends(get_session)
):
    inscricao = await session.get(InscricaoDB, inscricao_id)
    if not inscricao:
        raise HTTPException(status_code=404, detail="Inscrição não encontrada")
    return inscricao


@router.post("/{inscricao_id}/frequencia", response_model=InscricaoRead)
async def registrar_frequencia(
    inscricao_id: int,
    dados: FrequenciaAdd,
    session: AsyncSession = Depends(get_session),
):

    inscricao = await session.get(InscricaoDB, inscricao_id)
    if not inscricao:
        raise HTTPException(status_code=404, detail="Inscrição não encontrada")

    if dados.horas < 0:
        raise HTTPException(
            status_code=422, detail="A frequência não pode ser um valor negativo."
        )

    evento = await session.get(EventoDB, inscricao.evento_id)

    if inscricao.frequencia_horas + dados.horas > evento.carga_horaria:
        raise HTTPException(
            status_code=422,
            detail="A frequência acumulada excede a carga horária do evento.",
        )

    inscricao.frequencia_horas += dados.horas

    percentual = inscricao.frequencia_horas / evento.carga_horaria
    if percentual >= PERCENTUAL_APROVACAO:
        inscricao.aprovado = True

    session.add(inscricao)
    await session.commit()
    await session.refresh(inscricao)
    return inscricao