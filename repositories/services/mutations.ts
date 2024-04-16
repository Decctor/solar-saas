import { TService } from '@/utils/schemas/service.schema'
import { Collection, ObjectId } from 'mongodb'

type InsertServiceParams = {
  collection: Collection<TService>
  info: TService
  partnerId: string
}
export async function insertService({ collection, info, partnerId }: InsertServiceParams) {
  try {
    const insertResponse = await collection.insertOne({ ...info, idParceiro: partnerId, dataInsercao: new Date().toISOString() })

    return insertResponse
  } catch (error) {
    throw error
  }
}

type UpdateServiceParams = {
  id: string
  collection: Collection<TService>
  changes: Partial<TService>
  partnerId: string
}
export async function updateService({ id, collection, changes, partnerId }: UpdateServiceParams) {
  try {
    const updateResponse = await collection.updateOne({ _id: new ObjectId(id), idParceiro: partnerId }, { $set: { ...changes } })
    return updateResponse
  } catch (error) {
    throw error
  }
}
