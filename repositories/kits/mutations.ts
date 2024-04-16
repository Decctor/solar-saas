import { TKit } from '@/utils/schemas/kits.schema'
import { Collection, ObjectId } from 'mongodb'

type InsertKitParams = {
  collection: Collection<TKit>
  info: TKit
  partnerId: string
}
export async function insertKit({ collection, info, partnerId }: InsertKitParams) {
  try {
    const insertResponse = await collection.insertOne({ ...info, idParceiro: partnerId, dataInsercao: new Date().toISOString() })
    return insertResponse
  } catch (error) {
    throw error
  }
}

type UpdateKitParams = {
  id: string
  collection: Collection<TKit>
  changes: TKit
  partnerId: string
}
export async function updateKit({ id, collection, changes, partnerId }: UpdateKitParams) {
  try {
    const updateResponse = await collection.updateOne({ _id: new ObjectId(id), idParceiro: partnerId }, { $set: { ...changes } })
    return updateResponse
  } catch (error) {
    throw error
  }
}

type InsertManyKitsParams = {
  collection: Collection<TKit>
  info: TKit[]
  partnerId: string
}
export async function insertManyKits({ collection, info, partnerId }: InsertManyKitsParams) {
  try {
    const fixedKits = info.map((kit) => ({ ...kit, idParceiro: partnerId, dataInsercao: new Date().toISOString() }))
    const insertResponse = await collection.insertMany(fixedKits)
    return insertResponse
  } catch (error) {
    throw error
  }
}
