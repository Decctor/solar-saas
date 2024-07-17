import { TPartner, TPartnerWithSubscriptionAndUsers } from '@/utils/schemas/partner.schema'
import { Collection, Filter, ObjectId, WithId } from 'mongodb'

type GetPartnerByIdParams = {
  collection: Collection<TPartner>
  id: string
  query: Filter<TPartner>
}
export async function getPartnerById({ collection, id, query }: GetPartnerByIdParams) {
  try {
    const match = { _id: new ObjectId(id), ...query }
    const addFields = { partnerIdString: { $toString: '$_id' } }
    const subscriptionLookup = { from: 'subscriptions', localField: 'partnerIdString', foreignField: 'idParceiro', as: 'assinatura' }
    const usersLookup = { from: 'users', localField: 'partnerIdString', foreignField: 'idParceiro', as: 'usuarios' }

    const partnersArr = await collection
      .aggregate([{ $match: match }, { $addFields: addFields }, { $lookup: subscriptionLookup }, { $lookup: usersLookup }])
      .toArray()

    const partner = partnersArr.map((p) => ({ ...p, assinatura: p.assinatura[0] || null }))[0] as WithId<TPartnerWithSubscriptionAndUsers> | null
    return partner
  } catch (error) {
    throw error
  }
}
