import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { extractErrorMessage, useResponsibles } from '../methods'
import { TOpportunityHistoryDTO } from '../schemas/opportunity-history.schema'
import { TSalesStats } from '@/pages/api/stats/sales'
import { TActivity, TActivityDTO } from '../schemas/activities.schema'
import { TGeneralStats } from '../schemas/stats.schema'

export type TStats = {
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
  propostasAssinadas: {
    responsaveis: {
      id: string
      nome: string
      papel: string
      avatar_url?: string | null | undefined
    }[]
    dataAssinatura: string | null | undefined
    _id: string
    nome: string
    valor: number
  }[]
  atividades: TActivityDTO[]
  assinaturasPendentes: {
    _id: string
    nome: string
    identificador: string
    valorProposta: number
    responsaveis: {
      id: string
      nome: string
      papel: string
      avatar_url?: string | null | undefined
    }[]
  }[]
}
async function fetchStats(after: string, before: string, responsible: string | null, partner: string | null) {
  try {
    const { data } = await axios.get(`/api/stats?after=${after}&before=${before}&responsible=${responsible}&partner=${partner}`)
    return data.data as TGeneralStats
  } catch (error) {
    throw error
  }
}
export function useStats(enabled: boolean, after: string, before: string, responsible: string | null, partner: string | null) {
  return useQuery({
    queryKey: ['stats', after, before, responsible, partner],
    queryFn: async () => await fetchStats(after, before, responsible, partner),
    enabled: !!enabled,
  })
}

async function fetchSalesStats(after: string, before: string, responsibles: string[] | null) {
  try {
    const { data } = await axios.get(`/api/stats/sales?after=${after}&before=${before}&responsibles=${responsibles}`)
    return data.data as TSalesStats
  } catch (error) {
    throw error
  }
}
export function useSaleStats(after: string, before: string, responsibles: string[] | null) {
  return useQuery({
    queryKey: ['sale-stats', after, before, responsibles],
    queryFn: async () => await fetchSalesStats(after, before, responsibles),
  })
}
