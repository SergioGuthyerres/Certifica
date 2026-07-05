import type {
  CertificadoResumo,
  Evento,
  Inscrito,
  MinhaInscricao,
  StatusEvento,
  TipoUsuario,
  Usuario,
  ValidacaoCertificado,
} from "../types"
import { mockDb, type CertificadoInterno, type Db, type InscricaoInterna, type UsuarioInterno } from "./mockDb"
import { gerarCertificadoPdfMock } from "./pdf"

/**
 * Cliente de API mockado: implementa localmente o mesmo contrato descrito em
 * API_CONTRATOS.md. Quando o backend estiver pronto, essas funções passam a
 * fazer fetch() real para http://localhost:8000, mantendo a mesma assinatura
 * usada pelas telas.
 */

export class ApiError extends Error {
  status: number
  erro: string

  constructor(status: number, erro: string) {
    super(erro)
    this.status = status
    this.erro = erro
  }
}

const LATENCIA_MS = 350
const CHAVE_TOKEN = "certifica_token"

function atraso<T>(valor: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(valor), LATENCIA_MS))
}

function paraUsuarioPublico(usuario: UsuarioInterno): Usuario {
  return { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo }
}

function usuarioDoToken(db: Db, token: string | null): UsuarioInterno {
  if (!token) throw new ApiError(401, "Token ausente ou inválido")
  const partes = token.split("_")
  const id = Number(partes[2])
  const usuario = db.usuarios.find((u) => u.id === id)
  if (!usuario) throw new ApiError(401, "Token ausente ou inválido")
  return usuario
}

function exigirTipo(usuario: UsuarioInterno, tipo: TipoUsuario): void {
  if (usuario.tipo !== tipo) {
    throw new ApiError(403, `Usuário não é ${tipo === "organizador" ? "organizador" : "participante"}`)
  }
}

export function obterToken(): string | null {
  return localStorage.getItem(CHAVE_TOKEN)
}

export function definirToken(token: string | null): void {
  if (token) localStorage.setItem(CHAVE_TOKEN, token)
  else localStorage.removeItem(CHAVE_TOKEN)
}

// ---------------------------------------------------------------------------
// Autenticação
// ---------------------------------------------------------------------------

export const auth = {
  async cadastro(nome: string, email: string, senha: string, tipo: TipoUsuario): Promise<Usuario> {
    const db = mockDb.carregar()

    if (!nome || nome.trim().length < 2) throw new ApiError(400, "Nome deve ter ao menos 2 caracteres")
    if (!email) throw new ApiError(400, "E-mail é obrigatório")
    if (!senha || senha.length < 6) throw new ApiError(400, "Senha deve ter ao menos 6 caracteres")
    if (db.usuarios.some((u) => u.email === email)) throw new ApiError(409, "E-mail já cadastrado")

    const id = mockDb.gerarId(db, "usuarios")
    const novoUsuario: UsuarioInterno = { id, nome, email, senha, tipo }
    db.usuarios.push(novoUsuario)
    mockDb.salvar(db)

    return atraso(paraUsuarioPublico(novoUsuario))
  },

  async login(email: string, senha: string): Promise<{ token: string; usuario: Usuario }> {
    const db = mockDb.carregar()
    if (!email || !senha) throw new ApiError(400, "Campo ausente")

    const usuario = db.usuarios.find((u) => u.email === email && u.senha === senha)
    if (!usuario) throw new ApiError(401, "E-mail ou senha incorretos")

    const token = `mock_token_${usuario.id}_${Date.now()}`
    return atraso({ token, usuario: paraUsuarioPublico(usuario) })
  },

  async me(token: string | null): Promise<Usuario> {
    const db = mockDb.carregar()
    const usuario = usuarioDoToken(db, token)
    return atraso(paraUsuarioPublico(usuario))
  },
}

// ---------------------------------------------------------------------------
// Eventos
// ---------------------------------------------------------------------------

