import React, { useState } from 'react'
import CheckboxInput from '../Inputs/CheckboxInput'
import { TPricingMethodConditionType, TPricingMethodItemResultItem } from '@/utils/schemas/pricing-method.schema'

export type TComissionSpecs = {
  aplicavel: boolean
  resultados: {
    condicao: TPricingMethodItemResultItem['condicao']
    formulaArr: string[]
  }[]
}
function ComissionPannel() {
  const [comission, setComission] = useState<TComissionSpecs>({
    aplicavel: false,
    resultados: [],
  })
  const [resultHolder, setResultHolder] = useState<TComissionSpecs['resultados'][number]>({
    condicao: {
      aplicavel: false,
      variavel: null,
      igual: null,
    },
    formulaArr: [],
  })
  return (
    <>
      <h1 className="w-full pt-4 text-center text-sm font-medium">COMISSIONAMENTO</h1>
      <div className="flex w-full items-center justify-center">
        <div className="w-fit">
          <CheckboxInput
            labelFalse="USUÁRIO COMISSIONADO"
            labelTrue="USUÁRIO COMISSIONADO"
            checked={comission.aplicavel}
            handleChange={(value) => setComission((prev) => ({ ...prev, aplicavel: value }))}
          />
        </div>
      </div>
      {comission.aplicavel}
    </>
  )
}

export default ComissionPannel
