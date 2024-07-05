import { TSignUpSetup } from '@/utils/schemas/sign-up-setup.schema'
import { Collection, ObjectId } from 'mongodb'

type InsertSignUpSetupParams = {
  collection: Collection<TSignUpSetup>
  info: TSignUpSetup
}
export async function insertSignUpSetup({ info, collection }: InsertSignUpSetupParams) {
  try {
    const insertResponse = await collection.insertOne(info)
    return insertResponse
  } catch (error) {
    throw error
  }
}

type UpdateSignUpSetupParams = {
  collection: Collection<TSignUpSetup>
  changes: Partial<TSignUpSetup>
  id: string
}

export async function updateSignUpSetup({ collection, changes, id }: UpdateSignUpSetupParams) {
  try {
    const updateResponse = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...changes } })

    return updateResponse
  } catch (error) {
    throw error
  }
}
