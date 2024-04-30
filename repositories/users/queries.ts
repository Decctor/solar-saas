import { TUser, TUserEntity, simplifiedProjection } from '@/utils/schemas/user.schema'
import { Collection, Filter, ObjectId, WithId } from 'mongodb'
import { Session } from 'next-auth'

type GetAllUsers = {
  collection: Collection<TUserEntity>
}
export async function getAllUsers({ collection }: GetAllUsers) {
  try {
    const users = await collection.find({}, { projection: { senha: 0 } }).toArray()
    return users
  } catch (error) {
    throw error
  }
}
type GetPartnerUsers = {
  collection: Collection<TUserEntity>
  query: Filter<TUser>
}
export async function getPartnerUsers({ collection, query }: GetPartnerUsers) {
  try {
    const users = await collection.find({ ...query }, { projection: { senha: 0 } }).toArray()
    return users
  } catch (error) {
    throw error
  }
}
type GetUserById = {
  collection: Collection<TUserEntity>
  id: string
  query: Filter<TUser>
}
export async function getUserById({ collection, id, query }: GetUserById) {
  try {
    const user = await collection.findOne({ _id: new ObjectId(id), ...query }, { projection: { senha: 0 } })
    return user
  } catch (error) {
    throw error
  }
}
type GetOpportunityCreators = {
  collection: Collection<TUser>
  query: Filter<TUser>
}
export async function getOpportunityCreators({ collection, query }: GetOpportunityCreators) {
  try {
    const creators = await collection
      .find({ 'permissoes.oportunidades.criar': true, ...query })
      .project(simplifiedProjection)
      .toArray()
    return creators as WithId<TUser>[]
  } catch (error) {
    throw error
  }
}
type GetTechnicalAnalystsParams = {
  collection: Collection<TUser>
  query: Filter<TUser>
}

export async function getTechnicalAnalysts({ collection, query }: GetTechnicalAnalystsParams) {
  try {
    const analysts = await collection
      .find({ 'permissoes.analisesTecnicas.editar': true, ...query })
      .project(simplifiedProjection)
      .toArray()
    return analysts as WithId<TUser>[]
  } catch (error) {
    throw error
  }
}
