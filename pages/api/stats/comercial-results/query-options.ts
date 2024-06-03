import { getPartnersSimplified } from '@/repositories/partner-simplified/query'
import { getProjectTypesSimplified } from '@/repositories/project-type/queries'
import { getSalePromoters } from '@/repositories/users/queries'
import connectToDatabase from '@/services/mongodb/crm-db-connection'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TPartner, TPartnerSimplifiedDTO } from '@/utils/schemas/partner.schema'
import { TProjectType, TProjectTypeDTOSimplified } from '@/utils/schemas/project-types.schema'
import { TUser, TUserDTOWithSaleGoals } from '@/utils/schemas/user.schema'
import { Collection, Filter } from 'mongodb'
import { NextApiHandler } from 'next'

export type TComercialResultsQueryFiltersOptions = {
  salePromoters: TUserDTOWithSaleGoals[]
  partners: TPartnerSimplifiedDTO[]
  projectTypes: TProjectTypeDTOSimplified[]
}

type GetResponse = {
  data: TComercialResultsQueryFiltersOptions
}

const getQueryOptions: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const parterScope = session.user.permissoes.parceiros.escopo
  const partnerQuery = parterScope ? { idParceiro: { $in: [...parterScope, null] } } : {}

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const usersCollection: Collection<TUser> = db.collection('users')
  const partnersCollection: Collection<TPartner> = db.collection('partners')
  const projectTypesCollection: Collection<TProjectType> = db.collection('project-types')

  const salePromoters = await getSalePromoters({ collection: usersCollection, query: partnerQuery as Filter<TUser> })
  const partners = await getPartnersSimplified({ collection: partnersCollection, query: partnerQuery as Filter<TPartner> })
  const projectTypes = await getProjectTypesSimplified({ collection: projectTypesCollection, query: partnerQuery })

  const options = {
    salePromoters: salePromoters.map((s) => ({ ...s, _id: s._id.toString() })),
    partners: partners.map((p) => ({ ...p, _id: p._id.toString() })),
    projectTypes: projectTypes.map((p) => ({ ...p, _id: p._id.toString() })),
  }
  return res.status(200).json({ data: options })
}

export default apiHandler({ GET: getQueryOptions })
