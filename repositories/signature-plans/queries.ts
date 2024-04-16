import { TSignaturePlan, TSignaturePlanDTOWithPricingMethod, TSignaturePlanWithPricingMethod } from '@/utils/schemas/signature-plans.schema'
import { Collection, Filter, ObjectId } from 'mongodb'

type GetSignaturePlanByIdParams = {
  collection: Collection<TSignaturePlan>
  partnerId: string
  id: string
}
export async function getSignaturePlanById({ id, partnerId, collection }: GetSignaturePlanByIdParams) {
  try {
    const plan = await collection.findOne({ _id: new ObjectId(id), idParceiro: partnerId })

    return plan
  } catch (error) {
    throw error
  }
}
type GetSignaturePlansParams = {
  collection: Collection<TSignaturePlan>
  partnerId: string
  query: Filter<TSignaturePlan>
}
export async function getSignaturePlans({ partnerId, collection }: GetSignaturePlansParams) {
  try {
    const plans = await collection.find({ idParceiro: partnerId }).toArray()

    return plans
  } catch (error) {
    throw error
  }
}

type GetSignaturePlansWithPricingMethodParams = {
  collection: Collection<TSignaturePlan>
  partnerId: string
}
export async function getSignaturePlansWithPricingMethod({ collection, partnerId }: GetSignaturePlansWithPricingMethodParams) {
  const pipeline = [
    {
      $match: {
        ativo: true,
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
    const arrOfPlans = await collection.aggregate(pipeline).toArray()
    const plans = arrOfPlans.map((plan) => ({ ...plan, metodologia: plan.metodologia[0] })) as TSignaturePlanWithPricingMethod[]
    return plans
  } catch (error) {
    throw error
  }
}
