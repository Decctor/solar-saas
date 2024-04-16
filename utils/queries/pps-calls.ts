import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

async function fetchOpenCalls(responsibleId: string | null) {
  try {
    const { data } = await axios.get(`/api/integration/app-ampere/ppsCalls?responsible=${responsibleId}`)
    return data.data
  } catch (error) {
    throw error
  }
}

export function useOpenCalls(enabled: boolean, responsible: string | null) {
  console.log('RESPONSAVEL', responsible)
  return useQuery({
    queryKey: ['open-pps-calls', responsible],
    queryFn: async () => await fetchOpenCalls(responsible), //
    enabled: !!enabled,
    refetchOnWindowFocus: false,
  })
}
