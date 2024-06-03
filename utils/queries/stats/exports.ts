import { TResultsExportsItem } from '@/pages/api/stats/comercial-results/results-export'
import axios from 'axios'

export async function fetchResultsExports({
  after,
  before,
  responsibles,
  partners,
  projectTypes,
}: {
  after: string
  before: string
  responsibles: string[] | null
  partners: string[] | null
  projectTypes: string[] | null
}) {
  try {
    const { data } = await axios.post(`/api/stats/comercial-results/results-export?after=${after}&before=${before}`, { responsibles, partners, projectTypes })
    return data.data as TResultsExportsItem[]
  } catch (error) {
    throw error
  }
}
