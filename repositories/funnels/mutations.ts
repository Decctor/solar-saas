import { TFunnel, TFunnelEntity } from '@/utils/schemas/funnel.schema'
import { Collection } from 'mongodb'

type CreateFunnelParams = {
  collection: Collection<TFunnel>
  info: TFunnel
  partnerId?: string | null
}
export async function insertFunnel({ collection, info, partnerId }: CreateFunnelParams) {
  try {
    const insertResponse = await collection.insertOne({ ...info, idParceiro: partnerId || '' })
    return insertResponse
  } catch (error) {
    throw error
  }
}
