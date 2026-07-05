import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { eventos as eventosApi, inscricoes as inscricoesApi, obterToken } from "../../services/api"
import type { Evento, Inscrito } from "../../types"
import Badge from "../../components/Badge"
import Alerta from "../../components/Alerta"
import { formatarData } from "../../utils/data"
import { mensagemErro } from "../../utils/erro"

export default function GerenciarEvento() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const eventoId = Number(id)

  const [evento, setEvento] = useState<Evento | null>(null)
  const [inscritos, setInscritos] = useState<Inscrito[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [mensagem, setMensagem] = useState<string | null>(null)
  const [processando, setProcessando] = useState(false)

  function carregar(): Promise<void> {
    return Promise.all([eventosApi.detalhe(eventoId), eventosApi.inscritos(obterToken(), eventoId)])
      .then(([dadosEvento, listaInscritos]) => {
        setEvento(dadosEvento)
        setInscritos(listaInscritos)
      })
      .catch((e) => setErro(mensagemErro(e)))
      .finally(() => setCarregando(false))
  }

  useEffect(() => {
    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function mudarStatus(status: "aberto" | "encerrado") {
    setProcessando(true)
    setErro(null)
    setMensagem(null)
    try {
      const resposta = await eventosApi.mudarStatus(obterToken(), eventoId, status)
      setMensagem(
        status === "encerrado"
          ? `Evento encerrado. ${resposta.certificados_gerados ?? 0} certificado(s) gerado(s).`
          : "Inscrições abertas.",
      )
      await carregar()
    } catch (e) {
      setErro(mensagemErro(e))
    } finally {
      setProcessando(false)
    }
  }

  async function alternarPresenca(inscricaoId: number, presenteAtual: boolean) {
    setErro(null)
    try {
      await inscricoesApi.marcarPresenca(obterToken(), inscricaoId, !presenteAtual)
      setInscritos((lista) =>
        lista.map((i) => (i.inscricao_id === inscricaoId ? { ...i, presente: !presenteAtual, status: "confirmado" } : i)),
      )
    } catch (e) {
      setErro(mensagemErro(e))
    }
  }

  if (carregando) return <p className="text-slate-500">Carregando...</p>
  if (erro && !evento) return <Alerta tipo="erro">{erro}</Alerta>
  if (!evento) return null

  return (
    <div>
      <button onClick={() => navigate("/organizador")} className="text-sm text-slate-500 hover:text-slate-700 mb-4">
        ← Voltar ao painel
      </button>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-800">{evento.nome}</h1>
            <Badge texto={evento.status} />
          </div>
          <p className="text-slate-500 mt-1">
            {formatarData(evento.data)} · {evento.local} · {evento.carga_horaria}h · presença mínima {evento.percentual_minimo}%
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          {evento.status === "rascunho" && (
            <button
              onClick={() => mudarStatus("aberto")}
              disabled={processando}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              Abrir inscrições
            </button>
          )}
          {evento.status === "aberto" && (
            <button
              onClick={() => mudarStatus("encerrado")}
              disabled={processando}
              className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
            >
              Encerrar evento
            </button>
          )}
        </div>
      </div>

      {mensagem && <Alerta tipo="sucesso">{mensagem}</Alerta>}
      {erro && (
        <div className="mt-3">
          <Alerta tipo="erro">{erro}</Alerta>
        </div>
      )}

      <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-3">Inscritos ({inscritos.length})</h2>

      {inscritos.length === 0 ? (
        <p className="text-slate-500">Ninguém se inscreveu neste evento ainda.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Presença</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inscritos.map((inscrito) => (
                <tr key={inscrito.inscricao_id}>
                  <td className="px-4 py-3 text-slate-800">{inscrito.nome}</td>
                  <td className="px-4 py-3 text-slate-500">{inscrito.email}</td>
                  <td className="px-4 py-3">
                    <Badge texto={inscrito.status} />
                  </td>
                  <td className="px-4 py-3">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inscrito.presente}
                        disabled={evento.status !== "aberto"}
                        onChange={() => alternarPresenca(inscrito.inscricao_id, inscrito.presente)}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                      />
                      <span className="text-slate-600">{inscrito.presente ? "Presente" : "Ausente"}</span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
