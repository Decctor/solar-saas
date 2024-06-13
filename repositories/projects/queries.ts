import { TProject, TProjectWithClient } from '@/utils/schemas/project.schema'
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
    const addFields = { clientAsObjectId: { $toObjectId: '$cliente.id' } }
    const clientLookup = { from: 'clients', localField: 'clientAsObjectId', foreignField: '_id', as: 'clienteDados' }
    const projectArr = await collection
      .aggregate([
        {
          $match: { _id: new ObjectId(id), ...query },
        },
        {
          $addFields: addFields,
        },
        {
          $lookup: clientLookup,
        },
      ])
      .toArray()
    const project = projectArr.map((p) => ({ ...p, clienteDados: p.clienteDados[0] }))
    return project[0] as TProjectWithClient
  } catch (error) {
    throw error
  }
}
