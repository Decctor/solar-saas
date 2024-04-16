import { IProposalInfo, ISession } from '@/utils/models'
import { PricesObj, PricesPromoObj, Pricing, getMarginValue, getProposaldPrice, getTaxValue, priceDescription } from '@/utils/pricing/methods'
import React, { useState } from 'react'
import { AiFillEdit } from 'react-icons/ai'
import EditPriceModal from './EditPriceModal'

type PricingTableProps = {
  pricing: PricesObj | PricesPromoObj
  setPricing: React.Dispatch<React.SetStateAction<PricesObj | PricesPromoObj>>
  proposalInfo: IProposalInfo
  session: ISession
}
type EditPriceModalState = {
  isOpen: boolean
  priceTag: string | null
}
function PricingTable({ pricing, setPricing, proposalInfo, session }: PricingTableProps) {
  const [editPriceModal, setEditPriceModal] = useState<EditPriceModalState>({
    isOpen: false,
    priceTag: null,
  })
  function getTotals() {
    switch (proposalInfo.kit?.tipo) {
      case 'PROMOCIONAL':
        var totalCosts = 0
        var totalTaxes = 0
        var totalProfits = 0
        var finalProposalPrice = 0
        const promotionalPricing = pricing as PricesPromoObj
        Object.keys(promotionalPricing).forEach((priceType) => {
          const pricesObj = promotionalPricing[priceType as keyof PricesPromoObj]
          if (!pricesObj) return
          const { custo, vendaFinal, margemLucro, imposto } = pricesObj

          const taxValue = getTaxValue(custo, vendaFinal, margemLucro) * vendaFinal
          const marginValue = getMarginValue(custo, vendaFinal, imposto) * vendaFinal

          totalCosts = totalCosts + custo
          totalTaxes = totalTaxes + taxValue
          totalProfits = totalProfits + marginValue
          finalProposalPrice = finalProposalPrice + vendaFinal
        })
        return {
          totalCosts,
          totalTaxes,
          totalProfits,
          finalProposalPrice,
        }
      case 'TRADICIONAL':
        var totalCosts = 0
        var totalTaxes = 0
        var totalProfits = 0
        var finalProposalPrice = 0
        const traditionalPricing = pricing as PricesObj
        Object.keys(traditionalPricing).forEach((priceType) => {
          const pricesObj = traditionalPricing[priceType as keyof PricesObj]
          if (!pricesObj) return
          const { custo, vendaFinal, margemLucro, imposto } = pricesObj

          const taxValue = getTaxValue(custo, vendaFinal, margemLucro) * vendaFinal
          // console.log("SOMATORIA", priceType, taxValue);
          const marginValue = getMarginValue(custo, vendaFinal, imposto) * vendaFinal

          totalCosts = totalCosts + custo
          totalTaxes = totalTaxes + taxValue
          totalProfits = totalProfits + marginValue
          finalProposalPrice = finalProposalPrice + vendaFinal
        })
        return {
          totalCosts,
          totalTaxes,
          totalProfits,
          finalProposalPrice,
        }

      default:
        var totalCosts = 0
        var totalTaxes = 0
        var totalProfits = 0
        var finalProposalPrice = 0
        Object.keys(pricing).forEach((priceType) => {
          const pricesObj = pricing[priceType as keyof Pricing]
          if (!pricesObj) return
          const { custo, vendaFinal, margemLucro, imposto } = pricesObj
          const finalSellingPrice = vendaFinal
          const taxValue = getTaxValue(custo, finalSellingPrice, margemLucro) * finalSellingPrice
          const marginValue = getMarginValue(custo, finalSellingPrice, imposto) * finalSellingPrice

          totalCosts = totalCosts + custo
          totalTaxes = totalTaxes + taxValue
          totalProfits = totalProfits + marginValue
          finalProposalPrice = finalProposalPrice + finalSellingPrice
        })
        return {
          totalCosts,
          totalTaxes,
          totalProfits,
          finalProposalPrice,
        }
    }
  }

  return (
    <div className="flex w-full grow flex-col gap-1">
      <div className="flex w-full items-center rounded bg-blue-100">
        <div className="flex w-4/12 items-center justify-center p-1">
          <h1 className="font-Raleway font-bold text-gray-500">ITEM</h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="font-Raleway font-bold text-gray-500">CUSTO</h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="font-Raleway font-bold text-gray-500">IMPOSTO</h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="font-Raleway font-bold text-gray-500">LUCRO</h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="font-Raleway font-bold text-gray-500">VENDA</h1>
        </div>
      </div>
      {/* <div className="flex w-full items-center rounded">
        <div className="flex w-4/12 items-center justify-center p-1">
          <h1 className="text-gray-500">{proposalInfo.kit?.nome}</h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="text-gray-500">
            R${" "}
            {proposalInfo.kit?.preco.toLocaleString("pt-br", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="text-gray-500">-</h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="text-gray-500">
            R${" "}
            {proposalInfo.kit
              ? (
                  getMarginValue(
                    proposalInfo.kit.preco,
                    getProposaldPrice(proposalInfo.kit.preco, 0),
                    0
                  ) * getProposaldPrice(proposalInfo.kit.preco, 0)
                ).toLocaleString("pt-br", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })
              : 0}
          </h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="text-gray-500">
            R${" "}
            {proposalInfo.kit
              ? getProposaldPrice(proposalInfo.kit.preco, 0).toLocaleString(
                  "pt-br",
                  { maximumFractionDigits: 2, minimumFractionDigits: 2 }
                )
              : "-"}
          </h1>
        </div>
      </div> */}
      {Object.keys(pricing).map((priceType, index) => {
        const pricesObj = pricing[priceType as keyof Pricing]
        if (!pricesObj) return
        const { custo, vendaFinal, margemLucro, imposto, vendaProposto } = pricesObj
        const description = priceType == 'kit' ? proposalInfo.kit?.nome : priceDescription[priceType]

        const taxValue = getTaxValue(custo, vendaFinal, margemLucro) * vendaFinal
        const marginValue = getMarginValue(custo, vendaFinal, imposto) * vendaFinal
        return (
          <div className={`flex w-full items-center rounded ${Math.abs(vendaFinal - vendaProposto) > 1 ? 'bg-orange-200' : ''}`} key={index}>
            <div className="flex w-4/12 items-center justify-center p-1">
              <h1 className="text-gray-500">{description}</h1>
            </div>
            <div className="flex w-2/12 items-center justify-center p-1">
              <h1 className="text-gray-500">
                R${' '}
                {custo.toLocaleString('pt-br', {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </h1>
            </div>
            <div className="flex w-2/12 items-center justify-center p-1">
              <h1 className="text-gray-500">
                R${' '}
                {taxValue >= 0
                  ? taxValue.toLocaleString('pt-br', {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })
                  : 'N/A'}
              </h1>
            </div>
            <div className="flex w-2/12 items-center justify-center p-1">
              <h1 className="text-gray-500">
                R${' '}
                {marginValue.toLocaleString('pt-br', {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </h1>
            </div>
            <div className="flex w-2/12 items-center justify-center gap-4 p-1">
              <h1 className="w-full text-center text-gray-500 lg:w-1/2">
                R${' '}
                {vendaFinal.toLocaleString('pt-br', {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </h1>
              {session.user.permissoes.precos.editar ? (
                <button onClick={() => setEditPriceModal({ isOpen: true, priceTag: priceType })} className="text-md text-gray-400 hover:text-[#fead61]">
                  <AiFillEdit />
                </button>
              ) : null}
            </div>
          </div>
        )
      })}
      <div className="flex w-full items-center rounded border-t border-gray-200 py-1">
        <div className="flex w-4/12 items-center justify-center p-1">
          <h1 className="font-bold text-gray-800">TOTAIS</h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="font-medium text-gray-800">
            R${' '}
            {getTotals().totalCosts.toLocaleString('pt-br', {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="font-medium text-gray-800">
            R${' '}
            {getTotals().totalTaxes.toLocaleString('pt-br', {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="font-medium text-gray-800">
            R${' '}
            {getTotals().totalProfits.toLocaleString('pt-br', {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </h1>
        </div>
        <div className="flex w-2/12 items-center justify-center p-1">
          <h1 className="font-medium text-gray-800">
            R${' '}
            {getTotals().finalProposalPrice.toLocaleString('pt-br', {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </h1>
        </div>
      </div>
      {editPriceModal.isOpen && editPriceModal.priceTag ? (
        <EditPriceModal
          priceType={editPriceModal.priceTag}
          pricing={pricing}
          setPricing={setPricing}
          closeModal={() => setEditPriceModal((prev) => ({ ...prev, isOpen: false }))}
        />
      ) : null}
    </div>
  )
}

export default PricingTable
