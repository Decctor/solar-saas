import connectToDatabase from '@/services/mongodb/main-db-connection'
import { apiHandler, validateAuthorization } from '@/utils/api'
import { ISession } from '@/utils/models'
import { TActivity } from '@/utils/schemas/activities.schema'
import { TOpportunityHistory } from '@/utils/schemas/opportunity-history.schema'
import { TOpportunity } from '@/utils/schemas/opportunity.schema'
import { TUser } from '@/utils/schemas/user.schema'
import dayjs from 'dayjs'
import createHttpError from 'http-errors'
import { Collection, Filter } from 'mongodb'
import { NextApiHandler } from 'next'

type GetOpportunititiesResult = {
  _id: string
  nome: string
  tipo: string
  responsaveis: {
    id: string
    nome: string
    papel: string
    avatar_url?: string | null
  }[]
  idPropostaAtiva?: string | null
  identificador: string
  proposta?: {
    _id: string
    nome: string
    valor: number
  }[]
  perda: {
    idMotivo?: string | null
    descricaoMotivo?: string | null
    data?: string | null
  }
  ganho: {
    idProposta?: string | null
    idProjeto?: string | null
    data?: string | null
  }
  dataInsercao: string
}

type GetOpportunititiesParams = {
  collection: Collection<TOpportunity>
  query: Filter<TOpportunity>
}
async function getOpportunitities({ collection, query }: GetOpportunititiesParams) {
  try {
    // In case user has global scope and its querying for overall stats

    const pipeline = [
      {
        $match: {
          ...query,
        },
      },
      {
        $addFields: {
          proposalObjectID: {
            $toObjectId: '$idPropostaAtiva',
          },
        },
      },
      {
        $lookup: {
          from: 'proposals',
          localField: 'proposalObjectID',
          foreignField: '_id',
          as: 'proposta',
        },
      },
      {
        $project: {
          nome: 1,
          tipoProjeto: 1,
          responsaveis: 1,
          idPropostaAtiva: 1,
          identificador: 1,
          'proposta._id': 1,
          'proposta.nome': 1,
          'proposta.valor': 1,
          perda: 1,
          ganho: 1,
          dataInsercao: 1,
        },
      },
      {
        $sort: {
          dataInsercao: 1,
        },
      },
    ]

    const projects = await collection.aggregate(pipeline).toArray()
    return projects as GetOpportunititiesResult[]
  } catch (error) {
    throw error
  }
}
type GetActivitiesParams = {
  collection: Collection<TActivity>
  query: Filter<TActivity>
}
async function getActivities({ collection, query }: GetActivitiesParams) {
  try {
    const activities = await collection.find({ dataConclusao: null, ...query }, { sort: { dataVencimento: 1 } }).toArray()
    return activities
  } catch (error) {
    throw error
  }
}
type GetResponse = {
  data: unknown
}

