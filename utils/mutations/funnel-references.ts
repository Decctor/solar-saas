import axios from 'axios'
import { TFunnelReference } from '../schemas/funnel-reference.schema'
import { QueryClient, QueryFilters, QueryKey, useMutation } from '@tanstack/react-query'
import { TOpportunityDTOWithFunnelReference, TOpportunityEntityWithFunnelReference } from '../schemas/opportunity.schema'

type HandleFunnelReferenceCreation = {
  info: TFunnelReference
}

export async function createFunnelReference({ info }: HandleFunnelReferenceCreation) {
  try {
    const { data } = await axios.post('/api/opportunities/funnel-references', info)
    if (data.data?.insertedId) return data.data.insertedId as string
    return 'Referência de funil criada com sucesso !'
  } catch (error) {
    throw error
  }
}
type UseUpdateFunnelReferenceParams = {
  funnelReferenceId: string
  newStageId: string
  queryClient: QueryClient
  affectedQueryKey: QueryKey
}
async function updateFunnelReference({ funnelReferenceId, newStageId }: Omit<UseUpdateFunnelReferenceParams, 'queryClient' | 'affectedQueryKey'>) {
  try {
    const { data } = await axios.put(`/api/opportunities/funnel-references?id=${funnelReferenceId}`, { idEstagioFunil: newStageId })
    if (typeof data.data != 'string') return 'Estágio atualizado com sucesso !'
    return data.data
  } catch (error) {}
}
export function useFunnelReferenceUpdate({
  queryClient,
  affectedQueryKey,
}: Omit<UseUpdateFunnelReferenceParams, 'funnelReferenceId' | 'newStageId'>) {
  return useMutation({
    mutationKey: ['upate-funnel-reference'],
    mutationFn: async ({ funnelReferenceId, newStageId }: Omit<UseUpdateFunnelReferenceParams, 'queryClient' | 'affectedQueryKey'>) =>
      await updateFunnelReference({ funnelReferenceId, newStageId }),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: affectedQueryKey })
      const querySnapshot: TOpportunityDTOWithFunnelReference[] | undefined = queryClient.getQueryData(affectedQueryKey)
      if (!querySnapshot) return { querySnapshot }

      // Updating opportunity optimistically
      // Finding opportunity within snapshot
      const opportunity = querySnapshot?.filter((s) => s.funil.id == variables.funnelReferenceId)[0]
      // Getting the opportunity index within snapshot
      const opportunityIndex = querySnapshot?.map((s) => s.funil.id).indexOf(variables.funnelReferenceId)
      // Manually updating snapshot
      opportunity.funil.idEstagio = variables.newStageId
      querySnapshot[opportunityIndex] = opportunity
      // Setting query data with the updated snapshot
      const newOpportunities = [...querySnapshot]
      queryClient.setQueryData(affectedQueryKey, newOpportunities)
      // Returning snapshot as context for onSuccess or onError
      return { querySnapshot }
    },
    onError: async (err, variables, context) => {
      queryClient.setQueryData(affectedQueryKey, context?.querySnapshot)
    },
    onSettled: async () => {
      queryClient.invalidateQueries({ queryKey: affectedQueryKey })
    },
  })
}
