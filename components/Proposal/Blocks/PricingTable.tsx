import { formatToMoney } from '@/utils/methods'
import { TPricingItem } from '@/utils/schemas/proposal.schema'
import React, { useState } from 'react'
import { AiFillEdit } from 'react-icons/ai'

import { getPricingTotals } from '@/utils/pricing/methods'
import EditPriceItem from './EditPriceItem'

type TEditPriceModal = {
  isOpen: boolean
  priceItemIndex: null | number
}
type PricingTableProps = {
  pricing: TPricingItem[]
  setPricing: React.Dispatch<React.SetStateAction<TPricingItem[]>>
  userHasEditPermission: boolean
}
function PricingTable({ pricing, setPricing, userHasEditPermission }: PricingTableProps) {
  const [editPriceModal, setEditPriceModal] = useState<TEditPriceModal>({
    isOpen: false,
    priceItemIndex: null,
  })
  return (
    <div className="flex w-full grow flex-col gap-1">
      <div className="flex w-full items-center rounded bg-cyan-500">
        <div className="flex w-6/12 items-center justify-center p-1">
          <h1 className="font-bold text-white">ITEM</h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="font-bold text-white">CUSTO</h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="font-bold text-white">LUCRO</h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="font-bold text-white">VENDA</h1>
        </div>
      </div>
      {pricing.map((priceItem, index) => {
        const { descricao, custoCalculado, custoFinal, margemLucro, valorCalculado, valorFinal } = priceItem
        const profitMarginPercentage = margemLucro / 100
        return (
          <div className={`flex w-full items-center rounded ${Math.abs(valorFinal - valorCalculado) > 1 ? 'bg-orange-200' : ''}`} key={index}>
            <div className="flex w-6/12 items-center justify-center p-1">
              <h1 className="text-gray-500">{descricao}</h1>
            </div>
            <div className="flex w-2/12 items-center justify-center p-1">
              <h1 className="text-gray-500">{formatToMoney(custoFinal)}</h1>
            </div>
            <div className="flex w-2/12 items-center justify-center p-1">
              <h1 className="text-gray-500">{formatToMoney(valorFinal * profitMarginPercentage)}</h1>
            </div>
            <div className="flex w-2/12 items-center justify-center gap-4 p-1">
              <h1 className="w-full text-center text-gray-500 lg:w-1/2">{formatToMoney(valorFinal)}</h1>
              {userHasEditPermission ? (
                <button onClick={() => setEditPriceModal({ isOpen: true, priceItemIndex: index })} className="text-md text-gray-400 hover:text-[#fead61]">
                  <AiFillEdit />
                </button>
              ) : null}
            </div>
          </div>
        )
      })}
      <div className="flex w-full items-center rounded border-t border-gray-200 py-1">
        <div className="flex w-6/12 items-center justify-center p-1">
          <h1 className="font-bold text-gray-800">TOTAIS</h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="font-medium text-gray-800">{formatToMoney(getPricingTotals(pricing).cost)}</h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="font-medium text-gray-800">{formatToMoney(getPricingTotals(pricing).profit)}</h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="font-medium text-gray-800">{formatToMoney(getPricingTotals(pricing).total)}</h1>
        </div>
      </div>
      {editPriceModal.isOpen && typeof editPriceModal.priceItemIndex == 'number' ? (
        <EditPriceItem
          itemIndex={editPriceModal.priceItemIndex}
          pricing={pricing}
          setPricing={setPricing}
          closeModal={() => setEditPriceModal({ isOpen: false, priceItemIndex: null })}
        />
      ) : null}
    </div>
  )
}

export default PricingTable
