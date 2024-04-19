import axios from 'axios'
import { TProposal } from '../schemas/proposal.schema'
import { TOpportunityDTOWithClient } from '../schemas/opportunity.schema'
import { TPersonalizedProposalCreationResponse } from '@/pages/api/proposals/personalized'

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

type CreateProposalPersonalizedParams = {
  proposal: TProposal
  opportunityWithClient: TOpportunityDTOWithClient
  saveAsActive: boolean
  idAnvil?: string | null
}
export async function createProposalPersonalized({ proposal, opportunityWithClient, saveAsActive, idAnvil }: CreateProposalPersonalizedParams) {
  try {
    const { data } = await axios.post('/api/proposals/personalized', { proposal, opportunityWithClient, saveAsActive, idAnvil })

    return data as TPersonalizedProposalCreationResponse
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
