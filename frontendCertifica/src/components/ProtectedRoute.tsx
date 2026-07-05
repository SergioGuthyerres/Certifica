import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import type { TipoUsuario } from "../types"
import type { ReactNode } from "react"

export default function ProtectedRoute({ tipo, children }: { tipo?: TipoUsuario; children: ReactNode }) {
  const { usuario, carregando } = useAuth()

  if (carregando) return <p className="text-slate-500">Carregando...</p>
  if (!usuario) return <Navigate to="/login" replace />
  if (tipo && usuario.tipo !== tipo) return <Navigate to="/" replace />

  return <>{children}</>
}
