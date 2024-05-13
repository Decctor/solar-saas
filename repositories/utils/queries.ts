import { TCreditor, TUtil } from '@/utils/schemas/utils'
import { Collection, WithId } from 'mongodb'

type GetCreditorsParams = {
  collection: Collection<TUtil>
}
export async function getCreditors({ collection }: GetCreditorsParams) {
  try {
    const creditors = await collection.find({ identificador: 'CREDITOR' }).toArray()
    return creditors as WithId<TCreditor>[]
  } catch (error) {
    throw error
  }
}
