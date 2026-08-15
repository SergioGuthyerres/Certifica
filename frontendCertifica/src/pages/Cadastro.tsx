import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import Alerta from "../components/Alerta"
import { mensagemErro } from "../utils/erro"
import type { TipoUsuario } from "../types"
import { User, Building2, CheckCircle2, Award, Mail, Lock } from "lucide-react"

export default function Cadastro() {
  const { cadastrar } = useAuth()
  const navigate = useNavigate()

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [tipo, setTipo] = useState<TipoUsuario>("participante")
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function aoEnviar(evento: FormEvent) {
    evento.preventDefault()
    setErro(null)

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.")
      return
    }

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
            Sua jornada acadêmica começa por aqui.
          </h1>
          <p className="text-emerald-100/80 text-sm leading-relaxed mb-10 max-w-sm">
            Crie sua conta gratuitamente e participe de eventos acadêmicos, obtenha certificados e acumule horas complementares.
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

        {/* Métricas de Rodapé */}
        <div className="relative z-10 pt-10 border-t border-emerald-800/60 mt-10 grid grid-cols-3 gap-4">
          <div>
            <div className="text-lg font-bold text-white">+4.800</div>
            <div className="text-[11px] text-emerald-200/70">Participantes</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">+3.900</div>
            <div className="text-[11px] text-emerald-200/70">Certificados</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">24</div>
            <div className="text-[11px] text-emerald-200/70">Eventos</div>
          </div>
        </div>
      </div>

      {/* Coluna Direita: Formulário de Cadastro */}
      <div className="w-full md:w-7/12 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#1B4332]">Criar Conta</h2>
            <p className="text-xs text-slate-500 mt-1">Preencha os dados abaixo para começar.</p>
          </div>

          <form onSubmit={aoEnviar} className="space-y-4">
            {erro && <Alerta tipo="erro">{erro}</Alerta>}

            {/* Seletor Tipo de Conta */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                Tipo de Conta
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTipo("participante")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    tipo === "participante"
                      ? "bg-[#1B4332] text-white border-[#1B4332] shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <User className={`w-5 h-5 mb-1 ${tipo === "participante" ? "text-emerald-400" : "text-slate-400"}`} />
                  <span className="text-xs font-semibold">Participante</span>
                  <span className={`text-[10px] ${tipo === "participante" ? "text-emerald-200/80" : "text-slate-400"}`}>
                    Aluno / Externo
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTipo("organizador")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    tipo === "organizador"
                      ? "bg-[#1B4332] text-white border-[#1B4332] shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <Building2 className={`w-5 h-5 mb-1 ${tipo === "organizador" ? "text-emerald-400" : "text-slate-400"}`} />
                  <span className="text-xs font-semibold">Organizador</span>
                  <span className={`text-[10px] ${tipo === "organizador" ? "text-emerald-200/80" : "text-slate-400"}`}>
                    Professor / Servidor
                  </span>

                </button>
                
              </div>
            </div>

            {/* Campo Nome */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Nome Completo
              </label>
              <input
                required
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] focus:outline-none transition-all"
              />
            </div>

            {/* Campo E-mail */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                {tipo === "organizador" ? "E-mail Institucional" : "E-mail"}
              </label>
              <div className="relative">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    tipo === "organizador"
                      ? "Insira o e-mail institucional"
                      : "Insira seu e-mail"
                  }
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] focus:outline-none transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Senha
              </label>
              <div className="relative">
                <input
                  required
                  type="password"
                  minLength={6}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] focus:outline-none transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Campo Confirmar Senha */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Confirmar Senha
              </label>
              <div className="relative">
                <input
                  required
                  type="password"
                  minLength={6}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="Repita a senha"
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
              {enviando ? "Criando conta..." : "Criar Conta"}
            </button>
          </form>

          {/* Link para Login */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Já tem uma conta?{" "}
            <Link to="/login" className="font-semibold text-[#1B4332] hover:underline">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}