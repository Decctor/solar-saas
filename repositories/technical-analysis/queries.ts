import { TTechnicalAnalysis } from '@/utils/schemas/technical-analysis.schema'
import { Collection, ObjectId } from 'mongodb'

type GetTechnicalAnalysisParams = {
  collection: Collection<TTechnicalAnalysis>
  partnerId: string
}
export async function getTechnicalAnalysis({ collection, partnerId }: GetTechnicalAnalysisParams) {
  try {
    const allAnalysis = await collection.find({ idParceiro: partnerId }, { sort: { _id: -1 } }).toArray()
    return allAnalysis
  } catch (error) {
    throw error
  }
}

type GetTechnicalAnalysisByIdParams = {
  collection: Collection<TTechnicalAnalysis>
  partnerId: string
  analysisId: string
}
export async function getTechnicalAnalysisById({ collection, partnerId, analysisId }: GetTechnicalAnalysisByIdParams) {
  try {
    const analysis = await collection.findOne({ _id: new ObjectId(analysisId), idParceiro: partnerId })
    return analysis
  } catch (error) {
    throw error
  }
}

type GetTechnicalAnalysisByOpportunityIdParams = {
  collection: Collection<TTechnicalAnalysis>
  partnerId: string
  opportunityId: string
}
export async function getTechnicalAnalysisByOpportunityId({ collection, partnerId, opportunityId }: GetTechnicalAnalysisByOpportunityIdParams) {
  try {
    const analysis = await collection.find({ 'oportunidade.id': opportunityId, idParceiro: partnerId }, { sort: { _id: -1 } }).toArray()
    return analysis
  } catch (error) {
    throw error
  }
}
