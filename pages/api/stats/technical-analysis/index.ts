import { getHoursDiff } from '@/lib/methods/dates'
import { formatDateQuery } from '@/lib/methods/formatting'
import connectToDatabase from '@/services/mongodb/crm-db-connection'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TechnicalAnalysisSimplifiedProjection, TTechnicalAnalysis, TTechnicalAnalysisSimplified } from '@/utils/schemas/technical-analysis.schema'
import { Collection, Filter, WithId } from 'mongodb'
import { NextApiHandler } from 'next'
import { z } from 'zod'

export type TTechnicalAnalysisStats = {
  created: number
  concluded: number
  timeTillConclusion: TTechnicalAnalysisTimeTillConclusion
  byType: TTechnicalAnalysisByType
  byApplicant: TTechnicalAnalysisByApplicant
  byStatus: TTechnicalAnalysisByStatus
}

type GetResponse = {
  data: TTechnicalAnalysisStats
}

const QueryParamsSchema = z.object({
  after: z
    .string({
      required_error: 'Parâmetros de período não fornecidos ou inválidos.',
      invalid_type_error: 'Parâmetros de período não fornecidos ou inválidos.',
    })
    .datetime({ message: 'Tipo inválido para parâmetro de período.' }),
  before: z
    .string({
      required_error: 'Parâmetros de período não fornecidos ou inválidos.',
      invalid_type_error: 'Parâmetros de período não fornecidos ou inválidos.',
    })
    .datetime({ message: 'Tipo inválido para parâmetro de período.' }),
})
const getTechnicalAnalysisStats: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const { after, before } = QueryParamsSchema.parse(req.query)

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const analysisCollection: Collection<TTechnicalAnalysis> = db.collection('technical-analysis')

  const afterDateStr = formatDateQuery(after, 'start')
  const beforeDateStr = formatDateQuery(before, 'end')
  const analysis = await getAnalysis({ analysisCollection, afterDateStr, beforeDateStr })

  const created = analysis.length
  const concluded = analysis.filter((a) => !!a.dataEfetivacao).length
  const byType = getAnalysisByType({ analysis })
  const timeTillConclusion = getAvgTimeTillConclusion({ analysis })
  const byApplicant = getAnalysisByApplicant({ analysis })
  const byStatus = getAnalysisByStatus({ analysis })

  return res.status(200).json({ data: { created, concluded, timeTillConclusion, byType, byApplicant, byStatus } })
}
export default apiHandler({ POST: getTechnicalAnalysisStats })

type TTechnicalAnalysisTimeTillConclusion = {
  avgTime: number
  totalTime: number
  byType: { [key: string]: number }
}
function getAvgTimeTillConclusion({ analysis }: { analysis: TTechnicalAnalysisSimplified[] }) {
  const concludedAnalysis = analysis.filter((a) => !!a.dataEfetivacao)

  const totalConcludedAnalysis = concludedAnalysis.length
  const tillConclusion = concludedAnalysis.reduce(
    (acc: TTechnicalAnalysisTimeTillConclusion, current) => {
      const type = current.tipoSolicitacao || 'NÃO DEFINIDO'
      const diff = getHoursDiff({ start: current.dataInsercao, finish: current.dataEfetivacao as string, businessOnly: true })
      if (!acc.byType[type]) acc.byType[type] = 0
      acc.byType[type] += diff
      acc.totalTime += diff
      return acc
    },
    { avgTime: 0, totalTime: 0, byType: {} }
  )

  return { ...tillConclusion, avgTime: tillConclusion.totalTime / totalConcludedAnalysis }
}
type TTechnicalAnalysisByType = { [key: string]: number }
function getAnalysisByType({ analysis }: { analysis: TTechnicalAnalysisSimplified[] }) {
  const byType = analysis.reduce((acc: TTechnicalAnalysisByType, current) => {
    const type = current.tipoSolicitacao || 'NÃO DEFINIDO'
    if (!acc[type]) acc[type] = 0
    acc[type] = acc[type] + 1
    return acc
  }, {})

  return byType
}

type TTechnicalAnalysisByApplicant = {
  [key: string]: {
    avatar_url?: string | null
    analysis: number
    byType: { [key: string]: number }
  }
}
function getAnalysisByApplicant({ analysis }: { analysis: TTechnicalAnalysisSimplified[] }) {
  const byApplicant = analysis.reduce((acc: TTechnicalAnalysisByApplicant, current) => {
    const { nome, apelido, avatar_url } = current.requerente
    const applicantName = nome || apelido || 'NÃO DEFINIDO'
    const type = current.tipoSolicitacao || 'NÃO DEFINIDO'
    if (!acc[applicantName])
      acc[applicantName] = {
        avatar_url: avatar_url,
        analysis: 0,
        byType: {},
      }
    acc[applicantName].analysis += 1
    if (!acc[applicantName].byType[type]) acc[applicantName].byType[type] = 0
    acc[applicantName].byType[type] += 1
    return acc
  }, {})
  return byApplicant
}

type TTechnicalAnalysisByStatus = { [key: string]: number }

function getAnalysisByStatus({ analysis }: { analysis: TTechnicalAnalysisSimplified[] }) {
  const byStatus = analysis.reduce((acc: TTechnicalAnalysisByStatus, current) => {
    const status = current.status || 'NÃO DEFINIDO'
    if (!acc[status]) acc[status] = 0
    acc[status] = acc[status] + 1
    return acc
  }, {})
  return byStatus
}
type GetAnalysisParams = {
  analysisCollection: Collection<TTechnicalAnalysis>
  afterDateStr: string
  beforeDateStr: string
}

async function getAnalysis({ analysisCollection, afterDateStr, beforeDateStr }: GetAnalysisParams) {
  console.log('DATES', afterDateStr, beforeDateStr)
  const match: Filter<TTechnicalAnalysis> = {
    $or: [
      { $and: [{ dataInsercao: { $gte: afterDateStr } }, { dataInsercao: { $lte: beforeDateStr } }] },
      { $and: [{ dataEfetivacao: { $gte: afterDateStr } }, { dataEfetivacao: { $lte: beforeDateStr } }] },
    ],
  }
  const result = await analysisCollection.aggregate([{ $match: match }, { $project: TechnicalAnalysisSimplifiedProjection }]).toArray()

  return result as WithId<TTechnicalAnalysisSimplified>[]
}
