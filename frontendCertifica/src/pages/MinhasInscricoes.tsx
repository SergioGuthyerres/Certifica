import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { inscricoes as inscricoesApi, obterToken } from "../services/api"
import type { MinhaInscricao } from "../types"
import Alerta from "../components/Alerta"
import { formatarData } from "../utils/data"
import { mensagemErro } from "../utils/erro"
import {
  CalendarDays,
  Award,
  Clock,
  CheckCircle2,
  Hourglass,
  ExternalLink,
  Inbox,
  Search,
  BookOpen
} from "lucide-react"

export default function MinhasInscricoes() {
  const [lista, setLista] = useState<MinhaInscricao[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [busca, setBusca] = useState("")

  useEffect(() => {
    inscricoesApi
      .minhas(obterToken())
      .then((dados) => setLista(dados))
      .catch((e) => setErro(mensagemErro(e)))
      .finally(() => setCarregando(false))
  }, [])

  const inscricoesFiltradas = lista.filter((item) =>
    item.nome_evento.toLowerCase().includes(busca.toLowerCase())
  )

  const eventosConcluidos = lista.filter((i) => i.presente).length

  return (
    <div className="flex min-h-[calc(100vh-65px)] bg-[#F4F7F5]">
      {/* Sidebar do Participante */}
      <aside className="w-64 bg-[#1B4332] text-white flex flex-col justify-between shrink-0 hidden md:flex p-4">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-wider block">CERTIFICA</span>
              <span className="text-[10px] text-emerald-200/70 block uppercase font-medium">Área do Aluno</span>
            </div>
          </div>

          <nav className="space-y-1">
            <Link
              to="/minhas-inscricoes"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#4E9F76] text-white shadow-sm transition-all text-left"
            >
              <CalendarDays className="w-4 h-4 text-white" />
              <span>Minhas Inscrições</span>
            </Link>

            <Link
              to="/certificados"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-emerald-100/70 hover:bg-[#245943] hover:text-white transition-all text-left"
            >
              <Award className="w-4 h-4 text-emerald-400/80" />
              <span>Meus Certificados</span>
            </Link>

            <Link
              to="/"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-emerald-100/70 hover:bg-[#245943] hover:text-white transition-all text-left"
            >
              <BookOpen className="w-4 h-4 text-emerald-400/80" />
              <span>Catálogo de Eventos</span>
            </Link>
          </nav>
        </div>

        {/* Card de Resumo */}
        <div className="p-4 rounded-xl bg-[#245943]/60 border border-emerald-700/50">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Presenças Validadas</span>
          </div>
          <div className="text-2xl font-bold text-white">{eventosConcluidos}</div>
          <p className="text-[11px] text-emerald-200/70 mt-0.5">
            de {lista.length} evento(s) inscrito(s).
          </p>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-6 md:p-8 space-y-6 overflow-x-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1B4332]">Minhas Inscrições</h1>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              Acompanhe os eventos em que você está matriculado e o status da sua presença
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white text-xs font-semibold shadow-md shadow-emerald-950/10 transition-all shrink-0"
          >
            <span>Ver Novos Eventos</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Barra de Busca */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome do evento..."
              className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] focus:outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {erro && <Alerta tipo="erro">{erro}</Alerta>}

        {/* Tabela de Inscrições */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-6">ID</th>
                  <th className="py-3.5 px-6">Nome do Evento</th>
                  <th className="py-3.5 px-6">Data</th>
                  <th className="py-3.5 px-6 text-center">Status</th>
                  <th className="py-3.5 px-6 text-center">Presença</th>
                  <th className="py-3.5 px-6 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {carregando && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Carregando suas inscrições...
                    </td>
                  </tr>
                )}

                {!carregando && inscricoesFiltradas.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Inbox className="w-8 h-8 text-slate-300" />
                        <span>Nenhuma inscrição encontrada.</span>
                      </div>
                    </td>
                  </tr>
                )}

                {!carregando &&
                  inscricoesFiltradas.map((item) => (
                    <tr key={item.inscricao_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-mono text-[11px] text-slate-400 font-medium">
                        INS-{String(item.inscricao_id).padStart(3, "0")}
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-800 max-w-xs">
                        {item.nome_evento}
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {formatarData(item.data_evento)}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        {item.presente ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Confirmada</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                            <Hourglass className="w-3 h-3" />
                            <span>Pendente</span>
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          to={`/eventos/${item.evento_id}`}
                          className="font-semibold text-[#1B4332] hover:text-[#143326] hover:underline"
                        >
                          Ver detalhes
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}