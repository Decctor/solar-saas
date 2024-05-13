import { getCreditors } from '@/repositories/utils/equipments/queries'
import connectToDatabase from '@/services/mongodb/main-db-connection'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TUtil, UtilsIdentifierSchema } from '@/utils/schemas/utils'
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

export default apiHandler({ GET: getUtilsRelated })
