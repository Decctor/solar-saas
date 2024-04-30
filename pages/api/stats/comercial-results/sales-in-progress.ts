import { getPartnerFunnels } from '@/repositories/funnels/queries'
import connectToDatabase from '@/services/mongodb/main-db-connection'
import { apiHandler, validateAuthorization } from '@/utils/api'

import { Funnel } from '@/utils/models'
import { TFunnelReference } from '@/utils/schemas/funnel-reference.schema'
import { TFunnel } from '@/utils/schemas/funnel.schema'
import { TOpportunity } from '@/utils/schemas/opportunity.schema'

import { TProposal } from '@/utils/schemas/proposal.schema'
import { ResponsiblesBodySchema } from '@/utils/schemas/stats.schema'
import createHttpError from 'http-errors'

import { Collection, Filter, WithId } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: TInProgressResults
}

export type TInProgressResults = {
  [key: string]: {
    [key: string]: {
      projetos: number
      valor: number
    }
  }
}
const getInProgressResults: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthorization(req, res, 'resultados', 'visualizarComercial', true)
  const partnerId = session.user.idParceiro
  const partnerScope = session.user.permissoes.parceiros.escopo

  const userId = session.user.id
  const userScope = session.user.permissoes.resultados.escopo
  const { responsibles, partners } = ResponsiblesBodySchema.parse(req.body)

  // If user has a scope defined and in the request there isnt a responsible arr defined, then user is trying
  // to access a overall visualiation, which he/she isnt allowed
  if (!!userScope && !responsibles) throw new createHttpError.Unauthorized('Seu usuário não possui solicitação para esse escopo de visualização.')

  // If user has a scope defined and in the request there isnt a partners arr defined, then user is trying
  // to access a overall visualiation, which he/she isnt allowed
  if (!!partnerScope && !partners) throw new createHttpError.Unauthorized('Seu usuário não possui solicitação para esse escopo de visualização.')

  // If user has a scope defined and in the responsible arr request there is a single responsible that is not in hes/shes scope
  // then user is trying to access a visualization he/she isnt allowed
  if (!!userScope && responsibles?.some((r) => !userScope.includes(r)))
    throw new createHttpError.Unauthorized('Seu usuário não possui solicitação para esse escopo de visualização.')

  // If user has a scope defined and in the partner arr request there is a single partner that is not in hes/shes scope
  // then user is trying to access a visualization he/she isnt allowed
  if (!!partnerScope && partners?.some((r) => !partnerScope.includes(r)))
    throw new createHttpError.Unauthorized('Seu usuário não possui solicitação para esse escopo de visualização.')

  const responsiblesQuery: Filter<TOpportunity> = responsibles ? { 'responsaveis.id': { $in: responsibles } } : {}
  const partnerQuery = partners ? { idParceiro: { $in: [...partners, null] } } : {}

  const db = await connectToDatabase(process.env.MONGODB_URI, 'main')
  const opportunitiesCollection: Collection<TOpportunity> = db.collection('opportunities')
  const funnelsCollection: Collection<TFunnel> = db.collection('funnels')
  const funnelReferencesCollection: Collection<TFunnelReference> = db.collection('funnel-references')
  const projects = await getOpportunities({ opportunitiesCollection, responsiblesQuery, partnerQuery })
  const funnels = await getPartnerFunnels({ collection: funnelsCollection, query: partnerQuery })
  const funnelsReferences = await getFunnelReferences({
    funnelReferencesCollection,
    partnerQuery: partnerQuery as {
      idParceiro: {
        $in: string[]
      }
    },
  })

  const funnelsReduced = funnels.reduce((acc: { [key: string]: { [key: string]: { projetos: number; valor: number } } }, current: TFunnel) => {
    const funnelName = current.nome
    if (!acc[funnelName]) {
      var obj: { [key: string]: { projetos: number; valor: number } } = {}
      current.etapas.forEach((stage, index: any) => {
        obj[stage.nome] = {
          projetos: 0,
          valor: 0,
        }
      })
      acc[funnelName] = obj
    }
    return acc
  }, {})
  const inProgressResults = projects.reduce((acc, current) => {
    const currentProjectFunnels = funnelsReferences.filter((f) => f.idOportunidade == current._id)
    const proposeValue = current.valorProposta
    currentProjectFunnels?.forEach((funnel, index: number) => {
      const funnelStageId = funnel.idEstagioFunil
      const existingFunnel = funnels.find((f) => f._id.toString() == funnel.idFunil)
      if (!existingFunnel) return acc
      const existingStage = existingFunnel.etapas.find((stage) => stage.id == funnelStageId)
      if (!existingStage) return acc
      const funnelName = existingFunnel.nome
      const stageName = existingStage.nome
      acc[funnelName][stageName].projetos += 1
      acc[funnelName][stageName].valor += proposeValue
    })
    return acc
  }, funnelsReduced)

  return res.status(200).json({ data: inProgressResults })
}

export default apiHandler({
  POST: getInProgressResults,
})
type GetProjetsParams = {
  opportunitiesCollection: Collection<TOpportunity>
  responsiblesQuery: { 'responsaveis.id': { $in: string[] } } | {}
  partnerQuery:
    | {
        idParceiro: {
          $in: (string | null)[]
        }
      }
    | {
        idParceiro?: undefined
      }
}
type TInProgressResultsProject = {
  _id: string
  valorProposta: TProposal['valor']
}
async function getOpportunities({ opportunitiesCollection, responsiblesQuery, partnerQuery }: GetProjetsParams) {
  try {
    const match = { ...responsiblesQuery, ...partnerQuery, 'ganho.data': null, 'perda.data': null }
    const addFields = { activeProposeObjectID: { $toObjectId: '$idPropostaAtiva' } }
    const proposeLookup = { from: 'proposals', localField: 'activeProposeObjectID', foreignField: '_id', as: 'proposta' }
    const projection = { 'proposta.valor': 1 }
    const result = await opportunitiesCollection
      .aggregate([{ $match: match }, { $addFields: addFields }, { $lookup: proposeLookup }, { $project: projection }])
      .toArray()

    const projects = result.map((r) => ({ _id: r._id.toString(), valorProposta: r.proposta[0] ? r.proposta[0].valor : 0 })) as TInProgressResultsProject[]
    return projects
  } catch (error) {
    throw error
  }
}

type GetFunnelReferencesParams = {
  funnelReferencesCollection: Collection<TFunnelReference>
  partnerQuery: {
    idParceiro: {
      $in: string[]
    }
  }
}
async function getFunnelReferences({ funnelReferencesCollection, partnerQuery }: GetFunnelReferencesParams) {
  try {
    const references = await funnelReferencesCollection.find({ ...partnerQuery }).toArray()
    return references
  } catch (error) {
    throw error
  }
}
