import { getDateDifference } from '@/lib/methods/extracting'
import { getFunnelReferences } from '@/repositories/funnel-references/queries'
import { insertOpportunity, updateOpportunity } from '@/repositories/opportunities/mutations'
import { getOpportunitiesByQuery, getOpportunityById } from '@/repositories/opportunities/queries'
import { getOpenActivities } from '@/repositories/opportunity-history/queries'
import connectToDatabase from '@/services/mongodb/main-db-connection'
import { apiHandler, validateAuthentication, validateAuthorization } from '@/utils/api'
import { TActivity, TActivityDTO } from '@/utils/schemas/activities.schema'

import { TFunnelReference } from '@/utils/schemas/funnel-reference.schema'
import { TOpportunityHistory } from '@/utils/schemas/opportunity-history.schema'
import {
  InsertOpportunitySchema,
  TOpportunity,
  TOpportunityDTOWithClient,
  TOpportunitySimplifiedWithProposalAndActivitiesAndFunnels,
} from '@/utils/schemas/opportunity.schema'
import dayjs from 'dayjs'
import createHttpError from 'http-errors'
import { Collection, Document, Filter, MatchKeysAndValues, ObjectId, WithId } from 'mongodb'
import { NextApiHandler } from 'next'
import { z } from 'zod'

export type ActivitiesByStatus = {
  [key: string]: number
}
function getOpportunityActivityPendencyStatus(activities: WithId<TActivity>[]) {
  const currentDate = new Date().toISOString()
  const qty = activities.length
  if (qty == 0) return undefined

  const activitiesByStatus = activities.reduce((acc: ActivitiesByStatus, current) => {
    const dueDate = current.dataVencimento || new Date().toISOString()
    const dateDiffDays = getDateDifference({ dateOne: dueDate, dateTwo: currentDate, absolute: false }) || 0
    var status = 'A VENCER'
    if (dateDiffDays < 0) status = 'EM ATRASO'
    if (dateDiffDays < 3) status = 'EM VENCIMENTO'
    if (dateDiffDays > 3) status == 'A VENCER'
    if (!acc[status]) acc[status] = 0
    acc[status] += 1
    return acc
  }, {})
  return activitiesByStatus
}

type PostResponse = {
  data: {
    insertedId: string
  }
  message: string
}

const createOpportunity: NextApiHandler<PostResponse> = async (req, res) => {
  const session = await validateAuthorization(req, res, 'oportunidades', 'criar', true)
  const partnerId = session.user.idParceiro

  const project = InsertOpportunitySchema.parse(req.body)

  const db = await connectToDatabase(process.env.MONGODB_URI, 'main')
  const collection: Collection<TOpportunity> = db.collection('opportunities')

  const insertResponse = await insertOpportunity({ collection: collection, info: project, partnerId: partnerId || '' })
  if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido na criação do projeto.')
  const insertedId = insertResponse.insertedId.toString()
  res.status(201).json({ data: { insertedId: insertedId }, message: 'Projeto criado com sucesso.' })
}

const statusOptionsQueries = {
  GANHOS: { 'ganho.data': { $ne: null } },
  PERDIDOS: { 'perda.data': { $ne: null } },
}

type GetResponse = {
  data: TOpportunitySimplifiedWithProposalAndActivitiesAndFunnels[] | TOpportunityDTOWithClient
}

