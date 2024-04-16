import { getSimilarClients } from '@/repositories/clients/queries'
import connectToDatabase from '@/services/mongodb/main-db-connection'
import { apiHandler, validateAuthentication, validateAuthenticationWithSession } from '@/utils/api'
import { IClient } from '@/utils/models'
import { TClient, TSimilarClientSimplified } from '@/utils/schemas/client.schema'
import createHttpError from 'http-errors'
import { NextApiHandler } from 'next'

type GetSearchParams = {
  cpfCnpj: unknown
  phoneNumber: unknown
  email: unknown
}
export function getClientSearchParams({ cpfCnpj, phoneNumber, email }: GetSearchParams) {
  var orArr = []
  if (typeof cpfCnpj == 'string' && cpfCnpj.trim().length > 2) {
    orArr.push({ cpfCnpj: { $regex: cpfCnpj, $options: 'i' } })
    orArr.push({ cpfCnpj: cpfCnpj })
  }

  if (typeof phoneNumber == 'string' && phoneNumber.trim().length > 2) {
    orArr.push({ telefonePrimario: { $regex: phoneNumber, $options: 'i' } })
    orArr.push({ telefonePrimario: phoneNumber })
  }

  if (typeof email == 'string' && email.trim().length > 2) {
    orArr.push({ email: { $regex: email, $options: 'i' } })
    orArr.push({ email: email })
  }
  return orArr
}
type GetResponse = {
  data: TSimilarClientSimplified[]
}
const getPartnerSimilarClients: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const partnerId = session.user.idParceiro

  const db = await connectToDatabase(process.env.MONGODB_URI, 'main')
  const collection = db.collection<TClient>('clients')
  const { cpfCnpj, phoneNumber, email } = req.query

  const orParam = getClientSearchParams({ cpfCnpj, phoneNumber, email })
  if (orParam.length == 0) return res.status(200).json({ data: [] })

  const orQuery = { $or: orParam }

  const clients = await getSimilarClients({ collection: collection, query: orQuery, partnerId: partnerId || '' })

  res.status(200).json({ data: clients })
}
export default apiHandler({
  GET: getPartnerSimilarClients,
})
