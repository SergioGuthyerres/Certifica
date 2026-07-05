import { useEffect, useState } from "react"
import { certificados as certificadosApi, obterToken } from "../services/api"
import type { CertificadoResumo } from "../types"
import Alerta from "../components/Alerta"
import { baixarBlob } from "../services/pdf"
import { mensagemErro } from "../utils/erro"

export default function MeusCertificados() {
  const [lista, setLista] = useState<CertificadoResumo[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [baixandoId, setBaixandoId] = useState<number | null>(null)

  useEffect(() => {
    certificadosApi
      .meus(obterToken())
      .then(setLista)
      .catch((e) => setErro(mensagemErro(e)))
      .finally(() => setCarregando(false))
  }, [])

  async function baixar(id: number) {
    setBaixandoId(id)
    setErro(null)
    try {
      const { blob, nomeArquivo } = await certificadosApi.download(obterToken(), id)
      baixarBlob(blob, nomeArquivo)
    } catch (e) {
      setErro(mensagemErro(e))
    } finally {
      setBaixandoId(null)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Meus certificados</h1>

      {erro && <Alerta tipo="erro">{erro}</Alerta>}
      {carregando && <p className="text-slate-500">Carregando...</p>}
      {!carregando && lista.length === 0 && !erro && (
        <p className="text-slate-500">Você ainda não possui certificados emitidos.</p>
      )}

      <div className="space-y-3">
        {lista.map((certificado) => (
          <div
            key={certificado.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div>
              <p className="font-medium text-slate-800">{certificado.nome_evento}</p>
              <p className="text-sm text-slate-500">
                {certificado.carga_horaria}h · emitido em {certificado.emitido_em}
              </p>
              <p className="text-xs text-slate-400 font-mono mt-1">{certificado.codigo_verificacao}</p>
            </div>
            <button
              onClick={() => baixar(certificado.id)}
              disabled={baixandoId === certificado.id}
              className="shrink-0 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {baixandoId === certificado.id ? "Gerando..." : "Baixar PDF"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
