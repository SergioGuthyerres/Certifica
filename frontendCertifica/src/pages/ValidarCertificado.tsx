import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { validacao } from "../services/api"
import type { ValidacaoCertificado } from "../types"
import Alerta from "../components/Alerta"
import { mensagemErro } from "../utils/erro"

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
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Validar certificado</h1>
      <p className="text-slate-500 mb-6">Informe o código de verificação impresso no certificado.</p>

      <form onSubmit={aoEnviar} className="flex gap-2">
        <input
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Código de verificação (UUID)"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={consultando}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {consultando ? "Validando..." : "Validar"}
        </button>
      </form>

      {erro && (
        <div className="mt-6">
          <Alerta tipo="erro">{erro}</Alerta>
        </div>
      )}

      {resultado && (
        <div className="mt-6">
          {resultado.valido ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
              <p className="font-semibold text-emerald-700 mb-3">✓ Certificado válido</p>
              <dl className="space-y-1 text-sm text-emerald-900">
                <div>
                  <dt className="inline text-emerald-600">Participante: </dt>
                  <dd className="inline font-medium">{resultado.nome_participante}</dd>
                </div>
                <div>
                  <dt className="inline text-emerald-600">Evento: </dt>
                  <dd className="inline font-medium">{resultado.nome_evento}</dd>
                </div>
                <div>
                  <dt className="inline text-emerald-600">Data do evento: </dt>
                  <dd className="inline font-medium">{resultado.data_evento}</dd>
                </div>
                <div>
                  <dt className="inline text-emerald-600">Carga horária: </dt>
                  <dd className="inline font-medium">{resultado.carga_horaria}h</dd>
                </div>
                <div>
                  <dt className="inline text-emerald-600">Emitido em: </dt>
                  <dd className="inline font-medium">{resultado.emitido_em}</dd>
                </div>
              </dl>
            </div>
          ) : (
            <Alerta tipo="erro">{resultado.erro ?? "Certificado não encontrado"}</Alerta>
          )}
        </div>
      )}
    </div>
  )
}
