import { TInProgressResults } from '@/pages/api/stats/comercial-results/sales-in-progress'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type UseInProgressResultsParams = {
  responsibles: string[] | null
}
async function fetchStats({ responsibles }: UseInProgressResultsParams) {
  try {
    const { data } = await axios.post(`/api/stats/comercial-results/sales-in-progress`, { responsibles })
    return data.data as TInProgressResults
  } catch (error) {
    throw error
  }
}

export function useInProgressResults({ responsibles }: UseInProgressResultsParams) {
  return useQuery({
    queryKey: ['in-progress-results', responsibles],
    queryFn: async () => await fetchStats({ responsibles }),
  })
}
