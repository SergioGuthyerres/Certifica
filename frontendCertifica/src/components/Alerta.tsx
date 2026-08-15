import type { ReactNode } from "react"
import { AlertCircle, CheckCircle2, Info } from "lucide-react"

type TipoAlerta = "erro" | "sucesso" | "info"

const CONFIG: Record<
  TipoAlerta,
  { container: string; icone: typeof AlertCircle; iconeClasse: string }
> = {
  erro: {
    container: "bg-rose-50 text-rose-800 border-rose-200/80",
    icone: AlertCircle,
    iconeClasse: "text-rose-600",
  },
  sucesso: {
    container: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    icone: CheckCircle2,
    iconeClasse: "text-emerald-600",
  },
  info: {
    container: "bg-sky-50 text-sky-800 border-sky-200/80",
    icone: Info,
    iconeClasse: "text-sky-600",
  },
}

export default function Alerta({
  tipo,
  children,
}: {
  tipo: TipoAlerta
  children: ReactNode
}) {
  const { container, icone: Icone, iconeClasse } = CONFIG[tipo]

  return (
    <div className={`flex items-start gap-3 rounded-xl border p-3.5 text-xs md:text-sm font-medium shadow-2xs ${container}`}>
      <Icone className={`w-4 h-4 shrink-0 mt-0.5 ${iconeClasse}`} />
      <div className="flex-1 leading-snug">{children}</div>
    </div>
  )
}