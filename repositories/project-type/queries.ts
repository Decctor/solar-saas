import { TProjectType } from '@/utils/schemas/project-types.schema'
import { Collection, Filter, ObjectId } from 'mongodb'

type GetProjectTypesParams = {
  collection: Collection<TProjectType>
  query: Filter<TProjectType>
}
export async function getProjectTypes({ collection, query }: GetProjectTypesParams) {
  try {
    // @ts-ignore
    const types = await collection.find({ ...query }, { sort: { dataInsercao: 1 } }).toArray()

    return types
  } catch (error) {
    throw error
  }
}

type GetProjectTypeByIdParams = {
  collection: Collection<TProjectType>
  id: string
  query: Filter<TProjectType>
}
export async function getProjectTypeById({ collection, id, query }: GetProjectTypeByIdParams) {
  try {
    const type = await collection.findOne({ _id: new ObjectId(id), ...query })
    return type
  } catch (error) {
    throw error
  }
}
