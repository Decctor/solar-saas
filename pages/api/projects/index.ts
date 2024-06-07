import connectToDatabase from '@/services/mongodb/crm-db-connection'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { GeneralProjectSchema, TProject } from '@/utils/schemas/project.schema'
import createHttpError from 'http-errors'
import { Collection } from 'mongodb'
import { NextApiHandler } from 'next'

type PostResponse = {
  data: { insertedId: string }
  message: string
}

const addNewProject: NextApiHandler<PostResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const project = GeneralProjectSchema.parse(req.body)

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const collection: Collection<TProject> = db.collection('projects')

  const insertResponse = await collection.insertOne(project)
  if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido ao criar o projeto.')

  const insertedId = insertResponse.insertedId.toString()

  return res.status(201).json({ data: { insertedId }, message: 'Projeto criado com sucesso !' })
}

export default apiHandler({ POST: addNewProject })
