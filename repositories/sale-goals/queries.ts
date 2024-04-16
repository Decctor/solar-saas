import { TSaleGoal } from '@/utils/schemas/sale-goal.schema'
import { Collection } from 'mongodb'

type GetSaleGoalsByUserIdParams = {
  collection: Collection<TSaleGoal>
  userId: string
  partnerId: string
}
export async function getSaleGoalsByUserId({ collection, userId, partnerId }: GetSaleGoalsByUserIdParams) {
  try {
    const saleGoals = await collection.find({ 'usuario.id': userId, idParceiro: partnerId }).toArray()
    return saleGoals
  } catch (error) {
    throw error
  }
}
