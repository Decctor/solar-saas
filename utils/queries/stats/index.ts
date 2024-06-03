import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { TSalesStats } from '@/pages/api/stats/sales'
import { TActivityDTO } from '@/utils/schemas/activities.schema'
import { TGeneralStats } from '@/utils/schemas/stats.schema'
import { TGeneralStatsQueryFiltersOptions } from '@/pages/api/stats'
import { TComercialResultsQueryFiltersOptions } from '@/pages/api/stats/comercial-results/query-options'

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

type UseStatsParams = {
  after: string
  before: string
  responsibles: string[] | null
  partners: string[] | null
  projectTypes: string[] | null
}
async function fetchStats({ after, before, responsibles, partners, projectTypes }: UseStatsParams) {
  try {
    const { data } = await axios.post(`/api/stats?after=${after}&before=${before}`, { responsibles, partners, projectTypes })
    return data.data as TGeneralStats
  } catch (error) {
    throw error
  }
}
export function useStats({ after, before, responsibles, partners, projectTypes }: UseStatsParams) {
  return useQuery({
    queryKey: ['stats', after, before, responsibles, partners, projectTypes],
    queryFn: async () => await fetchStats({ after, before, responsibles, partners, projectTypes }),
    refetchOnWindowFocus: false,
  })
}
async function fetchStatsQueryOptions() {
  try {
    const { data } = await axios.get('/api/stats')
    return data.data as TGeneralStatsQueryFiltersOptions
  } catch (error) {
    throw error
  }
}
export function useStatsQueryOptions() {
  return useQuery({
    queryKey: ['general-stats-query-options'],
    queryFn: fetchStatsQueryOptions,
  })
}
async function fetchComercialResultsQueryOptions() {
  try {
    const { data } = await axios.get('/api/stats/comercial-results/query-options')
    return data.data as TComercialResultsQueryFiltersOptions
  } catch (error) {
    throw error
  }
}
export function useComercialResultsQueryOptions() {
  return useQuery({
    queryKey: ['comercial-results-query-options'],
    queryFn: fetchComercialResultsQueryOptions,
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
