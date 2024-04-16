import axios from 'axios'
import { TActivity, TActivityDTO } from '../schemas/activities.schema'

export async function createActivity({ info }: { info: TActivity }) {
  try {
    const { data } = await axios.post('/api/activities', info)
    if (typeof data.message != 'string') return 'Atividade criada com sucesso !'
    return data.message
  } catch (error) {
    throw error
  }
}

export async function editActivity({ id, changes }: { id: string; changes: Partial<TActivityDTO> }) {
  try {
    const { data } = await axios.put(`/api/activities?id=${id}`, changes)

    if (typeof data.message != 'string') return 'Atividade atualizada com sucesso !'
    return data.message
  } catch (error) {
    throw error
  }
}
