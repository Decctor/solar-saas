import { formatToMoney } from '@/utils/methods'
import { TProposal } from '@/utils/schemas/proposal.schema'
import { TSignaturePlanDTOWithPricingMethod } from '@/utils/schemas/signature-plans.schema'
import React from 'react'
import { AiFillEdit } from 'react-icons/ai'
import { BsCheckCircleFill } from 'react-icons/bs'

type ProposalSignaturePlanShowcaseProps = {
  plan: TProposal['planos'][number]
}
function ProposalSignaturePlanShowcase({ plan }: ProposalSignaturePlanShowcaseProps) {
  return (
    <div className="flex w-full flex-col rounded-lg border border-gray-500 bg-[#fff] p-6 shadow-lg">
      <div className="flex w-full items-center justify-between gap-2">
        <h1 className="font-black">{plan.nome}</h1>
      </div>
      <p className="w-full text-start text-sm text-gray-500">{plan?.descricao || '...'}</p>
      <div className="my-4 flex w-full items-end justify-center gap-1">
        <h1 className="text-4xl font-black">{formatToMoney(plan.valor)}</h1>
        <h1 className="text-xs font-light text-gray-500">/ {plan?.intervalo.tipo}</h1>
      </div>

      <div className="my-4 flex w-full grow flex-col gap-1">
        <h1 className="text-xs tracking-tight text-gray-500">DESCRITIVO</h1>
        <div className="flex w-[85%] flex-col gap-2 self-center">
          {plan.descritivo.map((d) => (
            <div className="flex w-full items-center gap-1 self-center">
              <div className="w-fit">
                <BsCheckCircleFill color="rgb(21,128,61)" size={15} />
              </div>
              <p className="grow text-xs font-medium tracking-tight">{d.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProposalSignaturePlanShowcase
