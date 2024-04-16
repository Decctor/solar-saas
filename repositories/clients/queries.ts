import { getClientSearchParams } from '@/pages/api/clients/search'
import { SimilarClientsSimplifiedProjection, TClient, TSimilarClientSimplified, TSimilarClientSimplifiedDTO } from '@/utils/schemas/client.schema'
import { Collection, Filter, MatchKeysAndValues, ObjectId } from 'mongodb'

type GetClientByIdParams = {
  collection: Collection<TClient>
  id: string
  partnerId: string
}
export async function getClientById({ collection, id, partnerId }: GetClientByIdParams) {
  try {
    const clientsArr = await collection
      .aggregate([
        { $match: { _id: new ObjectId(id), idParceiro: partnerId } },
        {
          $addFields: {
            stringId: { $toString: '$_id' },
          },
        },
        {
          $lookup: {
            from: 'opportunities',
            localField: 'stringId',
            foreignField: 'idCliente',
            as: 'oportunidades',
          },
        },
      ])
      .toArray()
    const client = clientsArr[0]
    return client
  } catch (error) {
    throw error
  }
}
type GetExistentClientParams = {
  collection: Collection<TClient>
  email?: string
  cpfCnpj?: string
  phoneNumber: string
  partnerId: string
}
export async function getExistentClientByProperties({ collection, email, cpfCnpj, phoneNumber, partnerId }: GetExistentClientParams) {
  try {
    const orParam = getClientSearchParams({ cpfCnpj, email, phoneNumber })
    const orQuery = orParam.length > 0 ? { $or: orParam } : {}
    const query = { idParceiro: partnerId, ...orQuery }
    const client = await collection.findOne(query)

    return client
  } catch (error) {
    throw error
  }
}

type GetClientsParams = {
  collection: Collection<TClient>
  partnerId: string
  queryParam: MatchKeysAndValues<TClient>
}
export async function getClients({ collection, partnerId, queryParam }: GetClientsParams) {
  try {
    const clients = await collection.find({ idParceiro: partnerId, ...queryParam }).toArray()
    return clients
  } catch (error) {
    throw error
  }
}

type GetSimilarClientsParams = {
  collection: Collection<TClient>
  partnerId: string
  query: Filter<TClient>
}

export async function getSimilarClients({ collection, partnerId, query }: GetSimilarClientsParams) {
  try {
    const clients = await collection.find({ idParceiro: partnerId, ...query }, { projection: SimilarClientsSimplifiedProjection }).toArray()
    return clients as TSimilarClientSimplified[]
  } catch (error) {
    throw error
  }
}
