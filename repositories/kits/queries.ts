import { TKit } from '@/utils/schemas/kits.schema'
import { Collection, ObjectId } from 'mongodb'

type GetKitsParams = {
  collection: Collection<TKit>
  partnerId: string
}
export async function getPartnerKits({ collection, partnerId }: GetKitsParams) {
  try {
    console.log(partnerId)
    const kits = await collection.find({ idParceiro: partnerId }).toArray()
    return kits
  } catch (error) {
    throw error
  }
}

export async function getPartnerActiveKits({ collection, partnerId }: GetKitsParams) {
  try {
    const kits = await collection.find({ idParceiro: partnerId, ativo: true }).toArray()
    return kits
  } catch (error) {
    throw error
  }
}

type GetKitByIdParams = {
  collection: Collection<TKit>
  id: string
  partnerId: string
}
export async function getKitById({ collection, id, partnerId }: GetKitByIdParams) {
  try {
    const kit = await collection.findOne({ _id: new ObjectId(id), idParceiro: partnerId })
    return kit
  } catch (error) {
    throw error
  }
}
