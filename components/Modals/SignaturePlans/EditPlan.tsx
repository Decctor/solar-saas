import DescriptiveInformation from '@/components/SignaturePlans/ModalBlocks/DescriptiveInformation'
import GeneralInformation from '@/components/SignaturePlans/ModalBlocks/GeneralInformation'
import PricingInformation from '@/components/SignaturePlans/ModalBlocks/PricingInformation'
import CheckboxInput from '@/components/Inputs/CheckboxInput'
import { createSignaturePlan, editSignaturePlan } from '@/utils/mutations/signature-plans'
import { useMutationWithFeedback } from '@/utils/mutations/general-hook'
import { TSignaturePlan, TSignaturePlanDTO } from '@/utils/schemas/signature-plans.schema'
import { useQueryClient } from '@tanstack/react-query'
import { Session } from 'next-auth'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { VscChromeClose } from 'react-icons/vsc'
import { Optional } from '@/utils/models'
import ServicesInformation from '@/components/SignaturePlans/ModalBlocks/ServicesInformation'
import { useSignaturePlanById } from '@/utils/queries/signature-plans'
import LoadingComponent from '@/components/utils/LoadingComponent'
import ErrorComponent from '@/components/utils/ErrorComponent'

type TNewSignaturePlan = Optional<TSignaturePlan, 'idMetodologiaPrecificacao'>

type EditPlanProps = {
  signaturePlanId: string
  session: Session
  closeModal: () => void
}
function EditPlan({ signaturePlanId, session, closeModal }: EditPlanProps) {
  const queryClient = useQueryClient()
  const { data: signaturePlan, isLoading, isError, isSuccess } = useSignaturePlanById({ id: signaturePlanId })
  const [infoHolder, setInfoHolder] = useState<TSignaturePlanDTO>({
    _id: 'id-holder',
    ativo: true,
    nome: '',
    idParceiro: session.user.idParceiro || '',
    idMetodologiaPrecificacao: '660de08225fee32a2237fa37',
    descricao: '',
    intervalo: {
      tipo: 'MENSAL',
      espacamento: 1,
    },
    descritivo: [],
    produtos: [],
    servicos: [],
    preco: 0,
    autor: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },
    dataInsercao: new Date().toISOString(),
  })

  async function validateAndEditPlan({ info }: { info: TSignaturePlan }) {
    if (info.nome.trim().length < 3) return toast.error('Forneça um nome de ao menos 3 caractéres ao plano.')
    if (info.preco == null && !infoHolder.idMetodologiaPrecificacao)
      return toast.error('Para casos de valor calculado, especifique a metodologia de precificação.')
    if (info.idMetodologiaPrecificacao == null && !!info.preco && info.preco < 0)
      return toast.error('Para casos de valor fixo, preencha um valor válido para o plano.')
    // @ts-ignore
    return handleEditSignaturePlan({ id: signaturePlanId, changes: info })
  }
  const { mutate: handleEditSignaturePlan, isPending } = useMutationWithFeedback({
    mutationKey: ['create-comercial-plan'],
    mutationFn: editSignaturePlan,
    queryClient: queryClient,
    affectedQueryKey: ['signature-plans'],
  })
  useEffect(() => {
    if (signaturePlan) setInfoHolder(signaturePlan)
  }, [signaturePlan])
  return (
    <div id="new-comercial-plan" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <div className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:w-[70%]">
        <div className="flex h-full flex-col">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <h3 className="text-xl font-bold text-[#353432] dark:text-white ">EDITAR PLANO</h3>
            <button
              onClick={() => closeModal()}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
          {isLoading ? <LoadingComponent /> : null}
          {isError ? <ErrorComponent msg="Erro ao buscar plano de assinatura." /> : null}
          {isSuccess && infoHolder ? (
            <>
              <div className="flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto px-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                <GeneralInformation
                  infoHolder={infoHolder as TSignaturePlan}
                  setInfoHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TSignaturePlan>>}
                />
                <DescriptiveInformation
                  infoHolder={infoHolder as TSignaturePlan}
                  setInfoHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TSignaturePlan>>}
                />
                <ServicesInformation
                  infoHolder={infoHolder as TSignaturePlan}
                  setInfoHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TSignaturePlan>>}
                />
                <PricingInformation
                  infoHolder={infoHolder as TSignaturePlan}
                  setInfoHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TSignaturePlan>>}
                />
              </div>
              <div className="flex w-full items-center justify-end p-2">
                <button
                  disabled={isPending}
                  // @ts-ignore
                  onClick={() => validateAndEditPlan({ info: infoHolder })}
                  className="h-9 whitespace-nowrap rounded bg-green-700 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-green-600 enabled:hover:text-white"
                >
                  ATUALIZAR PLANO
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default EditPlan
