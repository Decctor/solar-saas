import { insertFunnelReference, updateFunnelReference } from '@/repositories/funnel-references/mutations'
import connectToDatabase from '@/services/mongodb/main-db-connection'
import { apiHandler, validateAuthorization } from '@/utils/api'
import { InsertFunnelReferenceSchema, TFunnelReference } from '@/utils/schemas/funnel-reference.schema'
import createHttpError from 'http-errors'
import { Collection, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'
type PostResponse = {
  data: {
    insertedId: string
  }
  message: string
}
const createFunnelReference: NextApiHandler<PostResponse> = async (req, res) => {
  const session = await validateAuthorization(req, res, 'oportunidades', 'criar', true)
  const partnerId = session.user.idParceiro
  // Parsing insert object from request
  const funnelReference = InsertFunnelReferenceSchema.parse(req.body)

  const db = await connectToDatabase(process.env.MONGODB_URI, 'main')
  const funnelReferencesCollection: Collection<TFunnelReference> = db.collection('funnel-references')

  const insertResponse = await insertFunnelReference({ collection: funnelReferencesCollection, info: funnelReference, partnerId: partnerId || '' })
  // In case something went wrong, acknowledged would be false, so throwing an error
  if (!insertResponse.acknowledged)
    throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido na criação da referência de funil.')
  // Else, returning the inserted ID
  const insertedId = insertResponse.insertedId.toString()
  return res.status(201).json({ data: { insertedId: insertedId }, message: 'Referência de funil criada com sucesso!' })
}
type PutResponse = {
  data: string
  message: string
}
const editFunnelReference: NextApiHandler<PutResponse> = async (req, res) => {
  const session = await validateAuthorization(req, res, 'oportunidades', 'criar', true)
  const partnerId = session.user.idParceiro
  // Validing update id
  const { id } = req.query
  if (typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')

  const db = await connectToDatabase(process.env.MONGODB_URI, 'main')
  const funnelReferencesCollection: Collection<TFunnelReference> = db.collection('funnel-references')

  // Validing payload, checking if there is new stage id reference
  const updates = InsertFunnelReferenceSchema.partial().parse(req.body)
  const newStageId = updates.idEstagioFunil
  if (!newStageId) throw new createHttpError.BadRequest('Novo estágio de funil não informado.')

  const updateResponse = await updateFunnelReference({
    collection: funnelReferencesCollection,
    funnelReferenceId: id,
    newStageId: newStageId,
    partnerId: partnerId || '',
  })
  if (!updateResponse.acknowledged)
    throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido na atualização da referência de funil.')
  res.status(201).json({ data: 'Atualização feita com sucesso!', message: 'Atualização feita com sucesso !' })
}
export default apiHandler({
  POST: createFunnelReference,
  PUT: editFunnelReference,
})
