import { TResultsExportsItem } from '@/pages/api/stats/comercial-results/results-export'
import axios from 'axios'

export async function fetchResultsExports({ after, before, responsibles }: { after: string; before: string; responsibles: string[] | null }) {
  try {
    const { data } = await axios.post(`/api/stats/comercial-results/results-export?after=${after}&before=${before}`, { responsibles })
    return data.data as TResultsExportsItem[]
  } catch (error) {
    throw error
  }
}