export const eventos = {
  async criar(
    token: string | null,
    dados: Pick<Evento, "nome" | "descricao" | "data" | "local" | "carga_horaria" | "percentual_minimo">,
  ): Promise<Evento> {
    const db = mockDb.carregar()
    const organizador = usuarioDoToken(db, token)
    exigirTipo(organizador, "organizador")

    if (!dados.nome || !dados.data || !dados.local || !dados.carga_horaria || !dados.percentual_minimo) {
      throw new ApiError(400, "Campo obrigatório ausente")
    }

    const id = mockDb.gerarId(db, "eventos")
    const novoEvento: Evento = {
      id,
      nome: dados.nome,
      descricao: dados.descricao,
      data: dados.data,
      local: dados.local,
      carga_horaria: dados.carga_horaria,
      percentual_minimo: dados.percentual_minimo,
      status: "rascunho",
      organizador_id: organizador.id,
    }
    db.eventos.push(novoEvento)
    mockDb.salvar(db)

    return atraso(novoEvento)
  },

  async listar(): Promise<Evento[]> {
    const db = mockDb.carregar()
    return atraso(db.eventos.filter((e) => e.status === "aberto"))
  },

  async meus(token: string | null): Promise<Evento[]> {
    const db = mockDb.carregar()
    const organizador = usuarioDoToken(db, token)
    exigirTipo(organizador, "organizador")
    return atraso(db.eventos.filter((e) => e.organizador_id === organizador.id))
  },

  async detalhe(id: number): Promise<Evento> {
    const db = mockDb.carregar()
    const evento = db.eventos.find((e) => e.id === id)
    if (!evento) throw new ApiError(404, "Evento não encontrado")
    return atraso(evento)
  },

  async mudarStatus(
    token: string | null,
    id: number,
    status: StatusEvento,
  ): Promise<{ id: number; status: StatusEvento; certificados_gerados?: number }> {
    const db = mockDb.carregar()
    const organizador = usuarioDoToken(db, token)
    const evento = db.eventos.find((e) => e.id === id)
    if (!evento) throw new ApiError(404, "Evento não encontrado")
    if (evento.organizador_id !== organizador.id) throw new ApiError(403, "Usuário não é o organizador deste evento")

    evento.status = status
    let certificadosGerados: number | undefined

    if (status === "encerrado") {
      certificadosGerados = 0
      const inscricoesDoEvento = db.inscricoes.filter((i) => i.evento_id === id)

      for (const inscricao of inscricoesDoEvento) {
        const percentual = (inscricao.frequencia_horas / evento.carga_horaria) * 100
        const aprovado = inscricao.presente && percentual >= evento.percentual_minimo
        if (!aprovado) continue

        const jaTemCertificado = db.certificados.some(
          (c) => c.evento_id === id && c.usuario_id === inscricao.usuario_id,
        )
        if (jaTemCertificado) continue

        const certId = mockDb.gerarId(db, "certificados")
        const certificado: CertificadoInterno = {
          id: certId,
          usuario_id: inscricao.usuario_id,
          evento_id: evento.id,
          nome_evento: evento.nome,
          carga_horaria: evento.carga_horaria,
          emitido_em: new Date().toISOString().slice(0, 10),
          codigo_verificacao: crypto.randomUUID(),
        }
        db.certificados.push(certificado)
        certificadosGerados += 1
      }
    }

    mockDb.salvar(db)
    return atraso({ id: evento.id, status: evento.status, certificados_gerados: certificadosGerados })
  },

  async inscritos(token: string | null, id: number): Promise<Inscrito[]> {
    const db = mockDb.carregar()
    const organizador = usuarioDoToken(db, token)
    const evento = db.eventos.find((e) => e.id === id)
    if (!evento) throw new ApiError(404, "Evento não encontrado")
    if (evento.organizador_id !== organizador.id) throw new ApiError(403, "Usuário não é o organizador deste evento")

    const lista: Inscrito[] = db.inscricoes
      .filter((i) => i.evento_id === id)
      .map((i) => {
        const participante = db.usuarios.find((u) => u.id === i.usuario_id)
        return {
          inscricao_id: i.id,
          usuario_id: i.usuario_id,
          nome: participante?.nome ?? "Desconhecido",
          email: participante?.email ?? "",
          status: i.status,
          presente: i.presente,
        }
      })

    return atraso(lista)
  },
}

// ---------------------------------------------------------------------------
// Inscrições
// ---------------------------------------------------------------------------

