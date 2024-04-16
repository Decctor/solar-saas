import { TProjectType } from '@/utils/schemas/project-types.schema'
import { TProject } from '@/utils/schemas/project.schema'
import { Collection, ObjectId } from 'mongodb'

type InsertProjectTypeParams = {
  collection: Collection<TProjectType>
  info: TProjectType
  partnerId: string
}
export async function insertProjectType({ collection, info, partnerId }: InsertProjectTypeParams) {
  try {
    const insertResponse = await collection.insertOne({ ...info, idParceiro: partnerId, dataInsercao: new Date().toISOString() })
    return insertResponse
  } catch (error) {
    throw error
  }
}

type UpdateProjectTypeParams = {
  id: string
  collection: Collection<TProjectType>
  changes: Partial<TProjectType>
  partnerId: string
}

export async function updateProjectType({ id, collection, changes, partnerId }: UpdateProjectTypeParams) {
  try {
    const updateResponse = await collection.updateOne({ _id: new ObjectId(id), idParceiro: partnerId }, { $set: { ...changes } })

    return updateResponse
  } catch (error) {
    throw error
  }
}
