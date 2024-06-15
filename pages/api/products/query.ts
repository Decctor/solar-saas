import { getProductsWithPricingMethod } from '@/repositories/products/queries'
import connectToDatabase from '@/services/mongodb/crm-db-connection'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TProduct, TProductDTOWithPricingMethod, TProductWithPricingMethod } from '@/utils/schemas/products.schema'
import { Collection, Filter } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: TProductWithPricingMethod[]
}

const getProposalProducts: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const partnerId = session.user.idParceiro
  const partnerQuery: Filter<TProduct> = { idParceiro: partnerId }

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const collection: Collection<TProduct> = db.collection('products')
  const products = await getProductsWithPricingMethod({ collection: collection, query: partnerQuery })

  return res.status(200).json({ data: products })
}

export default apiHandler({ GET: getProposalProducts })
