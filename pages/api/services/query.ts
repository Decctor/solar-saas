import { getServicesWithPricingMethod } from '@/repositories/services/queries'
import connectToDatabase from '@/services/mongodb/main-db-connection'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'

import { TService, TServiceWithPricingMethod } from '@/utils/schemas/service.schema'
import { Collection } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: TServiceWithPricingMethod[]
}

const getProposalServices: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const partnerId = session.user.idParceiro

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const collection: Collection<TService> = db.collection('services')
  const services = await getServicesWithPricingMethod({ collection: collection, partnerId: partnerId || '' })

  return res.status(200).json({ data: services })
}

export default apiHandler({ GET: getProposalServices })
