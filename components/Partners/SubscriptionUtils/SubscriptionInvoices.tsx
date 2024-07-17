import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingComponent from '@/components/utils/LoadingComponent'
import { getErrorMessage } from '@/lib/methods/errors'
import { formatDateAsLocale } from '@/lib/methods/formatting'
import { formatToMoney } from '@/utils/methods'
import { useInvoicesBySubscriptionId } from '@/utils/queries/invoices'
import { TInvoice } from '@/utils/schemas/invoices.schema'
import React from 'react'

function getInvoiceStatusTag(status: TInvoice['status']) {
  if (status == 'succeeded')
    return <h1 className="rounded-lg border border-green-600 bg-green-400 px-2 py-1 text-[0.6rem] font-medium text-white">PAGAMENTO FEITO</h1>
  if (status == 'failed')
    return <h1 className="rounded-lg border border-red-600 bg-red-400 px-2 py-1 text-[0.6rem] font-medium text-white">PAGAMENTO PENDENTE</h1>
  return null
}

type SubscriptionInvoicesProps = {
  subscriptionId: string
}
function SubscriptionInvoices({ subscriptionId }: SubscriptionInvoicesProps) {
  const { data: invoices, isLoading, isError, isSuccess, error } = useInvoicesBySubscriptionId({ subscriptionId })
  const errorMsg = isError ? getErrorMessage(error) : null
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="text-xs font-medium tracking-tight text-gray-700">ÚLTIMAS FATURAS</h1>
      {isLoading ? <LoadingComponent /> : null}
      {isError ? <ErrorComponent msg={errorMsg || 'Oops, houve um erro desconhecido ao buscar faturas da assinatura.'} /> : null}
      {isSuccess
        ? invoices.map((invoice) => (
            <div className="flex w-full flex-col rounded border border-gray-200 p-2">
              <div className="flex w-full items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-xs font-medium text-gray-500">
                    FATURA DE {formatDateAsLocale(invoice.periodo.inicio)} - {formatDateAsLocale(invoice.periodo.fim)}
                  </h1>
                </div>
                <h1
                  className={`rounded-lg ${
                    invoice.valorPago ? 'border-green-800 bg-green-800' : 'border-red-800 bg-red-800'
                  } border px-2 py-1 text-[0.6rem] font-medium text-white`}
                >
                  {invoice.valorPago ? 'PAGO ' : 'PENDENTE '}
                  {formatToMoney(invoice.valorPago || invoice.valorDevido || 0)}
                </h1>
              </div>
            </div>
          ))
        : null}
    </div>
  )
}

export default SubscriptionInvoices