const getStats: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthorization(req, res, 'oportunidades', 'visualizar', true)
  const partnerId = session.user.idParceiro
  const partnerScope = session.user.permissoes.parceiros.escopo
  const opportunityVisibilityScope = session.user.permissoes.oportunidades.escopo

  const { after, before, responsible, partner } = req.query
  console.log(req.query)
  if (typeof after != 'string' || typeof before != 'string') throw new createHttpError.BadRequest('Parâmetros de período inválidos.')

  // Validating existence of responsible in query and its type
  if (!responsible || typeof responsible != 'string') throw new createHttpError.BadRequest('ID de responsável inválido.')
  // Validating existence of partner in query and its type
  if (!partner || typeof partner != 'string') throw new createHttpError.BadRequest('ID do parceiro inválido.')

  // If responsible was sent as null, which means all users, validating if user has global scope
  if (responsible == 'null' && !!opportunityVisibilityScope) throw new createHttpError.BadRequest('Seu usuário não possui permissão de visualização geral.')
  // If partner was sent as null, which means all partner, validating if user has global scope
  if (partner == 'null' && !!partnerScope) throw new createHttpError.BadRequest('Seu usuário não possui permissão de visualização geral.')

  // Validing user scope visibility
  if (!!opportunityVisibilityScope && !opportunityVisibilityScope.includes(responsible))
    throw new createHttpError.BadRequest('Seu escopo de visibilidade não contempla esse usuário.')
  // Validing parter scope visibility
  if (!!partnerScope && !partnerScope.includes(partner)) throw new createHttpError.BadRequest('Seu escopo de visibilidade não contempla esse parceiro.')

  const queryResponsible: Filter<TOpportunity> = responsible != 'null' ? { 'responsaveis.id': responsible } : {}
  const queryPartner: Filter<TOpportunity> = partner != 'null' ? { idParceiro: partner } : {}
  const query = { ...queryResponsible, ...queryPartner }

  const afterDate = dayjs(after).set('hour', -3).toDate()
  const beforeDate = dayjs(before).set('hour', 20).toDate()
  const afterWithMarginDate = new Date(dayjs(after).subtract(1, 'month').toISOString())
  const beforeWithMarginDate = new Date(dayjs(before).subtract(1, 'month').set('hour', 22).toISOString())

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const opportunitiesCollection: Collection<TOpportunity> = db.collection('opportunities')

  const activitiesCollection: Collection<TActivity> = db.collection('activities')

  const opportunities = await getOpportunitities({
    collection: opportunitiesCollection,
    query: query,
  })
  const activities = await getActivities({ collection: activitiesCollection, query: query as Filter<TActivity> })
  // prettier-ignore
  const signedProposals = getSignedProposals({opportunities,afterDate,beforeDate});

  const condensedInfo = getCondensedInfo({ opportunities, afterDate, beforeDate, afterWithMarginDate, beforeWithMarginDate })

  const pendingSignatures = getPendingSignatures({ opportunities })
  // const graphData = getGraphData({ proposals: signedProposals })
  res.status(200).json({
    data: {
      simplificado: condensedInfo,
      propostasAssinadas: signedProposals,
      atividades: activities,
      assinaturasPendentes: pendingSignatures,
    },
  })
}

export default apiHandler({
  GET: getStats,
})

