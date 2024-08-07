import { NextApiHandler } from 'next'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'

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
import { TUserGroup } from '@/utils/schemas/user-groups.schema'
import UserGroup from '@/components/Cards/UserGroup'
import { UserGroups } from '@/utils/select-options'
import { getInverterQty, getModulesPeakPotByProducts, getModulesQty } from '@/lib/methods/extracting'
import axios from 'axios'
type PostResponse = any

const UserGroupEquivalents = {
  '1': '66562a2a812707dbf9f04830',
  '2': '66562a2a812707dbf9f04831',
  '3': '66562a2a812707dbf9f04832',
  '4': '66562a2a812707dbf9f04833',
}

const LossReasonsEquivalents = {
  'NÃO QUER O PRODUTO/SERVIÇO': 'NÃO QUER O PRODUTO/SERVIÇO',
  'RESCISÃO CONTRATUAL': 'RESCISÃO CONTRATUAL',
  'COMPROU COM OUTRA EMPRESA': 'FECHOU COM OUTRA EMPRESA (GERAL)',
  'CLIENTE NÃO RESPONDE': 'CLIENTE NÃO RESPONDE',
  'OPTOU POR NÃO REALIZAR O PROJETO': 'NÃO QUER O PRODUTO/SERVIÇO',
  'DEMORA NO ATENDIMENTO': 'DEMORA NO ATENDIMENTO',
  'FECHOU COM OUTRA EMPRESA (GERAL)': 'FECHOU COM OUTRA EMPRESA (GERAL)',
  'NÃO GOSTOU DO PORTIFÓLIO (PRODUTOS/SERVIÇOS)': 'NÃO GOSTOU DO PORTIFÓLIO (PRODUTOS/SERVIÇOS)',
  'ACHOU O PREÇO ALTO': 'ACHOU O PREÇO ALTO',
  'PROBLEMAS COM LIBERAÇÃO DE CRÉDITO': 'PROBLEMAS COM LIBERAÇÃO DE CRÉDITO',
}

