import { formatToMoney } from '@/lib/methods/formatting'

import { TProposalDTO } from '@/utils/schemas/proposal.schema'
import React from 'react'
import { BsCheckCircleFill } from 'react-icons/bs'

type ProposalViewPlansBlockProps = {
  plans: TProposalDTO['planos']
}
function ProposalViewPlansBlock({ plans }: ProposalViewPlansBlockProps) {
  return (
    <div className="mt-4 flex w-full flex-col gap-2 rounded border border-gray-500 bg-[#fff]">
      <h1 className="w-full rounded bg-gray-800 py-2 text-center font-bold text-white ">PLANOS DE ASSINATURA</h1>
      <div className="my-4 flex h-fit w-full flex-wrap items-stretch justify-center gap-2 py-2">
        {plans.map((plan, index) => (
          <div key={index} className="flex w-[450px] flex-col rounded-lg border border-gray-500 bg-[#fff] p-6 shadow-lg">
            <div className="flex w-full items-center justify-between gap-2">
              <h1 className="font-black">{plan.nome}</h1>
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
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProposalViewPlansBlock
