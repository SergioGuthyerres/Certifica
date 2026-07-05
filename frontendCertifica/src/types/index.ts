export type TipoUsuario = "organizador" | "participante"

export type StatusEvento = "rascunho" | "aberto" | "encerrado"

export interface Usuario {
  id: number
  nome: string
  email: string
  tipo: TipoUsuario
}

export interface Evento {
  id: number
  nome: string
  descricao?: string
  data: string
  local: string
  carga_horaria: number
  percentual_minimo: number
  status: StatusEvento
  organizador_id: number
}

export interface Inscrito {
  inscricao_id: number
  usuario_id: number
  nome: string
  email: string
  status: string
  presente: boolean
}

export interface MinhaInscricao {
  inscricao_id: number
  evento_id: number
  nome_evento: string
  data_evento: string
  status: string
  presente: boolean
}

export interface CertificadoResumo {
  id: number
  evento_id: number
  nome_evento: string
  carga_horaria: number
  emitido_em: string
  codigo_verificacao: string
}

export interface ValidacaoCertificado {
  valido: boolean
  nome_participante?: string
  nome_evento?: string
  data_evento?: string
  carga_horaria?: number
  emitido_em?: string
  erro?: string
}
