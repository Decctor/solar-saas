import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { TTechnicalAnalysis, TTechnicalAnalysisDTO } from '../schemas/technical-analysis.schema'
import { useState } from 'react'
import { formatWithoutDiacritics } from '@/lib/methods/formatting'

async function fetchUserTechnicalAnalysis({ userId, status }: { userId: string | null; status: 'TODOS' | null }) {
  try {
    const { data } = await axios.get(`/api/integration/app-ampere/technicalAnalysis?applicant=${userId}&status=${status}`)
    return data.data as TTechnicalAnalysis[]
  } catch (error) {
    throw error
  }
}
type UseUserTechnicalAnalysis = {
  enabled: boolean
  userId: string | null
  status: 'TODOS' | null
}
export function useUserTechnicalAnalysis({ enabled, userId, status }: UseUserTechnicalAnalysis) {
  const [filters, setFilters] = useState({
    search: '',
  })
  function matchSearch(analysis: TTechnicalAnalysis) {
    if (filters.search.trim().length == 0) return true
    return analysis.nome.toUpperCase().includes(filters.search.toUpperCase())
  }
  function handleModelData(data: TTechnicalAnalysis[]) {
    var modeledData = data
    return modeledData.filter((analysis: any) => matchSearch(analysis))
  }

  return {
    ...useQuery({
      queryKey: ['user-technical-analysis', userId],
      queryFn: async () => await fetchUserTechnicalAnalysis({ userId, status }), // userName
      select: (data) => handleModelData(data),
      enabled: !!enabled,
    }),
    filters,
    setFilters,
  }
}

async function fetchTechnicalAnalysisByOpportunityId({ opportunityId }: { opportunityId: string }) {
  try {
    const { data } = await axios.get(`/api/technical-analysis?opportunityId=${opportunityId}`)
    return data.data as TTechnicalAnalysisDTO[]
  } catch (error) {
    throw error
  }
}

export function useOpportunityTechnicalAnalysis({ opportunityId }: { opportunityId: string }) {
  return useQuery({
    queryKey: ['opportunity-technical-analysis', opportunityId],
    queryFn: async () => await fetchTechnicalAnalysisByOpportunityId({ opportunityId }),
  })
}

async function fetchTechnicalAnalysis() {
  try {
    const { data } = await axios.get(`/api/technical-analysis`)
    return data.data as TTechnicalAnalysisDTO[]
  } catch (error) {
    throw error
  }
}

export type UseTechnicalAnalysisFilters = {
  search: string
  analyst: string | null
  requester: string[]
  type: string[]
  status: string[]
  complexity: string[]
}
export function useTechnicalAnalysis() {
  const [filters, setFilters] = useState<UseTechnicalAnalysisFilters>({
    search: '',
    analyst: null,
    requester: [],
    type: [],
    status: [],
    complexity: [],
  })
  function matchSearch(analysis: TTechnicalAnalysisDTO) {
    if (filters.search.trim().length == 0) return true
    return formatWithoutDiacritics(analysis.nome, true).includes(formatWithoutDiacritics(filters.search, true))
  }
  function matchAnalyst(analysis: TTechnicalAnalysisDTO) {
    if (!filters.analyst) return true
    return analysis.analista?.id == filters.analyst
  }
  function matchRequester(analysis: TTechnicalAnalysisDTO) {
    if (filters.requester.length == 0) return true
    return filters.requester.includes(analysis.requerente.nome || '')
  }
  function matchType(analysis: TTechnicalAnalysisDTO) {
    if (filters.type.length == 0) return true
    return filters.type.includes(analysis.tipoSolicitacao)
  }
  function matchStatus(analysis: TTechnicalAnalysisDTO) {
    if (filters.status.length == 0) return true
    return filters.status.includes(analysis.status)
  }
  function matchComplexity(analysis: TTechnicalAnalysisDTO) {
    if (filters.complexity.length == 0) return true
    return filters.complexity.includes(analysis.complexidade || '')
  }
  function handleModelData(data: TTechnicalAnalysisDTO[]) {
    var modeledData = data
    return modeledData.filter(
      (analysis) =>
        matchSearch(analysis) && matchAnalyst(analysis) && matchRequester(analysis) && matchType(analysis) && matchStatus(analysis) && matchComplexity(analysis)
    )
  }
  return {
    ...useQuery({
      queryKey: ['technical-analysis'],
      queryFn: fetchTechnicalAnalysis,
      select: (data) => handleModelData(data),
    }),
    filters,
    setFilters,
  }
}

async function fetchTechnicalAnalysisById({ id }: { id: string }) {
  try {
    const { data } = await axios.get(`/api/technical-analysis?id=${id}`)
    return data.data as TTechnicalAnalysisDTO
  } catch (error) {
    throw error
  }
}

export function useTechnicalAnalysisById({ id }: { id: string }) {
  return useQuery({
    queryKey: ['technical-analysis-by-id', id],
    queryFn: async () => await fetchTechnicalAnalysisById({ id }),
  })
}
