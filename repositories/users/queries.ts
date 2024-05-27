import { TUser, TUserEntity, simplifiedProjection } from '@/utils/schemas/user.schema'
import { Collection, Filter, ObjectId, WithId } from 'mongodb'
import { Session } from 'next-auth'

type GetAllUsers = {
  collection: Collection<TUserEntity>
}
export async function getAllUsers({ collection }: GetAllUsers) {
  try {
    const users = await collection.find({}, { projection: { senha: 0 }, sort: { nome: 1 } }).toArray()
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
    const users = await collection.find({ ...query }, { projection: { senha: 0 }, sort: { nome: 1 } }).toArray()
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
      .find({ 'permissoes.oportunidades.criar': true, ...query }, { sort: { nome: 1 } })
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
      .find({ 'permissoes.analisesTecnicas.editar': true, ...query }, { sort: { nome: 1 } })
      .project(simplifiedProjection)
      .toArray()
    return analysts as WithId<TUser>[]
  } catch (error) {
    throw error
  }
}

type GetLeadReceiversParams = {
  collection: Collection<TUser>
  query: Filter<TUser>
}
export async function getLeadReceivers({ collection, query }: GetLeadReceiversParams) {
  try {
    const receivers = await collection
      .find({ 'permissoes.integracoes.receberLeads': true, ...query }, { sort: { nome: 1 } })
      .project(simplifiedProjection)
      .toArray()
    return receivers as WithId<TUser>[]
  } catch (error) {
    throw error
  }
}
