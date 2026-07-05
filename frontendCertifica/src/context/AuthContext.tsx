import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { auth, definirToken, obterToken } from "../services/api"
import type { TipoUsuario, Usuario } from "../types"
import { AuthContext } from "./authContextBase"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const token = obterToken()
    const usuarioAtual = token ? auth.me(token) : Promise.resolve(null)

    usuarioAtual
      .then((encontrado) => {
        if (encontrado) setUsuario(encontrado)
      })
      .catch(() => definirToken(null))
      .finally(() => setCarregando(false))
  }, [])

  async function login(email: string, senha: string) {
    const resposta = await auth.login(email, senha)
    definirToken(resposta.token)
    setUsuario(resposta.usuario)
  }

  async function cadastrar(nome: string, email: string, senha: string, tipo: TipoUsuario) {
    await auth.cadastro(nome, email, senha, tipo)
    await login(email, senha)
  }

  function sair() {
    definirToken(null)
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, cadastrar, sair }}>{children}</AuthContext.Provider>
  )
}
