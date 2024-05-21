import connectToDatabase from '@/services/mongodb/crm-db-connection'
import { apiHandler, validateAuthentication } from '@/utils/api'
import { TOpportunity } from '@/utils/schemas/opportunity.schema'
import createHttpError from 'http-errors'
import { Collection } from 'mongodb'
import { NextApiHandler } from 'next'
import { z } from 'zod'

const ParamSchema = z.string({
  required_error: 'Parâmetros de busca não informados.',
  invalid_type_error: 'Tipo não válido para os parâmetros de busca.',
})

type GetResponse = {
  data: TOpportunity[]
}

const getOpportunitiesBySearch: NextApiHandler<GetResponse> = async (req, res) => {
  await validateAuthentication(req)
  const search = ParamSchema.parse(req.query.param)

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const collection: Collection<TOpportunity> = db.collection('opportunities')

  const opportunities = await collection
    .find(
      {
        $or: [{ nome: { $regex: search, $options: 'i' } }, { identificador: { $regex: search, $options: 'i' } }],
      },
      { projection: { nome: 1, identificador: 1, responsavel: 1 } }
    )
    .toArray()
  if (opportunities.length == 0) throw new createHttpError.NotFound('Nenhuma oportunidade encontrada com esse parâmetro.')
  return res.status(200).json({ data: opportunities })
}

export default apiHandler({
  GET: getOpportunitiesBySearch,
})
