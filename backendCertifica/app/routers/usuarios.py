from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.dependencies import get_session
from app.models.models_db import UsuarioDB
from app.schemas import UsuarioCreate, UsuarioRead, UsuarioUpdate

router = APIRouter(prefix="/usuarios", tags=["Usuários"])

TIPOS_VALIDOS = {"participante", "organizador", "palestrante"}


@router.post("/", response_model=UsuarioRead)
async def criar_usuario(dados: UsuarioCreate, session: AsyncSession = Depends(get_session)):
    if dados.tipo not in TIPOS_VALIDOS:
        raise HTTPException(
            status_code=422,
            detail=f"tipo inválido. Use um de: {', '.join(TIPOS_VALIDOS)}",
        )
    if dados.tipo == "participante" and not dados.matricula:
        raise HTTPException(status_code=422, detail="Participante requer matrícula")

    usuario = UsuarioDB(**dados.model_dump())
    session.add(usuario)
    await session.commit()
    await session.refresh(usuario)
    return usuario


@router.get("/", response_model=list[UsuarioRead])
async def listar_usuarios(
    tipo: str | None = None, session: AsyncSession = Depends(get_session)
):
    query = select(UsuarioDB)
    if tipo:
        query = query.where(UsuarioDB.tipo == tipo)
    result = await session.exec(query)
    return result.all()


@router.get("/{usuario_id}", response_model=UsuarioRead)
async def obter_usuario(usuario_id: int, session: AsyncSession = Depends(get_session)):
    usuario = await session.get(UsuarioDB, usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return usuario


@router.put("/{usuario_id}", response_model=UsuarioRead)
async def atualizar_usuario(
    usuario_id: int, dados: UsuarioUpdate, session: AsyncSession = Depends(get_session)
):
    usuario = await session.get(UsuarioDB, usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    for campo, valor in dados.model_dump(exclude_unset=True).items():
        setattr(usuario, campo, valor)
    session.add(usuario)
    await session.commit()
    await session.refresh(usuario)
    return usuario


@router.delete("/{usuario_id}")
async def deletar_usuario(usuario_id: int, session: AsyncSession = Depends(get_session)):
    usuario = await session.get(UsuarioDB, usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    await session.delete(usuario)
    await session.commit()
    return {"ok": True}