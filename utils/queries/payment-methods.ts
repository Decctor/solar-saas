import axios from 'axios'
import { TPaymentMethodDTO } from '../schemas/payment-methods'
import { useQuery } from '@tanstack/react-query'

export async function fetchPaymentMethods() {
  try {
    const { data } = await axios.get('/api/payment-methods')
    return data.data as TPaymentMethodDTO[]
  } catch (error) {
    throw error
  }
}
export function usePaymentMethods() {
  return useQuery({
    queryKey: ['payment-methods'],
    queryFn: fetchPaymentMethods,
  })
}

export async function fetchPaymentMethodById({ id }: { id: string }) {
  try {
    const { data } = await axios.get(`/api/payment-methods?id=${id}`)
    return data.data as TPaymentMethodDTO
  } catch (error) {
    throw error
  }
}

export function usePaymentMethodById({ id }: { id: string }) {
  return useQuery({
    queryKey: ['payment-method-by-id', id],
    queryFn: async () => await fetchPaymentMethodById({ id }),
  })
}
