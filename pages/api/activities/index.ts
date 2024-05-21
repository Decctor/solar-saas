import { insertActivity, updateActivity } from '@/repositories/acitivities/mutations'
import {
  getActivitiesByHomologationId,
  getActivitiesByOpportunityId,
  getActivitiesByResponsibleId,
  getActivitiesByTechnicalAnalysisId,
  getAllActivities,
} from '@/repositories/acitivities/queries'
import connectToDatabase from '@/services/mongodb/crm-db-connection'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { InsertActivitySchema, TActivity } from '@/utils/schemas/activities.schema'
import createHttpError from 'http-errors'
import { Collection, Filter, FilterOperators, MatchKeysAndValues, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: TActivity | TActivity[]
}
const getActivities: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const partnerId = session.user.idParceiro
  const parterScope = session.user.permissoes.parceiros.escopo
  const partnerQuery: Filter<TActivity> = parterScope ? { idParceiro: { $in: [...parterScope] } } : {}

  const { opportunityId, homologationId, technicalAnalysisId, responsibleId, openOnly, dueOnly } = req.query

  // Specifing queries
  const queryOpenOnly: Filter<TActivity> = openOnly == 'true' ? { dataConclusao: null } : {}
  const queryDueOnly: Filter<TActivity> = dueOnly == 'true' ? { dataVencimento: { $ne: null } } : {}
  // Final query
  const query: Filter<TActivity> = { ...partnerQuery, ...queryOpenOnly, ...queryDueOnly }

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const collection: Collection<TActivity> = db.collection('activities')

  if (opportunityId) {
    if (typeof opportunityId != 'string' || !ObjectId.isValid(opportunityId)) throw new createHttpError.BadRequest('ID de oportunidade inválido.')
    const activities = await getActivitiesByOpportunityId({ collection: collection, opportunityId: opportunityId, query: query })
    return res.status(200).json({ data: activities })
  }
  if (homologationId) {
    if (typeof homologationId != 'string' || !ObjectId.isValid(homologationId)) throw new createHttpError.BadRequest('ID de homologação inválido.')
    const activities = await getActivitiesByHomologationId({ collection: collection, homologationId: homologationId, query: query })
    return res.status(200).json({ data: activities })
  }
  if (technicalAnalysisId) {
    if (typeof technicalAnalysisId != 'string' || !ObjectId.isValid(technicalAnalysisId))
      throw new createHttpError.BadRequest('ID de análise técnica inválido.')
    const activities = await getActivitiesByTechnicalAnalysisId({ collection: collection, technicalAnalysisId: technicalAnalysisId, query: query })
    return res.status(200).json({ data: activities })
  }
  if (responsibleId) {
    if (typeof responsibleId != 'string' || !ObjectId.isValid(responsibleId)) throw new createHttpError.BadRequest('ID de responsável inválido.')
    const activities = await getActivitiesByResponsibleId({ collection: collection, responsibleId: responsibleId, query: query })
    return res.status(200).json({ data: activities })
  }
  const allActivities = await getAllActivities({ collection: collection, query: query })
  return res.status(200).json({ data: allActivities })
}

type PostResponse = {
  data: { insertedId: string }
  message: string
}

const createActivity: NextApiHandler<PostResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const activity = InsertActivitySchema.parse(req.body)

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const collection: Collection<TActivity> = db.collection('activities')

  const insertResponse = await insertActivity({ collection: collection, info: activity })
  if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError('Ooops, houve um erro desconhecido ao criar atividade.')
  const insertedId = insertResponse.insertedId.toString()
  return res.status(201).json({ data: { insertedId }, message: 'Atividade criada com sucesso !' })
}

type PutResponse = {
  data: string
  message: string
}

const editActivity: NextApiHandler<PutResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const partnerId = session.user.idParceiro
  const parterScope = session.user.permissoes.parceiros.escopo
  const partnerQuery: Filter<TActivity> = parterScope ? { idParceiro: { $in: [...parterScope] } } : {}

  const { id } = req.query

  if (!id || typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')

  const changes = InsertActivitySchema.partial().parse(req.body)

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const collection: Collection<TActivity> = db.collection('activities')

  const updateResponse = await updateActivity({ activityId: id, collection: collection, changes: changes, query: partnerQuery })
  if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido ao atualizar atividade.')

  return res.status(201).json({ data: 'Atividade atualizada com sucesso !', message: 'Atividade atualizada com sucesso !' })
}
export default apiHandler({ GET: getActivities, POST: createActivity, PUT: editActivity })
