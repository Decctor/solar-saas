import { insertTechnicalAnalysis, updateTechnicalAnalysis } from '@/repositories/technical-analysis/mutations'
import { getTechnicalAnalysis, getTechnicalAnalysisById, getTechnicalAnalysisByOpportunityId } from '@/repositories/technical-analysis/queries'
import connectToDatabase from '@/services/mongodb/main-db-connection'
import { apiHandler, validateAuthentication, validateAuthenticationWithSession } from '@/utils/api'
import { GeneralTechnicalAnalysisSchema, TTechnicalAnalysis } from '@/utils/schemas/technical-analysis.schema'
import createHttpError from 'http-errors'
import { Collection, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: TTechnicalAnalysis | TTechnicalAnalysis[]
}

const getPartnerTechnicalAnalysis: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const partnerId = session.user.idParceiro
  const { id, opportunityId } = req.query

  const db = await connectToDatabase(process.env.MONGODB_URI, 'main')
  const collection: Collection<TTechnicalAnalysis> = db.collection('technical-analysis')

  if (id) {
    if (typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')
    const analysis = await getTechnicalAnalysisById({ collection: collection, partnerId: partnerId || '', analysisId: id })
    if (!analysis) throw new createHttpError.NotFound('Análise técnica não encontrada.')
    return res.status(200).json({ data: analysis })
  }
  if (opportunityId) {
    if (typeof opportunityId != 'string' || !ObjectId.isValid(opportunityId)) throw new createHttpError.BadRequest('ID de oportunidade inválido.')

    const opportunityAnalysis = await getTechnicalAnalysisByOpportunityId({
      collection: collection,
      partnerId: partnerId || '',
      opportunityId: opportunityId,
    })
    return res.status(200).json({ data: opportunityAnalysis })
  }
  const allAnalysis = await getTechnicalAnalysis({ collection: collection, partnerId: partnerId || '' })

  return res.status(200).json({ data: allAnalysis })
}

type PostResponse = {
  data: { insertedId: string }
  message: string
}

const createTechnicalAnalysis: NextApiHandler<PostResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const partnerId = session.user.idParceiro

  const analysis = GeneralTechnicalAnalysisSchema.parse(req.body)
  const db = await connectToDatabase(process.env.MONGODB_URI, 'main')
  const collection: Collection<TTechnicalAnalysis> = db.collection('technical-analysis')

  const insertResponse = await insertTechnicalAnalysis({ collection: collection, info: analysis, partnerId: partnerId || '' })
  if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido na criação da análise técnica.')

  const insertedId = insertResponse.insertedId.toString()
  return res.status(201).json({ data: { insertedId }, message: 'Análise técnica criada com sucesso !' })
}

type PutResponse = {
  data: string
  message: string
}
const editTechnicalAnalysis: NextApiHandler<PutResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const partnerId = session.user.idParceiro
  const { id } = req.query
  if (!id || typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')

  const changes = req.body

  const db = await connectToDatabase(process.env.MONGODB_URI, 'main')
  const collection: Collection<TTechnicalAnalysis> = db.collection('technical-analysis')

  const updateResponse = await updateTechnicalAnalysis({ collection: collection, info: changes, analysisId: id, partnerId: partnerId || '' })
  if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido ao atualizar análise técnica.')
  if (updateResponse.matchedCount == 0) throw new createHttpError.NotFound('Análise técnica não encontrada.')
  return res.status(201).json({ data: 'Análise técnica atualizada com sucesso !', message: 'Análise técnica atualizada com sucesso !' })
}
export default apiHandler({
  GET: getPartnerTechnicalAnalysis,
  POST: createTechnicalAnalysis,
  PUT: editTechnicalAnalysis,
})