const CORES: Record<string, string> = {
  aberto: "bg-emerald-100 text-emerald-700",
  rascunho: "bg-amber-100 text-amber-700",
  encerrado: "bg-slate-200 text-slate-600",
  confirmado: "bg-emerald-100 text-emerald-700",
  inscrito: "bg-sky-100 text-sky-700",
  presente: "bg-emerald-100 text-emerald-700",
  ausente: "bg-rose-100 text-rose-700",
}

export default function Badge({ texto, tom }: { texto: string; tom?: string }) {
  const classeCor = CORES[tom ?? texto.toLowerCase()] ?? "bg-slate-100 text-slate-600"
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${classeCor}`}>
      {texto}
    </span>
  )
}
