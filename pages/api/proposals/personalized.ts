import connectToDatabase from '@/services/mongodb/main-db-connection'
import { validateAuthorization } from '@/utils/api'
import { InsertClientSchema } from '@/utils/schemas/client.schema'
import { InsertOpportunitySchema, OpportunityWithClientSchema } from '@/utils/schemas/opportunity.schema'
import { InsertProposalSchema, TProposal } from '@/utils/schemas/proposal.schema'
import { Collection } from 'mongodb'
import { NextApiHandler } from 'next'
import { z } from 'zod'

type PostResponse = {
  data: any
}

const PersonalizedProposalCreationSchema = z.object({
  proposal: InsertProposalSchema,
  opportunityWithClient: OpportunityWithClientSchema,
  idTemplate: z.string({
    required_error: 'ID de referência do template não informado.',
    invalid_type_error: 'Tipo não válido para o ID de referência do template.',
  }),
})

const createProposalPersonalized: NextApiHandler<PostResponse> = async (req, res) => {
  const session = await validateAuthorization(req, res, 'propostas', 'criar', true)
  const partnerId = session.user.idParceiro

  const { proposal, opportunityWithClient, idTemplate } = PersonalizedProposalCreationSchema.parse(req.body)

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const proposalsCollection: Collection<TProposal> = db.collection('proposals')
}
