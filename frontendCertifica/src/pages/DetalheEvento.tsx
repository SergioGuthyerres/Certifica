import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { eventos as eventosApi, inscricoes as inscricoesApi, obterToken } from "../services/api"
import type { Evento } from "../types"
import { useAuth } from "../hooks/useAuth"
import Badge from "../components/Badge"
import Alerta from "../components/Alerta"
import { formatarData } from "../utils/data"
import { mensagemErro } from "../utils/erro"

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
      setMensagem("Inscrição realizada com sucesso!")
    } catch (e) {
      setErro(mensagemErro(e))
    } finally {
      setInscrevendo(false)
    }
  }

  if (carregando) return <p className="text-slate-500">Carregando...</p>
  if (erro && !evento) return <Alerta tipo="erro">{erro}</Alerta>
  if (!evento) return null

  return (
    <div className="mx-auto max-w-2xl">
      <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-slate-700 mb-4">
        ← Voltar
      </button>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-800">{evento.nome}</h1>
          <Badge texto={evento.status} />
        </div>

        <p className="mt-3 text-slate-600">{evento.descricao}</p>

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-slate-400">Data</dt>
            <dd className="text-slate-700 font-medium">{formatarData(evento.data)}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Local</dt>
            <dd className="text-slate-700 font-medium">{evento.local}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Carga horária</dt>
            <dd className="text-slate-700 font-medium">{evento.carga_horaria}h</dd>
          </div>
          <div>
            <dt className="text-slate-400">Presença mínima</dt>
            <dd className="text-slate-700 font-medium">{evento.percentual_minimo}%</dd>
          </div>
        </dl>

        {mensagem && (
          <div className="mt-6">
            <Alerta tipo="sucesso">{mensagem}</Alerta>
          </div>
        )}
        {erro && (
          <div className="mt-6">
            <Alerta tipo="erro">{erro}</Alerta>
          </div>
        )}

        <div className="mt-6">
          {!usuario && (
            <p className="text-sm text-slate-500">
              <button onClick={() => navigate("/login", { state: { de: `/eventos/${evento.id}` } })} className="text-indigo-600 font-medium">
                Entre
              </button>{" "}
              para se inscrever neste evento.
            </p>
          )}

          {usuario?.tipo === "participante" && evento.status === "aberto" && !jaInscrito && (
            <button
              onClick={inscrever}
              disabled={inscrevendo}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {inscrevendo ? "Inscrevendo..." : "Inscrever-se"}
            </button>
          )}

          {usuario?.tipo === "participante" && jaInscrito && <Badge texto="Você já está inscrito" tom="confirmado" />}

          {usuario?.tipo === "participante" && evento.status !== "aberto" && !jaInscrito && (
            <p className="text-sm text-slate-500">Inscrições fechadas para este evento.</p>
          )}

          {usuario?.tipo === "organizador" && (
            <p className="text-sm text-slate-500">Organizadores gerenciam este evento pelo painel do organizador.</p>
          )}
        </div>
      </div>
    </div>
  )
}
