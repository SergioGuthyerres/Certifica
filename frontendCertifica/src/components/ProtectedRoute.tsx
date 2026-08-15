import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import type { TipoUsuario } from "../types"
import type { ReactNode } from "react"
import { Award } from "lucide-react"

export default function ProtectedRoute({
  tipo,
  children,
}: {
  tipo?: TipoUsuario
  children: ReactNode
}) {
  const { usuario, carregando } = useAuth()

  if (carregando) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F4F7F5] p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#1B4332] flex items-center justify-center text-emerald-400 shadow-md animate-pulse">
            <Award className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1B4332]">
            <div className="w-3.5 h-3.5 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
            <span>Verificando autenticação...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!usuario) return <Navigate to="/login" replace />
  if (tipo && usuario.tipo !== tipo) return <Navigate to="/" replace />

  return <>{children}</>
}