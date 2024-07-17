import axios from 'axios'
import { TInvoice, TInvoiceDTO } from '../schemas/invoices.schema'
import { useQuery } from '@tanstack/react-query'

async function fetchSubscriptionInvoices({ subscriptionId }: { subscriptionId: string }) {
  try {
    const { data } = await axios.get(`/api/integration/stripe/local/invoices?subscriptionId=${subscriptionId}`)

    return data.data as TInvoiceDTO[]
  } catch (error) {
    throw error
  }
}

export function useInvoicesBySubscriptionId({ subscriptionId }: { subscriptionId: string }) {
  return useQuery({
    queryKey: ['invoices-by-subscription-id', subscriptionId],
    queryFn: async () => await fetchSubscriptionInvoices({ subscriptionId }),
  })
}
