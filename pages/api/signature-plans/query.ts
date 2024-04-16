import { getSignaturePlansWithPricingMethod } from '@/repositories/signature-plans/queries'
import connectToDatabase from '@/services/mongodb/main-db-connection'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TSignaturePlan, TSignaturePlanDTOWithPricingMethod, TSignaturePlanWithPricingMethod } from '@/utils/schemas/signature-plans.schema'
import { Collection } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: TSignaturePlanWithPricingMethod[]
}
const getSignaturePlans: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const partnerId = session.user.idParceiro
  const db = await connectToDatabase(process.env.MONGODB_URI, 'main')
  const collection: Collection<TSignaturePlan> = db.collection('signature-plans')
  const plans = await getSignaturePlansWithPricingMethod({ collection: collection, partnerId: partnerId || '' })

  return res.status(200).json({ data: plans })
}

export default apiHandler({ GET: getSignaturePlans })