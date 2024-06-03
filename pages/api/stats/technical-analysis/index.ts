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
  totalTimeTillConclusion: number
  avgTimeTillConclusion: number
  byType: { type: string; created: number; concluded: number; totalTimeTillConclusion: number; avgTimeTillConclusion: number }[]
  byStatus: { status: string; value: number }[]
  byApplicant: { applicant: string; applicantAvatarUrl?: string | null; analysis: number; byType: { [key: string]: number } }[]
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

  const afterDateStr = formatDateQuery(after, 'start', 'string') as string
  const beforeDateStr = formatDateQuery(before, 'end', 'string') as string
  const analysis = await getAnalysis({ analysisCollection, afterDateStr, beforeDateStr })

  const condensed = getCondensedStats({ analysis, afterDateStr, beforeDateStr })

  const stats: TTechnicalAnalysisStats = {
    created: condensed.created,
    concluded: condensed.concluded,
    totalTimeTillConclusion: condensed.totalTimeTillConclusion,
    avgTimeTillConclusion: condensed.totalTimeTillConclusion / condensed.concluded,
    byType: Object.entries(condensed.byType).map(([key, value]) => {
      return {
        type: key,
        created: value.created,
        concluded: value.concluded,
        totalTimeTillConclusion: value.totalTimeTillConclusion,
        avgTimeTillConclusion: value.totalTimeTillConclusion / value.concluded,
      }
    }),
    byApplicant: Object.entries(condensed.byApplicant).map(([key, value]) => {
      return {
        applicant: key,
        applicantAvatarUrl: value.avatar_url,
        analysis: value.analysis,
        byType: value.byType,
      }
    }),
    byStatus: Object.entries(condensed.byStatus).map(([key, value]) => ({ status: key, value: value })),
  }
  return res.status(200).json({ data: stats })
}
export default apiHandler({ POST: getTechnicalAnalysisStats })

type TTechnicalAnalysisCondensedStats = {
  created: number
  concluded: number
  totalTimeTillConclusion: number
  avgTimeTillConclusion: number
  byType: { [key: string]: { created: number; concluded: number; totalTimeTillConclusion: number; avgTimeTillConclusion: number } }
  byStatus: { [key: string]: number }
  byApplicant: { [key: string]: { avatar_url?: string | null; analysis: number; byType: { [key: string]: number } } }
}
function getCondensedStats({
  analysis,
  afterDateStr,
  beforeDateStr,
}: {
  analysis: TTechnicalAnalysisSimplified[]
  afterDateStr: string
  beforeDateStr: string
}): TTechnicalAnalysisCondensedStats {
  const afterDate = new Date(afterDateStr)
  const beforeDate = new Date(beforeDateStr)
  const condensed = analysis.reduce(
    (acc: TTechnicalAnalysisCondensedStats, current) => {
      const type = current.tipoSolicitacao || 'NÃO DEFINIDO'
      const status = current.status
      const applicant = current.requerente
      const applicantName = applicant.nome || 'NÃO DEFINIDO'
      const applicantAvatar = applicant.avatar_url

      const insertionDate = current.dataInsercao ? new Date(current.dataInsercao) : null
      const conclusionDate = current.dataEfetivacao ? new Date(current.dataEfetivacao) : null

      const wasInsertedWithinCurrentPeriod = !!insertionDate && insertionDate >= afterDate && insertionDate <= beforeDate
      const wasConcludedWithinCurrentPeriod = !!conclusionDate && conclusionDate >= afterDate && conclusionDate <= beforeDate

      const timeTillConclusion = wasConcludedWithinCurrentPeriod ? getHoursDiff({ start: current.dataInsercao, finish: current.dataEfetivacao as string }) : 0

      // Defining general metrics
      if (wasInsertedWithinCurrentPeriod) acc.created += 1
      if (wasConcludedWithinCurrentPeriod) acc.concluded += 1
      if (wasConcludedWithinCurrentPeriod) acc.totalTimeTillConclusion += timeTillConclusion

      // Defining metrics by type
      if (!acc.byType[type]) acc.byType[type] = { created: 0, concluded: 0, totalTimeTillConclusion: 0, avgTimeTillConclusion: 0 }
      if (wasInsertedWithinCurrentPeriod) acc.byType[type].created += 1
      if (wasConcludedWithinCurrentPeriod) acc.byType[type].concluded += 1
      if (wasConcludedWithinCurrentPeriod) acc.byType[type].totalTimeTillConclusion += timeTillConclusion
      // Defining metrics by status
      if (!acc.byStatus[status]) acc.byStatus[status] = 0
      acc.byStatus[status] += 1
      // Defining metrics by applicant
      if (!acc.byApplicant[applicantName])
        acc.byApplicant[applicantName] = {
          avatar_url: applicantAvatar,
          analysis: 0,
          byType: {},
        }
      acc.byApplicant[applicantName].analysis += 1
      if (!acc.byApplicant[applicantName].byType[type]) acc.byApplicant[applicantName].byType[type] = 0
      acc.byApplicant[applicantName].byType[type] += 1

      return acc
    },
    { created: 0, concluded: 0, totalTimeTillConclusion: 0, avgTimeTillConclusion: 0, byType: {}, byStatus: {}, byApplicant: {} }
  )
  // Formatting and fixing some metrics
  return condensed
}

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
