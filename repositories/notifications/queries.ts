import { TNotification } from '@/utils/schemas/notification.schema'
import { Collection, ObjectId } from 'mongodb'

type GetNotificationByIdParams = {
  collection: Collection<TNotification>
  id: string
  partnerId: string
}
export async function getNotificationById({ collection, id, partnerId }: GetNotificationByIdParams) {
  try {
    const notification = await collection.findOne({ _id: new ObjectId(id), idParceiro: partnerId })

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
    const notifications = await collection
      .find({ 'destinatarios.id': recipientId, idParceiro: partnerId }, { sort: { 'recebimentos.dataLeitura': 1 } })
      .limit(30)
      .toArray()
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
