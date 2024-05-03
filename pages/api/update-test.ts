import { NextApiHandler } from 'next'
import { apiHandler } from '@/utils/api'

import connectToDatabase from '@/services/mongodb/main-db-connection'

import AmpereProjects from '@/ampere-migration/main.projects.json'
import AmpereProposes from '@/ampere-migration/main.proposes.json'
import { TClient } from '@/utils/schemas/client.schema'
import { z } from 'zod'
import { TOpportunity, TOpportunityDTO } from '@/utils/schemas/opportunity.schema'
import { Collection, ObjectId } from 'mongodb'
import { TSolarSystemPropose } from '@/ampere-migration/proposes-schemas/solar-system.schema'
import { THomologationPropose } from '@/ampere-migration/proposes-schemas/homologation.schema'
import { TOeMPropose } from '@/ampere-migration/proposes-schemas/oem.schema'
import { TMonitoringPropose } from '@/ampere-migration/proposes-schemas/monitoring.schema'
import { TPricingItem, TProposal } from '@/utils/schemas/proposal.schema'
import { TProductItem } from '@/utils/schemas/kits.schema'
import { TUser } from '@/utils/schemas/user.schema'
type PostResponse = any

const migrate: NextApiHandler<PostResponse> = async (req, res) => {
  const { id } = req.query

  const db = await connectToDatabase(process.env.MONGODB_URI, 'main')
  const opportunitiesCollection: Collection<TOpportunity> = db.collection('opportunities')
  const proposalsCollection: Collection<TProposal> = db.collection('proposals')
  const usersCollection: Collection<TUser> = db.collection('users')

  // const opportunities = await opportunitiesCollection.find({}, { projection: { idCliente: 1 } }).toArray()
  // const proposals = await proposalsCollection.find({}).toArray()
  const users = await usersCollection.find({}).toArray()
  // const bulkWriteArr = proposals.map((proposal) => {
  //   const equivalentOpportunity = opportunities.find((op) => op._id.toString() == proposal.oportunidade.id)
  //   const clientId = equivalentOpportunity?.idCliente || ''
  //   return {
  //     updateOne: {
  //       filter: { _id: new ObjectId(proposal._id) },
  //       update: {
  //         $set: {
  //           idCliente: clientId,
  //         },
  //       },
  //     },
  //   }
  // })
  // const bulkwriteResponse = await proposalsCollection.bulkWrite(bulkWriteArr)
  // const usersCollection: Collection<TUser> = db.collection('users')
  // const users = await usersCollection.find({}).toArray()

  const bulkwriteArr = users.map((user) => {
    return {
      updateOne: {
        filter: { _id: new ObjectId(user._id) },
        update: {
          $set: {
            'permissoes.homologacoes': {
              escopo: [user._id.toString()],
              visualizar: true,
              editar: false,
              criar: true,
            },
          },
        },
      },
    }
  })
  const bulkwriteResponse = await usersCollection.bulkWrite(bulkwriteArr)
  return res.json(bulkwriteResponse)
}
export default apiHandler({
  GET: migrate,
})
