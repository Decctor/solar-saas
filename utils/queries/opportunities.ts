import axios from 'axios'
import {
  TOpportunityDTO,
  TOpportunityDTOWithClient,
  TOpportunityDTOWithClientAndPartner,
  TOpportunityDTOWithFunnelReferenceAndActivities,
  TOpportunityDTOWithFunnelReferenceAndActivitiesByStatus,
  TOpportunitySimplifiedDTOWithProposalAndActivitiesAndFunnels,
  TOpportunityWithFunnelReferenceAndActivitiesByStatus,
} from '../schemas/opportunity.schema'
import { useQuery } from '@tanstack/react-query'
import { TResultsExportsItem } from '@/pages/api/stats/comercial-results/results-export'

type UseOpportunitiesParams = {
  responsible: string | null
  funnel: string | null
  after: string | undefined
  before: string | undefined
  status: 'GANHOS' | 'PERDIDOS' | undefined
}
async function fetchOpportunities({ responsible, funnel, after, before, status }: UseOpportunitiesParams) {
  try {
    const { data } = await axios.get(`/api/opportunities?responsible=${responsible}&funnel=${funnel}&after=${after}&before=${before}&status=${status}`)
    return data.data as TOpportunitySimplifiedDTOWithProposalAndActivitiesAndFunnels[]
  } catch (error) {
    throw error
  }
}
export function useOpportunities({ responsible, funnel, after, before, status }: UseOpportunitiesParams) {
  return useQuery({
    queryKey: ['opportunities', responsible, funnel, after, before, status],
    queryFn: async () => await fetchOpportunities({ responsible, funnel, after, before, status }),
  })
}

async function fetchOpportunity({ opportunityId }: { opportunityId: string }) {
  try {
    const { data } = await axios.get(`/api/opportunities?id=${opportunityId}`)
    return data.data as TOpportunityDTOWithClientAndPartner
  } catch (error) {
    throw error
  }
}
export function useOpportunityById({ opportunityId }: { opportunityId: string }) {
  return useQuery({
    queryKey: ['opportunity-by-id', opportunityId],
    queryFn: async () => await fetchOpportunity({ opportunityId }),
  })
}

async function fetchOpportunitiesBySearch({ param }: { param: string }) {
  try {
    if (param.trim().length < 3) return []
    const { data } = await axios.get(`/api/opportunities/search?param=${param}`)
    return data.data as TOpportunityDTO[]
  } catch (error) {
    throw error
  }
}

export function useOpportunitiesBySearch({ param }: { param: string }) {
  return useQuery({
    queryKey: ['opportunities-by-search', param],
    queryFn: async () => await fetchOpportunitiesBySearch({ param }),
  })
}

export async function fetchOpportunityExport({ responsible, funnel, after, before, status }: UseOpportunitiesParams) {
  try {
    const { data } = await axios.get(`/api/opportunities/export?responsible=${responsible}&funnel=${funnel}&after=${after}&before=${before}&status=${status}`)
    return data.data as TResultsExportsItem[]
  } catch (error) {
    throw error
  }
}
