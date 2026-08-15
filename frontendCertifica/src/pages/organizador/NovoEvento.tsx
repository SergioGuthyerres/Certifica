import { useState } from "react"
import type { FormEvent } from "react"
import { useNavigate, Link } from "react-router-dom"
import { eventos as eventosApi, obterToken } from "../../services/api"
import Alerta from "../../components/Alerta"
import { mensagemErro } from "../../utils/erro"
import {
  ArrowLeft,
  CalendarPlus,
  Calendar,
  MapPin,
  Clock,
  Percent,
  FileText,
  Type,
  Award,
  CalendarDays,
  LayoutDashboard,
  Users,
  BarChart3,
  Settings
} from "lucide-react"

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

      {/* Conteúdo Principal do Formulário */}
      <main className="flex-1 p-6 md:p-8 space-y-6 max-w-4xl">
        {/* Botão de Voltar */}
        <button
          onClick={() => navigate("/organizador")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1B4332] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao painel de eventos</span>
        </button>

        {/* Card do Formulário */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1B4332] flex items-center justify-center">
              <CalendarPlus className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#1B4332]">Cadastrar Novo Evento</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                O evento será criado inicialmente como rascunho para você revisar antes de abrir as inscrições.
              </p>
            </div>
          </div>

          <form onSubmit={aoEnviar} className="space-y-5">
            {erro && <Alerta tipo="erro">{erro}</Alerta>}

            {/* Nome do Evento */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Nome do Evento
              </label>
              <div className="relative">
                <input
                  required
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: I Simpósio de Tecnologia e Inovação"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] focus:outline-none transition-all"
                />
                <Type className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Descrição e Programação
              </label>
              <div className="relative">
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={3}
                  placeholder="Detalhe o cronograma, palestrantes ou temas que serão abordados..."
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] focus:outline-none transition-all resize-none"
                />
                <FileText className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Data e Local */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Data de Realização
                </label>
                <div className="relative">
                  <input
                    required
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs md:text-sm text-slate-800 focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] focus:outline-none transition-all"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Local / Auditório
                </label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    value={local}
                    onChange={(e) => setLocal(e.target.value)}
                    placeholder="Ex: Auditório Principal ou Laboratório 2"
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] focus:outline-none transition-all"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Carga Horária e Presença Mínima */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Carga Horária (Horas)
                </label>
                <div className="relative">
                  <input
                    required
                    type="number"
                    min={1}
                    value={cargaHoraria}
                    onChange={(e) => setCargaHoraria(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs md:text-sm text-slate-800 focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] focus:outline-none transition-all"
                  />
                  <Clock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Presença Mínima Obrigatória (%)
                </label>
                <div className="relative">
                  <input
                    required
                    type="number"
                    min={1}
                    max={100}
                    value={percentualMinimo}
                    onChange={(e) => setPercentualMinimo(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs md:text-sm text-slate-800 focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] focus:outline-none transition-all"
                  />
                  <Percent className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Ações de Envio */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate("/organizador")}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={enviando}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1B4332] hover:bg-[#143326] px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-950/10 transition-all disabled:opacity-60 cursor-pointer"
              >
                {enviando ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Salvando evento...</span>
                  </>
                ) : (
                  <span>Criar Evento (Rascunho)</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}