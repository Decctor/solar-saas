import { TTechnicalAnalysis } from '@/utils/schemas/technical-analysis.schema'
import { Collection, ObjectId } from 'mongodb'

type InsertTechnicalAnalysisParams = {
  collection: Collection<TTechnicalAnalysis>
  info: TTechnicalAnalysis
  partnerId: string
}
export async function insertTechnicalAnalysis({ collection, info, partnerId }: InsertTechnicalAnalysisParams) {
  try {
    const insertResponse = await collection.insertOne({ ...info, idParceiro: partnerId })

    return insertResponse
  } catch (error) {
    throw error
  }
}

type UpdateTechnicalAnalysisParams = {
  collection: Collection<TTechnicalAnalysis>
  info: Partial<TTechnicalAnalysis>
  analysisId: string
  partnerId: string
}
export async function updateTechnicalAnalysis({ collection, info, analysisId, partnerId }: UpdateTechnicalAnalysisParams) {
  try {
    const updateResponse = await collection.updateOne({ _id: new ObjectId(analysisId), idParceiro: partnerId }, { $set: { ...info } })
    return updateResponse
  } catch (error) {
    throw error
  }
}
