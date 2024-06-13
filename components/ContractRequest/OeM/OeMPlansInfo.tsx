import { formatToMoney } from '@/lib/methods/formatting'
import { OeMPricing, getOeMPrices } from '@/utils/pricing/oem/methods'
import { TContractRequest } from '@/utils/schemas/integrations/app-ampere/contract-request.schema'
import { TProposalDTO } from '@/utils/schemas/proposal.schema'
import React, { useState } from 'react'
import { AiFillCloseCircle } from 'react-icons/ai'
import { BsCheckCircleFill, BsPatchCheckFill } from 'react-icons/bs'
import { MdAttachMoney } from 'react-icons/md'

type OeMPlansInfoProps = {
  requestInfo: TContractRequest
  setRequestInfo: React.Dispatch<React.SetStateAction<TContractRequest>>
  goToPreviousStage: () => void
  goToNextStage: () => void
  modulesQty?: number
  distance?: number
  proposal: TProposalDTO
  activePlanId?: number
}

function OeMPlansInfo({ requestInfo, setRequestInfo, goToPreviousStage, goToNextStage, proposal, activePlanId, modulesQty, distance }: OeMPlansInfoProps) {
  const plan = proposal.planos[0]
  return (
    <div className="flex w-full grow flex-col bg-[#fff] pb-2">
      <span className="py-2 text-center text-lg font-bold uppercase text-[#15599a]">PLANO INTEGRADO DE OPERAÇÃO E MANUTENÇÃO</span>
      <p className="text-center text-sm italic text-gray-500">Escolha, se houver, o plano de Operação & Manutenção incluso no projeto.</p>
      <div className="flex grow flex-wrap items-start justify-center gap-2 py-2">
        <div className="flex w-[450px] flex-col rounded-lg border border-gray-500 bg-[#fff] p-6 shadow-lg">
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
      </div>
      <div className="mt-2 flex w-full flex-wrap justify-between  gap-2">
        <button
          onClick={() => {
            goToPreviousStage()
          }}
          className="rounded p-2 font-bold text-gray-500 duration-300 hover:scale-105"
        >
          Voltar
        </button>
        <button
          onClick={() => {
            goToNextStage()
            setRequestInfo((prev) => ({ ...prev, planoOeM: plan.nome as TContractRequest['planoOeM'] }))
          }}
          className="rounded p-2 font-bold hover:bg-black hover:text-white"
        >
          Prosseguir
        </button>
      </div>
    </div>
  )
}

export default OeMPlansInfo
