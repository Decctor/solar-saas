import { TActivity } from '@/utils/schemas/activities.schema'
import { TOpportunityHistory } from '@/utils/schemas/opportunity-history.schema'
import { Collection, ObjectId } from 'mongodb'

type GetOpportunityHistoryParams = {
  opportunityId: string
  collection: Collection<TOpportunityHistory>
  partnerId: string
}
export async function getOpportunityHistory({ opportunityId, collection, partnerId }: GetOpportunityHistoryParams) {
  try {
    const opportunityHistory = await collection.find({ 'oportunidade.id': opportunityId, idParceiro: partnerId }).sort({ dataInsercao: -1 }).toArray()
    return opportunityHistory
  } catch (error) {
    throw error
  }
}

type GetOpenActivitiesParams = {
  collection: Collection<TActivity>
  partnerId: string
}
export async function getOpenActivities({ collection, partnerId }: GetOpenActivitiesParams) {
  try {
    const activities = await collection
      .find({ dataVencimento: { $ne: null }, dataConclusao: null, idParceiro: partnerId })
      .sort({ dataVencimento: -1 })
      .toArray()
    return activities
  } catch (error) {
    throw error
  }
}

type GetOpportunityHistoryById = {
  id: string
  collection: Collection<TOpportunityHistory>
  partnerId: string
}
export async function getOpportunityHistoryById({ id, collection, partnerId }: GetOpportunityHistoryById) {
  try {
    const opportunityHistory = await collection.findOne({ _id: new ObjectId(id), idParceiro: partnerId })
    return opportunityHistory
  } catch (error) {
    throw error
  }
}
