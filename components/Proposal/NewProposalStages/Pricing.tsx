import React, { useState } from 'react'

import { AiFillEdit } from 'react-icons/ai'

import { TOpportunityDTOWithClient } from '@/utils/schemas/opportunity.schema'
import { TPricingItem, TProposal } from '@/utils/schemas/proposal.schema'
import PricingTable from '../Blocks/PricingTable'
import { Session } from 'next-auth'
import { getPricingTotal } from '@/utils/pricing/methods'
import { formatToMoney } from '@/utils/methods'
import EditFinalPrice from '../Blocks/EditFinalPrice'
type PricingProps = {
  infoHolder: TProposal
  setInfoHolder: React.Dispatch<React.SetStateAction<TProposal>>
  opportunity: TOpportunityDTOWithClient
  moveToNextStage: () => void
  moveToPreviousStage: () => void
  session: Session
}
function Pricing({ opportunity, infoHolder, setInfoHolder, moveToNextStage, moveToPreviousStage, session }: PricingProps) {
  const [pricing, setPricing] = useState<TPricingItem[]>(infoHolder.precificacao)
  const [editFinalPriceModalIsOpen, setEditFinalPriceModalIsOpen] = useState<boolean>(false)
  const pricingTotal = getPricingTotal({ pricing: pricing })
  const [addCostModalIsOpen, setAddCostModalIsOpen] = useState<boolean>(false)

  function handleProceed() {
    // Updating proposal final price
    setInfoHolder((prev) => ({ ...prev, precificacao: pricing, valor: pricingTotal }))
    // Moving to next stage
    moveToNextStage()
  }
  return (
    <>
      <div className="flex w-full flex-col gap-4 py-4">
        <h1 className="font-Raleway font-bold text-gray-800">DESCRITIVO DA VENDA</h1>
      </div>
      <PricingTable
        pricing={pricing}
        setPricing={setPricing}
        userHasPricingEditPermission={session?.user.permissoes.precos.editar}
        userHasPricingViewPermission={session.user.permissoes.precos.visualizar}
      />
      {/* {session?.user.permissoes.precos.editar ? (
        <button
          onClick={() => setAddCostModalIsOpen(true)}
          className="self-center rounded border border-[#fead41] p-1 font-bold text-[#fead41] duration-300 ease-in-out hover:scale-105 hover:bg-[#fead41] hover:text-black"
        >
          NOVO CUSTO
        </button>
      ) : null} */}

      <div className="flex w-full items-center justify-center gap-2 py-1">
        <div className="flex gap-2 rounded border border-gray-600 px-2 py-1 font-medium text-gray-600">
          <p>{formatToMoney(pricingTotal)}</p>
          {session?.user.permissoes.precos.editar ? (
            <button onClick={() => setEditFinalPriceModalIsOpen((prev) => !prev)} className="text-md text-gray-400 hover:text-[#fead61]">
              <AiFillEdit />
            </button>
          ) : (
            <button onClick={() => setEditFinalPriceModalIsOpen((prev) => !prev)} className="text-md text-gray-400 hover:text-[#fead61]">
              <AiFillEdit />
            </button>
          )}
        </div>
      </div>
      <div className="flex w-full items-center justify-between gap-2 px-1">
        <button onClick={() => moveToPreviousStage()} className="rounded p-2 font-bold text-gray-500 duration-300 hover:scale-105">
          Voltar
        </button>
        <button onClick={handleProceed} className="rounded p-2 font-bold hover:bg-black hover:text-white">
          Prosseguir
        </button>
      </div>
      {/* {addCostModalIsOpen && session?.user.permissoes.precos.editar ? (
        <NewCost closeModal={() => setAddCostModalIsOpen(false)} pricing={pricing} setPricing={setPricing} />
      ) : null} */}
      {editFinalPriceModalIsOpen ? <EditFinalPrice pricing={pricing} setPricing={setPricing} closeModal={() => setEditFinalPriceModalIsOpen(false)} /> : null}
    </>
  )
}

export default Pricing
