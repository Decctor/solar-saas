import { TPartner, TPartnerDTOWithSubscriptionAndUsers } from '@/utils/schemas/partner.schema'
import React from 'react'
import NewCheckout from './NewCheckout'
import dayjs from 'dayjs'
import { BsCalendar } from 'react-icons/bs'
import { formatDateAsLocale } from '@/lib/methods/formatting'
import toast from 'react-hot-toast'

function renderFreeTrialTag({ start, end }: { start: string; end: string }) {
  const trialIsOver = dayjs(new Date()).isAfter(end)

  if (!trialIsOver)
    return (
      <div className="flex flex-col items-center self-center overflow-hidden rounded border border-blue-600">
        <h1 className="w-full bg-blue-600 px-2 py-1 text-center text-[0.55rem] font-medium text-white">TESTE EM ANDAMENTO</h1>
        <div className="flex w-full items-center justify-center gap-1 p-2">
          <BsCalendar />
          <p className="text-sm tracking-tight text-gray-500">
            {formatDateAsLocale(start, true)} - {formatDateAsLocale(end, true)}
          </p>
        </div>
      </div>
    )
  return (
    <div className="flex flex-col items-center self-center overflow-hidden rounded border border-red-600">
      <h1 className="w-full bg-red-600 px-2 py-1 text-center text-[0.55rem] font-medium text-white">TESTE EM ANDAMENTO</h1>
      <div className="flex w-full items-center justify-center gap-1">
        <BsCalendar />
        <p className="text-sm tracking-tight text-gray-500">
          {formatDateAsLocale(start, true)} - {formatDateAsLocale(end, true)}
        </p>
      </div>
    </div>
  )
}

type NewSubscriptionMenuProps = {
  partnerId: string | null
  infoHolder: TPartnerDTOWithSubscriptionAndUsers
  setInfoHolder: React.Dispatch<React.SetStateAction<TPartner>>
}
function NewSubscriptionMenu({ partnerId, infoHolder, setInfoHolder }: NewSubscriptionMenuProps) {
  const freeTrialDefined = !!infoHolder.testeGratis.inicio && !!infoHolder.testeGratis.fim

  function activateFreeTrial() {
    const currentDate = dayjs()
    const trialStart = currentDate.startOf('day').toISOString()
    const trialEnd = currentDate.add(7, 'days').endOf('day').toISOString()

    setInfoHolder((prev) => ({ ...prev, testeGratis: { inicio: trialStart, fim: trialEnd } }))
    return toast.success('Teste grátis ativado !')
  }
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="my-2 w-full text-center text-sm font-medium tracking-tight text-gray-500">Opps, o parceiro em questão não possui uma assinatura.</h1>
      {freeTrialDefined ? renderFreeTrialTag({ start: infoHolder.testeGratis.inicio as string, end: infoHolder.testeGratis.fim as string }) : null}
      <div className="flex w-full items-center justify-center gap-4">
        {partnerId ? <NewCheckout partnerId={partnerId} /> : null}
        {!freeTrialDefined ? (
          <button
            onClick={() => activateFreeTrial()}
            className="whitespace-nowrap rounded bg-cyan-800 px-4 py-1 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-cyan-700 enabled:hover:text-white"
          >
            ATIVAR TESTE GRÁTIS
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default NewSubscriptionMenu
