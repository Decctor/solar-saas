import React from 'react'
import NumberInput from '../Inputs/NumberInput'
import { TProduct } from '@/utils/schemas/products.schema'
import { usePricingMethods } from '@/utils/queries/pricing-methods'
import SelectInput from '../Inputs/SelectInput'

type ValuesInformationBlockProps = {
  infoHolder: TProduct
  setInfoHolder: React.Dispatch<React.SetStateAction<TProduct>>
}
function ValuesInformationBlock({ infoHolder, setInfoHolder }: ValuesInformationBlockProps) {
  return (
    <div className="flex w-full flex-col gap-y-2">
      <h1 className="w-full bg-gray-700  p-1 text-center font-medium text-white">VALORES</h1>
      <div className="flex w-full flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <NumberInput
            label="POTÊNCIA"
            placeholder="Preencha a potência do produto, se aplicável."
            value={infoHolder.potencia || null}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, potencia: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <NumberInput
            label="GARANTIA"
            placeholder="Preencha a garantia do produto."
            value={infoHolder.garantia || null}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, garantia: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <NumberInput
            label="VALOR DO PRODUTO"
            placeholder="Preencha o valor do produto."
            value={infoHolder.preco || null}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, preco: value }))}
            width="100%"
          />
        </div>
      </div>
    </div>
  )
}

export default ValuesInformationBlock
