import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { validacao } from "../services/api"
import type { ValidacaoCertificado } from "../types"
import Alerta from "../components/Alerta"
import { mensagemErro } from "../utils/erro"
import { ShieldCheck, Search, CheckCircle2, XCircle, Calendar, Clock, Award, User } from "lucide-react"

export default function ValidarCertificado() {
  const { codigo: codigoDaUrl } = useParams<{ codigo?: string }>()
  const navigate = useNavigate()

  const [codigo, setCodigo] = useState(codigoDaUrl ?? "")
  const [resultado, setResultado] = useState<ValidacaoCertificado | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [consultando, setConsultando] = useState(false)

  function consultar(valor: string): void {
    Promise.resolve()
      .then(() => {
        setConsultando(true)
        setErro(null)
        setResultado(null)
        return validacao.validarCodigo(valor)
      })
      .then((resposta) => setResultado(resposta))
      .catch((e) => setErro(mensagemErro(e)))
      .finally(() => setConsultando(false))
  }

  useEffect(() => {
    if (codigoDaUrl) consultar(codigoDaUrl)
  }, [codigoDaUrl])

  function aoEnviar(evento: FormEvent) {
    evento.preventDefault()
    if (!codigo.trim()) return
    navigate(`/validar/${codigo.trim()}`)
  }

  return (
    <div className="min-h-[calc(100vh-130px)] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 md:p-10">
        
        {/* Cabeçalho do Card */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#1B4332] border border-emerald-100 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1B4332]">
            Validação Pública de Certificado
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Digite o código autenticador ou identificador UUID presente no rodapé do documento para atestar sua veracidade.
          </p>
        </div>

        {/* Formulário de Busca */}
        <form onSubmit={aoEnviar} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Código de Verificação (UUID)
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <input
                  required
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Ex: c1a8f9b2-3e4d-5f6a-7b8c-9d0e1f2a3b4c"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-4 pr-10 py-3 text-sm font-mono text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] focus:outline-none transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
              <button
                type="submit"
                disabled={consultando}
                className="rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white px-6 py-3 text-sm font-semibold shadow-md shadow-emerald-950/10 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                {consultando ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Validando...</span>
                  </>
                ) : (
                  <span>Validar Certificado</span>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Mensagem de Erro de Requisição */}
        {erro && (
          <div className="mt-6">
            <Alerta tipo="erro">{erro}</Alerta>
          </div>
        )}

        {/* Feedback / Resultado da Consulta */}
        {resultado && (
          <div className="mt-8 pt-6 border-t border-slate-100 animate-in fade-in duration-300">
            {resultado.valido ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6">
                <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-base mb-4 pb-3 border-b border-emerald-200/60">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Certificado Autêntico e Válido</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-2.5">
                    <User className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                        Participante
                      </span>
                      <span className="font-semibold text-emerald-950">
                        {resultado.nome_participante}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Award className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                        Evento
                      </span>
                      <span className="font-semibold text-emerald-950">
                        {resultado.nome_evento}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                        Data de Realização
                      </span>
                      <span className="text-emerald-900 font-medium">
                        {resultado.data_evento}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                        Carga Horária
                      </span>
                      <span className="text-emerald-900 font-medium">
                        {resultado.carga_horaria} horas
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs text-emerald-700">
                  <span>Emitido pelo sistema em: <strong>{resultado.emitido_em}</strong></span>
                  <span className="font-mono text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    Status: Regular
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-red-200 bg-red-50/80 p-5 flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-red-800">Certificado Inválido ou Não Encontrado</h3>
                  <p className="text-xs text-red-700 mt-0.5">
                    {resultado.erro ?? "O código fornecido não consta em nossa base institucional de certificados emitidos."}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}