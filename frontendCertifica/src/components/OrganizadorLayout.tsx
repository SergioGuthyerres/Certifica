import type { ReactNode } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import {
  Award,
  LayoutDashboard,
  CalendarDays,
  Users,
  BarChart3,
  Settings,
  QrCode,
  Plus,
  Bell,
  Search,
  LogOut,
} from "lucide-react"

export default function OrganizadorLayout({ children }: { children: ReactNode }) {
  const { usuario, sair } = useAuth()
  const navigate = useNavigate()

  const linksNav = [
    { to: "/organizador/dashboard", icone: LayoutDashboard, texto: "Dashboard" },
    { to: "/organizador", icone: CalendarDays, texto: "Eventos" },
    { to: "/organizador/participantes", icone: Users, texto: "Participantes" },
    { to: "/organizador/certificados", icone: Award, texto: "Certificados" },
    { to: "/organizador/relatorios", icone: BarChart3, texto: "Relatórios" },
  ]

  const iniciais = usuario?.nome
    ? usuario.nome
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "OR"

  return (
    <div className="flex min-h-screen bg-[#F4F7F5]">
      {/* Sidebar Verde */}
      <aside className="w-64 bg-[#1B4332] text-white flex flex-col justify-between shrink-0 p-5 hidden md:flex">
        <div className="space-y-7">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-base tracking-wider block leading-tight">CERTIFICA</span>
              <span className="text-[10px] text-emerald-200/70 block uppercase font-medium">Gestor Acadêmico</span>
            </div>
          </div>

          {/* Links Principais */}
          <nav className="space-y-1.5">
            {linksNav.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#4E9F76] text-white shadow-sm"
                      : "text-emerald-100/75 hover:bg-[#245943] hover:text-white"
                  }`
                }
              >
                <link.icone className="w-4 h-4" />
                <span>{link.texto}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Rodapé da Sidebar: Configurações + Perfil */}
        <div className="space-y-4 pt-4 border-t border-emerald-800/60">
          <NavLink
            to="/organizador/configuracoes"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#4E9F76] text-white"
                  : "text-emerald-100/75 hover:bg-[#245943] hover:text-white"
              }`
            }
          >
            <Settings className="w-4 h-4" />
            <span>Configurações</span>
          </NavLink>

          <div className="pt-3 border-t border-emerald-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {iniciais}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {usuario?.nome ?? "Organizador"}
                </p>
                <p className="text-[10px] text-emerald-200/70 capitalize leading-tight">
                  {usuario?.tipo ?? "Organizador"}
                </p>
              </div>
            </div>
            <button
              onClick={sair}
              title="Sair"
              className="text-emerald-300 hover:text-white p-1.5 rounded-lg hover:bg-[#245943] transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal + Topbar */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar Superior */}
        <header className="h-18 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between gap-4">
          <div className="relative w-72 md:w-96">
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full rounded-2xl bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#1B4332] focus:outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/organizador/leitor-qr")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-[#1B4332] text-xs font-semibold transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Leitor QR</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/organizador/eventos/novo")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Evento</span>
            </button>

            <button
              type="button"
              className="relative p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4 text-emerald-700" />
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </header>

        {/* Corpo da Página */}
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}