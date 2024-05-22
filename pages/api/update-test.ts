import { NextApiHandler } from 'next'
import { apiHandler } from '@/utils/api'

import connectToCRMDatabase from '@/services/mongodb/crm-db-connection'
import connectToProjectsDatabase from '@/services/mongodb/projects-db-connection'
import connectToRequestsDatabase from '@/services/mongodb/ampere/resquests-db-connection'
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
import { TTechnicalAnalysis } from '@/utils/schemas/technical-analysis.schema'
import { TFunnelReference } from '@/utils/schemas/funnel-reference.schema'
type PostResponse = any

type Reduced = { [key: string]: string[] }
const migrate: NextApiHandler<PostResponse> = async (req, res) => {
  const { id } = req.query

  // const requestsDb = await connectToRequestsDatabase(process.env.MONGODB_URI)

  // const requestsTechnicalAnalysisCollection = requestsDb.collection('analisesTecnicas')

  // // // const proposalsCollection: Collection<TProposal> = db.collection('proposals')
  // const crmAnalysis = await crmTechnicalAnalysisCollection.find({}).toArray()
  // // const requestsAnalysis = await requestsTechnicalAnalysisCollection.find({}).toArray()
  // const typeEquivalents = {
  //   'ALTERAÇÃO DE PROJETO': 'ANÁLISE TÉCNICA REMOTA URBANA',
  //   'VISITA TÉCNICA REMOTA - RURAL': 'ANÁLISE TÉCNICA REMOTA RURAL',
  //   'AUMENTO DE SISTEMA AMPÈRE': 'ANÁLISE TÉCNICA REMOTA URBANA',
  //   'VISITA TÉCNICA IN LOCO - RURAL': 'ANÁLISE TÉCNICA IN LOCO',
  //   'VISITA TÉCNICA REMOTA - URBANA': 'ANÁLISE TÉCNICA REMOTA URBANA',
  //   'AUMENTO DE SISTEMA': 'ANÁLISE TÉCNICA REMOTA RURAL',
  //   'VISITA TÉCNICA IN LOCO - URBANA': 'ANÁLISE TÉCNICA REMOTA URBANA',
  // }
  // const bulkWriteArr = crmAnalysis.map((analysis) => {
  //   const type = typeEquivalents[analysis.tipoSolicitacao]
  //   return {
  //     updateOne: {
  //       filter: { _id: new ObjectId(analysis._id) },
  //       update: {
  //         $set: {
  //           tipoSolicitacao: type,
  //         },
  //       },
  //     },
  //   }
  // })
  // const bulkwriteResponse = await crmTechnicalAnalysisCollection.bulkWrite(bulkWriteArr)
  // const bulkWriteArr = opportunities.map((opportunity) => {
  //   return {
  //     updateOne: {
  //       filter: { _id: new ObjectId(opportunity._id) },
  //       update: {
  //         $set: {
  //           tipo: {
  //             id: '661ec7e5e03128a48f94b4de',
  //             titulo: 'OPERAÇÃO E MANUTENÇÃO',
  //           },
  //         },
  //       },
  //     },
  //   }
  // })
  // const bulkwriteResponse = await opportunitiesCollection.bulkWrite(bulkWriteArr)
  // const usersCollection: Collection<TUser> = db.collection('users')

  // const opportunities = await opportunitiesCollection.find({}, { projection: { idCliente: 1 } }).toArray()
  // const proposals = await proposalsCollection.find({}).toArray()
  // const users = await usersCollection.find({}).toArray()
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

  // const bulkwriteArr = users.map((user) => {
  //   return {
  //     updateOne: {
  //       filter: { _id: new ObjectId(user._id) },
  //       update: {
  //         $set: {
  //           'permissoes.integracoes.receberLeads': false,
  //         },
  //       },
  //     },
  //   }
  // })
  // const bulkwriteResponse = await usersCollection.bulkWrite(bulkwriteArr)
  return res.json('DESATIVADA')
}
export default apiHandler({
  GET: migrate,
})
