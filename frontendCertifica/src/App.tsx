import { Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./pages/Login"
import Cadastro from "./pages/Cadastro"
import ListaEventos from "./pages/ListaEventos"
import DetalheEvento from "./pages/DetalheEvento"
import MinhasInscricoes from "./pages/MinhasInscricoes"
import MeusCertificados from "./pages/MeusCertificados"
import ValidarCertificado from "./pages/ValidarCertificado"
import NotFound from "./pages/NotFound"
import OrganizadorDashboard from "./pages/organizador/Dashboard"
import NovoEvento from "./pages/organizador/NovoEvento"
import GerenciarEvento from "./pages/organizador/GerenciarEvento"

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<ListaEventos />} />
        <Route path="login" element={<Login />} />
        <Route path="cadastro" element={<Cadastro />} />
        <Route path="eventos/:id" element={<DetalheEvento />} />
        <Route path="validar" element={<ValidarCertificado />} />
        <Route path="validar/:codigo" element={<ValidarCertificado />} />

        <Route
          path="minhas-inscricoes"
          element={
            <ProtectedRoute tipo="participante">
              <MinhasInscricoes />
            </ProtectedRoute>
          }
        />
        <Route
          path="certificados"
          element={
            <ProtectedRoute tipo="participante">
              <MeusCertificados />
            </ProtectedRoute>
          }
        />

        <Route
          path="organizador"
          element={
            <ProtectedRoute tipo="organizador">
              <OrganizadorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="organizador/eventos/novo"
          element={
            <ProtectedRoute tipo="organizador">
              <NovoEvento />
            </ProtectedRoute>
          }
        />
        <Route
          path="organizador/eventos/:id"
          element={
            <ProtectedRoute tipo="organizador">
              <GerenciarEvento />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
