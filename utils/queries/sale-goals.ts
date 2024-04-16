import { UseQueryResult, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { ISaleGoal } from '../models'
import { TSaleGoalDTO } from '../schemas/sale-goal.schema'

async function fetchSaleGoalsByPromoter({ promoterId }: { promoterId: string }) {
  try {
    const { data } = await axios.get(`/api/management/sale-goals?id=${promoterId}`)
    return data.data as TSaleGoalDTO[]
  } catch (error) {
    throw error
  }
}

export function usePromoterSaleGoals(id: string) {
  return useQuery({
    queryKey: ['user-sale-goals', id],
    queryFn: async () => await fetchSaleGoalsByPromoter({ promoterId: id }),
    refetchOnWindowFocus: false,
  })
}
