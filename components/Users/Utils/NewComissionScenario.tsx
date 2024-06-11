import NumberInput from '@/components/Inputs/NumberInput'
import React, { useState } from 'react'
import { VscChromeClose } from 'react-icons/vsc'
import { TComissionSpecs } from '../ComissionPannel'
import { operators } from '@/utils/pricing/helpers'
import { FiDelete } from 'react-icons/fi'
import CheckboxInput from '@/components/Inputs/CheckboxInput'

const variablesAlias = [
  { label: 'VALOR DA PROPOSTA', value: 'valorProposta' },
  { label: 'POTÊNCIA PICO', value: 'potenciaProposta' },
]

type NewComissionScenarioProps = {
  resultHolder: TComissionSpecs['resultados'][number]
  setResultHolder: React.Dispatch<React.SetStateAction<TComissionSpecs['resultados'][number]>>
  closeMenu: () => void
}
function NewComissionScenario({ resultHolder, setResultHolder, closeMenu }: NewComissionScenarioProps) {
  const [numberHolder, setNumberHolder] = useState(0)
  function addToUnitPricingItems(x: string) {
    const currentList = [...resultHolder.formulaArr]
    currentList.push(x)
    setResultHolder((prev) => ({ ...prev, formulaArr: currentList }))
    return
  }
  function dropUnitPricingItem() {
    const currentList = [...resultHolder.formulaArr]
    currentList.pop()
    setResultHolder((prev) => ({ ...prev, formulaArr: currentList }))
  }
  return (
    <div className="flex w-[80%] flex-col self-center rounded-md border border-gray-500 p-2 font-Inter">
      <div className="mb-4 flex w-full items-center justify-between">
        <h1 className="font-Inter font-black">NOVO CENÁRIO</h1>
        <button
          onClick={() => closeMenu()}
          type="button"
          className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
        >
          <VscChromeClose style={{ color: 'red' }} />
        </button>
      </div>
      <h1 className="mt-4 w-full text-center font-Inter text-sm font-black leading-none tracking-tight">CONSTRUÇÃO DO CÁLCULO DE COMISSÃO</h1>
      <h1 className="my-2 w-full text-start text-sm font-black text-[#FF9B50]">VALORES</h1>
      <div className="flex w-full items-end gap-2">
        <div className="grow">
          <NumberInput
            label="NÚMERO"
            labelClassName="font-semibold leading-none tracking-tight text-xs"
            placeholder="Preencha um valor para adição a fórmula..."
            value={numberHolder}
            handleChange={(value) => setNumberHolder(Number(value))}
            width="100%"
          />
        </div>
        <button
          onClick={() => {
            if (numberHolder) addToUnitPricingItems(numberHolder?.toString())
          }}
          className="min-h-[46px] rounded-md bg-green-500 p-2 text-sm text-white hover:bg-green-600"
        >
          ADD
        </button>
      </div>
      <h1 className="mt-2 w-full text-start text-sm font-black text-[#FF9B50]">VARIÁVEIS</h1>
      <div className="my-2 flex flex-wrap items-center gap-2">
        {variablesAlias.map((va, index) => (
          <button
            key={index}
            onClick={() => addToUnitPricingItems(`[${va.value}]`)}
            className="grow rounded border border-gray-700 p-1 text-xs font-medium text-gray-700 duration-300 ease-in-out hover:bg-gray-700 hover:text-white"
          >
            {va.label}
          </button>
        ))}
      </div>
      <h1 className="my-2 w-full text-start text-sm font-black text-[#FF9B50]">OPERAÇÕES</h1>
      <div className="flex w-full flex-wrap items-center justify-around gap-2">
        {operators.map((op, index) => (
          <button
            key={index}
            onClick={() => addToUnitPricingItems(op)}
            className="grow rounded border border-gray-300 bg-gray-100 p-2 text-center font-medium text-gray-700 duration-300 ease-in-out hover:scale-105 hover:bg-gray-200"
          >
            {op}
          </button>
        ))}
        <button
          onClick={() => dropUnitPricingItem()}
          className="flex grow items-center justify-center rounded border border-red-300 bg-red-100 p-2 text-center font-medium duration-300 ease-in-out hover:scale-105 hover:bg-red-200"
        >
          <FiDelete size={23} />
        </button>
      </div>
      <div className="my-2 flex w-full items-center justify-center gap-2">
        <div className="w-fit">
          <CheckboxInput
            labelFalse="APLICAR CONDIÇÃO"
            labelTrue="APLICAR CONDIÇÃO"
            checked={resultHolder.condicao.aplicavel}
            handleChange={(value) => setResultHolder((prev) => ({ ...prev, condicao: { ...prev.condicao, aplicavel: value } }))}
            justify="justify-center"
          />
        </div>
      </div>
    </div>
  )
}

export default NewComissionScenario