const getOpportunities: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthorization(req, res, 'oportunidades', 'visualizar', true)
  const partnerId = session.user.idParceiro
  const userScope = session.user.permissoes.oportunidades.escopo

  const db = await connectToDatabase(process.env.MONGODB_URI, 'main')
  const opportunitiesCollection: Collection<TOpportunity> = db.collection('opportunities')
  const funnelReferencesCollection: Collection<TFunnelReference> = db.collection('funnel-references')
  const opportunityActivitiesCollection: Collection<TActivity> = db.collection('activities')

  const { id, responsible, funnel, after, before, status } = req.query

  // There are two possible query dynamics, query by ID or query by funnel-status

  // In case of query by ID, looking for the requested opportunity within the partners scope
  if (id) {
    if (typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')

    const opportunity = await getOpportunityById({ collection: opportunitiesCollection, id: id, partnerId: partnerId })
    if (!opportunity) throw new createHttpError.BadRequest('Nenhum projeto encontrado.')

    return res.status(200).json({ data: opportunity })
  }

  // In the other case, we gotta structure the funnel-status query
  var queryParam: MatchKeysAndValues<TOpportunity> = {}

  if (typeof responsible != 'string') throw new createHttpError.BadRequest('Responsável inválido')
  if (typeof funnel != 'string' || funnel == 'null') throw new createHttpError.BadRequest('Funil inválido')
  if (typeof after != 'string' || typeof before != 'string') throw new createHttpError.BadRequest('Parâmetros de período inválidos.')

  const isPeriodDefined = after != 'undefined' && before != 'undefined'
  const statusOption = statusOptionsQueries[status as keyof typeof statusOptionsQueries] || {}

  // Validing user scope visibility
  if (!!userScope && !userScope.includes(responsible)) throw new createHttpError.BadRequest('Seu escopo de visibilidade não contempla esse usuário.')

  // Defining the responsible query parameters. If specified, filtering opportunities in the provided responsible scope
  const queryResponsible: Filter<TOpportunity> = responsible != 'null' ? { 'responsaveis.id': responsible } : {}
  // Defining, if provided, period query parameters for date of insertion
  const queryInsertion: Filter<TOpportunity> = isPeriodDefined ? { $and: [{ dataInsercao: { $gte: after } }, { dataInsercao: { $lte: before } }] } : {}
  // Defining, if provided, won/lost query parameters
  const queryStatus: Filter<TOpportunity> = status != 'undefined' ? statusOption : { 'perda.data': null, 'ganho.data': null }

  const query = { ...queryResponsible, ...queryInsertion, ...queryStatus }
  // if (responsible != 'null') queryParam = { 'responsaveis.id': responsible, 'perda.data': null }
  // else queryParam = { 'perda.data': null }
  // // Defining, if provided, period query parameters for date of insertion
  // if (after != 'undefined' && before != 'undefined') {
  //   queryParam = { ...queryParam, $and: [{ dataInsercao: { $gte: after } }, { dataInsercao: { $lte: before } }] }
  // }
  // // Defining, if provided, won/lost query parameters
  // if (status == 'PERDIDOS') queryParam = { ...queryParam, 'perda.data': { $ne: null } }
  // if (status == 'GANHOS') queryParam = { ...queryParam, 'ganho.idProjeto': { $ne: null } }

  const opportunities = await getOpportunitiesByQuery({ collection: opportunitiesCollection, query: query, partnerId: partnerId || '' })
  // Looking for the funnel references
  const funnelReferences = await getFunnelReferences({ collection: funnelReferencesCollection, funnelId: funnel, partnerId: partnerId || '' })
  // Looking for open activities
  const activities = await getOpenActivities({ collection: opportunityActivitiesCollection, partnerId: partnerId || '' })

  // Formatting projects with the respective funnel reference
  const opportunitiesWithFunnelAndActivities: (WithId<TOpportunitySimplifiedWithProposalAndActivitiesAndFunnels> | null)[] = opportunities.map(
    (opportunity) => {
      // Getting the equivalent funnel reference for the current opportunity
      const opportunityFunnelReference = funnelReferences.find((reference) => reference.idOportunidade == opportunity._id.toString())
      if (!opportunityFunnelReference) return null
      // Getting all pending activities for the current opportunity
      const opportunityActivities = activities.filter((activity) => activity.oportunidade.id == opportunity._id.toString())
      const activitiesStatus = getOpportunityActivityPendencyStatus(opportunityActivities)
      return {
        ...opportunity,
        proposta: {
          nome: opportunity.proposta[0]?.nome,
          valor: opportunity.proposta[0]?.valor,
          potenciaPico: opportunity.proposta[0]?.potenciaPico,
        },
        funil: {
          id: opportunityFunnelReference._id.toString(),
          idFunil: opportunityFunnelReference.idFunil,
          idEstagio: opportunityFunnelReference.idEstagioFunil,
        },
        statusAtividades: activitiesStatus,
      }
    }
  )
  const filteredOpportunitiesWithFunnelReference = opportunitiesWithFunnelAndActivities.filter(
    (opportunity) => !!opportunity?._id
  ) as WithId<TOpportunitySimplifiedWithProposalAndActivitiesAndFunnels>[]

  return res.status(200).json({ data: filteredOpportunitiesWithFunnelReference })
}

