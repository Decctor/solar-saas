import { copyToClipboard } from '@/lib/hooks'
import { formatDateAsLocale } from '@/lib/methods/formatting'
import { formatToMoney } from '@/utils/methods'
import { TSubscription, TSubscriptionDTO } from '@/utils/schemas/subscription.schema'
import React, { useState } from 'react'
import { BsCalendar, BsCalendarPlus } from 'react-icons/bs'
import { FaRegCopy, FaUser } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { TbFileInvoice } from 'react-icons/tb'
import { VscChromeClose } from 'react-icons/vsc'
import SubscriptionInvoices from './SubscriptionInvoices'

function getSubscriptionStatusTag(status: TSubscription['status']) {
  if (status == 'active') return <h1 className="rounded-lg border border-green-600 bg-green-400 px-2 py-1 text-[0.6rem] font-medium text-white">ATIVA</h1>
  if (status == 'canceled') return <h1 className="rounded-lg border border-red-600 bg-red-400 px-2 py-1 text-[0.6rem] font-medium text-black">CANCELADA</h1>
  if (status == 'paused') return <h1 className="rounded-lg border border-gray-600 bg-gray-400 px-2 py-1 text-[0.6rem] font-medium text-white">PAUSADA</h1>
  if (status == 'unpaid') return <h1 className="rounded-lg border border-yellow-600 bg-yellow-400 px-2 py-1 text-[0.6rem] font-medium text-white">NÃO PAGA</h1>
  if (status == 'past_due')
    return <h1 className="rounded-lg border border-orange-600 bg-orange-400 px-2 py-1 text-[0.6rem] font-medium text-orange-600">EM ATRASO</h1>
  return <h1 className="rounded-lg border border-gray-600 bg-gray-400 px-2 py-1 text-[0.6rem] font-medium text-gray-600">NÃO DEFINIDO</h1>
}

type SubscriptionCardProps = {
  subscription: TSubscriptionDTO
}
function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const [invoicesHistoryIsOpen, setInvoicesHistoryIsOpen] = useState<boolean>(false)
  return (
    <div className="flex w-full flex-col gap-2 rounded-md border border-gray-400 p-3 shadow-sm">
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xs font-bold leading-none tracking-tight">ASSINATURA SOLAR SALES</h1>
          {getSubscriptionStatusTag(subscription.status)}
        </div>
        <h1 className="rounded-lg border border-gray-800 bg-gray-800 px-2 py-1 text-[0.6rem] font-medium text-white">
          {formatToMoney(subscription.precoUnitarioAssinatura * subscription.qtdeAssinatura)}
        </h1>
      </div>
      <div className="flex w-full flex-wrap items-center gap-4">
        <div className={`flex items-center gap-1 text-gray-800`}>
          <FaUser />
          <p className="text-[0.65rem] font-medium">{subscription.qtdeAssinatura}x ASSINATURAS CONTRATADAS</p>
        </div>
        <div className={`flex items-center gap-1 text-gray-800`}>
          <BsCalendar />
          <p className="text-[0.65rem] font-medium">
            PERÍODO ATUAL: {formatDateAsLocale(subscription.periodo.inicio)} até {formatDateAsLocale(subscription.periodo.fim)}
          </p>
        </div>
        <div className={`flex items-center gap-1 text-gray-800`}>
          <MdEmail />
          <p className="text-[0.65rem] font-medium">{subscription.emailClienteStripe}</p>
        </div>
        <button
          className={`flex items-center gap-1 text-gray-800 duration-300 ease-in-out hover:text-cyan-500`}
          onClick={() => copyToClipboard(subscription.idClienteStripe)}
        >
          <FaRegCopy />
          <p className="text-[0.65rem] font-medium">{subscription.idClienteStripe}</p>
        </button>
      </div>
      <div className="flex w-full items-center justify-between">
        {invoicesHistoryIsOpen ? (
          <button>
            <button
              onClick={() => setInvoicesHistoryIsOpen(false)}
              className="flex items-center gap-1 rounded-lg border border-red-500 bg-red-50 px-2 py-1 text-[0.6rem] text-red-500 duration-300 ease-in-out hover:border-red-700 hover:text-red-700"
            >
              <VscChromeClose />
              <p className="font-medium">FECHAR HISTÓRICO</p>
            </button>
          </button>
        ) : (
          <button
            onClick={() => setInvoicesHistoryIsOpen(true)}
            className="flex items-center gap-1 rounded-lg border border-cyan-500 bg-cyan-50 px-2 py-1 text-[0.6rem] text-cyan-500 duration-300 ease-in-out hover:border-cyan-700 hover:text-cyan-700"
          >
            <TbFileInvoice />
            <p className="font-medium">ABRIR HISTÓRICO DE FATURAS</p>
          </button>
        )}
        <div className={`flex items-center gap-1`}>
          <BsCalendarPlus />
          <p className="text-[0.65rem] font-medium text-gray-800">{formatDateAsLocale(subscription.dataInicio, true)}</p>
        </div>
      </div>
      {invoicesHistoryIsOpen ? <SubscriptionInvoices subscriptionId={subscription._id} /> : null}
    </div>
  )
}

export default SubscriptionCard
