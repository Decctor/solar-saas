import { formatToMoney } from '@/utils/methods'
import { useOverallSalesResults } from '@/utils/queries/stats/overall'
import React from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { BsFileEarmarkText, BsPatchCheck, BsTicketPerforated } from 'react-icons/bs'
import { VscDiffAdded } from 'react-icons/vsc'
import LossesByReason from '../general/LossesByReason'

type OverallResultsProps = {
  after: string
  before: string
  responsibles: string[] | null
}
function OverallResults({ after, before, responsibles }: OverallResultsProps) {
  const { data: stats } = useOverallSalesResults({ after, before, responsibles })

  return (
    <div className="flex w-full flex-col">
      <h1 className="mt-4 rounded-md bg-[#15599a] text-center text-xl font-black text-white">GERAL</h1>
      <div className="mt-2 flex w-full flex-col items-center justify-around gap-2 lg:flex-row">
        <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-6 shadow-sm lg:w-1/5">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-medium uppercase tracking-tight">Projetos Criados</h1>
            <VscDiffAdded />
          </div>
          <div className="mt-2 flex w-full flex-col">
            <div className="text-2xl font-bold text-[#15599a]">{stats?.projetosCriados?.total || 0}</div>
            <p className="text-xs font-medium text-gray-800">{stats?.projetosCriados.inbound || 0} INBOUND</p>
            <p className="text-xs font-medium text-gray-800">{stats?.projetosCriados.outboundVendedor} OUTBOUND (VENDEDOR)</p>
            <p className="text-xs font-medium text-gray-800">{stats?.projetosCriados.outboundSdr} OUTBOUND (SDR)</p>
          </div>
        </div>
        <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-6 shadow-sm lg:w-1/5">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-medium uppercase tracking-tight">Projetos Ganhos</h1>
            <BsPatchCheck />
          </div>
          <div className="mt-2 flex w-full flex-col">
            <div className="text-2xl font-bold text-[#15599a]">{stats?.projetosGanhos?.total || 0}</div>
            <p className="text-xs font-medium text-gray-800">{stats?.projetosGanhos.inbound} INBOUND</p>
            <p className="text-xs font-medium text-gray-800">{stats?.projetosGanhos.outboundVendedor} OUTBOUND (VENDEDOR)</p>
            <p className="text-xs font-medium text-gray-800">{stats?.projetosGanhos.outboundSdr} OUTBOUND (SDR)</p>
          </div>
        </div>
        <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-6 shadow-sm lg:w-1/5">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-medium uppercase tracking-tight">Projetos Perdidos</h1>
            <AiOutlineCloseCircle size={'20px'} />
          </div>
          <div className="mt-2 flex w-full flex-col">
            <div className="text-2xl font-bold text-[#15599a]">{stats?.projetosPerdidos?.total || 0}</div>
            <p className="text-xs font-medium text-gray-800">{stats?.projetosPerdidos.inbound} INBOUND</p>
            <p className="text-xs font-medium text-gray-800">{stats?.projetosPerdidos.outboundVendedor} OUTBOUND (VENDEDOR)</p>
            <p className="text-xs font-medium text-gray-800">{stats?.projetosPerdidos.outboundSdr} OUTBOUND (SDR)</p>
          </div>
        </div>
        <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-6 shadow-sm lg:w-1/5">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-medium uppercase tracking-tight">Total Vendido</h1>
            <BsFileEarmarkText />
          </div>
          <div className="mt-2 flex w-full flex-col">
            <div className="text-2xl font-bold text-[#15599a]">{stats?.totalVendido ? formatToMoney(stats?.totalVendido.total) : 0}</div>
            <p className="text-xs font-medium text-gray-800">
              {stats?.totalVendido.inbound ? formatToMoney(stats?.totalVendido.inbound) : 0} INBOUND
            </p>
            <p className="text-xs font-medium text-gray-800">
              {stats?.totalVendido.outboundVendedor ? formatToMoney(stats?.totalVendido.outboundVendedor) : 0} OUTBOUND (VENDEDOR)
            </p>
            <p className="text-xs font-medium text-gray-800">
              {stats?.totalVendido.outboundSdr ? formatToMoney(stats?.totalVendido.outboundSdr) : 0} OUTBOUND (SDR)
            </p>
          </div>
        </div>
        <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-6 shadow-sm lg:w-1/5">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-medium uppercase tracking-tight">Ticket Médio</h1>
            <BsTicketPerforated />
          </div>
          <div className="mt-2 flex w-full flex-col">
            <div className="text-2xl font-bold text-[#15599a]">
              {stats?.totalVendido ? formatToMoney(stats?.totalVendido.total / stats?.projetosGanhos.total) : 0}
            </div>
            <p className="text-xs font-medium text-gray-800">
              {stats?.totalVendido.inbound ? formatToMoney(stats?.totalVendido.inbound / stats?.projetosGanhos.inbound) : 0} INBOUND
            </p>
            <p className="text-xs font-medium text-gray-800">
              {stats?.totalVendido.outboundVendedor
                ? formatToMoney(stats?.totalVendido.outboundVendedor / stats?.projetosGanhos.outboundVendedor)
                : 0}{' '}
              OUTBOUND (VENDEDOR)
            </p>
            <p className="text-xs font-medium text-gray-800">
              {stats?.totalVendido.outboundSdr ? formatToMoney(stats?.totalVendido.outboundSdr / stats?.projetosGanhos.outboundSdr) : 0} OUTBOUND
              (SDR)
            </p>
          </div>
        </div>
      </div>
      <LossesByReason stats={stats} />
    </div>
  )
}

export default OverallResults
