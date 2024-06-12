import React, { useState } from 'react'
import { TComissionSpecs } from '../ComissionPannel'
import NumberInput from '@/components/Inputs/NumberInput'
import { operators } from '@/utils/pricing/helpers'
import { FiDelete } from 'react-icons/fi'
import CheckboxInput from '@/components/Inputs/CheckboxInput'
import NewComissionScenario from './NewComissionScenario'
import { TUser, TUserComission } from '@/utils/schemas/user.schema'
import { formatComissionFormulaItem, renderComissionScenarioConditionPhrase } from '@/utils/comissions/helpers'
import { MdContentCopy, MdDelete, MdEdit } from 'react-icons/md'
import toast from 'react-hot-toast'
import EditComissionScenario from './EditComissionScenario'

const comissionVariablesAlias = [{ label: 'VALOR DA PROPOSTA', value: 'valorProposta' }, { label: 'POTÊNCIA PICO DA PROPOSTA' }]

type ComissionScenariosMenuProps = {
  infoHolder: TUser
  setInfoHolder: React.Dispatch<React.SetStateAction<TUser>>
  resultHolder: TUserComission['resultados'][number]
  setResultHolder: React.Dispatch<React.SetStateAction<TUserComission['resultados'][number]>>
}
function ComissionScenariosMenu({ infoHolder, setInfoHolder, resultHolder, setResultHolder }: ComissionScenariosMenuProps) {
  const [newComissionScenarioMenuIsOpen, setNewComissionScenarioMenuIsOpen] = useState<boolean>(false)
  const [editComissionScenarioMenu, setEditComissionScenarioMenu] = useState<{ info: TUserComission['resultados'][number] | null; index: number | null }>({
    info: null,
    index: null,
  })
  function deleteScenario(index: number) {
    const scenarios = [...infoHolder.comissionamento.resultados]
    scenarios.splice(index, 1)
    setInfoHolder((prev) => ({ ...prev, comissionamento: { ...prev.comissionamento, resultados: scenarios } }))
  }
  return (
    <div className="flex w-full flex-col gap-y-2">
      <h1 className="mt-2 w-full rounded-md bg-gray-700 p-1 text-center text-sm font-bold text-white">CENÁRIOS DE COMISSIONAMENTO</h1>
      {newComissionScenarioMenuIsOpen ? (
        <NewComissionScenario
          infoHolder={infoHolder}
          setInfoHolder={setInfoHolder}
          resultHolder={resultHolder}
          setResultHolder={setResultHolder}
          closeMenu={() => setNewComissionScenarioMenuIsOpen(false)}
        />
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
      {editComissionScenarioMenu.index != null ? (
        <EditComissionScenario
          index={editComissionScenarioMenu.index}
          infoHolder={infoHolder}
          setInfoHolder={setInfoHolder}
          resultHolder={resultHolder}
          setResultHolder={setResultHolder}
          closeMenu={() => setEditComissionScenarioMenu({ index: null, info: null })}
        />
      ) : null}
      <h1 className="my-4 text-sm font-bold leading-none tracking-tight text-[#E25E3E]">LISTA DE CENÁRIOS</h1>
      <div className="flex flex-col">
        {infoHolder.comissionamento.resultados.map((result, index) => (
          <div key={index} className="mb-1 flex w-full flex-col gap-2 rounded-md border border-[#A0E9FF] p-1">
            <div className="flex w-full items-center justify-between gap-2">
              {renderComissionScenarioConditionPhrase({ condition: result.condicao })}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setNewComissionScenarioMenuIsOpen(false)
                    setEditComissionScenarioMenu({ index: index, info: result })
                    setResultHolder(result)
                  }}
                  className="flex items-center justify-center rounded-lg p-1 text-orange-500 duration-300 ease-linear hover:scale-105 hover:bg-orange-200"
                >
                  <MdEdit />
                </button>
                <button
                  onClick={() => deleteScenario(index)}
                  type="button"
                  className="flex items-center justify-center rounded-lg p-1 text-red-500 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
                >
                  <MdDelete style={{ color: 'red' }} />
                </button>
              </div>
            </div>
            <div className="flex  grow flex-wrap items-center justify-center gap-1 p-1">
              {result.formulaArr.map((y) => (
                <p className={`text-[0.7rem] ${y.includes('[') ? 'rounded bg-blue-500 p-1 text-white' : ''}`}>{formatComissionFormulaItem(y)}</p>
              ))}
            </div>
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
