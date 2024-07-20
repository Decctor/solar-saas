import { insertManyFileReferences } from '@/repositories/file-references/mutation'
import connectToDatabase from '@/services/mongodb/crm-db-connection'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { InsertFileReferenceSchema, TFileReference } from '@/utils/schemas/file-reference.schema'
import createHttpError from 'http-errors'
import { Collection } from 'mongodb'
import { NextApiHandler } from 'next'
import { z } from 'zod'

type PostResponse = {
  data: {
    insertedIds: string[]
  }
  message: string
}

const createManyFileReferences: NextApiHandler<PostResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res, true)
  const partnerId = session.user.idParceiro

  const manyAnalysis = z.array(InsertFileReferenceSchema).parse(req.body)

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const fileReferencesCollection: Collection<TFileReference> = db.collection('file-references')

  const insertResponse = await insertManyFileReferences({ collection: fileReferencesCollection, info: manyAnalysis, partnerId: partnerId || '' })
  if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido na criação das referências de arquivo.')
  const insertedIds = Object.values(insertResponse.insertedIds).map((i) => i.toString())

  return res.status(201).json({ data: { insertedIds }, message: 'Referências de arquivo criadas com sucesso !' })
}

export default apiHandler({
  POST: createManyFileReferences,
})
