import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { eventos as eventosApi, inscricoes as inscricoesApi, obterToken } from "../../services/api"
import type { Evento, Inscrito } from "../../types"
import Alerta from "../../components/Alerta"
import { formatarData } from "../../utils/data"
import { mensagemErro } from "../../utils/erro"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Percent,
  Users,
  CheckCircle2,
  Lock,
  PlayCircle,
  Award,
  Search,
  Inbox,
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  Settings
} from "lucide-react"

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
  const [busca, setBusca] = useState("")

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
          ? `Evento encerrado com sucesso! ${resposta.certificados_gerados ?? 0} certificado(s) gerado(s).`
          : "Inscrições abertas com sucesso.",
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
        lista.map((i) =>
          i.inscricao_id === inscricaoId
            ? { ...i, presente: !presenteAtual, status: "confirmado" }
            : i
        )
      )
    } catch (e) {
      setErro(mensagemErro(e))
    }
  }

  if (carregando) {
    return (
      <div className="flex min-h-[calc(100vh-65px)] bg-[#F4F7F5] p-8 items-center justify-center">
        <div className="text-slate-500 text-sm flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
          <span>Carregando dados do evento...</span>
        </div>
      </div>
    )
  }

  if (erro && !evento) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <Alerta tipo="erro">{erro}</Alerta>
      </div>
    )
  }

  if (!evento) return null

  const presentesContagem = inscritos.filter((i) => i.presente).length
  const inscritosFiltrados = inscritos.filter(
    (i) =>
      i.nome.toLowerCase().includes(busca.toLowerCase()) ||
      i.email.toLowerCase().includes(busca.toLowerCase())
  )

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
            <Link
              to="/organizador"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#4E9F76] text-white shadow-sm transition-all text-left"
            >
              <CalendarDays className="w-4 h-4 text-white" />
              <span>Eventos</span>
            </Link>

            <button
              type="button"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-emerald-100/70 hover:bg-[#245943] hover:text-white transition-all text-left cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400/80" />
              <span>Dashboard</span>
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
        {/* Botão de Voltar */}
        <button
          onClick={() => navigate("/organizador")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1B4332] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao painel de eventos</span>
        </button>

        {/* Topo do Evento e Ações de Ciclo de Vida */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-[#1B4332]">{evento.nome}</h1>
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
            </div>
            <p className="text-xs md:text-sm text-slate-500 mt-1">{evento.descricao}</p>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center gap-2.5 shrink-0">
            {evento.status === "rascunho" && (
              <button
                onClick={() => mudarStatus("aberto")}
                disabled={processando}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-xs font-semibold shadow-sm transition-all disabled:opacity-60 cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                <span>{processando ? "Abrindo..." : "Abrir Inscrições"}</span>
              </button>
            )}

            {evento.status === "aberto" && (
              <button
                onClick={() => mudarStatus("encerrado")}
                disabled={processando}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 text-xs font-semibold shadow-sm transition-all disabled:opacity-60 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>{processando ? "Encerrando..." : "Encerrar e Emitir Certificados"}</span>
              </button>
            )}
          </div>
        </div>

        {mensagem && <Alerta tipo="sucesso">{mensagem}</Alerta>}
        {erro && <Alerta tipo="erro">{erro}</Alerta>}

        {/* Metadados e Indicadores */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/70 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-[#1B4332]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Data</span>
              <span className="text-xs md:text-sm font-semibold text-slate-800">{formatarData(evento.data)}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/70 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-[#1B4332]">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Local</span>
              <span className="text-xs md:text-sm font-semibold text-slate-800 truncate block max-w-[130px]">{evento.local}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/70 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-[#1B4332]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Carga Horária</span>
              <span className="text-xs md:text-sm font-semibold text-slate-800">{evento.carga_horaria} horas</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/70 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-[#1B4332]">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Presença Mínima</span>
              <span className="text-xs md:text-sm font-semibold text-slate-800">{evento.percentual_minimo}%</span>
            </div>
          </div>
        </div>

        {/* Gerenciamento da Lista de Presença */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#1B4332]">
                Lista de Inscritos e Presença ({inscritos.length})
              </h2>
              <p className="text-xs text-slate-500">
                {presentesContagem} participante(s) com presença confirmada.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por participante..."
                className="w-full rounded-xl bg-white border border-slate-200 pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] focus:outline-none transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Tabela de Inscritos */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3.5 px-6">Nome</th>
                    <th className="py-3.5 px-6">E-mail</th>
                    <th className="py-3.5 px-6 text-center">Status</th>
                    <th className="py-3.5 px-6 text-right">Controle de Presença</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {inscritosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Inbox className="w-7 h-7 text-slate-300" />
                          <span>Nenhum participante encontrado.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    inscritosFiltrados.map((inscrito) => (
                      <tr key={inscrito.inscricao_id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6 font-semibold text-slate-800">
                          {inscrito.nome}
                        </td>
                        <td className="py-4 px-6 text-slate-500 font-mono text-[11px]">
                          {inscrito.email}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                            {inscrito.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={inscrito.presente}
                              disabled={evento.status !== "aberto"}
                              onChange={() => alternarPresenca(inscrito.inscricao_id, inscrito.presente)}
                              className="h-4 w-4 rounded border-slate-300 text-[#1B4332] focus:ring-[#1B4332] accent-[#1B4332] disabled:opacity-40 cursor-pointer"
                            />
                            <span
                              className={`text-xs font-semibold ${
                                inscrito.presente ? "text-emerald-700" : "text-slate-400"
                              }`}
                            >
                              {inscrito.presente ? "Presente" : "Ausente"}
                            </span>
                          </label>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}