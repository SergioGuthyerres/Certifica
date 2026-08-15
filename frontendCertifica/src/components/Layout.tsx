import { Link, NavLink, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { Award, LogOut, User } from "lucide-react"

function linkClasse({ isActive }: { isActive: boolean }): string {
  return `px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
    isActive
      ? "bg-[#1B4332] text-white shadow-sm"
      : "text-slate-600 hover:text-[#1B4332] hover:bg-emerald-50/60"
  }`
}

export default function Layout() {
  const { usuario, sair } = useAuth()
  const location = useLocation()

  // Rotas de tela cheia sem Header/Footer padrão
  const rotasSemLayout = ["/login", "/cadastro", "/recuperar-senha"]
  const esconderLayout = rotasSemLayout.includes(location.pathname)

  if (esconderLayout) {
    return <Outlet />
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7F5]">
      {/* Header Institucional */}
      <header className="border-b border-slate-200/80 bg-white sticky top-0 z-50 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-[#1B4332] font-bold text-lg tracking-wider">
            <div className="w-8 h-8 rounded-lg bg-[#1B4332] flex items-center justify-center text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <span>CERTIFICA</span>
          </Link>

          {/* Navegação Principal */}
          <nav className="hidden md:flex items-center gap-1.5">
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

          {/* Ações de Usuário / Autenticação */}
          <div className="flex items-center gap-3">
            {usuario ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                  <User className="w-3.5 h-3.5 text-[#1B4332]" />
                  <span className="font-medium">{usuario.nome}</span>
                  <span className="text-[10px] uppercase font-bold text-[#1B4332] bg-emerald-100 px-1.5 py-0.5 rounded">
                    {usuario.tipo}
                  </span>
                </div>
                <button
                  onClick={sair}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium text-slate-700 hover:text-[#1B4332] hover:bg-slate-100 transition-all"
                >
                  Entrar
                </Link>
                <Link
                  to="/cadastro"
                  className="px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold bg-[#1B4332] text-white hover:bg-[#143326] shadow-sm transition-all"
                >
                  Criar conta
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Conteúdo Dinâmico das Telas */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Rodapé Padrão */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        © 2026 CERTIFICA — Plataforma de Gestão e Certificação Acadêmica
      </footer>
    </div>
  )
}