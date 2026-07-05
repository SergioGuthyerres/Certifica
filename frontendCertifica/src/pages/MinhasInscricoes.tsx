import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { inscricoes as inscricoesApi, obterToken } from "../services/api"
import type { MinhaInscricao } from "../types"
import Badge from "../components/Badge"
import Alerta from "../components/Alerta"
import { formatarData } from "../utils/data"
import { mensagemErro } from "../utils/erro"

export default function MinhasInscricoes() {
  const [lista, setLista] = useState<MinhaInscricao[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    inscricoesApi
      .minhas(obterToken())
      .then(setLista)
      .catch((e) => setErro(mensagemErro(e)))
      .finally(() => setCarregando(false))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Minhas inscrições</h1>

      {erro && <Alerta tipo="erro">{erro}</Alerta>}
      {carregando && <p className="text-slate-500">Carregando...</p>}
      {!carregando && lista.length === 0 && !erro && (
        <p className="text-slate-500">
          Você ainda não se inscreveu em nenhum evento.{" "}
          <Link to="/" className="text-indigo-600 font-medium">
            Ver eventos disponíveis
          </Link>
        </p>
      )}

      <div className="space-y-3">
        {lista.map((inscricao) => (
          <Link
            key={inscricao.inscricao_id}
            to={`/eventos/${inscricao.evento_id}`}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-indigo-300"
          >
            <div>
              <p className="font-medium text-slate-800">{inscricao.nome_evento}</p>
              <p className="text-sm text-slate-500">{formatarData(inscricao.data_evento)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge texto={inscricao.status} />
              <Badge texto={inscricao.presente ? "presente" : "ausente"} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
