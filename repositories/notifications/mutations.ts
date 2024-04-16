import { TNotification } from '@/utils/schemas/notification.schema'
import { Collection, ObjectId } from 'mongodb'

type InsertNotificationParams = {
  collection: Collection<TNotification>
  info: TNotification
  partnerId: string
}
export async function insertNotification({ collection, info, partnerId }: InsertNotificationParams) {
  try {
    const insertResponse = await collection.insertOne({ ...info, idParceiro: partnerId })
    return insertResponse
  } catch (error) {
    throw error
  }
}
type UpdateNotificationParams = {
  collection: Collection<TNotification>
  info: Partial<TNotification>
  partnerId: string
}
export async function updateNotification({ collection, info, partnerId }: UpdateNotificationParams) {
  try {
    const updateResponse = await collection.updateOne({ _id: new ObjectId(partnerId), idParceiro: partnerId }, { $set: { ...info } })
    return updateResponse
  } catch (error) {
    throw error
  }
}
