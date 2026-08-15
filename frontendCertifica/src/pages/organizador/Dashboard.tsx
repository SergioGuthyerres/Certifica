import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { eventos as eventosApi, obterToken } from "../../services/api"
import type { Evento } from "../../types"
import Alerta from "../../components/Alerta"
import { formatarData } from "../../utils/data"
import { mensagemErro } from "../../utils/erro"
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Award,
  BarChart3,
  Settings,
  Search,
  Plus,
  ChevronRight,
  Inbox
} from "lucide-react"

export default function OrganizadorDashboard() {
  const [lista, setLista] = useState<Evento[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState<"todos" | "aberto" | "rascunho" | "encerrado">("todos")

  useEffect(() => {
    eventosApi
      .meus(obterToken())
      .then(setLista)
      .catch((e) => setErro(mensagemErro(e)))
      .finally(() => setCarregando(false))
  }, [])

  const eventosFiltrados = lista.filter((evento) => {
    const correspondeBusca =
      evento.nome.toLowerCase().includes(busca.toLowerCase()) ||
      evento.local.toLowerCase().includes(busca.toLowerCase()) ||
      String(evento.id).includes(busca)

    const correspondeStatus =
      filtroStatus === "todos" ? true : evento.status === filtroStatus

    return correspondeBusca && correspondeStatus
  })

  return (
    <div className="flex min-h-[calc(100vh-65px)] bg-[#F4F7F5]">
      {/* Sidebar Verde Institucional */}
      <aside className="w-64 bg-[#1B4332] text-white flex flex-col justify-between shrink-0 hidden md:flex p-4">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-wider block">CERTIFICA</span>
              <span className="text-[10px] text-emerald-200/70 block uppercase font-medium">Gestor Acadêmico</span>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              type="button"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-emerald-100/70 hover:bg-[#245943] hover:text-white transition-all text-left cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400/80" />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#4E9F76] text-white shadow-sm transition-all text-left cursor-pointer"
            >
              <CalendarDays className="w-4 h-4 text-white" />
              <span>Eventos</span>
            </button>

            <button
              type="button"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-emerald-100/70 hover:bg-[#245943] hover:text-white transition-all text-left cursor-pointer"
            >
              <Users className="w-4 h-4 text-emerald-400/80" />
              <span>Participantes</span>
            </button>

            <button
              type="button"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-emerald-100/70 hover:bg-[#245943] hover:text-white transition-all text-left cursor-pointer"
            >
              <Award className="w-4 h-4 text-emerald-400/80" />
              <span>Certificados</span>
            </button>

            <button
              type="button"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-emerald-100/70 hover:bg-[#245943] hover:text-white transition-all text-left cursor-pointer"
            >
              <BarChart3 className="w-4 h-4 text-emerald-400/80" />
              <span>Relatórios</span>
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-emerald-800/60">
          <button
            type="button"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-emerald-100/70 hover:bg-[#245943] hover:text-white transition-all text-left cursor-pointer"
          >
            <Settings className="w-4 h-4 text-emerald-400/80" />
            <span>Configurações</span>
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-6 md:p-8 space-y-6 overflow-x-auto">
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1B4332]">Eventos</h1>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              Gerencie todos os eventos acadêmicos da instituição
            </p>
          </div>

          <Link
            to="/organizador/eventos/novo"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white text-xs font-semibold shadow-md shadow-emerald-950/10 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Evento</span>
          </Link>
        </div>

        {/* Barra de Filtros e Pesquisa */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome ou código..."
              className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] focus:outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
          </div>

          {/* Pílulas de Status */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {[
              { id: "todos", label: "Todos" },
              { id: "aberto", label: "Aberto" },
              { id: "rascunho", label: "Rascunho" },
              { id: "encerrado", label: "Encerrado" }
            ].map((filtro) => (
              <button
                key={filtro.id}
                onClick={() => setFiltroStatus(filtro.id as typeof filtroStatus)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  filtroStatus === filtro.id
                    ? "bg-[#1B4332] text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {filtro.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mensagem de Erro */}
        {erro && <Alerta tipo="erro">{erro}</Alerta>}

        {/* Tabela de Eventos */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-6">ID</th>
                  <th className="py-3.5 px-6">Nome do Evento</th>
                  <th className="py-3.5 px-6">Data</th>
                  <th className="py-3.5 px-6">Local</th>
                  <th className="py-3.5 px-6 text-center">Status</th>
                  <th className="py-3.5 px-6 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {carregando && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Carregando eventos...
                    </td>
                  </tr>
                )}

                {!carregando && eventosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Inbox className="w-8 h-8 text-slate-300" />
                        <span>Nenhum evento encontrado.</span>
                      </div>
                    </td>
                  </tr>
                )}

                {!carregando &&
                  eventosFiltrados.map((evento) => (
                    <tr key={evento.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-mono text-[11px] text-slate-400 font-medium">
                        EVT-{String(evento.id).padStart(3, "0")}
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-800 max-w-xs truncate">
                        {evento.nome}
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {formatarData(evento.data)}
                      </td>
                      <td className="py-4 px-6 text-slate-600 max-w-[180px] truncate">
                        {evento.local}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            evento.status === "aberto"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : evento.status === "rascunho"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {evento.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          to={`/organizador/eventos/${evento.id}`}
                          className="inline-flex items-center gap-1 font-semibold text-[#1B4332] hover:text-[#143326] hover:underline"
                        >
                          <span>Gerenciar</span>
                          <ChevronRight className="w-3.5 h-3.5" />
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