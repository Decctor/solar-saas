import { apiHandler, validateAuthentication, validateAuthenticationWithSession, validateAuthorization } from '../../../utils/api'
import { NextApiHandler } from 'next'
import connectToDatabase from '../../../services/mongodb/main-db-connection'
import { IUsuario } from '../../../utils/models'
import { z } from 'zod'
import { hashSync } from 'bcrypt'
import createHttpError from 'http-errors'
import { Collection, ObjectId } from 'mongodb'
import { userInfo } from 'os'
import { InsertUserSchema, TUser, TUserEntity, UserEntitySchema } from '@/utils/schemas/user.schema'
import { getAllUsers, getPartnerUsers, getUserById } from '@/repositories/users/queries'

// POST RESPONSE
type PostResponse = {
  data: {
    insertedId: string
  }
  message: string
}

const createUser: NextApiHandler<PostResponse> = async (req, res) => {
  const session = await validateAuthorization(req, res, 'usuarios', 'criar', true)
  const partnerId = session.user.idParceiro
  const user = InsertUserSchema.parse(req.body)
  const { senha: password } = user
  let hashedPassword = hashSync(password, 10)

  const db = await connectToDatabase(process.env.MONGODB_URI, 'main')
  const collection: Collection<TUser> = db.collection('users')

  // Validing existence of equivalent user in database
  const existingUserInDn = await collection.findOne({ email: user.email })
  if (existingUserInDn) {
    throw new createHttpError.BadRequest('Oops, já existe um usuário com esse email.')
  }
  // Passed validations, now, creating user refencing requester partner ID
  let insertResponse = await collection.insertOne({ ...user, idParceiro: partnerId, senha: hashedPassword })
  const insertedIdAsString = insertResponse.insertedId.toString()
  // Dealing with updates for self scope only
  var updates = { $set: {} }
  if (user.permissoes.propostas.escopo && user.permissoes.propostas.escopo.length == 0) {
    updates.$set = { ...updates.$set, 'permissoes.propostas.escopo': [insertedIdAsString] }
  }
  if (user.permissoes.oportunidades.escopo && user.permissoes.oportunidades.escopo.length == 0) {
    updates.$set = { ...updates.$set, 'permissoes.oportunidades.escopo': [insertedIdAsString] }
  }
  if (user.permissoes.clientes.escopo && user.permissoes.clientes.escopo.length == 0) {
    updates.$set = { ...updates.$set, 'permissoes.clientes.escopo': [insertedIdAsString] }
  }
  if (user.permissoes.resultados.escopo && user.permissoes.resultados.escopo.length == 0) {
    updates.$set = { ...updates.$set, 'permissoes.resultados.escopo': [insertedIdAsString] }
  }
  console.log('UPDATES', updates)
  await collection.updateOne({ _id: insertResponse.insertedId }, updates)
  // Returning successful insertion
  if (insertResponse.acknowledged) res.status(201).json({ data: { insertedId: insertedIdAsString }, message: 'Usuário adicionado!' })
  else throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido na criação do usuário.')
}

// GET RESPONSE
type GetResponse = {
  data: TUserEntity[] | TUserEntity
}
const getUsers: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const db = await connectToDatabase(process.env.MONGODB_URI, 'main')
  const usersCollection: Collection<TUserEntity> = db.collection('users')
  const userIsAdmin = session.user.administrador
  const userPartnerId = session.user.idParceiro

  const { id } = req.query
  if (id && typeof id === 'string') {
    const user = await getUserById({ collection: usersCollection, id: id, userIsAdmin, userPartnerId })
    if (!user) throw new createHttpError.NotFound('Nenhum usuário encontrado com o ID fornecido.')
    res.status(200).json({ data: user })
  } else {
    var users = []
    if (userIsAdmin) {
      users = await getAllUsers({ collection: usersCollection })
    } else {
      users = await getPartnerUsers({ collection: usersCollection, partnerId: userPartnerId })
    }
    res.status(200).json({ data: users })
  }
}

// PUT RESPONSE
type PutResponse = {
  data: string
  message: string
}

const editUser: NextApiHandler<PutResponse> = async (req, res) => {
  await validateAuthorization(req, res, 'usuarios', 'editar', true)
  const { id } = req.query
  if (!id || typeof id !== 'string') throw new createHttpError.BadRequest('ID do objeto de alteração não especificado.')
  if (!req.body.changes) throw new createHttpError.BadRequest('Mudanças não especificadas na requisição.')

  const user = req.body.changes

  const db = await connectToDatabase(process.env.MONGODB_URI, 'main')
  const collection = db.collection('users')
  let changes
  if (req.body.changePassword && user.senha) {
    let hashedPassword = hashSync(user.senha, 10)
    changes = { ...user, senha: hashedPassword }
  } else {
    changes = { ...user }
  }
  // @ts-ignore
  delete changes._id
  if (typeof id === 'string') await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...changes } })
  res.status(201).json({ data: 'OK', message: 'Usuário alterado com sucesso.' })
}

export default apiHandler({
  POST: createUser,
  GET: getUsers,
  PUT: editUser,
})
