import { TSignUpSetup } from '@/utils/schemas/sign-up-setup.schema'
import { Collection, ObjectId } from 'mongodb'

type GetSignUpSetupParams = {
  collection: Collection<TSignUpSetup>
  id: string
}

export async function getSignUpSetup({ collection, id }: GetSignUpSetupParams) {
  try {
    const setup = await collection.findOne({ _id: new ObjectId(id) })

    return setup
  } catch (error) {
    throw error
  }
}
