import { TActivity } from '@/utils/schemas/activities.schema'
import { Collection, ObjectId } from 'mongodb'

type InsertActivityParams = {
  collection: Collection<TActivity>
  info: TActivity
  partnerId: string
}
export async function insertActivity({ collection, info, partnerId }: InsertActivityParams) {
  try {
    const insertResponse = await collection.insertOne({ ...info, idParceiro: partnerId, dataInsercao: new Date().toISOString() })
    return insertResponse
  } catch (error) {
    throw error
  }
}

type UpdateActivityParams = {
  activityId: string
  collection: Collection<TActivity>
  changes: Partial<TActivity>
  partnerId: string
}
export async function updateActivity({ activityId, collection, changes, partnerId }: UpdateActivityParams) {
  try {
    const updateResponse = await collection.updateOne({ _id: new ObjectId(activityId), idParceiro: partnerId }, { $set: { ...changes } })

    return updateResponse
  } catch (error) {
    throw error
  }
}
