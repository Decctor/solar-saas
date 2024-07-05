import { insertSignUpSetup, updateSignUpSetup } from '@/repositories/sign-up-setup/mutations'
import { getSignUpSetup } from '@/repositories/sign-up-setup/queries'
import connectToDatabase from '@/services/mongodb/crm-db-connection'
import { apiHandler } from '@/utils/api'
import { InsertSignUpSetupSchema, TSignUpSetup } from '@/utils/schemas/sign-up-setup.schema'
import createHttpError from 'http-errors'
import { Collection, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = any

const getSignUpSetupRoute: NextApiHandler<GetResponse> = async (req, res) => {
  const { id } = req.query
  if (!id || typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido para a referência de cadastro.')
  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const collection: Collection<TSignUpSetup> = db.collection('sign-up-setup')

  const setup = await getSignUpSetup({ collection, id })

  return res.status(200).json({ data: setup })
}

type PostResponse = {
  data: { insertedId: string }
  message: string
}

const createSignUpSetupRoute: NextApiHandler<PostResponse> = async (req, res) => {
  const setup = InsertSignUpSetupSchema.parse(req.body)

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const collection: Collection<TSignUpSetup> = db.collection('sign-up-setup')

  const insertResponse = await insertSignUpSetup({ info: setup, collection })
  if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido ao prosseguir com o cadastro.')

  const insertedId = insertResponse.insertedId.toString()

  return res.status(201).json({ data: { insertedId }, message: 'Cadastro iniciado com sucesso !' })
}

type PutResponse = {
  data: string
  message: string
}

const editSignUpSetupRoute: NextApiHandler<PutResponse> = async (req, res) => {
  const { id } = req.query

  if (!id || typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')

  const changes = InsertSignUpSetupSchema.partial().parse(req.body)

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const collection: Collection<TSignUpSetup> = db.collection('sign-up-setup')

  const updateResponse = await updateSignUpSetup({ id, collection, changes })
  if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido ao prosseguir com o cadastro.')
  if (updateResponse.matchedCount == 0) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido ao prosseguir com o cadastro.')

  return res.status(201).json({ data: 'Cadastro atualizado com sucesso !', message: 'Cadastro atualizado com sucesso !' })
}

export default apiHandler({ GET: getSignUpSetupRoute, POST: createSignUpSetupRoute, PUT: editSignUpSetupRoute })
