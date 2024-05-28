import connectToDatabase from '@/services/mongodb/crm-db-connection'
import { apiHandler, validateAuthentication, validateAuthenticationWithSession } from '@/utils/api'
import { IUsuario } from '@/utils/models'
import { TUser, TUserDTOWithSaleGoals } from '@/utils/schemas/user.schema'
import { Collection, WithId } from 'mongodb'
import { NextApiHandler } from 'next'
type GetResponse = {
  data: TUserDTOWithSaleGoals[]
}
const getSalePromoters: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const partnerId = session.user.idParceiro
  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const usersCollection: Collection<TUser> = db.collection('users')
  const salePromoters = await usersCollection
    .aggregate([
      {
        $match: {
          ativo: true,
          idParceiro: partnerId,
          idGrupo: { $in: ['66562a2a812707dbf9f04832', '66562a2a812707dbf9f04833'] },
        },
      },
      {
        $project: {
          senha: 0,
        },
      },
      {
        $addFields: {
          userIdString: { $toString: '$_id' },
        },
      },
      {
        $lookup: {
          from: 'sale-goals',
          localField: 'userIdString',
          foreignField: 'usuario.id',
          as: 'metas',
        },
      },
      {
        $sort: {
          nome: 1,
        },
      },
    ])
    .toArray()
  return res.status(200).json({ data: salePromoters as WithId<TUserDTOWithSaleGoals>[] })
}

export default apiHandler({ GET: getSalePromoters })
