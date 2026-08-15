import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import Alerta from "../components/Alerta"
import { mensagemErro } from "../utils/erro"
import { Award, Mail, Lock, CheckCircle2 } from "lucide-react"

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
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#F4F7F5]">
      {/* Coluna Esquerda: Branding Institucional */}
      <div className="w-full md:w-5/12 bg-[#1B4332] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
        {/* Efeito decorativo de fundo */}
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#245943]/40 pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-64 h-64 rounded-full bg-[#245943]/30 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-wider">CERTIFICA</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-serif font-semibold leading-tight mb-4">
            Certificação que transforma trajetórias acadêmicas.
          </h1>
          <p className="text-emerald-100/80 text-sm leading-relaxed mb-10 max-w-sm">
            Acesse sua conta para gerenciar eventos, registrar presenças e emitir certificados com validade institucional.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-xs text-emerald-100/90 leading-snug">
                Certificados com validação pública por QR Code e UUID
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-xs text-emerald-100/90 leading-snug">
                Gestão completa de eventos e participantes
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-xs text-emerald-100/90 leading-snug">
                Emissão automática após confirmação de presença
              </span>
            </div>
          </div>
        </div>

        {/* Informações de Apoio do Protótipo */}
        <div className="relative z-10 pt-6 border-t border-emerald-800/60 mt-8">
          <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider mb-2">
            Contas de teste (Mock):
          </p>
          <div className="space-y-1 text-xs text-emerald-100/80">
            <p>
              <strong className="text-white">Organizador:</strong> organizador@certifica.com | 123456
            </p>
            <p>
              <strong className="text-white">Participante:</strong> participante@certifica.com | 123456
            </p>
          </div>
        </div>
      </div>

      {/* Coluna Direita: Formulário de Login */}
      <div className="w-full md:w-7/12 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#1B4332]">Bem-vindo de volta</h2>
            <p className="text-xs text-slate-500 mt-1">Acesse sua conta CERTIFICA para continuar.</p>
          </div>

          <form onSubmit={aoEnviar} className="space-y-4">
            {erro && <Alerta tipo="erro">{erro}</Alerta>}

            {/* Campo E-mail */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                E-mail
              </label>
              <div className="relative">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com.br"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] focus:outline-none transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Campo Senha com link Esqueceu a Senha */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Senha
                </label>
                <Link
                  to="/recuperar-senha"
                  className="text-xs font-medium text-emerald-700 hover:text-[#1B4332] hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <input
                  required
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] focus:outline-none transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={enviando}
              className="w-full rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white py-3 text-sm font-semibold shadow-md shadow-emerald-950/10 transition-all disabled:opacity-60 mt-2"
            >
              {enviando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Link para Cadastro */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Não tem uma conta?{" "}
            <Link to="/cadastro" className="font-semibold text-[#1B4332] hover:underline">
              Cadastre-se gratuitamente
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}