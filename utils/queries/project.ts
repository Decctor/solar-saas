import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

async function fetchProjectById(id: string) {
  console.log('ID', id)
  if (!id) throw new Error('ID inválido.')
  try {
    const { data } = await axios.get(`/api/projects?id=${id}`)
    return data.data as []
  } catch (error) {
    throw error
  }
}

export function useProjectById({ id }: { id: string }) {
  return useQuery({
    queryKey: ['project-by-id', id],
    queryFn: async () => await fetchProjectById(id),
    refetchOnWindowFocus: true,
  })
}
