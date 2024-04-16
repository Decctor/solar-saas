import { TClientEntity } from '@/utils/schemas/client.schema'
import {
  SimplifiedOpportunityWithProposalProjection,
  TOpportunity,
  TOpportunityDTO,
  TOpportunityDTOWithClient,
  TOpportunitySimplified,
} from '@/utils/schemas/opportunity.schema'
import { TProposal } from '@/utils/schemas/proposal.schema'
import { Collection, Filter, MatchKeysAndValues, ObjectId, WithId } from 'mongodb'

type GetOpportunityById = {
  collection: Collection<TOpportunity>
  id: string
  partnerId?: string | null
}
export async function getOpportunityById({ collection, id, partnerId }: GetOpportunityById) {
  try {
    // const opportunity = await collection.findOne({ _id: new ObjectId(id), idParceiro: partnerId || '' })
    const opportunityArr = await collection
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
            idParceiro: partnerId,
          },
        },
        {
          $addFields: {
            clientAsObjectId: { $toObjectId: '$idCliente' },
          },
        },
        {
          $lookup: {
            from: 'clients',
            localField: 'clientAsObjectId',
            foreignField: '_id',
            as: 'cliente',
          },
        },
      ])
      .toArray()
    const opportunity = opportunityArr.map((op) => ({ ...op, cliente: op.cliente[0] }))

    return opportunity[0] as TOpportunityDTOWithClient
  } catch (error) {
    throw error
  }
}

type GetOpportunityByQueryParams = {
  collection: Collection<TOpportunity>
  partnerId: string
  query: Filter<TOpportunity>
}

type TOpportunityByQueryResult = TOpportunitySimplified & { proposta: WithId<TProposal>[] }
export async function getOpportunitiesByQuery({ collection, partnerId, query }: GetOpportunityByQueryParams) {
  try {
    const addFields = { idPropostaAtivaObjectId: { $toObjectId: '$idPropostaAtiva' } }
    const lookup = { from: 'proposals', localField: 'idPropostaAtivaObjectId', foreignField: '_id', as: 'proposta' }
    const projection = SimplifiedOpportunityWithProposalProjection
    // const opportunities = await collection.find({ ...query, idParceiro: partnerId || '' }).toArray()
    const opportunities = (await collection
      .aggregate([{ $match: { ...query, idParceiro: partnerId } }, { $addFields: addFields }, { $lookup: lookup }, { $project: projection }])
      .toArray()) as WithId<TOpportunityByQueryResult>[]

    return opportunities
  } catch (error) {
    throw error
  }
}
