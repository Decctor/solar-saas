import { z } from 'zod'
import { TActivityDTO } from './activities.schema'

export const ResponsiblesBodySchema = z.object({
  responsibles: z.array(z.string({ required_error: 'Responsáveis não informados ou inválidos.', invalid_type_error: 'Responsáveis inválidos.' })).nullable(),
  partners: z.array(z.string({ required_error: 'Parceiros não informados ou inválidos.', invalid_type_error: 'Parceiros inválidos.' })).nullable(),
})
export type TGeneralStats = {
  simplificado: {
    ANTERIOR: {
      projetosCriados: number
      projetosGanhos: number
      projetosPerdidos: number
      totalVendido: number
    }
    ATUAL: {
      projetosCriados: number
      projetosGanhos: number
      projetosPerdidos: number
      totalVendido: number
    }
  }
  ganhos: {
    _id: string
    nome: string
    responsaveis: {
      nome: string
      id: string
      papel: string
      avatar_url?: string | null | undefined
      telefone?: string | null | undefined
    }[]
    idMarketing: string | null | undefined
    proposta: {
      _id: string
      nome: string
      valor: number
      potenciaPico: number | null | undefined
    } | null
    dataGanho: string
  }[]
  ganhosPendentes: {
    _id: string
    nome: string
    idMarketing: string | null | undefined
    responsaveis: {
      nome: string
      id: string
      papel: string
      avatar_url?: string | null | undefined
      telefone?: string | null | undefined
    }[]
    proposta: {
      _id: string
      nome: string
      valor: number
      potenciaPico: number | null | undefined
    } | null
    dataSolicitacao: string
  }[]
  atividades: TActivityDTO[]
}
