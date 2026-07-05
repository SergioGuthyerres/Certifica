import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import Alerta from "../components/Alerta"
import { mensagemErro } from "../utils/erro"
import type { TipoUsuario } from "../types"

export default function Cadastro() {
  const { cadastrar } = useAuth()
  const navigate = useNavigate()

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [tipo, setTipo] = useState<TipoUsuario>("participante")
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function aoEnviar(evento: FormEvent) {
    evento.preventDefault()
    setErro(null)
    setEnviando(true)
    try {
      await cadastrar(nome, email, senha, tipo)
      navigate("/", { replace: true })
    } catch (e) {
      setErro(mensagemErro(e))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Criar conta</h1>

      <form onSubmit={aoEnviar} className="space-y-4">
        {erro && <Alerta tipo="erro">{erro}</Alerta>}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
          <input
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Seu nome completo"
          />
        </div>

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
            minLength={6}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de conta</label>
          <div className="flex gap-3">
            {(["participante", "organizador"] as TipoUsuario[]).map((opcao) => (
              <label
                key={opcao}
                className={`flex-1 cursor-pointer rounded-md border px-3 py-2 text-sm text-center capitalize ${
                  tipo === opcao ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-300 text-slate-600"
                }`}
              >
                <input type="radio" name="tipo" value={opcao} checked={tipo === opcao} onChange={() => setTipo(opcao)} className="sr-only" />
                {opcao}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {enviando ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-500">
        Já tem conta?{" "}
        <Link to="/login" className="text-indigo-600 font-medium">
          Entrar
        </Link>
      </p>
    </div>
  )
}