type GetSignedProposalsParams = {
  opportunities: GetOpportunititiesResult[]
  afterDate: Date
  beforeDate: Date
}
function getSignedProposals({ opportunities, afterDate, beforeDate }: GetSignedProposalsParams) {
  // Filtering for projects with contract signed within the period
  const filteredProposals = opportunities.filter((opportunity) => {
    // checking if it is a won opportunity
    const winDate = opportunity.ganho.data ? new Date(opportunity.ganho.data) : null
    if (!winDate) return false

    // checking if the win happened within the provided period
    const wonWithinThePeriod = winDate >= afterDate && winDate <= beforeDate
    if (wonWithinThePeriod) return true
    return false
  })

  const formattedProposals = filteredProposals
    .map((opportunity) => {
      const proposal = opportunity.proposta ? opportunity.proposta[0] : null
      if (!proposal) return null
      const winDate = opportunity.ganho.data
      const responsibles = opportunity.responsaveis
      return {
        ...proposal,
        responsaveis: responsibles,
        dataAssinatura: winDate,
      }
    })
    .filter((o) => o != null)
  const sortedProposals = formattedProposals.sort((a: any, b: any) => new Date(b.dataAssinatura).getTime() - new Date(a.dataAssinatura).getTime())
  return sortedProposals
}
type GetCondensedInfoParams = {
  opportunities: GetOpportunititiesResult[]
  afterDate: Date
  beforeDate: Date
  afterWithMarginDate: Date
  beforeWithMarginDate: Date
}
function getCondensedInfo({ opportunities, afterDate, beforeDate, afterWithMarginDate, beforeWithMarginDate }: GetCondensedInfoParams) {
  const condensedInfo = opportunities.reduce(
    (acc, current) => {
      // Insertion related checkings
      const insertDate = new Date(current.dataInsercao)
      const wasInsertedWithinCurrentPeriod = insertDate >= afterDate && insertDate <= beforeDate
      const wasInsertedWithinPreviousPeriod = insertDate >= afterWithMarginDate && insertDate < beforeWithMarginDate

      // Signing related checkings
      const signatureDate = current.ganho?.data ? new Date(current.ganho?.data) : null
      const hasContractSigned = !!signatureDate
      const wasSignedWithinCurrentPeriod = hasContractSigned && signatureDate >= afterDate && signatureDate <= beforeDate
      const wasSignedWithinPreviousPeriod = hasContractSigned && signatureDate >= afterWithMarginDate && signatureDate < beforeWithMarginDate
      const signedProposal = !!current.ganho?.idProposta && !!current.proposta ? current.proposta[0] : null
      const proposalValue = !!signedProposal && signedProposal.valor ? signedProposal.valor : 0

      // Lost related checkings
      const lostDate = !!current.perda.data ? new Date(current.perda.data) : null
      const isLostProject = !!lostDate
      const wasLostWithinCurrentPeriod = isLostProject && lostDate >= afterDate && lostDate <= beforeDate
      const wasLostWithinPreviousPeriod = isLostProject && lostDate >= afterWithMarginDate && lostDate <= beforeWithMarginDate

      // Increasing ATUAL qtys based on checkings
      if (wasInsertedWithinCurrentPeriod) acc['ATUAL'].projetosCriados += 1
      if (wasSignedWithinCurrentPeriod) acc['ATUAL'].projetosGanhos += 1
      if (wasLostWithinCurrentPeriod) acc['ATUAL'].projetosPerdidos += 1
      if (wasSignedWithinCurrentPeriod) acc['ATUAL'].totalVendido += proposalValue

      // Increasing ANTERIOR qtys based on checkings
      if (wasInsertedWithinPreviousPeriod) acc['ANTERIOR'].projetosCriados += 1
      if (wasSignedWithinPreviousPeriod) acc['ANTERIOR'].projetosGanhos += 1
      if (wasLostWithinPreviousPeriod) acc['ANTERIOR'].projetosPerdidos += 1
      if (wasSignedWithinPreviousPeriod) acc['ANTERIOR'].totalVendido += proposalValue

      return acc
    },
    {
      ANTERIOR: {
        projetosCriados: 0,
        projetosGanhos: 0,
        projetosPerdidos: 0,
        totalVendido: 0,
      },
      ATUAL: {
        projetosCriados: 0,
        projetosGanhos: 0,
        projetosPerdidos: 0,
        totalVendido: 0,
      },
    }
  )
  return condensedInfo
}
type GetPendingSignatures = {
  opportunities: GetOpportunititiesResult[]
}
function getPendingSignatures({ opportunities }: GetPendingSignatures) {
  const filteredOpportunities = opportunities.filter((opportunity) => {
    // Validating if a project was requested
    const hasProjectRequested = !!opportunity.ganho.idProjeto

    // Validating if opportunity was won
    const winDate = !!opportunity.ganho.data

    // Lost related checkings
    const wasLost = !!opportunity.perda.data

    // Validating pendency in signature, which is project requested, pending signature date and not lost
    if (hasProjectRequested && !winDate && !wasLost) return true
    else return false
  })
  const formattedOpportunities = filteredOpportunities.map((opportunity) => {
    const id = opportunity._id
    const name = opportunity.nome
    const identifier = opportunity.identificador

    const responsibles = opportunity.responsaveis

    const proposal = !!opportunity.proposta ? opportunity.proposta[0] : null
    const proposalValue = proposal ? proposal.valor : 0

    return {
      _id: id,
      nome: name,
      identificador: identifier,
      valorProposta: proposalValue,
      responsaveis: responsibles,
    }
  })

  return formattedOpportunities
}
