import { TUser, TUserEntity, simplifiedProjection } from '@/utils/schemas/user.schema'
import { Collection, ObjectId, WithId } from 'mongodb'
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
  partnerId?: string | null
}
export async function getPartnerUsers({ collection, partnerId }: GetPartnerUsers) {
  try {
    const users = await collection.find({ idParceiro: partnerId }, { projection: { senha: 0 } }).toArray()
    return users
  } catch (error) {
    throw error
  }
}
type GetUserById = {
  collection: Collection<TUserEntity>
  id: string
  userIsAdmin: boolean
  userPartnerId?: string | null
}
export async function getUserById({ collection, id, userIsAdmin, userPartnerId }: GetUserById) {
  try {
    var user
    if (userIsAdmin) user = await collection.findOne({ _id: new ObjectId(id) }, { projection: { senha: 0 } })
    else user = await collection.findOne({ _id: new ObjectId(id), idParceiro: userPartnerId }, { projection: { senha: 0 } })
    return user
  } catch (error) {
    throw error
  }
}
type GetOpportunityCreators = {
  collection: Collection<TUser>
  partnerId?: string | null
}
export async function getOpportunityCreators({ collection, partnerId }: GetOpportunityCreators) {
  try {
    const creators = await collection.find({ 'permissoes.oportunidades.criar': true, idParceiro: partnerId }).project(simplifiedProjection).toArray()
    return creators as WithId<TUser>[]
  } catch (error) {
    throw error
  }
}
type GetTechnicalAnalystsParams = {
  collection: Collection<TUser>
  partnerId?: string | null
}

export async function getTechnicalAnalysts({ collection, partnerId }: GetTechnicalAnalystsParams) {
  try {
    const analysts = await collection
      .find({ 'permissoes.analisesTecnicas.editar': true, idParceiro: partnerId })
      .project(simplifiedProjection)
      .toArray()
    return analysts as WithId<TUser>[]
  } catch (error) {
    throw error
  }
}
