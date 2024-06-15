import { TUserGroup } from '@/utils/schemas/user-groups.schema'
import { Collection, ObjectId } from 'mongodb'

type InsertUserGroupParams = {
  collection: Collection<TUserGroup>
  info: TUserGroup
  partnerId: string
}
export async function insertUserGroup({ collection, info, partnerId }: InsertUserGroupParams) {
  try {
    const insertResponse = await collection.insertOne({ ...info, idParceiro: partnerId, dataInsercao: new Date().toISOString() })

    return insertResponse
  } catch (error) {
    throw error
  }
}

type UpdateUserGroupParams = {
  collection: Collection<TUserGroup>
  info: Partial<TUserGroup>
  id: string
  partnerId: string
}

export async function updateUserGroup({ id, partnerId, collection, info }: UpdateUserGroupParams) {
  try {
    const insertResponse = await collection.updateOne({ _id: new ObjectId(id), idParceiro: partnerId }, { $set: { ...info } })

    return insertResponse
  } catch (error) {
    throw error
  }
}
