import { PartnerSimplifiedProject, TPartner, TPartnerSimplified } from '@/utils/schemas/partner.schema'
import { Collection, ObjectId, WithId } from 'mongodb'

type GetPartnerOwnInformationParams = {
  collection: Collection<TPartner>
  id: string
}
export async function getPartnerOwnInformation({ collection, id }: GetPartnerOwnInformationParams) {
  try {
    const parter = await collection.findOne({ _id: new ObjectId(id) }, { projection: PartnerSimplifiedProject })
    return parter as TPartnerSimplified
  } catch (error) {
    throw error
  }
}
type GetPartnersSimplifiedParams = {
  collection: Collection<TPartner>
}
export async function getPartnersSimplified({ collection }: GetPartnersSimplifiedParams) {
  try {
    const parters = await collection.find({}, { projection: PartnerSimplifiedProject }).toArray()
    return parters as WithId<TPartnerSimplified>[]
  } catch (error) {
    throw error
  }
}
