import axios from 'axios'
import { IPPSCall } from '../models'

export async function createPPSCall(info: IPPSCall) {
  try {
    const { data } = await axios.post('/api/integration/app-ampere/ppsCalls', { data: info })
    return data.message as string
  } catch (error) {
    throw error
  }
}
