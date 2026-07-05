import { useEffect, useState } from "react"
import { eventos as eventosApi } from "../services/api"
import type { Evento } from "../types"
import EventoCard from "../components/EventoCard"
import Alerta from "../components/Alerta"
import { mensagemErro } from "../utils/erro"

export default function ListaEventos() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    eventosApi
      .listar()
      .then(setEventos)
      .catch((e) => setErro(mensagemErro(e)))
      .finally(() => setCarregando(false))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Eventos abertos</h1>
      <p className="text-slate-500 mb-6">Inscreva-se nos eventos com inscrições abertas.</p>

      {erro && <Alerta tipo="erro">{erro}</Alerta>}
      {carregando && <p className="text-slate-500">Carregando eventos...</p>}
      {!carregando && eventos.length === 0 && !erro && (
        <p className="text-slate-500">Nenhum evento com inscrições abertas no momento.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {eventos.map((evento) => (
          <EventoCard key={evento.id} evento={evento} />
        ))}
      </div>
    </div>
  )
}
