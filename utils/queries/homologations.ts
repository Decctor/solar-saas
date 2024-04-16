import axios from 'axios'
import { THomologationDTO } from '../schemas/homologation.schema'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

async function fetchOpportunityHomologations({ opportunityId }: { opportunityId: string }) {
  try {
    const { data } = await axios.get(`/api/homologations?opportunityId=${opportunityId}`)

    return data.data as THomologationDTO[]
  } catch (error) {
    throw error
  }
}

export function useOpportunityHomologations({ opportunityId }: { opportunityId: string }) {
  return useQuery({
    queryKey: ['opportunity-homologations', opportunityId],
    queryFn: async () => await fetchOpportunityHomologations({ opportunityId }),
  })
}

async function fetchHomologationById({ id }: { id: string }) {
  try {
    const { data } = await axios.get(`/api/homologations?id=${id}`)

    return data.data as THomologationDTO
  } catch (error) {
    throw error
  }
}

export function useHomologationById({ id }: { id: string }) {
  return useQuery({
    queryKey: ['homologation-by-id', id],
    queryFn: async () => await fetchHomologationById({ id }),
  })
}

async function fetchHomologations() {
  try {
    const { data } = await axios.get(`/api/homologations`)

    return data.data as THomologationDTO[]
  } catch (error) {
    throw error
  }
}

type UseHomologationsFilters = {
  search: string
  status: string[]
}
export function useHomologations() {
  const [filters, setFilters] = useState<UseHomologationsFilters>({
    search: '',
    status: [],
  })
  return {
    ...useQuery({
      queryKey: ['homologations'],
      queryFn: fetchHomologations,
    }),
    filters,
    setFilters,
  }
}
