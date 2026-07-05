import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { eventos as eventosApi, obterToken } from "../../services/api"
import type { Evento } from "../../types"
import Badge from "../../components/Badge"
import Alerta from "../../components/Alerta"
import { formatarData } from "../../utils/data"
import { mensagemErro } from "../../utils/erro"

export default function OrganizadorDashboard() {
  const [lista, setLista] = useState<Evento[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    eventosApi
      .meus(obterToken())
      .then(setLista)
      .catch((e) => setErro(mensagemErro(e)))
      .finally(() => setCarregando(false))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Painel do organizador</h1>
          <p className="text-slate-500">Gerencie seus eventos, inscritos e presença.</p>
        </div>
        <Link
          to="/organizador/eventos/novo"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          + Novo evento
        </Link>
      </div>

      {erro && <Alerta tipo="erro">{erro}</Alerta>}
      {carregando && <p className="text-slate-500">Carregando...</p>}
      {!carregando && lista.length === 0 && !erro && <p className="text-slate-500">Você ainda não criou nenhum evento.</p>}

      <div className="space-y-3">
        {lista.map((evento) => (
          <Link
            key={evento.id}
            to={`/organizador/eventos/${evento.id}`}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-indigo-300"
          >
            <div>
              <p className="font-medium text-slate-800">{evento.nome}</p>
              <p className="text-sm text-slate-500">
                {formatarData(evento.data)} · {evento.local} · {evento.carga_horaria}h
              </p>
            </div>
            <Badge texto={evento.status} />
          </Link>
        ))}
      </div>
    </div>
  )
}
