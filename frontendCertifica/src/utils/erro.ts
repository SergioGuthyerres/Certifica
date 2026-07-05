import { ApiError } from "../services/api"

export function mensagemErro(erro: unknown): string {
  if (erro instanceof ApiError) return erro.erro
  if (erro instanceof Error) return erro.message
  return "Ocorreu um erro inesperado."
}
