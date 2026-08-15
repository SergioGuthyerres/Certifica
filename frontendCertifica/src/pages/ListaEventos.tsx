import { useEffect, useState } from "react"
import { eventos as eventosApi } from "../services/api"
import type { Evento } from "../types"
import EventoCard from "../components/EventoCard"
import Alerta from "../components/Alerta"
import { mensagemErro } from "../utils/erro"
import { CalendarDays, Sparkles, Inbox } from "lucide-react"

export default function ListaEventos() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    eventosApi
      .listar()
      .then(setEventos)
      .catch((e) => setErro(mensagemErro(e)))
      .finally(() => setCarregando(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner / Cabeçalho da Página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#1B4332] text-xs font-semibold mb-3 border border-emerald-100">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Oportunidades Acadêmicas</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1B4332]">
            Eventos Disponíveis
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Inscreva-se em palestras, semanas acadêmicas e workshops para emitir certificados com validação oficial e computar horas complementares.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F4F7F5] px-4 py-2.5 rounded-xl border border-slate-200 shrink-0">
          <CalendarDays className="w-5 h-5 text-[#1B4332]" />
          <span className="text-xs font-semibold text-slate-700">
            {carregando ? "Carregando..." : `${eventos.length} evento(s) listado(s)`}
          </span>
        </div>
      </div>

      {/* Alerta de Erro */}
      {erro && <Alerta tipo="erro">{erro}</Alerta>}

      {/* Skeleton de Carregamento */}
      {carregando && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white rounded-2xl border border-slate-200/70 p-6 space-y-4 animate-pulse shadow-sm"
            >
              <div className="h-5 bg-slate-200 rounded w-2/3" />
              <div className="space-y-2">
                <div className="h-3.5 bg-slate-100 rounded w-full" />
                <div className="h-3.5 bg-slate-100 rounded w-4/5" />
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between">
                <div className="h-4 bg-slate-200 rounded w-1/4" />
                <div className="h-8 bg-slate-200 rounded-lg w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Estado Vazio */}
      {!carregando && eventos.length === 0 && !erro && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            Nenhum evento com inscrições abertas
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Novos eventos acadêmicos serão disponibilizados em breve pela comissão organizadora.
          </p>
        </div>
      )}

      {/* Grid de Cards */}
      {!carregando && eventos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventos.map((evento) => (
            <EventoCard key={evento.id} evento={evento} />
          ))}
        </div>
      )}
    </div>
  )
}