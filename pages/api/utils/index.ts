import { insertUtil } from '@/repositories/utils/mutations'
import { getCreditors } from '@/repositories/utils/queries'
import connectToDatabase from '@/services/mongodb/main-db-connection'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { GeneralUtilSchema, TUtil, UtilsIdentifierSchema } from '@/utils/schemas/utils'
import createHttpError from 'http-errors'
import { Collection } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = any

const getUtilsRelated: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const identifier = UtilsIdentifierSchema.parse(req.query.identifier)

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const collection: Collection<TUtil> = db.collection('utils')
  if (identifier == 'CREDITOR') {
    const creditors = await getCreditors({ collection: collection })

    return res.status(200).json({ data: creditors })
  }

  return res.status(200).json({ data: [] })
}

type PostResponse = {
  data: { insertedId: string }
  message: string
}

const createUtil: NextApiHandler<PostResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const collection: Collection<TUtil> = db.collection('utils')
  const util = GeneralUtilSchema.parse(req.body)

  const insertResponse = await insertUtil({ collection: collection, info: util })
  if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido ao inserir personalização.')

  const insertedId = insertResponse.insertedId.toString()

  return res.status(201).json({ data: { insertedId }, message: 'Personalização criada com sucesso !' })
}

export default apiHandler({ GET: getUtilsRelated, POST: createUtil })
