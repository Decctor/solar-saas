import {
  SimplifiedOpportunityWithProposalProjection,
  TOpportunity,
  TOpportunityDTO,
  TOpportunityDTOWithClient,
  TOpportunityDTOWithClientAndPartner,
  TOpportunitySimplified,
} from '@/utils/schemas/opportunity.schema'
import { TProposal } from '@/utils/schemas/proposal.schema'
import { Collection, Filter, MatchKeysAndValues, ObjectId, WithId } from 'mongodb'

type GetOpportunityById = {
  collection: Collection<TOpportunity>
  id: string
  query: Filter<TOpportunity>
}
export async function getOpportunityById({ collection, id, query }: GetOpportunityById) {
  try {
    // const opportunity = await collection.findOne({ _id: new ObjectId(id), idParceiro: partnerId || '' })

    const addFields = { clientAsObjectId: { $toObjectId: '$idCliente' }, partnerAsObjectId: { $toObjectId: '$idParceiro' } }
    const clientLookup = { from: 'clients', localField: 'clientAsObjectId', foreignField: '_id', as: 'cliente' }
    const partnerLookup = { from: 'partners', localField: 'partnerAsObjectId', foreignField: '_id', as: 'parceiro' }
    const opportunityArr = await collection
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
            ...query,
          },
        },
        {
          $addFields: addFields,
        },
        {
          $lookup: clientLookup,
        },
        {
          $lookup: partnerLookup,
        },
      ])
      .toArray()
    const opportunity = opportunityArr.map((op) => ({ ...op, cliente: op.cliente[0], parceiro: op.parceiro[0] }))

    return opportunity[0] as TOpportunityDTOWithClientAndPartner
  } catch (error) {
    throw error
  }
}

type GetOpportunityByQueryParams = {
  collection: Collection<TOpportunity>
  query: Filter<TOpportunity>
}

type TOpportunityByQueryResult = TOpportunitySimplified & { proposta: WithId<TProposal>[] }
export async function getOpportunitiesByQuery({ collection, query }: GetOpportunityByQueryParams) {
  try {
    const addFields = { idPropostaAtivaObjectId: { $toObjectId: '$idPropostaAtiva' } }
    const lookup = { from: 'proposals', localField: 'idPropostaAtivaObjectId', foreignField: '_id', as: 'proposta' }
    const projection = SimplifiedOpportunityWithProposalProjection
    // const opportunities = await collection.find({ ...query, idParceiro: partnerId || '' }).toArray()
    const opportunities = (await collection
      .aggregate([{ $match: { ...query } }, { $addFields: addFields }, { $lookup: lookup }, { $project: projection }])
      .toArray()) as WithId<TOpportunityByQueryResult>[]

    return opportunities
  } catch (error) {
    throw error
  }
}
