import { TProduct, TProductWithPricingMethod } from '@/utils/schemas/products.schema'
import { Collection, ObjectId } from 'mongodb'

type GetProductsParams = {
  collection: Collection<TProduct>
  partnerId: string
}
export async function getProducts({ collection, partnerId }: GetProductsParams) {
  try {
    const products = await collection.find({ idParceiro: partnerId }).toArray()

    return products
  } catch (error) {
    throw error
  }
}

type GetProductByIdParams = {
  collection: Collection<TProduct>
  partnerId: string
  id: string
}
export async function getProductById({ collection, partnerId, id }: GetProductByIdParams) {
  try {
    const product = await collection.findOne({ _id: new ObjectId(id), idParceiro: partnerId })
    return product
  } catch (error) {
    throw error
  }
}

type GetProductsWithPricingMethodParams = {
  collection: Collection<TProduct>
  partnerId: string
}
export async function getProductsWithPricingMethod({ collection, partnerId }: GetProductsWithPricingMethodParams) {
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
    const arrOfProducts = await collection.aggregate(pipeline).toArray()
    const plans = arrOfProducts.map((plan) => ({ ...plan, metodologia: plan.metodologia[0] })) as TProductWithPricingMethod[]
    return plans
  } catch (error) {
    throw error
  }
}
