import { TOpportunityHistory } from '@/utils/schemas/opportunity-history.schema'
import { Collection, ObjectId } from 'mongodb'

type CreateOpportunityHistoryParams = {
  collection: Collection<TOpportunityHistory>
  info: TOpportunityHistory
  partnerId: string
}
export async function insertOpportunityHistory({ collection, info, partnerId }: CreateOpportunityHistoryParams) {
  try {
    const insertResponse = await collection.insertOne({ ...info, idParceiro: partnerId, dataInsercao: new Date().toISOString() })
    return insertResponse
  } catch (error) {
    throw error
  }
}

type UpdateOpportunityHistoryParams = {
  id: string
  collection: Collection<TOpportunityHistory>
  changes: Partial<TOpportunityHistory>
  partnerId: string
}
export async function updateOpportunityHistory({ id, collection, changes, partnerId }: UpdateOpportunityHistoryParams) {
  try {
    const updateResponse = await collection.updateOne({ _id: new ObjectId(id), idParceiro: partnerId }, { $set: { ...changes } })
    return updateResponse
  } catch (error) {
    throw error
  }
}
