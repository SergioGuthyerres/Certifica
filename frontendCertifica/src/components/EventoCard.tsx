import { Link } from "react-router-dom"
import type { Evento } from "../types"
import Badge from "./Badge"
import { formatarData } from "../utils/data"

export default function EventoCard({ evento }: { evento: Evento }) {
  return (
    <Link
      to={`/eventos/${evento.id}`}
      className="block rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-slate-800">{evento.nome}</h3>
        <Badge texto={evento.status} />
      </div>
      <p className="mt-2 text-sm text-slate-500 line-clamp-2">{evento.descricao}</p>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        <span>📅 {formatarData(evento.data)}</span>
        <span>📍 {evento.local}</span>
        <span>⏱️ {evento.carga_horaria}h</span>
      </div>
    </Link>
  )
}
