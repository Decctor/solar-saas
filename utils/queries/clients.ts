import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { IClient } from '../models'
import { TClientDTO, TSimilarClientSimplifiedDTO } from '../schemas/client.schema'
import { useState } from 'react'
import { formatWithoutDiacritics } from '@/lib/methods/formatting'

type SearchClientsParams = {
  cpfCnpj: string
  phoneNumber: string
  email: string
}
async function searchClients({ cpfCnpj, phoneNumber, email }: SearchClientsParams) {
  try {
    const { data } = await axios.get(`/api/clients/search?cpfCnpj=${cpfCnpj}&phoneNumber=${phoneNumber}&email=${email}`)
    return data.data as TSimilarClientSimplifiedDTO[]
  } catch (error) {
    throw error
  }
}
type UseSearchClientParams = {
  enabled: boolean
  cpfCnpj: string
  phoneNumber: string
  email: string
}
export function useSearchClients({ enabled, cpfCnpj, phoneNumber, email }: UseSearchClientParams) {
  return useQuery({
    queryKey: ['search-clients'],
    queryFn: async () => await searchClients({ cpfCnpj, phoneNumber, email }),
    enabled: !!enabled,
  })
}

async function fetchClientById({ id }: { id: string }) {
  try {
    const { data } = await axios.get(`/api/clients?id=${id}`)
    return data.data as TClientDTO
  } catch (error) {
    throw error
  }
}

export function useClientById({ id }: { id: string }) {
  return useQuery({
    queryKey: ['client', id],
    queryFn: async () => await fetchClientById({ id }),
  })
}

async function fetchClients({ author }: { author: string | null }) {
  try {
    const { data } = await axios.get(`/api/clients?author=${author}`)
    return data.data as TClientDTO[]
  } catch (error) {
    throw error
  }
}

type UseClientsFilters = {
  search: string
  city: string[]
}
export function useClients({ author }: { author: string | null }) {
  const [filters, setFilters] = useState<UseClientsFilters>({
    search: '',
    city: [],
  })
  function matchSearch(client: TClientDTO) {
    if (filters.search.trim().length == 0) return true
    return formatWithoutDiacritics(client.nome, true).includes(formatWithoutDiacritics(filters.search, true))
  }
  function matchCity(client: TClientDTO) {
    if (filters.city.length == 0) return true
    return filters.city.includes(client.cidade)
  }
  function handleModelData(data: TClientDTO[]) {
    var modeledData = data
    return modeledData.filter((client) => matchSearch(client) && matchCity(client))
  }
  return {
    ...useQuery({
      queryKey: ['clients'],
      queryFn: async () => await fetchClients({ author }),
      select: (data) => handleModelData(data),
    }),
    filters,
    setFilters,
  }
}
