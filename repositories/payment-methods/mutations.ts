import { TPaymentMethod } from '@/utils/schemas/payment-methods'
import { Collection, ObjectId } from 'mongodb'

type CreatePaymentMethodParams = {
  collection: Collection<TPaymentMethod>
  info: TPaymentMethod
  partnerId: string
}
export async function insertPaymentMethod({ collection, info, partnerId }: CreatePaymentMethodParams) {
  try {
    const insertResponse = await collection.insertOne({ ...info, idParceiro: partnerId })
    return insertResponse
  } catch (error) {
    throw error
  }
}

type UpdatePaymentMethodParams = {
  id: string
  collection: Collection<TPaymentMethod>
  changes: Partial<TPaymentMethod>
  partnerId: string
}

export async function updatePaymentMethod({ id, collection, changes, partnerId }: UpdatePaymentMethodParams) {
  try {
    const updateResponse = await collection.updateOne({ _id: new ObjectId(id), idParceiro: partnerId }, { $set: { ...changes } })
    return updateResponse
  } catch (error) {
    throw error
  }
}
