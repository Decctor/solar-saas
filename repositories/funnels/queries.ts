import { TFunnel } from '@/utils/schemas/funnel.schema'
import createHttpError from 'http-errors'
import { Collection, ObjectId } from 'mongodb'

type GetFunnelByIdParams = {
  collection: Collection<TFunnel>
  id: string
  partnerId: string
}
export async function getFunnelById({ collection, id, partnerId }: GetFunnelByIdParams) {
  try {
    const funnel = await collection.findOne({ _id: new ObjectId(id), idParceiro: partnerId })
    if (!funnel) throw new createHttpError.NotFound('Nenhum funil encontrado com o ID fornecido.')
    return funnel
  } catch (error) {
    throw error
  }
}

type GetPartnerFunnelsParams = {
  collection: Collection<TFunnel>
  partnerId: string
}
export async function getPartnerFunnels({ collection, partnerId }: GetPartnerFunnelsParams) {
  try {
    const funnels = await collection.find({ idParceiro: partnerId }).toArray()
    return funnels
  } catch (error) {
    throw error
  }
}
