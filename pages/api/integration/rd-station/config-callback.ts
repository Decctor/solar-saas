import connectToDatabase from '@/services/mongodb/main-db-connection'
import { apiHandler } from '@/utils/api'
import { Optional } from '@/utils/models'
import { TIntegration, TIntegrationRDStation } from '@/utils/schemas/integration.schema'
import axios from 'axios'
import createHttpError from 'http-errors'
import { Collection, ObjectId, WithId } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: string
}
const handleRDIntegrationUpdate: NextApiHandler<GetResponse> = async (req, res) => {
  const { code, state } = req.query
  console.log(req.query)
  // code is the returned auth code that will be used to generate the access_token in for RD Station Marketing API calls
  // state is supposed to be the ID of the integration config document that needs to be update
  if (!state || typeof state != 'string' || !ObjectId.isValid(state)) throw new createHttpError.BadRequest('ID de atualização não fornecido.')

  const db = await connectToDatabase(process.env.MONGODB_URI, 'main')
  const integrationsCollection: Collection<TIntegrationRDStation> = db.collection('integrations')
  // Getting the current document information in database
  const configDocument = await integrationsCollection.findOne({ _id: new ObjectId(state) })
  if (!configDocument) throw new createHttpError.NotFound('Nenhum objeto de integração encontrado para atualização.')
  const client_id = configDocument.client_id
  const client_secret = configDocument.client_secret

  // Request RD Station for the access_token and refresh_token
  const { data: rdStationResponse } = await axios.post('https://api.rd.services/auth/token?token_by=code', { client_id, client_secret, code })
  const { access_token, expires_in, refresh_token } = rdStationResponse

  // Creating a new configuration document and updating the previous one with the access_token and refresh_token for future revalidations
  const newConfigDocument: Optional<WithId<TIntegrationRDStation>, '_id'> = {
    ...configDocument,
    access_token,
    refresh_token,
    dataValidacaoToken: new Date().toISOString(),
  }
  console.log(access_token)
  console.log(expires_in)
  console.log(refresh_token)
  delete newConfigDocument._id
  const updateResponse = await integrationsCollection.updateOne({ _id: new ObjectId(state) }, { $set: { ...newConfigDocument } })
  console.log(updateResponse)
  // Redirecting user to configuracoes page
  res.redirect('/configuracoes?initialMode=integrations')
}

export default apiHandler({
  GET: handleRDIntegrationUpdate,
})
