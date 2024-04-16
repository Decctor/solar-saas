import React from 'react'
import dayjs from 'dayjs'

import { BsCalendarFill } from 'react-icons/bs'
import { ImPower, ImPriceTag } from 'react-icons/im'

import { formatToMoney } from '@/utils/methods'
import Link from 'next/link'
import { MdAttachMoney } from 'react-icons/md'
import { TProposalDTO } from '@/utils/schemas/proposal.schema'
import { formatDecimalPlaces } from '@/lib/methods/formatting'

type GetColorArgs = {
  proposalId: string
  opportunityWonProposalId?: string | null
  opportunityActiveProposalId?: string | null
}
function getTagColor({ opportunityWonProposalId, opportunityActiveProposalId, proposalId }: GetColorArgs) {
  if (opportunityWonProposalId == proposalId) return 'bg-green-500'
  if (opportunityActiveProposalId == proposalId) return 'bg-blue-500'
  return 'bg-gray-500'
}
function getStatusColor({ opportunityWonProposalId, opportunityActiveProposalId, proposalId }: GetColorArgs) {
  if (opportunityWonProposalId == proposalId)
    return <h1 className="w-fit self-center rounded border border-green-500 p-1 text-center text-[0.6rem] font-black text-green-500">GANHA</h1>
  if (opportunityActiveProposalId == proposalId)
    return <h1 className="w-fit self-center rounded border border-blue-500 p-1 text-center text-[0.6rem] font-black text-blue-500">ATIVA</h1>
  return <h1 className="w-fit self-center rounded border border-gray-500 p-1 text-center text-[0.6rem] font-black text-gray-500">GERADA</h1>
}

type ProposalItemProps = {
  info: TProposalDTO
  opportunityActiveProposalId?: string | null
  opportunityIsWon: boolean
  opportunityWonProposalId?: string | null
}
function ProposalItem({ info, opportunityActiveProposalId, opportunityIsWon, opportunityWonProposalId }: ProposalItemProps) {
  return (
    <div className="flex w-full items-center rounded-md border border-gray-200">
      <div
        className={`h-full w-[5px] rounded-bl-md rounded-tl-md ${getTagColor({
          proposalId: info._id,
          opportunityActiveProposalId: opportunityActiveProposalId,
          opportunityWonProposalId: opportunityWonProposalId,
        })}`}
      ></div>
      <div className="flex grow flex-col p-3">
        <div className="flex w-full flex-col items-start justify-between gap-1 lg:flex-row">
          <div className="flex flex-col items-center lg:items-start">
            <Link href={`/comercial/proposta/${info._id}`}>
              <h1 className="w-full text-center text-sm font-bold leading-none tracking-tight duration-300 ease-in-out hover:text-cyan-500 lg:text-start">
                {info.nome}
              </h1>
            </Link>
            <p className="mt-1 w-full text-center text-[0.6rem] font-medium text-gray-500 lg:text-start">#{info._id}</p>
          </div>

          {getStatusColor({
            proposalId: info._id,
            opportunityActiveProposalId: opportunityActiveProposalId,
            opportunityWonProposalId: opportunityWonProposalId,
          })}
        </div>

        <div className="mt-1 flex w-full flex-col items-center justify-between gap-1 lg:flex-row">
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2 text-gray-500`}>
              <BsCalendarFill />
              <p className="text-xs font-medium">{dayjs(info.dataInsercao).format('DD/MM/YYYY HH:mm')}</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 lg:flex-row lg:gap-4">
            <div className="flex items-center gap-1 text-gray-500">
              <ImPower style={{ fontSize: '20px' }} />
              <p className="text-xs text-black">{info.potenciaPico} kWp</p>
            </div>
            <div className="flex items-center gap-1 text-gray-500 ">
              <ImPriceTag style={{ fontSize: '20px' }} />
              <p className="text-xs text-black">{info.valor ? formatToMoney(info.valor) : '-'} </p>
            </div>
            <div className="flex items-center gap-1 text-gray-500 ">
              <MdAttachMoney style={{ fontSize: '20px' }} />
              <p className="text-xs text-black">
                {info.valor && info.potenciaPico ? `${formatDecimalPlaces(info.valor / (1000 * info.potenciaPico))} R$ / Wp` : '-'}{' '}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProposalItem
