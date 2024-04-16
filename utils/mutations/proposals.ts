import axios from 'axios'
import { TProposal } from '../schemas/proposal.schema'

type CreateProposalParams = {
  info: TProposal
}
export async function createProposal({ info }: CreateProposalParams) {
  try {
    const { data } = await axios.post('/api/proposals', info)
    if (typeof data.message != 'string') return 'Proposta criada com sucesso !'
    return data.message
    // return data.data?.insertedId as string
  } catch (error) {
    throw error
  }
}

export async function editProposal({ id, changes }: { id: string; changes: Partial<TProposal> }) {
  try {
    const { data } = await axios.put(`/api/proposals?id=${id}`, changes)
    if (typeof data.message != 'string') return 'Proposta atualizada com sucesso !'
    return data.message as string
  } catch (error) {
    throw error
  }
}
