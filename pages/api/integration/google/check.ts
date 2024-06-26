import connectToDatabase from '@/services/mongodb/crm-db-connection'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TIntegrationGoogleAuth } from '@/utils/schemas/integration.schema'
import { Collection, Filter } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: { hasIntegration: boolean }
}

const getGoogleIntegrationRegistry: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const userId = session.user.id
  const partnerId = session.user.idParceiro

  const partnerQuery: Filter<TIntegrationGoogleAuth> = { idParceiro: partnerId }
  const userQuery: Filter<TIntegrationGoogleAuth> = { idUsuario: userId }

  const query = { ...partnerQuery, ...userQuery }
  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const integrationsCollection: Collection<TIntegrationGoogleAuth> = db.collection('integrations')

  const integrationsMatched = await integrationsCollection.countDocuments({ identificador: 'GOOGLE_AUTH', ...query })

  return res.status(200).json({ data: { hasIntegration: integrationsMatched > 0 } })
}

export default apiHandler({ GET: getGoogleIntegrationRegistry })
