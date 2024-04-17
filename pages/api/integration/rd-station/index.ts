import connectToDatabase from '@/services/mongodb/main-db-connection'
import { apiHandler, validateAuthentication, validateAuthenticationWithSession } from '@/utils/api'
import { TIntegration } from '@/utils/schemas/integration.schema'
import createHttpError from 'http-errors'
import { Collection } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: TIntegration | null
}

const getIntegrationDetails: NextApiHandler<GetResponse> = async (req, res) => {
  console.log('INTEGRAÇÃO ROTA')
  const session = await validateAuthenticationWithSession(req, res)
  const partnerId = session.user.idParceiro

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const integrationsCollection: Collection<TIntegration> = db.collection('integrations')

  const rdStationInformation = await integrationsCollection.findOne({ identificador: 'RD_STATION', idParceiro: partnerId || '' })

  return res.status(200).json({ data: rdStationInformation })
}

type PostResponse = {
  data: {
    insertedId: string
  }
  message: string
}
const createRdStationConfig: NextApiHandler<PostResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const partnerId = session.user.idParceiro

  const { client_id, client_secret } = req.body
  if (!client_id || typeof client_id != 'string') throw new createHttpError.BadRequest('ID de cliente (client_id) não informado.')
  if (!client_secret || typeof client_secret != 'string') throw new createHttpError.BadRequest('ID secreto (secret_id) não informado.')
  const author = { id: session.user.id, nome: session.user.nome, avatar_url: session.user.avatar_url }

  const IntegrationConfig = {
    identificador: 'RD_STATION',
    idParceiro: partnerId || '',
    autor: author,
    dataInsercao: new Date().toISOString(),
    client_id,
    client_secret,
  }

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const integrationsCollection: Collection<TIntegration> = db.collection('integrations')
  // @ts-ignore
  const insertResponse = await integrationsCollection.insertOne(IntegrationConfig)
  if (!insertResponse) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido na criação do configuração de integração.')

  return res.status(201).json({
    data: {
      insertedId: insertResponse.insertedId.toString(),
    },
    message: 'Registro de configuração de integração feito com sucesso!',
  })
}

export default apiHandler({
  GET: getIntegrationDetails,
  POST: createRdStationConfig,
})
