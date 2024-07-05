import axios from 'axios'
import { TSignUpSetup } from '../schemas/sign-up-setup.schema'

export async function createSignUpSetup({ info }: { info: TSignUpSetup }) {
  try {
    const { data } = await axios.post('/api/signup-setup', info)

    return data.data.insertedId as string
  } catch (error) {
    throw error
  }
}

export async function editSignUpSetup({ id, changes }: { id: string; changes: Partial<TSignUpSetup> }) {
  try {
    const { data } = await axios.put(`/api/signup-setup?id=${id}`, changes)
    return 'Atualizado com sucesso !'
  } catch (error) {
    throw error
  }
}