const PlansEquivalents = {
  'MANUTENÇÃO SIMPLES': '661d828de3446bbfeff1bcf4',
  'PLANO SOL': '660efd7cb535065ae08d459f',
  'PLANO SOL PLUS': '660ff9f61285da49d6dc201e',
}
function getRandomArbitrary(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
const letters = 'abcdefghijklmnopqrstuvwxyz'.split('')
type Reduced = { [key: string]: string[] }
const migrate: NextApiHandler<PostResponse> = async (req, res) => {
  // const session = await validateAuthenticationWithSession(req, res)
  // const { id } = req.query
  const crmDb = await connectToCRMDatabase(process.env.MONGODB_URI, 'crm')
  const usersCollection = crmDb.collection('users')
  const users = await usersCollection.find({}).toArray()
  const bulkWriteArr = users.map((u) => {})
  // const bulkWriteArr = opportunities.map((opportunity) => {
  //   const responsibles: TOpportunity['responsaveis'] = opportunity.responsaveis.map((resp) => {
  //     const equivUser = users.find((u) => u._id.toString() == resp.id)
  //     return {
  //       id: equivUser?._id.toString() || resp.id,
  //       nome: equivUser?.nome || resp.nome,
  //       papel: resp.papel,
  //       avatar_url: equivUser?.avatar_url || null,
  //       dataInsercao: resp.dataInsercao,
  //     }
  //   })
  //   return {
  //     updateOne: {
  //       filter: { _id: new ObjectId(opportunity._id) },
  //       update: {
  //         $set: {
  //           responsaveis: responsibles,
  //         },
  //       },
  //     },
  //   }
  // })
  // const users = await usersCollection.find({ _id: { $ne: new ObjectId('6463ccaa8c5e3e227af54d89') } }).toArray()
  // const bulkwriteArr = clients.map((u) => {
  //   const author = users.find((x) => x._id.toString() == u.autor.id)
  //   const newAuthor = {
  //     id: author?._id.toString() || u.autor.id,
  //     nome: author?.nome || u.autor.nome,
  //     avatar_url: null,
  //   }
  //   const randomIndex = getRandomArbitrary(0, 4000)
  //   const randomUser = randomUsers[randomIndex]
  //   // console.log(randomUser)
  //   const newName = `${randomUser.name.first} ${randomUser.name.last}`
  //   const newEmail = randomUser.email
  //   const newPhone = ''

  //   return {
  //     updateOne: {
  //       filter: { _id: new ObjectId(u._id) },
  //       update: {
  //         $set: {
  //           nome: newName,
  //           email: newEmail,
  //           telefone: newPhone,
  //           cpfCnpj: '',
  //           autor: newAuthor,
  //         },
  //       },
  //     },
  //   }
  // })
  // const proposals = await proposalsCollection.find({ 'kits.0': { $exists: true } }).toArray()

  // const bulkWriteArr = proposals.map((proposal) => {
  //   const products = proposal.produtos
  //   const inverterQty = getInverterQty(products)
  //   const moduleQty = getModulesQty(products)
  //   const modulePeakPower = getModulesPeakPotByProducts(products)

  //   return {
  //     updateOne: {
  //       filter: { _id: new ObjectId(proposal._id) },
  //       update: {
  //         $set: {
  //           'premissas.numModulos': moduleQty,
  //           'premissas.numInversores': inverterQty,
  //           'premissas.potenciaPico': modulePeakPower,
  //         },
  //       },
  //     },
  //   }
  // })
  // const opportunitiesCollection: Collection<TOpportunity> = crmDb.collection('opportunities')

  // const opportunities = await opportunitiesCollection.find({}, { projection: { nome: 1, responsaveis: 1, dataInsercao: 1 } }).toArray()

  // const bulkWriteArr = opportunities.map((opportunity) => {
  //   const insertDate = opportunity.dataInsercao
  //   const responsibles = opportunity.responsaveis.map((resp) => ({ ...resp, dataInsercao: insertDate }))
  //   return {
  //     updateOne: {
  //       filter: { _id: new ObjectId(opportunity._id) },
  //       update: {
  //         $set: {
  //           responsaveis: responsibles,
  //         },
  //       },
  //     },
  //   }
  // })
  // const proposalsCollection: Collection<TProposal> = crmDb.collection('proposals')

  // const proposalsToFix = await proposalsCollection.find({ 'planos.id': '' }).toArray()

  // const bulkWriteArr = proposalsToFix.map((proposal) => {
  //   const plans = proposal.planos
  //   const plansFixed = plans.map((p) => {
  //     const equivalentId = PlansEquivalents[p.nome as keyof typeof PlansEquivalents]
  //     console.log(equivalentId, p.nome)
  //     return { ...p, id: equivalentId }
  //   })

  //   return {
  //     updateOne: {
  //       filter: { _id: new ObjectId(proposal._id) },
  //       update: {
  //         $set: {
  //           planos: plansFixed,
  //         },
  //       },
  //     },
  //   }
  // })
  // const opportunitiesCollection: Collection<TOpportunity> = crmDb.collection('opportunities')

  // const opportunities = await opportunitiesCollection.find({}, { projection: { perda: 1 } }).toArray()

  // const bulkWriteArr = opportunities.map((opportunity) => {
  //   const lossReason = opportunity.perda.descricaoMotivo
  //     ? LossReasonsEquivalents[opportunity.perda.descricaoMotivo as keyof typeof LossReasonsEquivalents]
  //     : null
  //   return {
  //     updateOne: {
  //       filter: { _id: new ObjectId(opportunity._id) },
  //       update: {
  //         $set: {
  //           'perda.descricaoMotivo': lossReason,
  //         },
  //       },
  //     },
  //   }
  // })
  // const funnelReferencesCollection: Collection<TFunnelReference> = crmDb.collection('funnel-references')

  // const references = await funnelReferencesCollection.find({}).toArray()

  // const bulkwriteArr = references.map((ref) => {
  //   const currentStageId = ref.idEstagioFunil

  //   return {
  //     updateOne: {
  //       filter: { _id: new ObjectId(ref._id) },
  //       update: {
  //         $set: {
  //           [`estagios.${currentStageId}.entrada`]: new Date().toISOString(),
  //         },
  //       },
  //     },
  //   }
  // })
  // const userGroupsCollection: Collection<TUserGroup> = crmDb.collection('user-groups')

  // const usersCollection: Collection<TUser> = crmDb.collection('users')

  // const users = await usersCollection.find({ _id: new ObjectId('6463ccaa8c5e3e227af54d89') })

  // await usersCollection.updateOne({ _id: new ObjectId('6463ccaa8c5e3e227af54d89') }, { $set: { 'teste.teste': 'AAAAA' } })

  // const bulkwriteArr = users.map((user) => {
  //   const newUserGroup = UserGroupEquivalents[user.idGrupo as keyof typeof UserGroupEquivalents]

  //   return {
  //     updateOne: {
  //       filter: { _id: new ObjectId(user._id) },
  //       update: {
  //         $set: {
  //           idGrupo: newUserGroup,
  //         },
  //       },
  //     },
  //   }
  // })
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
  // const bulkwriteResponse = await usersCollection.bulkWrite(bulkWriteArr)
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
  // const insertManyResponse = await userGroupsCollection.insertMany(insertUserGroups)
  return res.status(200).json('DESATIVADA')
}
export default apiHandler({
  GET: migrate,
})
