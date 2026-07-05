import type { ReactNode } from "react"

const ESTILOS: Record<"erro" | "sucesso" | "info", string> = {
  erro: "bg-rose-50 text-rose-700 border-rose-200",
  sucesso: "bg-emerald-50 text-emerald-700 border-emerald-200",
  info: "bg-sky-50 text-sky-700 border-sky-200",
}

export default function Alerta({ tipo, children }: { tipo: "erro" | "sucesso" | "info"; children: ReactNode }) {
  return <div className={`rounded-md border px-4 py-3 text-sm ${ESTILOS[tipo]}`}>{children}</div>
}
