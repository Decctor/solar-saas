import axios from 'axios'
import { TOpportunityHistory, TOpportunityHistoryDTO } from '../schemas/opportunity-history.schema'

type CreateOpportunityHistory = {
  info: TOpportunityHistory
}
export async function createOpportunityHistory({ info }: CreateOpportunityHistory) {
  try {
    const { data } = await axios.post('/api/opportunities/history', info)
    if (typeof data.message != 'string') return 'Adicionado ao histórico da oportunidade.'
    return data.message
  } catch (error) {
    throw error
  }
}

export async function updateOpportunityHistory({ id, changes }: { id: string; changes: Partial<TOpportunityHistoryDTO> }) {
  try {
    const { data } = await axios.put(`/api/opportunities/history?id=${id}`, changes)
    if (typeof data.data != 'string') return 'Atualização feita com sucesso !'
    return data.data
  } catch (error) {
    throw error
  }
}
