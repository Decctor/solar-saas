import { insertOpportunityHistory, updateOpportunityHistory } from '@/repositories/opportunity-history/mutation'
import { getOpportunityHistory, getOpportunityHistoryById } from '@/repositories/opportunity-history/queries'
import connectToDatabase from '@/services/mongodb/crm-db-connection'
import { apiHandler, validateAuthorization } from '@/utils/api'
import {
  InsertOpportunityHistorySchema,
  TOpportunityHistory,
  TOpportunityHistoryEntity,
  UpdateOpportunityHistorySchema,
} from '@/utils/schemas/opportunity-history.schema'
import createHttpError from 'http-errors'
import { Collection, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'

type PostResponse = {
  data: {
    insertedId: string
  }
  message: string
}

const createOpportunityHistory: NextApiHandler<PostResponse> = async (req, res) => {
  const session = await validateAuthorization(req, res, 'oportunidades', 'editar', true)
  const partnerId = session.user.idParceiro

  const opportunityHistory = InsertOpportunityHistorySchema.parse(req.body)

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const opportunityHistoryCollection: Collection<TOpportunityHistory> = db.collection('opportunities-history')

  const insertResponse = await insertOpportunityHistory({ collection: opportunityHistoryCollection, info: opportunityHistory, partnerId: partnerId || '' })
  if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido na criação do histórico da oportunidade.')
  const insertedId = insertResponse.insertedId.toString()

  res.status(201).json({ data: { insertedId: insertedId }, message: 'Evento de oportunidade criado com sucesso.' })
}

type GetResponse = {
  data: TOpportunityHistory[]
}

const getTypes = ['open-activities']
const getOpportunitiesHistory: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthorization(req, res, 'oportunidades', 'visualizar', true)
  const partnerId = session.user.idParceiro

  const { opportunityId, type } = req.query
  if (!opportunityId || typeof opportunityId != 'string' || !ObjectId.isValid(opportunityId))
    throw new createHttpError.BadRequest('ID de oportunidade inválido.')

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const collection: Collection<TOpportunityHistory> = db.collection('opportunities-history')

  const history = await getOpportunityHistory({ opportunityId: opportunityId, collection: collection, partnerId: partnerId || '' })

  return res.status(200).json({ data: history })
}

type PutResponse = {
  data: string
  message: string
}

const editOpportunityHistory: NextApiHandler<PutResponse> = async (req, res) => {
  const session = await validateAuthorization(req, res, 'oportunidades', 'editar', true)
  const userId = session.user.id
  const partnerId = session.user.idParceiro
  const userScope = session.user.permissoes.oportunidades.escopo

  const { id } = req.query
  if (!id || typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')
  const changes = UpdateOpportunityHistorySchema.parse(req.body)
  // const changes = req.body
  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const opportunityHistoryCollection: Collection<TOpportunityHistory> = db.collection('opportunities-history')
  // Validating existence of opportunity history
  const opportunityHistory = await getOpportunityHistoryById({ collection: opportunityHistoryCollection, id: id, partnerId: partnerId || '' })
  if (!opportunityHistory) throw new createHttpError.NotFound('Objeto de alteração não encontrada.')
  // Checking for opportunity history edit authorization
  // @ts-ignore
  if (!!userScope && !userScope.includes(opportunityHistory.responsavel?.id))
    new createHttpError.Unauthorized('Usuário não possui permissão para essa alteração.')

  const updateResponse = await updateOpportunityHistory({
    id: id,
    collection: opportunityHistoryCollection,
    changes: changes,
    partnerId: partnerId || '',
  })
  if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido na criação do usuário.')
  return res.status(201).json({ data: 'Objeto alterado com sucesso !', message: 'Objeto alterado com sucesso !' })
}
export default apiHandler({
  GET: getOpportunitiesHistory,
  POST: createOpportunityHistory,
  PUT: editOpportunityHistory,
})
