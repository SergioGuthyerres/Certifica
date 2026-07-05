import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md text-center py-16">
      <h1 className="text-4xl font-bold text-slate-800 mb-2">404</h1>
      <p className="text-slate-500 mb-6">Página não encontrada.</p>
      <Link to="/" className="text-indigo-600 font-medium">
        Voltar para a lista de eventos
      </Link>
    </div>
  )
}
