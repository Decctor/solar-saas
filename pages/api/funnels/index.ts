import { insertFunnel } from '@/repositories/funnels/mutations'
import { getFunnelById, getPartnerFunnels } from '@/repositories/funnels/queries'
import connectToDatabase from '@/services/mongodb/main-db-connection'
import { apiHandler, validateAuthentication, validateAuthenticationWithSession, validateAuthorization } from '@/utils/api'
import { InsertFunnelSchema, TFunnel, TFunnelEntity } from '@/utils/schemas/funnel.schema'
import createHttpError from 'http-errors'
import { Collection, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: TFunnelEntity | TFunnelEntity[]
}
const getFunnel: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const userPartnerId = session.user.idParceiro
  const db = await connectToDatabase(process.env.MONGODB_URI, 'main')
  const funnelsCollection: Collection<TFunnel> = db.collection('funnels')

  const { id } = req.query

  if (id) {
    if (typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')
    const funnel = await getFunnelById({ collection: funnelsCollection, id: id, partnerId: userPartnerId || '' })
    return res.status(200).json({ data: funnel })
  }
  const funnels = await getPartnerFunnels({ collection: funnelsCollection, partnerId: userPartnerId || '' })
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

  const db = await connectToDatabase(process.env.MONGODB_URI, 'main')
  const funnelsCollection: Collection<TFunnel> = db.collection('funnels')

  const insertResponse = await insertFunnel({ collection: funnelsCollection, info: funnel, partnerId })
  if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido na criação do funil.')
  return res.status(201).json({ data: { insertedId: insertResponse.insertedId.toString() }, message: 'Funil criado com sucesso !' })
}

export default apiHandler({
  GET: getFunnel,
  POST: createFunnel,
})
