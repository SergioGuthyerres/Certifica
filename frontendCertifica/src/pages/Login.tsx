import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import Alerta from "../components/Alerta"
import { mensagemErro } from "../utils/erro"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const localizacao = useLocation()

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function aoEnviar(evento: FormEvent) {
    evento.preventDefault()
    setErro(null)
    setEnviando(true)
    try {
      await login(email, senha)
      const destino = (localizacao.state as { de?: string } | null)?.de ?? "/"
      navigate(destino, { replace: true })
    } catch (e) {
      setErro(mensagemErro(e))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Entrar</h1>

      <form onSubmit={aoEnviar} className="space-y-4">
        {erro && <Alerta tipo="erro">{erro}</Alerta>}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="voce@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
          <input
            type="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-500">
        Não tem conta?{" "}
        <Link to="/cadastro" className="text-indigo-600 font-medium">
          Cadastre-se
        </Link>
      </p>

      <div className="mt-6 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
        <p className="font-semibold mb-1">Contas de exemplo (protótipo):</p>
        <p>Organizador: organizador@certifica.com / 123456</p>
        <p>Participante: participante@certifica.com / 123456</p>
      </div>
    </div>
  )
}