type PutResponse = {
  data: string
  message: string
}
const editOpportunity: NextApiHandler<PutResponse> = async (req, res) => {
  const session = await validateAuthorization(req, res, 'oportunidades', 'editar', true)
  const partnerId = session.user.idParceiro
  const userId = session.user.id
  const userScope = session.user.permissoes.oportunidades.escopo

  const { id } = req.query
  const changes = req.body

  if (!id || typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID de oportunidade inválido.')

  const db = await connectToDatabase(process.env.MONGODB_URI, 'main')
  const opportunitiesCollection: Collection<TOpportunity> = db.collection('opportunities')
  const opportunity = await getOpportunityById({ collection: opportunitiesCollection, id: id, partnerId: partnerId })
  if (!opportunity) throw new createHttpError.NotFound('Oportunidade não encontrada.')

  // Validating if user either: has global opportunity scope, its one of the opportunity responsibles or has one of the opportunity responsibles within his scope
  const hasEditAuthorizationForOpportunity = !userScope || opportunity.responsaveis.some((opResp) => opResp.id == userId || userScope.includes(opResp.id))
  if (!hasEditAuthorizationForOpportunity) throw new createHttpError.Unauthorized('Você não possui permissão para alterar informações dessa oportunidade.')

  const updateResponse = await updateOpportunity({ id: id, collection: opportunitiesCollection, changes: changes, partnerId: partnerId || '' })

  if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido na atualização da oportunidade.')
  return res.status(201).json({ data: 'Oportunidade alterada com sucesso !', message: 'Oportunidade alterada com sucesso !' })
}
// const editProjects: NextApiHandler<PutResponse> = async (req, res) => {
//   const session = await validateAuthorization(req, res, 'projetos', 'serResponsavel', true)

//   const { id, responsavel } = req.query
//   const userId = session.user.id
//   const userHasEditPermission = session.user.permissoes.projetos.editar

//   if (!id || typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID do objeto de alteração não especificado.')
//   if (!req.body.changes) throw new createHttpError.BadRequest('Mudanças não especificadas na requisição.')
//   const db = await connectToDatabase(process.env.MONGODB_URI, 'main')
//   const collection = db.collection('projects')
//   if (!userHasEditPermission) await validateEditAuthorization({ collection, userId, projectId: id })

//   const changes = editProjectSchema.parse(req.body.changes)
//   const setObj = formatUpdateSetObject(changes)
//   console.log('SET OBJECT', setObj)
//   if (typeof id === 'string') {
//     const data = await collection.findOneAndUpdate(
//       {
//         _id: new ObjectId(id),
//       },
//       {
//         $set: { ...setObj },
//       },
//       {
//         returnDocument: 'after',
//       }
//     )
//     res.status(201).json({ data: data.value as any, message: 'Projeto alterado com sucesso.' })
//   }
// }
export default apiHandler({
  POST: createOpportunity,
  GET: getOpportunities,
  PUT: editOpportunity,
})

type ValidateEditAuthorizationParams = {
  collection: Collection
  projectId: string
  userId: string
}
async function validateEditAuthorization({ collection, projectId, userId }: ValidateEditAuthorizationParams) {
  try {
    const projectSimplified = await collection.findOne({ _id: new ObjectId(projectId) }, { projection: { responsavel: 1, representante: 1 } })
    if (!projectSimplified) throw new createHttpError.NotFound('Projeto não econtrado.')
    const isAuthorized = userId == projectSimplified.responsavel.id || userId == projectSimplified.representante.id

    if (!isAuthorized) throw new createHttpError.Unauthorized('Somente o responsável/representante ou administradores podem alterar esse projeto.')
  } catch (error) {
    throw error
  }
}
