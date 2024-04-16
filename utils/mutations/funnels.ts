import axios from 'axios'
import { TFunnel } from '../schemas/funnel.schema'

export async function createFunnel({ info }: { info: TFunnel }) {
  try {
    const { data } = await axios.post('/api/funnels', info)
    if (typeof data.message == 'string') return data.message
    return data.message
  } catch (error) {
    throw error
  }
}
