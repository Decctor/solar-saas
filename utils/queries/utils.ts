import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { TCreditorDTO } from '../schemas/utils'

type UseDistanceDataParams = {
  originCity: string
  originUF: string
  destinationCity: string
  destinationUF: string
}
async function fetchDistanceData({ originCity, originUF, destinationCity, destinationUF }: UseDistanceDataParams) {
  try {
    const { data } = await axios.get(
      `/api/utils/distance?destination=${`${destinationCity}, ${destinationUF}, BRASIL`}&origin=${originCity}, ${originUF}, BRASIL'`
    )
    return data.data as number
  } catch (error) {
    throw error
  }
}

export function useDistanceData({ originCity, originUF, destinationCity, destinationUF }: UseDistanceDataParams) {
  return useQuery({
    queryKey: ['distance', destinationCity, destinationUF],
    queryFn: async () => await fetchDistanceData({ originCity, originUF, destinationCity, destinationUF }),
  })
}

// CREDITORS

async function fetchCreditors() {
  try {
    const { data } = await axios.get(`/api/utils?identifier=CREDITOR`)
    return data.data as TCreditorDTO[]
  } catch (error) {
    throw error
  }
}

export function useCreditors() {
  return useQuery({ queryKey: ['creditors'], queryFn: fetchCreditors })
}
