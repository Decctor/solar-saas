import { TProject } from '@/utils/schemas/project.schema'
import { Collection, Document, Filter, ObjectId, WithId } from 'mongodb'

type GetProjectsParams = {
  collection: Collection<TProject>
  query: Filter<TProject>
}
export async function getProjects({ collection, query }: GetProjectsParams) {
  try {
    const projects = await collection.find({ ...query }).toArray()
    return projects
  } catch (error) {
    throw error
  }
}
type GetProjectByIdParams = {
  id: string
  collection: Collection<TProject>
  query: Filter<TProject>
}
export async function getProjectById({ id, collection, query }: GetProjectByIdParams) {
  try {
    const project = await collection.findOne({ _id: new ObjectId(id), ...query })
    return project
  } catch (error) {
    throw error
  }
}
