import React from 'react'
import FunnelListItem from './FunnelListItem'
import { Droppable } from 'react-beautiful-dnd'
import { ProjectActivity } from '@/utils/models'
import { ImPower } from 'react-icons/im'
import { MdDashboard } from 'react-icons/md'
import { TOpportunityDTO, TOpportunityDTOWithFunnelReferenceAndActivitiesByStatus } from '@/utils/schemas/opportunity.schema'

import { Session } from 'next-auth'

interface IFunnelListProps {
  stageName: string
  id: string | number
  session: Session
  items: {
    id: number | string
    idOportunidade: string
    nome: string
    identificador?: string
    responsaveis: TOpportunityDTO['responsaveis']
    idMarketing?: string
    statusAtividades?: TOpportunityDTOWithFunnelReferenceAndActivitiesByStatus['statusAtividades']
    proposta?: {
      nome: string
      valor: number
      potenciaPico?: number | null
    }
    ganho?: boolean
    perca?: boolean
    contratoSolicitado?: boolean
  }[]
}
function FunnelList({ stageName, session, items, id }: IFunnelListProps) {
  function getListCumulativeProposalValues() {
    var sum = 0
    for (let i = 0; i < items.length; i++) {
      var value = items[i]?.proposta?.valor || 0
      if (value) sum = sum + value
    }
    return sum.toLocaleString('pt-br', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }
  function getListCumulativeProposalPeakPower() {
    var sum = 0
    for (let i = 0; i < items.length; i++) {
      var value = items[i]?.proposta?.potenciaPico || 0
      if (value) sum = sum + value
    }
    return sum.toLocaleString('pt-br', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }
  return (
    <Droppable droppableId={id.toString()}>
      {(provided) => (
        <div className="flex w-full min-w-[350px] flex-col p-2 px-4 lg:w-[350px]">
          <div className="flex h-[100px] w-full flex-col rounded bg-[#15599a] px-2 lg:h-[60px]">
            <h1 className="w-full rounded p-1 text-center font-medium text-white">{stageName}</h1>
            <div className="mt-1 flex w-full flex-col items-center justify-between px-2 pb-2 lg:flex-row">
              <div className="flex w-full items-center justify-center gap-1 text-[0.65rem] text-white lg:w-1/3 lg:justify-start lg:text-[0.7rem]">
                <p>R$</p>
                <p>{getListCumulativeProposalValues()}</p>
              </div>
              <div className="flex w-full items-center justify-center gap-1 text-[0.65rem] text-white lg:w-1/3 lg:text-[0.7rem]">
                <p>
                  <ImPower />
                </p>
                <p>{getListCumulativeProposalPeakPower()} kWp</p>
              </div>
              <div className="flex w-full items-center justify-center gap-1 text-[0.65rem] text-white lg:w-1/3 lg:justify-end lg:text-[0.7rem]">
                <p>
                  <MdDashboard />
                </p>
                <p>{items.length}</p>
              </div>
            </div>
          </div>

          <div ref={provided.innerRef} {...provided.droppableProps} className="my-1 flex flex-col gap-2 ">
            {items.map((item, index) => (
              <FunnelListItem key={item.id} item={item} session={session} index={index} />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  )
}

export default FunnelList
