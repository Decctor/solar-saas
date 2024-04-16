import TextInput from '@/components/Inputs/TextInput'
import ControlPricingUnit from '@/components/PricingMethods/ControlPricingUnit'
import NewPricingUnit from '@/components/PricingMethods/NewPricingUnit'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingComponent from '@/components/utils/LoadingComponent'
import { useMutationWithFeedback } from '@/utils/mutations/general-hook'
import { createPricingMethod, editPricingMethod } from '@/utils/mutations/pricing-methods'
import { formatCondition, formatFormulaItem } from '@/utils/pricing/helpers'
import { usePricingMethodById } from '@/utils/queries/pricing-methods'
import { TPricingMethod, TPricingMethodDTO } from '@/utils/schemas/pricing-method.schema'
import { useQueryClient } from '@tanstack/react-query'
import { Session } from 'next-auth'
import React, { useEffect, useState } from 'react'
import { VscChromeClose } from 'react-icons/vsc'

type EditPricingMethodProps = {
  pricingMethodId: string
  session: Session
  closeModal: () => void
}
function EditPricingMethod({ pricingMethodId, session, closeModal }: EditPricingMethodProps) {
  const queryClient = useQueryClient()
  const { data: pricingMethod, isLoading, isSuccess, isError } = usePricingMethodById({ id: pricingMethodId })
  const [methodology, setMethodology] = useState<TPricingMethodDTO>({
    _id: 'id-holder',
    nome: '',
    idParceiro: session.user.idParceiro || '',
    itens: [],
    autor: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },
    dataInsercao: new Date().toISOString(),
  })
  const { mutate: handleEditPricingMethod, isPending } = useMutationWithFeedback({
    mutationKey: ['edit-pricing-method', pricingMethodId],
    mutationFn: editPricingMethod,
    affectedQueryKey: ['pricing-methods'],
    queryClient: queryClient,
  })
  useEffect(() => {
    if (pricingMethod) setMethodology(pricingMethod)
  }, [pricingMethod])
  console.log(methodology)
  return (
    <div id="defaultModal" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <div className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:w-[70%]">
        <div className="flex h-full flex-col font-Inter">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <h3 className="text-xl font-bold text-[#353432] dark:text-white ">EDITAR METODOLOGIA DE PRECIFICAÇÃO</h3>
            <button
              onClick={() => closeModal()}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
          {isLoading ? <LoadingComponent /> : null}
          {isError ? <ErrorComponent msg="Erro ao buscar metodologia de precificação." /> : null}
          {isSuccess ? (
            <div className="flex h-full grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto p-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
              <div className="my-5 flex flex-col">
                <p className="text-gray-500">Construa metodologias de precificação a serem aplicadas ao seus kits.</p>
                <p className="text-gray-500">
                  Crie unidades de preço para composição da sua precificação. Utilize <strong className="text-[#E25E3E]">variáveis</strong>, aplique{' '}
                  <strong className="text-[#E25E3E]">condições</strong> , e tenha flexibilidade na criação de fórmulas de{' '}
                  <strong className="text-[#E25E3E]">cálculo de custo.</strong>
                </p>
              </div>
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
              {/* <h1 className="mt-2 w-full rounded-md bg-gray-700 p-1 text-center text-sm font-bold text-white">UNIDADES DE PREÇO</h1>
            {newPriceUnitMenuIsOpen ? (
              <NewPricingUnit methodology={methodology} setMethodology={setMethodology} closeMenu={() => setNewPriceUnitMenuIsOpen(false)} />
            ) : (
              <div className="flex w-full items-center justify-end">
                <button
                  className="rounded bg-green-500 p-1 px-4 text-sm font-medium text-white duration-300 ease-in-out hover:bg-green-600"
                  onClick={() => setNewPriceUnitMenuIsOpen(true)}
                >
                  NOVA UNIDADE DE PREÇO
                </button>
              </div>
            )}
            <h1 className="my-4 text-sm font-bold leading-none tracking-tight text-[#E25E3E]">LISTA DE UNIDADES DE PREÇO</h1>
            {methodology.itens.length > 0 ? (
              methodology.itens.map((item, index) => (
                <div key={index} className="flex w-full flex-col rounded-md border border-gray-500 p-3 shadow-sm">
                  <h1 className="mb-2 text-sm font-black leading-none tracking-tight">{item.nome}</h1>
                  <div className="flex flex-col">
                    {item.resultados.map((result, index2) => (
                      <div key={index2} className="mb-1 flex w-full items-center gap-2 rounded-md border border-[#A0E9FF] p-1">
                        <div className="flex flex-col">
                          <h1 className="text-start text-sm font-bold leading-none tracking-tight text-cyan-500">
                            {!result.condicao.aplicavel
                              ? 'FÓRMULA GERAL:'
                              : `SE ${formatCondition(result.condicao.variavel || '')} FOR IGUAL A ${result.condicao.igual}:`}
                          </h1>
                          <div className="flex items-center gap-2 font-Inter">
                            <div className="flex items-center gap-1">
                              <p className="text-xs text-gray-500">MARGEM: </p>
                              <p className="text-xs font-bold text-[#FFBB5C]">{result.margemLucro}%</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <p className="text-xs text-gray-500">IMPOSTO: </p>
                              <p className="text-xs font-bold text-[#FFBB5C]">{result.taxaImposto}%</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex  grow flex-wrap items-center justify-center gap-1 p-1">
                          {result.formulaArr.map((y) => (
                            <p className={`text-[0.7rem] ${y.includes('[') ? 'rounded bg-blue-500 p-1 text-white' : ''}`}>{formatFormulaItem(y)}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <h1 className="w-full text-center text-xs font-medium italic">Sem unidades de preço cadastradas...</h1>
            )} */}
              <div className="flex w-full items-center justify-end">
                <button
                  disabled={isPending}
                  className="h-9 whitespace-nowrap rounded bg-blue-800 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-blue-800 enabled:hover:text-white"
                  onClick={() =>
                    // @ts-ignore
                    handleEditPricingMethod({ id: pricingMethodId, changes: methodology })
                  }
                >
                  ATUALIZAR METODOLOGIA
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default EditPricingMethod