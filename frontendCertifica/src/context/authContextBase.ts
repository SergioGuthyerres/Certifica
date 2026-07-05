import { createContext } from "react"
import type { TipoUsuario, Usuario } from "../types"

export interface AuthContextValor {
  usuario: Usuario | null
  carregando: boolean
  login: (email: string, senha: string) => Promise<void>
  cadastrar: (nome: string, email: string, senha: string, tipo: TipoUsuario) => Promise<void>
  sair: () => void
}

export const AuthContext = createContext<AuthContextValor | null>(null)
