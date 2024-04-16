import { TProjectType } from '@/utils/schemas/project-types.schema'
import { Collection, ObjectId } from 'mongodb'

type GetProjectTypesParams = {
  collection: Collection<TProjectType>
  partnerId: string
}
export async function getProjectTypes({ collection, partnerId }: GetProjectTypesParams) {
  try {
    // @ts-ignore
    const types = await collection.find({ $or: [{ idParceiro: null }, { idParceiro: partnerId }] }, { sort: { dataInsercao: 1 } }).toArray()

    return types
  } catch (error) {
    throw error
  }
}

type GetProjectTypeByIdParams = {
  collection: Collection<TProjectType>
  id: string
  partnerId: string
}
export async function getProjectTypeById({ collection, id, partnerId }: GetProjectTypeByIdParams) {
  try {
    const type = await collection.findOne({ _id: new ObjectId(id), idParceiro: partnerId })
    return type
  } catch (error) {
    throw error
  }
}
