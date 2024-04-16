import { TPaymentMethod } from '@/utils/schemas/payment-methods'
import { Collection, ObjectId } from 'mongodb'

type GetPaymentMethodsParams = {
  collection: Collection<TPaymentMethod>
  partnerId: string
}
export async function getPaymentMethods({ collection, partnerId }: GetPaymentMethodsParams) {
  try {
    const paymentMethods = await collection.find({ idParceiro: partnerId }).toArray()
    return paymentMethods
  } catch (error) {
    throw error
  }
}

type GetPaymentMethodsByIdParams = {
  collection: Collection<TPaymentMethod>
  id: string
  partnerId: string
}
export async function getPaymentMethodsById({ collection, id, partnerId }: GetPaymentMethodsByIdParams) {
  try {
    const paymentMethod = await collection.findOne({ _id: new ObjectId(id), idParceiro: partnerId })
    return paymentMethod
  } catch (error) {
    throw error
  }
}
