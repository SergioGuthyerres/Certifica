from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.dependencies import get_session
from app.models.models_db import CertificadoDB, InscricaoDB
from app.schemas import CertificadoRead

router = APIRouter(prefix="/certificados", tags=["Certificados"])


@router.post("/inscricao/{inscricao_id}", response_model=CertificadoRead)
async def emitir_certificado(
    inscricao_id: int, session: AsyncSession = Depends(get_session)
):
    """
    Regra (equivalente ao domain.py):
    - só emite certificado se a inscrição estiver aprovada
    - código de validação gerado a partir da matrícula + prefixo do título do evento
    """
    inscricao = await session.get(InscricaoDB, inscricao_id)
    if not inscricao:
        raise HTTPException(status_code=404, detail="Inscrição não encontrada")

    if not inscricao.aprovado:
        raise HTTPException(
            status_code=422,
            detail="Certificado não pode ser gerado: Participante não aprovado.",
        )

    existente = await session.exec(
        select(CertificadoDB).where(CertificadoDB.inscricao_id == inscricao_id)
    )
    if existente.first():
        raise HTTPException(
            status_code=409, detail="Certificado já emitido para esta inscrição"
        )

    # carrega participante e evento para montar o código de validação
    await session.refresh(inscricao, attribute_names=["participante", "evento"])
    prefixo_evento = inscricao.evento.titulo[:3].upper()
    codigo = f"CERT-{inscricao.participante.matricula}-{prefixo_evento}"

    certificado = CertificadoDB(inscricao_id=inscricao_id, codigo_validacao=codigo)
    session.add(certificado)
    await session.commit()
    await session.refresh(certificado)
    return certificado


@router.get("/", response_model=list[CertificadoRead])
async def listar_certificados(session: AsyncSession = Depends(get_session)):
    result = await session.exec(select(CertificadoDB))
    return result.all()


@router.get("/validar/{codigo_validacao}", response_model=CertificadoRead)
async def validar_certificado(
    codigo_validacao: str, session: AsyncSession = Depends(get_session)
):
    result = await session.exec(
        select(CertificadoDB).where(CertificadoDB.codigo_validacao == codigo_validacao)
    )
    certificado = result.first()
    if not certificado:
        raise HTTPException(status_code=404, detail="Certificado não encontrado")
    return certificado