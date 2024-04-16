import { TProposal } from '@/utils/schemas/proposal.schema'
import { Collection, ObjectId } from 'mongodb'

type InsertProposalParams = {
  collection: Collection<TProposal>
  info: TProposal
  partnerId: string
}
export async function insertProposal({ collection, info, partnerId }: InsertProposalParams) {
  try {
    const insertResponse = await collection.insertOne({ ...info, idParceiro: partnerId, dataInsercao: new Date().toISOString() })
    return insertResponse
  } catch (error) {
    throw error
  }
}

type UpdateProposalParams = {
  id: string
  collection: Collection<TProposal>
  changes: Partial<TProposal>
  partnerId: string
}
export async function updateProposal({ id, collection, changes, partnerId }: UpdateProposalParams) {
  try {
    const updateResponse = await collection.updateOne({ _id: new ObjectId(id), idParceiro: partnerId }, { $set: { ...changes } })

    return updateResponse
  } catch (error) {
    throw error
  }
}
