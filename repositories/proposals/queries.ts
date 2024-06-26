import { TProposal, TProposalDTOWithOpportunity, TProposalDTOWithOpportunityAndClient } from '@/utils/schemas/proposal.schema'
import { Collection, ObjectId } from 'mongodb'

type GetOpportunityProposalsParams = {
  opportunityId: string
  collection: Collection<TProposal>
  partnerId: string
}
export async function getOpportunityProposals({ opportunityId, collection, partnerId }: GetOpportunityProposalsParams) {
  try {
    const proposals = await collection.find({ 'oportunidade.id': opportunityId, idParceiro: partnerId }).sort({ _id: -1 }).toArray()
    return proposals
  } catch (error) {
    throw error
  }
}
type GetProposalByIdParams = {
  id: string
  collection: Collection<TProposal>
  partnerId: string
}
export async function getProposalById({ id, collection, partnerId }: GetProposalByIdParams) {
  try {
    const proposals = await collection
      .aggregate([
        { $match: { _id: new ObjectId(id), idParceiro: partnerId } },
        {
          $addFields: {
            opportunityObjectId: { $toObjectId: '$oportunidade.id' },
            clientObjectId: { $toObjectId: '$idCliente' },
          },
        },
        {
          $lookup: {
            from: 'opportunities',
            localField: 'opportunityObjectId',
            foreignField: '_id',
            as: 'oportunidadeDados',
          },
        },
        {
          $lookup: {
            from: 'clients',
            localField: 'clientObjectId',
            foreignField: '_id',
            as: 'clienteDados',
          },
        },
      ])
      .toArray()
    // console.log('propostas', proposals)
    const proposal = proposals.map((p) => {
      return { ...p, oportunidadeDados: p.oportunidadeDados[0], clienteDados: p.clienteDados[0] }
    })
    return proposal[0] as TProposalDTOWithOpportunityAndClient
  } catch (error) {
    throw error
  }
}
