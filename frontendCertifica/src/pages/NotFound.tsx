import { Link } from "react-router-dom"
import { AlertCircle, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 text-center">
        {/* Ícone de Erro */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#1B4332] border border-emerald-100 flex items-center justify-center mx-auto mb-5 shadow-xs">
          <AlertCircle className="w-8 h-8" />
        </div>

        {/* Código e Mensagem */}
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full">
          Erro 404
        </span>
        <h1 className="text-2xl font-bold text-[#1B4332] mt-3">
          Página não encontrada
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-8 leading-relaxed">
          O endereço acessado não existe, foi movido ou você não possui permissão para visualizá-lo.
        </p>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar página</span>
          </button>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white text-xs font-semibold shadow-md shadow-emerald-950/10 transition-all cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Início / Eventos</span>
          </Link>
        </div>
      </div>
    </div>
  )
}