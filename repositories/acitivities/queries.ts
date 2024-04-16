import { TActivity } from '@/utils/schemas/activities.schema'
import { Collection, Filter } from 'mongodb'

type GetActivitiesByOpportunityIdParams = {
  opportunityId: string
  collection: Collection<TActivity>
  partnerId: string
  query: Filter<TActivity>
}
export async function getActivitiesByOpportunityId({ opportunityId, collection, partnerId, query }: GetActivitiesByOpportunityIdParams) {
  try {
    const activities = await collection.find({ 'oportunidade.id': opportunityId, idParceiro: partnerId, ...query }, { sort: { dataInsercao: -1 } }).toArray()
    return activities
  } catch (error) {
    throw error
  }
}
type GetActivitiesByHomologationIdParams = {
  homologationId: string
  collection: Collection<TActivity>
  partnerId: string
  query: Filter<TActivity>
}
export async function getActivitiesByHomologationId({ homologationId, collection, partnerId, query }: GetActivitiesByHomologationIdParams) {
  try {
    const activities = await collection.find({ idHomologacao: homologationId, idParceiro: partnerId, ...query }, { sort: { dataInsercao: -1 } }).toArray()
    return activities
  } catch (error) {
    throw error
  }
}
type GetActivitiesByTechnicalAnalysisIdParams = {
  technicalAnalysisId: string
  collection: Collection<TActivity>
  partnerId: string
  query: Filter<TActivity>
}
export async function getActivitiesByTechnicalAnalysisId({ technicalAnalysisId, collection, partnerId, query }: GetActivitiesByTechnicalAnalysisIdParams) {
  try {
    const activities = await collection
      .find({ idAnaliseTecnica: technicalAnalysisId, idParceiro: partnerId, ...query }, { sort: { dataInsercao: -1 } })
      .toArray()
    return activities
  } catch (error) {
    throw error
  }
}
