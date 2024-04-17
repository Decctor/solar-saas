import { getTechnicalAnalysis } from '@/repositories/technical-analysis/queries'
import { getOpportunityCreators, getTechnicalAnalysts } from '@/repositories/users/queries'
import connectToDatabase from '@/services/mongodb/main-db-connection'
import { apiHandler, validateAuthenticationWithSession, validateAuthorization } from '@/utils/api'
import { TUser, TUserEntity } from '@/utils/schemas/user.schema'
import { Collection, WithId } from 'mongodb'
import { NextApiHandler } from 'next'
import { z } from 'zod'
import technicalAnalysis from '../technical-analysis'

type GetResponse = {
  data: WithId<TUser>[]
}
const PersonalizedQueryTypes = [
  'user-creators',
  'opportunity-creators',
  'client-creators',
  'kit-creators',
  'proposal-creators',
  'price-editors',
  'technical-analysts',
] as const
const getUsersPersonalized: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const partnerId = session.user.idParceiro
  const type = z
    .enum(PersonalizedQueryTypes, { invalid_type_error: 'Tipo inválido para tipo de usuários.', required_error: 'Tipo de usuários não definido.' })
    .parse(req.query.type)

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const usersCollection: Collection<TUser> = db.collection('users')

  if (type == 'opportunity-creators') {
    const creators = await getOpportunityCreators({ collection: usersCollection, partnerId: partnerId })
    return res.status(200).json({ data: creators })
  }
  if (type == 'technical-analysts') {
    const analysts = await getTechnicalAnalysts({ collection: usersCollection, partnerId: partnerId || '' })
    return res.status(200).json({ data: analysts })
  }
  return res.status(200).json({ data: [] })
}
export default apiHandler({
  GET: getUsersPersonalized,
})
