import { Link, NavLink, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

function linkClasse({ isActive }: { isActive: boolean }): string {
  return `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"
  }`
}

export default function Layout() {
  const { usuario, sair } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="text-xl font-bold text-indigo-700">
            Certifica
          </Link>

          <nav className="flex items-center gap-1 flex-wrap">
            <NavLink to="/" end className={linkClasse}>
              Eventos
            </NavLink>
            {usuario?.tipo === "participante" && (
              <>
                <NavLink to="/minhas-inscricoes" className={linkClasse}>
                  Minhas inscrições
                </NavLink>
                <NavLink to="/certificados" className={linkClasse}>
                  Meus certificados
                </NavLink>
              </>
            )}
            {usuario?.tipo === "organizador" && (
              <NavLink to="/organizador" className={linkClasse}>
                Painel do organizador
              </NavLink>
            )}
            <NavLink to="/validar" className={linkClasse}>
              Validar certificado
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            {usuario ? (
              <>
                <span className="text-sm text-slate-600 hidden sm:inline">
                  {usuario.nome} <span className="text-slate-400">({usuario.tipo})</span>
                </span>
                <button
                  onClick={sair}
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100">
                  Entrar
                </Link>
                <Link
                  to="/cadastro"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Criar conta
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        Certifica — protótipo de telas com dados mockados
      </footer>
    </div>
  )
}
