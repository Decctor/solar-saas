import { formatToMoney, getModulesQty } from '@/utils/methods'
import { TPricingItem, TProposal } from '@/utils/schemas/proposal.schema'
import React, { useState } from 'react'
import { AiFillEdit } from 'react-icons/ai'

import { getPricingTotals, handlePartialPricingReCalculation, TPricingConditionData, TPricingVariableData } from '@/utils/pricing/methods'
import EditPriceItem from './EditPriceItem'
import { TbPercentage } from 'react-icons/tb'
import { formatDecimalPlaces } from '@/lib/methods/formatting'
import { MdSignalCellularAlt } from 'react-icons/md'
import CheckboxInput from '@/components/Inputs/CheckboxInput'
import { TOpportunityDTOWithClientAndPartner } from '@/utils/schemas/opportunity.schema'
import { getInverterQty } from '@/lib/methods/extracting'

type TEditPriceModal = {
  isOpen: boolean
  priceItemIndex: null | number
}
type PricingTableProps = {
  pricing: TPricingItem[]
  setPricing: React.Dispatch<React.SetStateAction<TPricingItem[]>>
  proposal: TProposal
  opportunity: TOpportunityDTOWithClientAndPartner
  userHasPricingViewPermission: boolean
  userHasPricingEditPermission: boolean
}
function PricingTable({ pricing, setPricing, proposal, opportunity, userHasPricingViewPermission, userHasPricingEditPermission }: PricingTableProps) {
  const [editPriceModal, setEditPriceModal] = useState<TEditPriceModal>({
    isOpen: false,
    priceItemIndex: null,
  })
  const [showOnlyNonZero, setShowOnlyNonZero] = useState<boolean>(true)

  function handleRecalculateCumulatives(pricing: TPricingItem[]) {
    const moduleQty = getModulesQty(proposal.produtos)
    const inverterQty = getInverterQty(proposal.produtos)
    const kitPrice = proposal.kits.reduce((acc, current) => acc + current.valor, 0)
    const conditionData: TPricingConditionData = {
      uf: opportunity.localizacao.uf,
      cidade: opportunity.localizacao.cidade,
      topologia: proposal.premissas.topologia || 'INVERSOR',
      grupoInstalacao: proposal.premissas.grupoInstalacao || 'RESIDENCIAL',
    }
    const variableData: TPricingVariableData = {
      kit: kitPrice,
      numModulos: moduleQty,
      product: 0,
      service: 0,
      potenciaPico: proposal.potenciaPico || 0,
      distancia: proposal.premissas.distancia || 0,
      plan: 0,
      numInversores: inverterQty,
      valorReferencia: proposal.premissas.valorReferencia || 0,
      custosInstalacao: proposal.premissas.custosInstalacao || 0,
      custosPadraoEnergia: proposal.premissas.custosPadraoEnergia || 0,
      custosEstruturaInstalacao: proposal.premissas.custosEstruturaInstalacao || 0,
      custosOutros: proposal.premissas.custosOutros || 0,
    }
    const newPricing = handlePartialPricingReCalculation({ variableData, conditionData, methodology })
  }
  // In case user has pricing view permission
  if (userHasPricingViewPermission)
    return (
      <>
        <div className="my-2 flex w-full items-center justify-end">
          <button className="rounded-xl bg-cyan-800 px-2 py-1 text-[0.6rem] font-bold text-white">RECALCULAR ACUMULÁVEIS</button>
          <div className="w-fit">
            <CheckboxInput
              checked={showOnlyNonZero}
              handleChange={(value) => setShowOnlyNonZero(value)}
              labelTrue="MOSTRAR SOMENTE PREÇOS NÃO NULOS"
              labelFalse="MOSTRAR SOMENTE PREÇOS NÃO NULOS"
            />
          </div>
        </div>
        {/**WEB STYLES */}
        <div className="hidden w-full grow flex-col gap-1 lg:flex">
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
            if (showOnlyNonZero && valorFinal == 0) return null
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
                  {userHasPricingEditPermission ? (
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
        </div>
        {/**MOBILE STYLES */}
        <div className="flex w-full grow flex-col gap-1 lg:hidden">
          <div className="flex w-full items-center rounded bg-cyan-500">
            <div className="flex w-full items-center justify-center p-1">
              <h1 className="font-bold text-white">PRECIFICAÇÃO</h1>
            </div>
          </div>
          {pricing.map((priceItem, index) => {
            const { descricao, custoCalculado, faturavel, custoFinal, margemLucro, valorCalculado, valorFinal } = priceItem
            const profitMarginPercentage = margemLucro / 100
            return (
              <div className={`flex w-full flex-col rounded-md border border-gray-500 p-2`} key={index}>
                <div className="flex items-center justify-between gap-2">
                  <h1 className="text-sm font-black leading-none tracking-tight">{descricao}</h1>
                  {userHasPricingEditPermission ? (
                    <button
                      onClick={() => setEditPriceModal({ isOpen: true, priceItemIndex: index })}
                      className="text-md min-w-fit text-gray-400 hover:text-[#fead61]"
                    >
                      <AiFillEdit />
                    </button>
                  ) : null}
                </div>
                <div className="flex w-full items-center gap-2">
                  <div className="flex items-center gap-1">
                    <TbPercentage color="rgb(34,197,94)" />
                    <p className="text-[0.6rem] tracking-tight text-gray-500">MARGEM DE {formatDecimalPlaces(margemLucro)}%</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <MdSignalCellularAlt color={'#fead41'} />
                    <p className="text-[0.6rem] tracking-tight text-gray-500">{faturavel ? 'FATURÁVEL' : 'NÃO FATURÁVEL'}</p>
                  </div>
                </div>
                <div className="mt-1 flex w-full items-center justify-around gap-2">
                  <div className="flex flex-col items-center rounded-md border border-gray-500 px-2 py-1">
                    <h1 className="text-[0.48rem] tracking-tight text-gray-500">CUSTO</h1>
                    <h1 className="text-[0.5rem] font-medium tracking-tight text-gray-500">{formatToMoney(custoFinal)}</h1>
                  </div>
                  <div className="flex flex-col items-center rounded-md border border-green-500 px-2 py-1">
                    <h1 className="text-[0.48rem] tracking-tight text-green-500">LUCRO</h1>
                    <h1 className="text-[0.5rem] font-medium tracking-tight text-green-500">{formatToMoney(profitMarginPercentage * valorFinal)}</h1>
                  </div>
                  <div className="flex flex-col items-center rounded-md border border-blue-500 px-2 py-1">
                    <h1 className="text-[0.48rem] tracking-tight text-blue-500">VALOR FINAL</h1>
                    <h1 className="text-[0.5rem] font-medium tracking-tight text-blue-500">{formatToMoney(valorFinal)}</h1>
                  </div>
                </div>
              </div>
            )
          })}
          <div className="flex w-full items-center justify-center rounded bg-gray-800 p-1">
            <h1 className="text-xs font-bold text-white">TOTAIS</h1>
          </div>
          <div className="flex w-full flex-col items-center gap-2">
            <div className="flex w-full flex-col rounded-md border border-gray-500 p-2">
              <h1 className="text-[0.65rem] tracking-tight text-gray-500">CUSTO</h1>
              <h1 className="w-full text-center text-[0.7rem] font-bold tracking-tight text-gray-500">{formatToMoney(getPricingTotals(pricing).cost)}</h1>
            </div>
            <div className="flex w-full flex-col rounded-md border border-green-500 p-2">
              <h1 className="text-[0.65rem] tracking-tight text-green-500">LUCRO</h1>
              <h1 className="w-full text-center text-[0.7rem] font-bold tracking-tight text-green-500">{formatToMoney(getPricingTotals(pricing).profit)}</h1>
            </div>
            <div className="flex w-full flex-col rounded-md border border-blue-500 p-2">
              <h1 className="text-[0.65rem] tracking-tight text-blue-500">VALOR FINAL</h1>
              <h1 className="w-full text-center text-[0.7rem] font-bold tracking-tight text-blue-500">{formatToMoney(getPricingTotals(pricing).total)}</h1>
            </div>
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
      </>
    )
  return (
    <div className="flex w-full grow flex-col gap-1">
      <div className="flex w-full items-center rounded bg-cyan-500">
        <div className="flex w-full items-center justify-center p-1">
          <h1 className="font-bold text-white">ITEM</h1>
        </div>
      </div>
      {pricing.map((priceItem, index) => {
        const { descricao, valorCalculado, valorFinal } = priceItem
        return (
          <div className={`flex w-full items-center rounded ${Math.abs(valorFinal - valorCalculado) > 1 ? 'bg-orange-200' : ''}`} key={index}>
            <div className="flex w-full items-center justify-center p-1">
              <h1 className="text-gray-500">{descricao}</h1>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PricingTable
