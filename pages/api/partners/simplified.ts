import { getPartnerOwnInformation } from '@/repositories/partner-simplified/query'
import connectToDatabase from '@/services/mongodb/main-db-connection'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TPartner, TPartnerSimplified } from '@/utils/schemas/partner.schema'
import createHttpError from 'http-errors'
import { Collection, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: TPartnerSimplified
}
const getPartnerSimplified: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const partnerId = session.user.idParceiro

  const { id } = req.query
  if (!id || typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')

  const db = await connectToDatabase(process.env.MONGODB_URI, 'main')
  const partnersCollection: Collection<TPartner> = db.collection('partners')

  const partner = await getPartnerOwnInformation({ collection: partnersCollection, id: id })
  if (!partner) throw new createHttpError.NotFound('Parceiro não encontrado.')
  res.json({ data: partner })
}

export default apiHandler({
  GET: getPartnerSimplified,
})
