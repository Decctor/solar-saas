import NumberInput from '@/components/Inputs/NumberInput'
import { useMutationWithFeedback } from '@/utils/mutations/general-hook'
import { editProposal } from '@/utils/mutations/proposals'
import { TProposal } from '@/utils/schemas/proposal.schema'
import { useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { VscChromeClose } from 'react-icons/vsc'

type EditPlanPriceProps = {
  proposalId: string
  plans: TProposal['planos']
  planIndex: number
  alterationLimit: number | undefined
  closeModal: () => void
}
function EditPlanFinalPrice({ proposalId, plans, planIndex, alterationLimit, closeModal }: EditPlanPriceProps) {
  const queryClient = useQueryClient()
  const initialPrice = plans[planIndex].valor || 0
  const [priceHolder, setPriceHolder] = useState<number>(initialPrice)
  async function updatePrice(newPrice: number) {
    var newPlans = [...plans]
    newPlans[planIndex].valor = newPrice
    await editProposal({ id: proposalId, changes: { planos: newPlans } })
    return 'Preço do plano alterado com sucesso !'
  }
  const { mutate: handleUpdatePrice, isPending } = useMutationWithFeedback({
    mutationKey: ['update-proposal-plan-price'],
    mutationFn: updatePrice,
    queryClient: queryClient,
    affectedQueryKey: ['proposal-by-id', proposalId],
    callbackFn: () => closeModal(),
  })
  return (
    <div id="defaultModal" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <div className="fixed left-[50%] top-[50%] z-[100] h-fit w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px]  lg:w-[25%]">
        <div className="flex h-full flex-col">
          <div className="flex flex-wrap items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg">
            <h3 className="text-xl font-bold text-[#353432] dark:text-white ">ALTERAÇÃO DE PREÇOS</h3>
            <button
              onClick={() => closeModal()}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
          <div className="flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            <NumberInput
              label="PREÇO FINAL DA PROPOSTA"
              value={priceHolder}
              placeholder="Preencha aqui o valor final da proposta..."
              handleChange={(value) => {
                setPriceHolder(value)
              }}
              width="100%"
            />
          </div>
          <div className="flex w-full items-center justify-end py-2">
            <button
              onClick={() => {
                // @ts-ignore
                handleUpdatePrice(priceHolder)
              }}
              disabled={isPending}
              className="h-9 whitespace-nowrap rounded bg-blue-800 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-blue-800 enabled:hover:text-white"
            >
              ATUALIZAR VALOR
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditPlanFinalPrice
