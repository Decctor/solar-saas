import axios from 'axios'
import { TFunnelDTO, TFunnelEntity } from '../schemas/funnel.schema'
import { useQuery } from '@tanstack/react-query'

async function fetchFunnels() {
  try {
    const { data } = await axios.get('/api/funnels')
    return data.data as TFunnelDTO[]
  } catch (error) {
    throw error
  }
}
export function useFunnels() {
  return useQuery({
    queryKey: ['funnels'],
    queryFn: fetchFunnels,
  })
}
