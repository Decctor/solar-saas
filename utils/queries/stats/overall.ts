import { TOverallResults } from '@/pages/api/stats/comercial-results/sales-overall'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type UseOverallResultsParams = {
  after: string
  before: string
  responsibles: string[] | null
}
async function fetchStats({ after, before, responsibles }: UseOverallResultsParams) {
  try {
    const { data } = await axios.post(`/api/stats/comercial-results/sales-overall?after=${after}&before=${before}`, { responsibles })
    return data.data as TOverallResults
  } catch (error) {
    throw error
  }
}

export function useOverallSalesResults({ after, before, responsibles }: UseOverallResultsParams) {
  return useQuery({
    queryKey: ['overall-sales-results', after, before, responsibles],
    queryFn: async () => await fetchStats({ after, before, responsibles }),
  })
}