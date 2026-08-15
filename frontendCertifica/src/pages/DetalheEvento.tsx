import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { eventos as eventosApi, inscricoes as inscricoesApi, obterToken } from "../services/api"
import type { Evento } from "../types"
import { useAuth } from "../hooks/useAuth"
import Badge from "../components/Badge"
import Alerta from "../components/Alerta"
import { formatarData } from "../utils/data"
import { mensagemErro } from "../utils/erro"
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  Percent, 
  CheckCircle2, 
  Info,
  CalendarCheck
} from "lucide-react"

export default function DetalheEvento() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { usuario } = useAuth()

  const [evento, setEvento] = useState<Evento | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [mensagem, setMensagem] = useState<string | null>(null)
  const [jaInscrito, setJaInscrito] = useState(false)
  const [inscrevendo, setInscrevendo] = useState(false)

  useEffect(() => {
    if (!id) return
    const eventoId = Number(id)

    eventosApi
      .detalhe(eventoId)
      .then(setEvento)
      .catch((e) => setErro(mensagemErro(e)))
      .finally(() => setCarregando(false))

    if (usuario?.tipo === "participante") {
      inscricoesApi.minhas(obterToken()).then((lista) => {
        setJaInscrito(lista.some((i) => i.evento_id === eventoId))
      })
    }
  }, [id, usuario])

  async function inscrever() {
    if (!evento) return
    setInscrevendo(true)
    setErro(null)
    setMensagem(null)
    try {
      await inscricoesApi.inscrever(obterToken(), evento.id)
      setJaInscrito(true)
      setMensagem("Inscrição confirmada com sucesso no evento!")
    } catch (e) {
      setErro(mensagemErro(e))
    } finally {
      setInscrevendo(false)
    }
  }

  if (carregando) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-pulse space-y-4">
        <div className="h-6 bg-slate-200 rounded w-24" />
        <div className="h-64 bg-white rounded-2xl border border-slate-200" />
      </div>
    )
  }

  if (erro && !evento) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Alerta tipo="erro">{erro}</Alerta>
      </div>
    )
  }

  if (!evento) return null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Botão de Voltar */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1B4332] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para eventos</span>
      </button>

      {/* Card Principal do Evento */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        
        {/* Topo com Título e Status */}
        <div className="p-6 md:p-8 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1B4332]">
              {evento.nome}
            </h1>
            <div className="shrink-0">
              <Badge texto={evento.status} />
            </div>
          </div>
          <p className="mt-4 text-sm md:text-base text-slate-600 leading-relaxed">
            {evento.descricao}
          </p>
        </div>

        {/* Grid com Informações e Metadados */}
        <div className="p-6 md:p-8 bg-[#F4F7F5]/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-4 rounded-xl border border-slate-200/70 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-[#1B4332]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Data
              </span>
              <span className="text-sm font-semibold text-slate-800">
                {formatarData(evento.data)}
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/70 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-[#1B4332]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Local
              </span>
              <span className="text-sm font-semibold text-slate-800">
                {evento.local}
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/70 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-[#1B4332]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Carga Horária
              </span>
              <span className="text-sm font-semibold text-slate-800">
                {evento.carga_horaria} horas
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/70 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-[#1B4332]">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Presença Mínima
              </span>
              <span className="text-sm font-semibold text-slate-800">
                {evento.percentual_minimo}%
              </span>
            </div>
          </div>
        </div>

        {/* Seção de Feedback e Ação de Inscrição */}
        <div className="p-6 md:p-8 space-y-4">
          {mensagem && <Alerta tipo="sucesso">{mensagem}</Alerta>}
          {erro && <Alerta tipo="erro">{erro}</Alerta>}

          <div className="pt-2">
            {!usuario && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 text-xs text-amber-900">
                  <Info className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Você precisa estar autenticado para garantir sua vaga neste evento.</span>
                </div>
                <button
                  onClick={() => navigate("/login", { state: { de: `/eventos/${evento.id}` } })}
                  className="px-4 py-2 bg-[#1B4332] text-white text-xs font-semibold rounded-lg hover:bg-[#143326] transition-all shrink-0 cursor-pointer"
                >
                  Entrar na conta
                </button>
              </div>
            )}

            {usuario?.tipo === "participante" && evento.status === "aberto" && !jaInscrito && (
              <button
                onClick={inscrever}
                disabled={inscrevendo}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#1B4332] hover:bg-[#143326] px-8 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-950/10 transition-all disabled:opacity-60 cursor-pointer"
              >
                {inscrevendo ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Confirmando inscrição...</span>
                  </>
                ) : (
                  <>
                    <CalendarCheck className="w-4 h-4" />
                    <span>Realizar Inscrição Gratuita</span>
                  </>
                )}
              </button>
            )}

            {usuario?.tipo === "participante" && jaInscrito && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Inscrição Confirmada
                  </h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Sua vaga está garantida. Compareça ao evento para registro de presença e emissão do certificado.
                  </p>
                </div>
              </div>
            )}

            {usuario?.tipo === "participante" && evento.status !== "aberto" && !jaInscrito && (
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600">
                Inscrições encerradas ou indisponíveis para este evento.
              </div>
            )}

            {usuario?.tipo === "organizador" && (
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-500" />
                <span>Organizadores gerenciam a lista de chamada e configurações pelo painel de controle.</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}