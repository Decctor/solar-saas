import { TPricingMethod } from '@/utils/schemas/pricing-method.schema'
import { Collection, ObjectId } from 'mongodb'

type GetPricingMethodsParams = {
  collection: Collection<TPricingMethod>
  partnerId: string
}
export async function getPartnerPricingMethods({ collection, partnerId }: GetPricingMethodsParams) {
  try {
    // @ts-ignore
    const pricingMethods = await collection.find({ $or: [{ idParceiro: partnerId }, { idParceiro: null }] }, { sort: { dataInsercao: 1 } }).toArray()
    return pricingMethods
  } catch (error) {
    throw error
  }
}

type GetPricingMethodByIdParams = {
  id: string
  collection: Collection<TPricingMethod>
  partnerId: string
}
export async function getPartnerPricingMethodById({ id, collection, partnerId }: GetPricingMethodByIdParams) {
  try {
    const pricingMethod = await collection.findOne({ _id: new ObjectId(id), idParceiro: partnerId })
    return pricingMethod
  } catch (error) {
    throw error
  }
}
