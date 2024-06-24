import connectToDatabase from '@/services/mongodb/crm-db-connection'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TIntegrationGoogleAuth, TIntegrationRDStation } from '@/utils/schemas/integration.schema'
import { Collection, Filter } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: TIntegrationGoogleAuth | null
}

const getGoogleIntegrationRegistry: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const userId = session.user.id
  const partnerId = session.user.idParceiro

  const partnerQuery: Filter<TIntegrationGoogleAuth> = { idParceiro: partnerId }

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const integrationsCollection: Collection<TIntegrationGoogleAuth> = db.collection('integrations')

  const googleIntegration = await integrationsCollection.findOne({ identificador: 'GOOGLE_AUTH', userId: userId, ...partnerQuery })

  return res.status(200).json({ data: googleIntegration })
}

export default apiHandler({ GET: getGoogleIntegrationRegistry })
