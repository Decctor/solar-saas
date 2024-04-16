import { TProposalUpdateRecord } from '@/utils/schemas/proposal-update-records.schema'
import { Collection } from 'mongodb'

type GetProposalUpdateRecordsParams = {
  proposalId: string
  collection: Collection<TProposalUpdateRecord>
  partnerId: string
}
export async function getProposalUpdateRecordsByProposeId({ proposalId, collection, partnerId }: GetProposalUpdateRecordsParams) {
  try {
    const records = await collection.find({ 'proposta.id': proposalId, idParceiro: partnerId }, { sort: { _id: -1 } }).toArray()
    return records
  } catch (error) {
    throw error
  }
}
