import { TSellerSalesResults } from '@/pages/api/stats/comercial-results/sales-sellers'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type UseSalesTeamResultsParams = {
  after: string
  before: string
  responsibles: string[] | null
  partners: string[] | null
  projectTypes: string[] | null
}
async function fetchStats({ after, before, responsibles, partners, projectTypes }: UseSalesTeamResultsParams) {
  try {
    const { data } = await axios.post(`/api/stats/comercial-results/sales-sellers?after=${after}&before=${before}`, { responsibles, partners, projectTypes })
    return data.data as TSellerSalesResults
  } catch (error) {
    throw error
  }
}

export function useSalesTeamResults({ after, before, responsibles, partners, projectTypes }: UseSalesTeamResultsParams) {
  return useQuery({
    queryKey: ['sales-team-results', after, before, responsibles, partners, projectTypes],
    queryFn: async () => await fetchStats({ after, before, responsibles, partners, projectTypes }),
  })
}
