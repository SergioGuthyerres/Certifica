import { Link } from "react-router-dom"
import type { Evento } from "../types"
import Badge from "./Badge"
import { formatarData } from "../utils/data"
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react"

export default function EventoCard({ evento }: { evento: Evento }) {
  return (
    <Link
      to={`/eventos/${evento.id}`}
      className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-md hover:border-emerald-300/80 transition-all duration-200"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-bold text-slate-800 text-base group-hover:text-[#1B4332] transition-colors line-clamp-2">
            {evento.nome}
          </h3>
          <div className="shrink-0">
            <Badge texto={evento.status} />
          </div>
        </div>

        {evento.descricao && (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {evento.descricao}
          </p>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 mt-2 space-y-3">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>{formatarData(evento.data)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="truncate max-w-[140px]">{evento.local}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>{evento.carga_horaria}h</span>
          </div>
        </div>

        <div className="flex items-center justify-end text-xs font-semibold text-[#1B4332] group-hover:translate-x-0.5 transition-transform">
          <span className="inline-flex items-center gap-1">
            Ver detalhes
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}