import { insertFunnel, updateFunnel } from '@/repositories/funnels/mutations'
import { getFunnelById, getPartnerFunnels } from '@/repositories/funnels/queries'
import connectToDatabase from '@/services/mongodb/crm-db-connection'
import { apiHandler, validateAuthentication, validateAuthenticationWithSession, validateAuthorization } from '@/utils/api'
import { InsertFunnelSchema, TFunnel, TFunnelEntity } from '@/utils/schemas/funnel.schema'
import createHttpError from 'http-errors'
import { Collection, Filter, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: TFunnelEntity | TFunnelEntity[]
}
const getFunnel: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const partnerId = session.user.idParceiro
  const parterScope = session.user.permissoes.parceiros.escopo
  const partnerQuery: Filter<TFunnel> = parterScope ? { idParceiro: { $in: [...parterScope, null] } } : {}

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const funnelsCollection: Collection<TFunnel> = db.collection('funnels')

  const { id } = req.query

  if (id) {
    if (typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')
    const funnel = await getFunnelById({ collection: funnelsCollection, id: id, query: partnerQuery })
    return res.status(200).json({ data: funnel })
  }
  const funnels = await getPartnerFunnels({ collection: funnelsCollection, query: partnerQuery })
  return res.status(200).json({ data: funnels })
}
type PostResponse = {
  data: {
    insertedId: string
  }
  message: string
}
const createFunnel: NextApiHandler<PostResponse> = async (req, res) => {
  const session = await validateAuthorization(req, res, 'configuracoes', 'funis', true)
  const partnerId = session.user.idParceiro
  const infoParsed = InsertFunnelSchema.parse(req.body)
  const funnel = {
    ...infoParsed,
    idParceiro: infoParsed.idParceiro || partnerId || '',
    dataInsercao: new Date().toISOString(),
  }

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const funnelsCollection: Collection<TFunnel> = db.collection('funnels')

  const insertResponse = await insertFunnel({ collection: funnelsCollection, info: funnel, partnerId })
  if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido na criação do funil.')
  return res.status(201).json({ data: { insertedId: insertResponse.insertedId.toString() }, message: 'Funil criado com sucesso !' })
}

type PutResponse = {
  data: string
  message: string
}
const editFunnel: NextApiHandler<PutResponse> = async (req, res) => {
  const session = await validateAuthorization(req, res, 'configuracoes', 'funis', true)
  const partnerId = session.user.idParceiro
  const parterScope = session.user.permissoes.parceiros.escopo
  const partnerQuery: Filter<TFunnel> = parterScope ? { idParceiro: { $in: [...parterScope, null] } } : {}

  const { id } = req.query
  if (!id || typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')

  const changes = InsertFunnelSchema.partial().parse(req.body)

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const collection: Collection<TFunnel> = db.collection('funnels')

  const updateResponse = await updateFunnel({ id: id, collection: collection, changes: changes, query: partnerQuery })
  if (updateResponse.matchedCount == 0) throw new createHttpError.NotFound('Funil não encontrado.')

  if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido na atualização do funil.')
  return res.status(201).json({ data: 'Funil alterado com sucesso !', message: 'Funil alterado com sucesso !' })
}

export default apiHandler({
  GET: getFunnel,
  POST: createFunnel,
  PUT: editFunnel,
})
