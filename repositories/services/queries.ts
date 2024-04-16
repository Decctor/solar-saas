import { TProduct } from '@/utils/schemas/products.schema'
import { TService, TServiceWithPricingMethod } from '@/utils/schemas/service.schema'
import { Collection, ObjectId } from 'mongodb'

type GetServicesParams = {
  collection: Collection<TService>
  partnerId: string
}
export async function getServices({ collection, partnerId }: GetServicesParams) {
  try {
    const services = await collection.find({ idParceiro: partnerId }).toArray()

    return services
  } catch (error) {
    throw error
  }
}

type GetServiceByIdParams = {
  collection: Collection<TService>
  partnerId: string
  id: string
}
export async function getServiceById({ collection, partnerId, id }: GetServiceByIdParams) {
  try {
    const service = await collection.findOne({ _id: new ObjectId(id), idParceiro: partnerId })
    return service
  } catch (error) {
    throw error
  }
}

type GetServicesWithPricingMethodParams = {
  collection: Collection<TService>
  partnerId: string
}
export async function getServicesWithPricingMethod({ collection, partnerId }: GetServicesWithPricingMethodParams) {
  const pipeline = [
    {
      $match: {
        idParceiro: partnerId,
      },
    },
    {
      $addFields: {
        methodologyObjectId: { $toObjectId: '$idMetodologiaPrecificacao' },
      },
    },
    {
      $lookup: {
        from: 'pricing-methods',
        localField: 'methodologyObjectId',
        foreignField: '_id',
        as: 'metodologia',
      },
    },
    {
      $sort: {
        dataInsercao: -1,
      },
    },
  ]
  try {
    const arrOfServices = await collection.aggregate(pipeline).toArray()
    const plans = arrOfServices.map((plan) => ({ ...plan, metodologia: plan.metodologia[0] })) as TServiceWithPricingMethod[]
    return plans
  } catch (error) {
    throw error
  }
}
