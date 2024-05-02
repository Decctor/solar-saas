import axios from 'axios'
import { IPPSCall } from '../models'
import { TPPSCall } from '../schemas/integrations/app-ampere/pps-calls.schema'

export async function createPPSCall(info: TPPSCall) {
  try {
    const { data } = await axios.post('/api/integration/app-ampere/pps-calls', info)
    if (typeof data.message != 'string') return 'Chamado criado com sucesso '
    return data.message as string
  } catch (error) {
    throw error
  }
}
