import { TFunnelReference } from '@/utils/schemas/funnel-reference.schema'
import { Collection, ObjectId } from 'mongodb'

type CreateFunnelReferenceParams = {
  collection: Collection<TFunnelReference>
  info: TFunnelReference
  partnerId?: string | null
}

export async function insertFunnelReference({ collection, info, partnerId }: CreateFunnelReferenceParams) {
  try {
    const insertResponse = await collection.insertOne({ ...info, idParceiro: partnerId || '', dataInsercao: new Date().toISOString() })
    return insertResponse
  } catch (error) {
    throw error
  }
}

type UpdateFunnelReferenceParams = {
  collection: Collection<TFunnelReference>
  funnelReferenceId: string
  newStageId: string | number
  partnerId: string
}

export async function updateFunnelReference({ collection, funnelReferenceId, newStageId, partnerId }: UpdateFunnelReferenceParams) {
  try {
    const updateResponse = await collection.updateOne(
      { _id: new ObjectId(funnelReferenceId), idParceiro: partnerId },
      { $set: { idEstagioFunil: newStageId } }
    )
    return updateResponse
  } catch (error) {
    throw error
  }
}