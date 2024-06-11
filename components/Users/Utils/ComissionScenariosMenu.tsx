import React, { useState } from 'react'
import { TComissionSpecs } from '../ComissionPannel'
import NumberInput from '@/components/Inputs/NumberInput'
import { operators } from '@/utils/pricing/helpers'
import { FiDelete } from 'react-icons/fi'
import CheckboxInput from '@/components/Inputs/CheckboxInput'
import NewComissionScenario from './NewComissionScenario'

const comissionVariablesAlias = [{ label: 'VALOR DA PROPOSTA', value: 'valorProposta' }, { label: 'POTÊNCIA PICO DA PROPOSTA' }]

type ComissionScenariosMenuProps = {
  comission: TComissionSpecs
  setComission: React.Dispatch<React.SetStateAction<TComissionSpecs>>
  resultHolder: TComissionSpecs['resultados'][number]
  setResultHolder: React.Dispatch<React.SetStateAction<TComissionSpecs['resultados'][number]>>
}
function ComissionScenariosMenu({ comission, setComission, resultHolder, setResultHolder }: ComissionScenariosMenuProps) {
  const [newComissionScenarioMenuIsOpen, setNewComissionScenarioMenuIsOpen] = useState<boolean>(false)
  return (
    <div className="flex w-full flex-col gap-y-2">
      <h1 className="mt-2 w-full rounded-md bg-gray-700 p-1 text-center text-sm font-bold text-white">CENÁRIOS DE COMISSIONAMENTO</h1>
      {newComissionScenarioMenuIsOpen ? (
        <NewComissionScenario />
      ) : (
        <div className="flex w-full items-center justify-end">
          <button
            className="rounded bg-green-500 p-1 px-4 text-sm font-medium text-white duration-300 ease-in-out hover:bg-green-600"
            onClick={() => setNewComissionScenarioMenuIsOpen(true)}
          >
            NOVO CENÁRIO
          </button>
        </div>
      )}
      <h1 className="my-4 text-sm font-bold leading-none tracking-tight text-[#E25E3E]">LISTA DE UNIDADES DE PREÇO</h1>
      <div className="flex flex-col">
        {comission.resultados.map((result, index2) => (
          <div key={index2} className="mb-1 flex w-full items-center gap-2 rounded-md border border-[#A0E9FF] p-1">
            {/* <div className="flex flex-col">
              {renderConditionPhrase({ condition: result.condicao, partners: [] })}
              <div className="flex items-center gap-2 font-Inter">
                <div className="flex items-center gap-1">
                  <p className="text-xs text-gray-500">MARGEM: </p>
                  <p className="text-xs font-bold text-[#FFBB5C]">{result.margemLucro}%</p>
                </div>
                <div className="flex items-center gap-1">
                  <p className="text-xs text-gray-500">FATURÁVEL: </p>
                  <p className="text-xs font-bold text-[#FFBB5C]">{result.faturavel ? 'SIM' : 'NÃO'}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setResultHolder((prev) => ({ ...prev, formulaArr: [...prev.formulaArr, ...result.formulaArr] }))
                  return toast.success('Formula adicionada a área de trabalho')
                }}
                className="flex w-fit items-center gap-1 rounded-md bg-gray-900 px-2 py-1 text-white hover:bg-gray-800"
              >
                <MdContentCopy size={15} />
                <p className="text-[0.6rem] tracking-tight">COPIAR PARA ÁREA DE TRABALHO</p>
              </button>
            </div>
            <div className="flex  grow flex-wrap items-center justify-center gap-1 p-1">
              {result.formulaArr.map((y) => (
                <p className={`text-[0.7rem] ${y.includes('[') ? 'rounded bg-blue-500 p-1 text-white' : ''}`}>{formatFormulaItem(y)}</p>
              ))}
            </div> */}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ComissionScenariosMenu

// <h1 className="my-2 w-full text-start text-sm font-black text-[#FF9B50]">VALORES</h1>
// <div className="flex w-full items-end gap-2">
//   <div className="grow">
//     <NumberInput
//       label="NÚMERO"
//       labelClassName="font-semibold leading-none tracking-tight text-xs"
//       placeholder="Preencha um valor para adição a fórmula..."
//       value={numberHolder}
//       handleChange={(value) => setNumberHolder(Number(value))}
//       width="100%"
//     />
//   </div>
//   <button
//     onClick={() => {
//       if (numberHolder) addToUnitPricingItems(numberHolder?.toString())
//     }}
//     className="min-h-[46px] rounded-md bg-green-500 p-2 text-sm text-white hover:bg-green-600"
//   >
//     ADD
//   </button>
// </div>
// <h1 className="mt-2 w-full text-start text-sm font-black text-[#FF9B50]">VARIÁVEIS</h1>
// <div className="my-2 flex flex-wrap items-center gap-2">
//   {comissionVariablesAlias.map((va, index) => (
//     <button
//       key={index}
//       onClick={() => addToUnitPricingItems(`[${va.value}]`)}
//       className="grow rounded border border-gray-700 p-1 text-xs font-medium text-gray-700 duration-300 ease-in-out hover:bg-gray-700 hover:text-white"
//     >
//       {va.label}
//     </button>
//   ))}
// </div>
// <h1 className="my-2 w-full text-start text-sm font-black text-[#FF9B50]">OPERAÇÕES</h1>
// <div className="flex w-full flex-wrap items-center justify-around gap-2">
//   {operators.map((op, index) => (
//     <button
//       key={index}
//       onClick={() => addToUnitPricingItems(op)}
//       className="grow rounded border border-gray-300 bg-gray-100 p-2 text-center font-medium text-gray-700 duration-300 ease-in-out hover:scale-105 hover:bg-gray-200"
//     >
//       {op}
//     </button>
//   ))}
//   <button
//     onClick={() => dropUnitPricingItem()}
//     className="flex grow items-center justify-center rounded border border-red-300 bg-red-100 p-2 text-center font-medium duration-300 ease-in-out hover:scale-105 hover:bg-red-200"
//   >
//     <FiDelete size={23} />
//   </button>
// </div>
// <div className="my-2 flex w-full items-center justify-center gap-2">
//   <div className="w-fit">
//     <CheckboxInput
//       labelFalse="APLICAR CONDIÇÃO"
//       labelTrue="APLICAR CONDIÇÃO"
//       checked={resultHolder.condicao.aplicavel}
//       handleChange={(value) => setResultHolder((prev) => ({ ...prev, condicao: { ...prev.condicao, aplicavel: value } }))}
//       justify="justify-center"
//     />
//   </div>
// </div>
