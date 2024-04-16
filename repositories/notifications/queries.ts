import { TNotification } from '@/utils/schemas/notification.schema'
import { Collection, ObjectId } from 'mongodb'

type GetNotificationByIdParams = {
  collection: Collection<TNotification>
  notificationId: string
  partnerId: string
}
export async function getNotificationById({ collection, notificationId, partnerId }: GetNotificationByIdParams) {
  try {
    const notification = await collection.findOne({ _id: new ObjectId(notificationId), idParceiro: partnerId })

    return notification
  } catch (error) {
    throw error
  }
}

type GetNotificationByRecipientIdParams = {
  collection: Collection<TNotification>
  recipientId: string
  partnerId: string
}
export async function getNotificationByRecipientId({ collection, recipientId, partnerId }: GetNotificationByRecipientIdParams) {
  try {
    const notifications = await collection.find({ 'destinatario.id': recipientId, idParceiro: partnerId }).toArray()
    return notifications
  } catch (error) {
    throw error
  }
}
type GetNotificationByOpportunityIdParams = {
  collection: Collection<TNotification>
  opportunityId: string
  partnerId: string
}
export async function getNotificationByOpportunityId({ collection, opportunityId, partnerId }: GetNotificationByOpportunityIdParams) {
  try {
    const notifications = await collection.find({ 'oportunidade.id': opportunityId, idParceiro: partnerId }).toArray()
    return notifications
  } catch (error) {
    throw error
  }
}
