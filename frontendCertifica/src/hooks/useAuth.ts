import { useContext } from "react"
import { AuthContext } from "../context/authContextBase"
import type { AuthContextValor } from "../context/authContextBase"

export function useAuth(): AuthContextValor {
  const contexto = useContext(AuthContext)
  if (!contexto) throw new Error("useAuth precisa ser usado dentro de um AuthProvider")
  return contexto
}
