import { TSignaturePlan, TSignaturePlanDTOWithPricingMethod, TSignaturePlanWithPricingMethod } from '@/utils/schemas/signature-plans.schema'
import { Collection, Filter, ObjectId } from 'mongodb'

type GetSignaturePlanByIdParams = {
  collection: Collection<TSignaturePlan>
  query: Filter<TSignaturePlan>
  id: string
}
export async function getSignaturePlanById({ id, query, collection }: GetSignaturePlanByIdParams) {
  try {
    const plan = await collection.findOne({ _id: new ObjectId(id), ...query })

    return plan
  } catch (error) {
    throw error
  }
}
type GetSignaturePlansParams = {
  collection: Collection<TSignaturePlan>
  query: Filter<TSignaturePlan>
}
export async function getSignaturePlans({ collection, query }: GetSignaturePlansParams) {
  try {
    const plans = await collection.find({ ...query }).toArray()

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
