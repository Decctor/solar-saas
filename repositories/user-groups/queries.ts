import { TUserGroup, TUserGroupWithUsers } from '@/utils/schemas/user-groups.schema'
import { Collection, Filter, ObjectId, WithId } from 'mongodb'

type GetUserGroupsParams = {
  collection: Collection<TUserGroup>
  query: Filter<TUserGroup>
}

export async function getUserGroups({ collection, query }: GetUserGroupsParams) {
  try {
    const match = { ...query }
    const addFields = { idAsString: { $toString: '$_id' } }
    const lookup = { from: 'users', localField: 'idAsString', foreignField: 'idGrupo', as: 'usuarios' }
    const projection = { 'usuarios.senha': 0, 'usuarios.permissoes': 0, 'usuarios.comissoes': 0 }

    const groups = await collection.aggregate([{ $match: match }, { $addFields: addFields }, { $lookup: lookup }, { $project: projection }]).toArray()

    return groups as WithId<TUserGroupWithUsers>[]
  } catch (error) {
    throw error
  }
}
type GetUserGroupByIdParams = {
  id: string
  collection: Collection<TUserGroup>
  query: Filter<TUserGroup>
}
export async function getUserGroupById({ collection, id, query }: GetUserGroupByIdParams) {
  try {
    const match = { _id: new ObjectId(id), ...query }
    const addFields = { idAsString: { $toString: '$_id' } }
    const lookup = { from: 'users', localField: 'idAsString', foreignField: 'idGrupo', as: 'usuarios' }
    const projection = { 'usuarios.senha': 0, 'usuarios.permissoes': 0, 'usuarios.comissoes': 0 }

    const groups = await collection.aggregate([{ $match: match }, { $addFields: addFields }, { $lookup: lookup }, { $project: projection }]).toArray()

    return groups[0] as WithId<TUserGroupWithUsers> | null
  } catch (error) {
    throw error
  }
}
