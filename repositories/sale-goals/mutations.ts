import { Optional } from '@/utils/models'
import { TSaleGoal } from '@/utils/schemas/sale-goal.schema'
import { Collection, ObjectId } from 'mongodb'

type UpdateSaleGoalParams = {
  collection: Collection<TSaleGoal>
  id: string
  partnerId: string
  changes: Partial<TSaleGoal>
}
export async function updateSaleGoal({ collection, id, partnerId, changes }: UpdateSaleGoalParams) {
  try {
    const updateResponse = await collection.updateOne({ _id: new ObjectId(id), idParceiro: partnerId }, { $set: { ...changes } })
    return updateResponse
  } catch (error) {
    throw error
  }
}
