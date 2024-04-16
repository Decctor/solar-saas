import { InsertHomologationSchema, THomologation } from '@/utils/schemas/homologation.schema'
import { Collection, ObjectId } from 'mongodb'

type GetHomologationByIdParams = {
  collection: Collection<THomologation>
  id: string
  partnerId: string
}
export async function getHomologationById({ collection, id, partnerId }: GetHomologationByIdParams) {
  try {
    const homologation = await collection.findOne({ _id: new ObjectId(id), idParceiro: partnerId })
    return homologation
  } catch (error) {
    throw error
  }
}
type GetHomologationByOpportunityIdParams = {
  collection: Collection<THomologation>
  opportunityId: string
  partnerId: string
}
export async function getHomologationByOpportunityId({ collection, opportunityId, partnerId }: GetHomologationByOpportunityIdParams) {
  try {
    const homologations = await collection.find({ 'oportunidade.id': opportunityId, idParceiro: partnerId }).toArray()
    return homologations
  } catch (error) {
    throw error
  }
}

type GetPartnerHomologationsParams = {
  collection: Collection<THomologation>
  partnerId: string
}

export async function getPartnerHomologations({ collection, partnerId }: GetPartnerHomologationsParams) {
  try {
    const homologations = await collection.find({ idParceiro: partnerId }).toArray()

    return homologations
  } catch (error) {
    throw error
  }
}
