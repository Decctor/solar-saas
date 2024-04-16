import axios from 'axios'
import { TActivityDTO } from '../schemas/activities.schema'
import { useQuery } from '@tanstack/react-query'

type UseActivitiesByOpportunityIdParams = { opportunityId: string; openOnly?: boolean; dueOnly?: boolean }
async function fetchActivitiesByOpportunityId({ opportunityId, openOnly, dueOnly }: UseActivitiesByOpportunityIdParams) {
  try {
    var url = `/api/activities?opportunityId=${opportunityId}`
    if (openOnly) url += `&openOnly=${openOnly}`
    if (dueOnly) url += `&dueOnly=${dueOnly}`
    const { data } = await axios.get(url)
    return data.data as TActivityDTO[]
  } catch (error) {
    throw error
  }
}
export function useActivitiesByOpportunityId({ opportunityId, openOnly, dueOnly }: UseActivitiesByOpportunityIdParams) {
  return useQuery({
    queryKey: ['opportunity-activities', opportunityId],
    queryFn: async () => await fetchActivitiesByOpportunityId({ opportunityId, openOnly, dueOnly }),
  })
}

async function fetchActivitiesByHomologationId({ homologationId }: { homologationId: string }) {
  try {
    const { data } = await axios.get(`/api/activities?homologationId=${homologationId}`)
    return data.data as TActivityDTO[]
  } catch (error) {
    throw error
  }
}

export function useActivitiesByHomologationId({ homologationId }: { homologationId: string }) {
  return useQuery({
    queryKey: ['homologation-activities', homologationId],
    queryFn: async () => await fetchActivitiesByHomologationId({ homologationId }),
  })
}

async function fetchActivitiesByTechnicalAnalysisId({ technicalAnalysisId }: { technicalAnalysisId: string }) {
  try {
    const { data } = await axios.get(`/api/activities?technicalAnalysisId=${technicalAnalysisId}`)
    return data.data as TActivityDTO[]
  } catch (error) {
    throw error
  }
}

export function useActivitiesByTechnicalAnalysisId({ technicalAnalysisId }: { technicalAnalysisId: string }) {
  return useQuery({
    queryKey: ['technical-analysis-activities', technicalAnalysisId],
    queryFn: async () => await fetchActivitiesByTechnicalAnalysisId({ technicalAnalysisId }),
  })
}
