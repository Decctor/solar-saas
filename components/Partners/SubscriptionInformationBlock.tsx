import { TPartner, TPartnerDTOWithSubscriptionAndUsers } from '@/utils/schemas/partner.schema'
import React, { useState } from 'react'
import NumberInput from '../Inputs/NumberInput'
import axios from 'axios'
import { copyToClipboard } from '@/lib/hooks'
import { useMutationWithFeedback } from '@/utils/mutations/general-hook'
import { useQueryClient } from '@tanstack/react-query'
import { TSubscription } from '@/utils/schemas/subscription.schema'
import { formatLongString, formatToMoney } from '@/utils/methods'
import { FaRegCopy, FaUser } from 'react-icons/fa'
import { BsCalendarPlus } from 'react-icons/bs'
import { formatDateAsLocale } from '@/lib/methods/formatting'
import { MdEmail } from 'react-icons/md'
import SubscriptionCard from './SubscriptionUtils/SubscriptionCard'

function getSubscriptionStatusTag(status: TSubscription['status']) {
  if (status == 'active') return <h1 className="rounded-lg border border-green-600 bg-green-400 px-2 py-1 text-[0.6rem] font-medium text-white">ATIVA</h1>
  if (status == 'canceled') return <h1 className="rounded-lg border border-red-600 bg-red-400 px-2 py-1 text-[0.6rem] font-medium text-black">CANCELADA</h1>
  if (status == 'paused') return <h1 className="rounded-lg border border-gray-600 bg-gray-400 px-2 py-1 text-[0.6rem] font-medium text-white">PAUSADA</h1>
  if (status == 'unpaid') return <h1 className="rounded-lg border border-yellow-600 bg-yellow-400 px-2 py-1 text-[0.6rem] font-medium text-white">NÃO PAGA</h1>
  if (status == 'past_due')
    return <h1 className="rounded-lg border border-orange-600 bg-orange-400 px-2 py-1 text-[0.6rem] font-medium text-orange-600">EM ATRASO</h1>
  return <h1 className="rounded-lg border border-gray-600 bg-gray-400 px-2 py-1 text-[0.6rem] font-medium text-gray-600">NÃO DEFINIDO</h1>
}

type MediaInformationBlockProps = {
  partnerId: string | null
  infoHolder: TPartnerDTOWithSubscriptionAndUsers
  setInfoHolder: React.Dispatch<React.SetStateAction<TPartner>>
}
function SubscriptionInformationBlock({ partnerId, infoHolder, setInfoHolder }: MediaInformationBlockProps) {
  const queryClient = useQueryClient()
  const [usersQtyHolder, setUsersQtyHolder] = useState<number>(1)
  const [checkoutSessionUrl, setCheckoutSessionUrl] = useState('')

  async function handleGenerateCheckoutUrl(usersQty: number) {
    try {
      const { data } = await axios.post('/api/integration/stripe/checkout', { usersQty, partnerId })
      const url = data.data
      setCheckoutSessionUrl(url)
      copyToClipboard(url)
      return 'Link de checkout criado e copiado para área de transferência!'
    } catch (error) {
      throw error
    }
  }
  const { mutate, isPending } = useMutationWithFeedback({
    mutationKey: ['create-checkout-session'],
    mutationFn: handleGenerateCheckoutUrl,
    queryClient,
    affectedQueryKey: [],
  })
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="w-full rounded bg-pink-900 p-1 text-center text-sm font-bold text-white">CONTROLE DE ASSINATURA</h1>
      {infoHolder.assinatura ? (
        <SubscriptionCard subscription={infoHolder.assinatura} />
      ) : (
        <div className="flex w-full flex-col">
          {checkoutSessionUrl ? (
            <div className="flex w-full items-center justify-center gap-1 rounded border border-blue-700 bg-blue-50 p-3 text-center text-xs text-blue-700">
              <h1 className="break-all">{formatLongString(checkoutSessionUrl, 200)}</h1>
              <button className="min-w-fit">
                <FaRegCopy size={20} />
              </button>
            </div>
          ) : (
            <>
              <h1 className="my-2 w-full text-center text-xs font-medium tracking-tight text-gray-500">
                O parceiro em questão não possui uma assinatura. Crie abaixo um link para ativação:{' '}
              </h1>
              <div className="flex w-full items-center justify-center">
                <NumberInput
                  label="Nº DE ASSINATURAS"
                  placeholder="Preencha aqui o número desejado de assinaturas..."
                  value={usersQtyHolder}
                  handleChange={(value) => setUsersQtyHolder(value)}
                  width="100%"
                />
              </div>
              <div className="mt-2 flex w-full items-center justify-end">
                <button
                  disabled={isPending}
                  // @ts-ignore
                  onClick={() => mutate(usersQtyHolder)}
                  className="whitespace-nowrap rounded bg-gray-900 px-4 py-1 text-xs font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-gray-800 enabled:hover:text-white"
                >
                  CRIAR CHECKOUT
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default SubscriptionInformationBlock
