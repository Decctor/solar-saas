import axios from 'axios'
import { TOpportunityHistoryDTO } from '../schemas/opportunity-history.schema'
import { useQuery } from '@tanstack/react-query'
import { TActivityDTO } from '../schemas/activities.schema'

async function fetchOpportunityHistory({ opportunityId }: { opportunityId: string }) {
  try {
    const { data } = await axios.get(`/api/opportunities/history?opportunityId=${opportunityId}`)
    return data.data as TOpportunityHistoryDTO[]
  } catch (error) {
    throw error
  }
}

export function useOpportunityHistory({ opportunityId }: { opportunityId: string }) {
  return useQuery({
    queryKey: ['opportunity-history', opportunityId],
    queryFn: async () => await fetchOpportunityHistory({ opportunityId }),
  })
}

export type TOpportunityActivityHistoryDTO = (TOpportunityHistoryDTO | TActivityDTO) & { dataReferencia: string }
async function fetchOpportunityHistoryAndActivities({ opportunityId }: { opportunityId: string }) {
  try {
    const { data: historyResponse } = await axios.get(`/api/opportunities/history?opportunityId=${opportunityId}`)
    const { data: activitiesResponse } = await axios.get(`/api/activities?opportunityId=${opportunityId}`)
    // Mapping through history and adding a reference date for sorting based on insertion date
    const history = (historyResponse.data as TOpportunityHistoryDTO[]).map((h) => ({ ...h, dataReferencia: h.dataInsercao }))
    // Mapping through activities and adding a reference date for sorting based on conclusion date or due date or insertion date
    const activities = (activitiesResponse.data as TActivityDTO[]).map((h) => ({ ...h, dataReferencia: h.dataConclusao || h.dataVencimento || h.dataInsercao }))
    // Create reference date for sorting
    const historyAndActivities: TOpportunityActivityHistoryDTO[] = [...history, ...activities].sort(
      (a, b) => new Date(b.dataReferencia).getTime() - new Date(a.dataReferencia).getTime()
    )

    return historyAndActivities
  } catch (error) {
    throw error
  }
}

export function useOpportunityHistoryAndActivities({ opportunityId }: { opportunityId: string }) {
  return useQuery({
    queryKey: ['opportunity-history-and-activities', opportunityId],
    queryFn: async () => fetchOpportunityHistoryAndActivities({ opportunityId }),
  })
}