export const inscricoes = {
  async inscrever(token: string | null, eventoId: number): Promise<InscricaoInterna> {
    const db = mockDb.carregar()
    const participante = usuarioDoToken(db, token)
    exigirTipo(participante, "participante")

    const evento = db.eventos.find((e) => e.id === eventoId)
    if (!evento) throw new ApiError(404, "Evento não encontrado")
    if (evento.status !== "aberto") throw new ApiError(400, "Inscrições fechadas para este evento")

    const jaInscrito = db.inscricoes.some((i) => i.evento_id === eventoId && i.usuario_id === participante.id)
    if (jaInscrito) throw new ApiError(409, "Usuário já está inscrito neste evento")

    const id = mockDb.gerarId(db, "inscricoes")
    const novaInscricao: InscricaoInterna = {
      id,
      evento_id: eventoId,
      usuario_id: participante.id,
      status: "inscrito",
      presente: false,
      frequencia_horas: 0,
    }
    db.inscricoes.push(novaInscricao)
    mockDb.salvar(db)

    return atraso(novaInscricao)
  },

  async minhas(token: string | null): Promise<MinhaInscricao[]> {
    const db = mockDb.carregar()
    const participante = usuarioDoToken(db, token)
    exigirTipo(participante, "participante")

    const lista: MinhaInscricao[] = db.inscricoes
      .filter((i) => i.usuario_id === participante.id)
      .map((i) => {
        const evento = db.eventos.find((e) => e.id === i.evento_id)
        return {
          inscricao_id: i.id,
          evento_id: i.evento_id,
          nome_evento: evento?.nome ?? "Evento removido",
          data_evento: evento?.data ?? "",
          status: i.status,
          presente: i.presente,
        }
      })

    return atraso(lista)
  },

  async marcarPresenca(
    token: string | null,
    inscricaoId: number,
    presente: boolean,
  ): Promise<{ inscricao_id: number; usuario_id: number; nome: string; presente: boolean }> {
    const db = mockDb.carregar()
    const organizador = usuarioDoToken(db, token)

    const inscricao = db.inscricoes.find((i) => i.id === inscricaoId)
    if (!inscricao) throw new ApiError(404, "Inscrição não encontrada")

    const evento = db.eventos.find((e) => e.id === inscricao.evento_id)
    if (!evento || evento.organizador_id !== organizador.id) {
      throw new ApiError(403, "Usuário não é o organizador deste evento")
    }

    inscricao.presente = presente
    inscricao.status = "confirmado"
    inscricao.frequencia_horas = presente ? evento.carga_horaria : 0
    mockDb.salvar(db)

    const participante = db.usuarios.find((u) => u.id === inscricao.usuario_id)
    return atraso({
      inscricao_id: inscricao.id,
      usuario_id: inscricao.usuario_id,
      nome: participante?.nome ?? "Desconhecido",
      presente: inscricao.presente,
    })
  },
}

// ---------------------------------------------------------------------------
// Certificados
// ---------------------------------------------------------------------------

export const certificados = {
  async meus(token: string | null): Promise<CertificadoResumo[]> {
    const db = mockDb.carregar()
    const participante = usuarioDoToken(db, token)
    exigirTipo(participante, "participante")

    const lista = db.certificados
      .filter((c) => c.usuario_id === participante.id)
      .map(({ id, evento_id, nome_evento, carga_horaria, emitido_em, codigo_verificacao }) => ({
        id,
        evento_id,
        nome_evento,
        carga_horaria,
        emitido_em,
        codigo_verificacao,
      }))

    return atraso(lista)
  },

  async download(token: string | null, id: number): Promise<{ blob: Blob; nomeArquivo: string }> {
    const db = mockDb.carregar()
    const usuario = usuarioDoToken(db, token)

    const certificado = db.certificados.find((c) => c.id === id)
    if (!certificado) throw new ApiError(404, "Certificado não encontrado")
    if (certificado.usuario_id !== usuario.id) throw new ApiError(403, "Certificado não pertence ao usuário autenticado")

    const corpo = `Certificamos que ${usuario.nome} concluiu o evento "${certificado.nome_evento}", com carga horária de ${certificado.carga_horaria} horas, emitido em ${certificado.emitido_em}.`
    const blob = gerarCertificadoPdfMock("Certificado de Participação", corpo, certificado.codigo_verificacao)
    const nomeArquivo = `certificado_${certificado.nome_evento.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.pdf`

    return atraso({ blob, nomeArquivo })
  },
}

// ---------------------------------------------------------------------------
// Validação pública
// ---------------------------------------------------------------------------

export const validacao = {
  async validarCodigo(codigo: string): Promise<ValidacaoCertificado> {
    const db = mockDb.carregar()
    const certificado = db.certificados.find((c) => c.codigo_verificacao === codigo)

    if (!certificado) {
      return atraso({ valido: false, erro: "Certificado não encontrado" })
    }

    const participante = db.usuarios.find((u) => u.id === certificado.usuario_id)
    const evento = db.eventos.find((e) => e.id === certificado.evento_id)

    return atraso({
      valido: true,
      nome_participante: participante?.nome ?? "Desconhecido",
      nome_evento: certificado.nome_evento,
      data_evento: evento?.data ?? "",
      carga_horaria: certificado.carga_horaria,
      emitido_em: certificado.emitido_em,
    })
  },
}
