import { TFunnelReference } from '@/utils/schemas/funnel-reference.schema'
import { Collection } from 'mongodb'

type GetFunnelReferencesParams = {
  collection: Collection<TFunnelReference>
  funnelId: string
  partnerId: string
}
export async function getFunnelReferences({ collection, funnelId, partnerId }: GetFunnelReferencesParams) {
  try {
    const references = await collection.find({ idFunil: funnelId, idParceiro: partnerId }).toArray()
    return references
  } catch (error) {
    throw error
  }
}
