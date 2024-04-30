import { TSDRTeamResults } from '@/pages/api/stats/comercial-results/sales-sdr'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type UseSDRTeamResultsParams = {
  after: string
  before: string
  responsibles: string[] | null
  partners: string[] | null
}
async function fetchStats({ after, before, responsibles, partners }: UseSDRTeamResultsParams) {
  try {
    const { data } = await axios.post(`/api/stats/comercial-results/sales-sdr?after=${after}&before=${before}`, { responsibles, partners })
    return data.data as TSDRTeamResults
  } catch (error) {
    throw error
  }
}

export function useSDRTeamResults({ after, before, responsibles, partners }: UseSDRTeamResultsParams) {
  return useQuery({
    queryKey: ['sdr-team-results', after, before, responsibles, partners],
    queryFn: async () => await fetchStats({ after, before, responsibles, partners }),
  })
}
