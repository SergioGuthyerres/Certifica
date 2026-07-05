import { useState } from "react"
import type { FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { eventos as eventosApi, obterToken } from "../../services/api"
import Alerta from "../../components/Alerta"
import { mensagemErro } from "../../utils/erro"

export default function NovoEvento() {
  const navigate = useNavigate()

  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [data, setData] = useState("")
  const [local, setLocal] = useState("")
  const [cargaHoraria, setCargaHoraria] = useState(4)
  const [percentualMinimo, setPercentualMinimo] = useState(75)
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function aoEnviar(evento: FormEvent) {
    evento.preventDefault()
    setErro(null)
    setEnviando(true)
    try {
      const novoEvento = await eventosApi.criar(obterToken(), {
        nome,
        descricao,
        data,
        local,
        carga_horaria: cargaHoraria,
        percentual_minimo: percentualMinimo,
      })
      navigate(`/organizador/eventos/${novoEvento.id}`)
    } catch (e) {
      setErro(mensagemErro(e))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Criar novo evento</h1>

      <form onSubmit={aoEnviar} className="space-y-4">
        {erro && <Alerta tipo="erro">{erro}</Alerta>}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nome do evento</label>
          <input
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
            <input
              type="date"
              required
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Local</label>
            <input
              required
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Carga horária (h)</label>
            <input
              type="number"
              min={1}
              required
              value={cargaHoraria}
              onChange={(e) => setCargaHoraria(Number(e.target.value))}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Presença mínima (%)</label>
            <input
              type="number"
              min={1}
              max={100}
              required
              value={percentualMinimo}
              onChange={(e) => setPercentualMinimo(Number(e.target.value))}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {enviando ? "Criando..." : "Criar evento (como rascunho)"}
        </button>
      </form>
    </div>
  )
}
