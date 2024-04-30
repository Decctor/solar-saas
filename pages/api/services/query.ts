import { getServicesWithPricingMethod } from '@/repositories/services/queries'
import connectToDatabase from '@/services/mongodb/main-db-connection'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'

import { TService, TServiceWithPricingMethod } from '@/utils/schemas/service.schema'
import { Collection, Filter } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: TServiceWithPricingMethod[]
}

const getProposalServices: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const partnerId = session.user.idParceiro
  const parterScope = session.user.permissoes.parceiros.escopo
  const partnerQuery: Filter<TService> = { idParceiro: parterScope ? { $in: [...parterScope, null] } : { $ne: undefined } }

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const collection: Collection<TService> = db.collection('services')
  const services = await getServicesWithPricingMethod({ collection: collection, query: partnerQuery })

  return res.status(200).json({ data: services })
}

export default apiHandler({ GET: getProposalServices })
