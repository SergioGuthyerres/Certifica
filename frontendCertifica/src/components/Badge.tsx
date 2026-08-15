const CORES: Record<string, { bg: string; dot: string }> = {
  aberto: {
    bg: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    dot: "bg-emerald-500",
  },
  rascunho: {
    bg: "bg-amber-50 text-amber-800 border-amber-200/80",
    dot: "bg-amber-500",
  },
  encerrado: {
    bg: "bg-slate-100 text-slate-700 border-slate-200/80",
    dot: "bg-slate-400",
  },
  confirmado: {
    bg: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    dot: "bg-emerald-500",
  },
  inscrito: {
    bg: "bg-sky-50 text-sky-800 border-sky-200/80",
    dot: "bg-sky-500",
  },
  presente: {
    bg: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    dot: "bg-emerald-500",
  },
  ausente: {
    bg: "bg-rose-50 text-rose-800 border-rose-200/80",
    dot: "bg-rose-500",
  },
}

export default function Badge({ texto, tom }: { texto: string; tom?: string }) {
  const chave = (tom ?? texto).toLowerCase().replace(/\s+/g, "_")
  const config = CORES[chave] ?? {
    bg: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-400",
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-2xs ${config.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{texto.replace("_", " ")}</span>
    </span>
  )
}