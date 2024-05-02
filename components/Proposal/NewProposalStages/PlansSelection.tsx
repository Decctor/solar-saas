import ProposalSignaturePlan from '@/components/Cards/ProposalSignaturePlan'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingComponent from '@/components/utils/LoadingComponent'
import { combineUniqueProducts, combineUniqueServices } from '@/lib/methods/array-manipulation'
import { useSignaturePlanWithPricingMethod } from '@/utils/queries/signature-plans'
import { TOpportunityDTOWithClient, TOpportunityDTOWithClientAndPartner } from '@/utils/schemas/opportunity.schema'
import { TProposal } from '@/utils/schemas/proposal.schema'
import { TSignaturePlanDTO, TSignaturePlanDTOWithPricingMethod } from '@/utils/schemas/signature-plans.schema'
import { Session } from 'next-auth'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { ImSad } from 'react-icons/im'

type PlansSelectionProps = {
  opportunity: TOpportunityDTOWithClientAndPartner
  signaturePlans?: TSignaturePlanDTOWithPricingMethod[]
  plansLoading: boolean
  plansError: boolean
  infoHolder: TProposal
  setInfoHolder: React.Dispatch<React.SetStateAction<TProposal>>
  moveToNextStage: () => void
  moveToPreviousStage: () => void
  session: Session
}
function PlansSelection({
  opportunity,
  signaturePlans,
  infoHolder,
  plansLoading,
  plansError,
  setInfoHolder,
  moveToNextStage,
  moveToPreviousStage,
  session,
}: PlansSelectionProps) {
  const [selectedPlans, setSelectedPlans] = useState<(TSignaturePlanDTOWithPricingMethod & { valorFinal: number })[]>([])
  function handleProceed() {
    if (selectedPlans.length == 0) return toast.error('Selecione ao menos um plano de assinatura.')
    const proposalPlans: TProposal['planos'] = selectedPlans.map((s) => ({
      id: s._id,
      nome: s.nome,
      valor: s.valorFinal,
      descricao: s.descricao,
      descritivo: s.descritivo,
      intervalo: s.intervalo,
    }))

    // const selectedProducts = selectedPlans.flatMap((p) => p.produtos)
    // const selectedServices = selectedPlans.flatMap((p) => p.servicos)

    // const products = combineUniqueProducts(selectedProducts)
    // const services = combineUniqueServices(selectedServices)

    setInfoHolder((prev) => ({ ...prev, planos: proposalPlans }))
    moveToNextStage()
  }
  return (
    <div className="flex min-h-[400px] w-full flex-col gap-2 py-4">
      <div className="flex w-full items-center justify-center">
        <h1 className="text-center font-medium italic text-[#fead61]">
          Nessa etapa por favor escolha as opções de planos que deseja contemplar na sua proposta.
        </h1>
      </div>
      <div className="flex w-full grow flex-wrap justify-around gap-2 overflow-y-auto px-2 py-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
        {plansLoading ? <LoadingComponent /> : null}
        {plansError ? <ErrorComponent /> : null}
        {signaturePlans ? (
          signaturePlans.length > 0 ? (
            signaturePlans.map((plan, index) => (
              <ProposalSignaturePlan
                index={index}
                selectedIds={selectedPlans.map((s) => s._id)}
                plan={plan}
                opportunity={opportunity}
                proposal={infoHolder}
                handleSelect={(plan) => setSelectedPlans((prev) => [...prev, plan])}
                handleRemove={(index) => {
                  const copy = [...selectedPlans]
                  copy.splice(index, 1)
                  setSelectedPlans(copy)
                }}
                userHasPricingView={session.user.permissoes.precos.visualizar}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-4">
              <ImSad style={{ fontSize: '50px', color: '#fead61' }} />
              <p className="w-full text-center text-sm italic text-gray-600 lg:w-[50%]">
                Oops, parece que não há planos cadastrados considerados os filtros que você selecionou. Contate o setor responsável ou, se desejar, busque os
                demais kits clicando em <strong className="text-[#15599a]">"Mostrar todos os kits"</strong>.
              </p>
            </div>
          )
        ) : null}
      </div>
      <div className="flex w-full items-center justify-between gap-2 px-1">
        <button onClick={() => moveToPreviousStage()} className="rounded p-2 font-bold text-gray-500 duration-300 hover:scale-105">
          Voltar
        </button>
        <button onClick={() => handleProceed()} className="rounded p-2 font-bold hover:bg-black hover:text-white">
          Prosseguir
        </button>
      </div>
    </div>
  )
}

export default PlansSelection
