import { formatToMoney } from '@/lib/methods/formatting'
import { TProposal } from '@/utils/schemas/proposal.schema'
import React from 'react'
import { AiFillEdit } from 'react-icons/ai'
import { BsCheckCircleFill } from 'react-icons/bs'

type ProposalPlanProps = {
  plan: TProposal['planos'][number]
  definePlan: (plan: TProposal['planos'][number]) => void
  editPrice: () => void
  enableSelection: boolean
  userHasPricingEditPermission: boolean
}
function ProposalPlan({ plan, definePlan, editPrice, enableSelection, userHasPricingEditPermission }: ProposalPlanProps) {
  return (
    <div className="flex w-[450px] flex-col rounded-lg border border-gray-500 bg-[#fff] p-6 shadow-lg">
      <div className="flex w-full items-center justify-between gap-2">
        <h1 className="font-black">{plan.nome}</h1>
        {userHasPricingEditPermission ? (
          <button onClick={() => editPrice()} className="text-md text-gray-400 hover:text-[#fead61]">
            <AiFillEdit />
          </button>
        ) : null}
      </div>
      <p className="w-full text-start text-sm text-gray-500">{plan?.descricao || '...'}</p>
      <div className="my-4 flex w-full items-end justify-center gap-1">
        <h1 className="text-4xl font-black">{formatToMoney(plan.valor || 0)}</h1>
        <h1 className="text-xs font-light text-gray-500">/ {plan?.intervalo.tipo}</h1>
      </div>
      <div className="my-4 flex flex-grow flex-col gap-1">
        <h1 className="text-[0.6rem] tracking-tight text-gray-500">DESCRITIVO</h1>
        <div className="flex flex-grow flex-col gap-2">
          {plan.descritivo.map((d, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <div className="w-fit">
                <BsCheckCircleFill color="rgb(21,128,61)" size={15} />
              </div>
              <p className="text-xs font-medium tracking-tight">{d.descricao}</p>
            </div>
          ))}
        </div>
      </div>
      {enableSelection ? (
        <>
          <div className="flex w-full items-center justify-end">
            <button onClick={() => definePlan(plan)} className="rounded-full bg-blue-600 px-2 py-1 text-[0.65rem] font-bold text-white lg:text-xs">
              SELECIONAR
            </button>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default ProposalPlan
