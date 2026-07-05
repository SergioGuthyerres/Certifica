import type { CertificadoResumo, Evento, TipoUsuario } from "../types"

interface UsuarioInterno {
  id: number
  nome: string
  email: string
  senha: string
  tipo: TipoUsuario
}

interface InscricaoInterna {
  id: number
  evento_id: number
  usuario_id: number
  status: "inscrito" | "confirmado"
  presente: boolean
  frequencia_horas: number
}

interface CertificadoInterno extends CertificadoResumo {
  usuario_id: number
}

interface Db {
  usuarios: UsuarioInterno[]
  eventos: Evento[]
  inscricoes: InscricaoInterna[]
  certificados: CertificadoInterno[]
  proximoId: Record<string, number>
}

const CHAVE_DB = "certifica_mock_db"

function seed(): Db {
  return {
    usuarios: [
      { id: 1, nome: "Ana Organizadora", email: "organizador@certifica.com", senha: "123456", tipo: "organizador" },
      { id: 2, nome: "Maria Souza", email: "participante@certifica.com", senha: "123456", tipo: "participante" },
    ],
    eventos: [
      {
        id: 1,
        nome: "Semana da Computação 2024",
        descricao: "Evento anual do curso de Computação, com palestras e minicursos.",
        data: "2024-11-15",
        local: "Auditório Principal",
        carga_horaria: 20,
        percentual_minimo: 75,
        status: "aberto",
        organizador_id: 1,
      },
      {
        id: 2,
        nome: "Workshop de Inteligência Artificial",
        descricao: "Introdução prática a modelos de linguagem e visão computacional.",
        data: "2024-12-02",
        local: "Laboratório 3",
        carga_horaria: 8,
        percentual_minimo: 80,
        status: "aberto",
        organizador_id: 1,
      },
      {
        id: 3,
        nome: "Hackathon Certifica",
        descricao: "Maratona de programação de 24 horas.",
        data: "2024-09-10",
        local: "Bloco B",
        carga_horaria: 24,
        percentual_minimo: 75,
        status: "encerrado",
        organizador_id: 1,
      },
    ],
    inscricoes: [
      { id: 1, evento_id: 3, usuario_id: 2, status: "confirmado", presente: true, frequencia_horas: 24 },
    ],
    certificados: [
      {
        id: 1,
        usuario_id: 2,
        evento_id: 3,
        nome_evento: "Hackathon Certifica",
        carga_horaria: 24,
        emitido_em: "2024-09-11",
        codigo_verificacao: "a3f8c21d-94b1-4e67-b3d2-0f1e2c3a4b5d",
      },
    ],
    proximoId: { usuarios: 3, eventos: 4, inscricoes: 2, certificados: 2 },
  }
}

function carregar(): Db {
  const bruto = localStorage.getItem(CHAVE_DB)
  if (!bruto) {
    const db = seed()
    salvar(db)
    return db
  }
  return JSON.parse(bruto) as Db
}

function salvar(db: Db): void {
  localStorage.setItem(CHAVE_DB, JSON.stringify(db))
}

function gerarId(db: Db, colecao: keyof Db["proximoId"]): number {
  const id = db.proximoId[colecao]
  db.proximoId[colecao] = id + 1
  return id
}

export const mockDb = { carregar, salvar, gerarId }
export type { UsuarioInterno, InscricaoInterna, CertificadoInterno, Db }

export function resetarMockDb(): void {
  localStorage.removeItem(CHAVE_DB)
}
