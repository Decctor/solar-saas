import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import TextInput from '../Inputs/TextInput'
import NewPricingUnit from '../PricingMethods/NewPricingUnit'

import { TPricingMethod } from '@/utils/schemas/pricing-method.schema'
import { TAuthor } from '@/utils/schemas/user.schema'

import { formatCondition, formatFormulaItem } from '@/utils/pricing/helpers'

import { useMutationWithFeedback } from '@/utils/mutations/general-hook'
import { createPricingMethod } from '@/utils/mutations/onboarding'
import ControlPricingUnit from '../PricingMethods/ControlPricingUnit'

type PricingMethodProps = {
  partnerId: string
  author: TAuthor
  goToNextStage: () => void
  goToPreviousStage: () => void
}
function PricingMethod({ partnerId, author, goToNextStage, goToPreviousStage }: PricingMethodProps) {
  const queryClient = useQueryClient()
  const [methodology, setMethodology] = useState<TPricingMethod>({
    nome: '',
    idParceiro: partnerId,
    itens: [],
    autor: author,
    dataInsercao: new Date().toISOString(),
  })
  const [newPriceUnitMenuIsOpen, setNewPriceUnitMenuIsOpen] = useState<boolean>(true)
  const { mutate: handleCreatePricingMethod, isPending } = useMutationWithFeedback({
    mutationKey: ['create-pricing-method'],
    mutationFn: createPricingMethod,
    affectedQueryKey: ['pricing-methods'],
    queryClient: queryClient,
  })
  return (
    <div className="flex grow flex-col gap-y-2">
      <h1 className="mt-4 w-full text-center text-lg tracking-tight text-gray-500">
        Nós possibilitamos que você defina suas metodologias de precificação. Essas podem ser vinculadas aos kits que você eventualmente criar, de modo que as
        proposta geradas utilizando-os sejam precificadas com a metodologia que você definiu.
      </h1>
      <h1 className="mb-4 w-full text-center text-lg tracking-tight text-gray-500">
        Se desejar, você pode pular essa etapa e definir suas metodologias posteriormente.
      </h1>
      <h1 className="w-full bg-[#fead41] p-1 text-center font-bold text-white">METODOLOGIA DE PRECIFICAÇÃO</h1>
      <div className="my-5 flex flex-col px-2">
        <p className="text-gray-500">Construa metodologias de precificação a serem aplicadas ao seus kits.</p>
        <p className="text-gray-500">
          Crie unidades de preço para composição da sua precificação. Utilize <strong className="text-[#E25E3E]">variáveis</strong>, aplique{' '}
          <strong className="text-[#E25E3E]">condições</strong> , e tenha flexibilidade na criação de fórmulas de{' '}
          <strong className="text-[#E25E3E]">cálculo de custo.</strong>
        </p>
      </div>
      <div className="flex  w-full grow flex-col overflow-y-auto overscroll-y-auto px-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
        <TextInput
          label="NOME DA METODOLOGIA DE PRECIFICAÇÃO"
          value={methodology.nome}
          placeholder="Preencha aqui o nome da metodologia de precificação..."
          handleChange={(value) => setMethodology((prev) => ({ ...prev, nome: value }))}
          width="100%"
        />
        <ControlPricingUnit
          methodology={methodology as TPricingMethod}
          setMethodology={setMethodology as React.Dispatch<React.SetStateAction<TPricingMethod>>}
        />
      </div>
      <div className="flex w-full items-center justify-end gap-2 px-2">
        <button
          className="rounded bg-gray-500 p-1 px-4 text-xs font-medium text-white duration-300 ease-in-out hover:bg-gray-600"
          // @ts-ignore
          onClick={() => goToNextStage()}
        >
          PULAR
        </button>
        <button
          className="rounded bg-black p-1 px-4 text-xs font-medium text-white duration-300 ease-in-out disabled:bg-gray-400 disabled:text-black enabled:hover:bg-gray-600"
          disabled={isPending}
          // @ts-ignore
          onClick={() => handleCreatePricingMethod({ info: methodology })}
        >
          PROSSEGUIR
        </button>
      </div>
    </div>
  )
}

export default PricingMethod
