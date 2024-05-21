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
type PostResponse = any

const typeEquivalents = {
  'SISTEMA FOTOVOLTAICO': {
    tipo: {
      id: '6615785ddcb7a6e66ede9785',
      titulo: 'SISTEMA FOTOVOLTAICO',
    },
    categoriaVenda: 'KIT',
  },
  'OPERAÇÃO E MANUTENÇÃO': {
    tipo: {
      id: '661ec7e5e03128a48f94b4de',
      titulo: 'OPERAÇÃO E MANUTENÇÃO',
    },
    categoriaVenda: 'PLANO',
  },
  'MONTAGEM E DESMONTAGEM': {
    tipo: {
      id: '661ec86de03128a48f94b4df',
      titulo: 'SERVIÇOS AVULSOS',
    },
    categoriaVenda: 'SERVIÇOS',
  },
  MONITORAMENTO: {
    tipo: {
      id: '661ec8dae03128a48f94b4e0',
      titulo: 'SERVIÇOS AVULSOS',
    },
    categoriaVenda: 'SERVIÇOS',
  },
}

const migrate: NextApiHandler<PostResponse> = async (req, res) => {
  const { id } = req.query

  // const crmDb = await connectToCRMDatabase(process.env.MONGODB_URI, 'main')
  // const requestsDb = await connectToRequestsDatabase(process.env.MONGODB_URI)

  // const crmTechnicalAnalysisCollection: Collection<TTechnicalAnalysis> = crmDb.collection('technical-analysis')
  // const requestsTechnicalAnalysisCollection = requestsDb.collection('analisesTecnicas')

  // // const proposalsCollection: Collection<TProposal> = db.collection('proposals')
  // const crmAnalysis = await crmTechnicalAnalysisCollection.find({}).toArray()
  // const requestsAnalysis = await requestsTechnicalAnalysisCollection.find({}).toArray()

  // const bulkWriteArr = crmAnalysis.map((analysis) => {
  //   const requestEquivalent = requestsAnalysis.find((a) => a._id.toString() == analysis._id.toString())
  //   console.log(requestEquivalent?.nome, requestEquivalent?.dataEfetivacao)
  //   const finishDate = analysis.dataEfetivacao ? analysis.dataEfetivacao : requestEquivalent?.dataEfetivacao || null
  //   return {
  //     updateOne: {
  //       filter: { _id: new ObjectId(analysis._id) },
  //       update: {
  //         $set: {
  //           dataEfetivacao: finishDate,
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
