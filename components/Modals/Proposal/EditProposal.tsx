import CheckboxInput from '@/components/Inputs/CheckboxInput'
import TextInput from '@/components/Inputs/TextInput'
import AddPricingItem from '@/components/Proposal/Blocks/AddPricingItem'
import EditFinalPrice from '@/components/Proposal/Blocks/EditFinalPrice'
import PricingTable from '@/components/Proposal/Blocks/PricingTable'
import { handleDownload } from '@/lib/methods/download'

import { formatToMoney } from '@/lib/methods/formatting'
import { updateProposalUpdateRecord } from '@/repositories/proposal-update-records/mutations'
import { useMutationWithFeedback } from '@/utils/mutations/general-hook'
import { createProposalUpdateRecord } from '@/utils/mutations/proposal-update-records'
import { editProposal, editProposalPersonalized } from '@/utils/mutations/proposals'
import { getPricingTotal } from '@/utils/pricing/methods'
import { TProposalUpdateRecord } from '@/utils/schemas/proposal-update-records.schema'
import { TPricingItem, TProposalDTO, TProposalDTOWithOpportunityAndClient } from '@/utils/schemas/proposal.schema'
import { useQueryClient } from '@tanstack/react-query'
import { Session } from 'next-auth'
import React, { useState } from 'react'
import { AiFillEdit } from 'react-icons/ai'
import { MdAdd } from 'react-icons/md'
import { VscChromeClose } from 'react-icons/vsc'

type EditProposalProps = {
  closeModal: () => void
  info: TProposalDTOWithOpportunityAndClient
  userHasPricingEditPermission: boolean
  userHasPricingViewPermission: boolean
  session: Session
}
function EditProposal({ closeModal, info, userHasPricingViewPermission, userHasPricingEditPermission, session }: EditProposalProps) {
  const queryClient = useQueryClient()
  const alterationLimit = userHasPricingEditPermission ? undefined : 0.02

  // Creating a flag for the need of updating the defined plan price, if
  // there is one. So, if there is only one plan to the proposal, it is the defined one.
  const updatePlanPrice = info.planos.length == 1

  const [proposalName, setProposalName] = useState(info.nome)
  const [regenerateFile, setRegenerateFile] = useState<boolean>(false)
  const [pricing, setPricing] = useState<TPricingItem[]>(info.precificacao)
  const [addNewPriceItemModalIsOpen, setAddNewPriceItemModalIsOpen] = useState<boolean>(false)
  const [editFinalPriceModalIsOpen, setEditFinalPriceModalIsOpen] = useState<boolean>(false)
  const pricingTotal = getPricingTotal({ pricing: pricing })

  async function handleProposalUpdate({
    newName,
    newPricing,
    previousName,
    previousPricing,
  }: {
    newName: string
    newPricing: TPricingItem[]
    previousName: string
    previousPricing: TPricingItem[]
  }) {
    try {
      // Creating update registry
      const previousTotal = getPricingTotal({ pricing: previousPricing })
      const newTotal = getPricingTotal({ pricing: newPricing })

      const previousProposal: Partial<TProposalDTO> = { nome: previousName, precificacao: previousPricing, valor: previousTotal }
      const newProposal: Partial<TProposalDTO> = { nome: newName, precificacao: newPricing, valor: newTotal }

      const record: TProposalUpdateRecord = {
        idParceiro: info.idParceiro,
        oportunidade: {
          id: info.oportunidade.id,
          nome: info.oportunidade.nome,
        },
        proposta: {
          id: info._id,
          nome: info.nome,
        },
        anterior: previousProposal,
        novo: newProposal,
        autor: {
          id: session.user.id,
          nome: session.user.nome,
          avatar_url: session.user.avatar_url,
        },
        dataInsercao: new Date().toISOString(),
      }
      await createProposalUpdateRecord({ info: record })

      const proposalPlans: TProposalDTO['planos'] = updatePlanPrice ? [{ ...info.planos[0], valor: newTotal }] : info.planos

      const response = await editProposalPersonalized({
        id: info._id,
        proposal: { ...info, nome: newName, planos: proposalPlans, precificacao: newPricing, valor: newTotal },
        opportunity: info.oportunidadeDados,
        client: info.clienteDados,
        regenerateFile: regenerateFile,
        idAnvil: info.idModeloAnvil,
      })

      const fileName = info.nome
      const fileUrl = response.data?.fileUrl
      if (fileUrl) await handleDownload({ fileName, fileUrl })

      if (typeof response.message != 'string') return 'Proposta atualizado com sucesso !'
      return response.message as string
    } catch (error) {
      throw error
    }
  }

  const { mutate: handleUpdate, isPending } = useMutationWithFeedback({
    mutationKey: ['update-proposal', info._id],
    mutationFn: handleProposalUpdate,
    queryClient: queryClient,
    affectedQueryKey: ['proposal-update-records', info._id],
    callbackFn: async () => await queryClient.invalidateQueries({ queryKey: ['proposal-by-id', info._id] }),
  })
  return (
    <div id="edit-proposal" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <div className="fixed left-[50%] top-[50%] z-[100] flex h-fit max-h-[90%] w-[90%] translate-x-[-50%] translate-y-[-50%] flex-col rounded-md bg-[#fff] p-[10px] lg:w-[90%]">
        <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
          <h3 className="text-xl font-bold text-[#353432] dark:text-white ">EDITAR PROPOSTA</h3>
          <button
            onClick={() => closeModal()}
            type="button"
            className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
          >
            <VscChromeClose style={{ color: 'red' }} />
          </button>
        </div>
        <div className="flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto px-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
          <TextInput
            label="NOME DA PROPOSTA"
            placeholder="Preencha o nome da proposta..."
            value={proposalName}
            handleChange={(value) => setProposalName(value)}
            width="100%"
          />
          <PricingTable
            opportunity={info.oportunidadeDados}
            proposal={info}
            pricing={pricing}
            setPricing={setPricing}
            userHasPricingEditPermission={userHasPricingEditPermission}
            userHasPricingViewPermission={userHasPricingViewPermission}
          />
          {userHasPricingEditPermission ? (
            <div className="flex w-full items-center justify-center">
              <button
                onClick={() => setAddNewPriceItemModalIsOpen(true)}
                className="flex items-center gap-2 rounded bg-orange-600 px-4 py-2 text-white duration-100 ease-in-out hover:bg-orange-700"
              >
                <MdAdd />
                <h1 className="text-xs font-bold">NOVO CUSTO</h1>
              </button>
            </div>
          ) : null}
          <div className="flex w-full items-center justify-center gap-2 py-1">
            <div className="flex gap-2 rounded border border-gray-600 px-2 py-1 font-medium text-gray-600">
              <p>{formatToMoney(pricingTotal)}</p>

              {userHasPricingEditPermission ? (
                <button onClick={() => setEditFinalPriceModalIsOpen((prev) => !prev)} className="text-md text-gray-400 hover:text-[#fead61]">
                  <AiFillEdit />
                </button>
              ) : null}
            </div>
          </div>
          <div className="flex w-full items-center justify-end gap-2 p-2">
            {info.idModeloAnvil ? (
              <div className="w-fit">
                <CheckboxInput
                  labelFalse="GERAR NOVO DOCUMENTO"
                  labelTrue="GERAR NOVO DOCUMENTO"
                  checked={regenerateFile}
                  handleChange={(value) => setRegenerateFile(value)}
                />
              </div>
            ) : null}
            <button
              disabled={isPending}
              // @ts-ignore
              onClick={() => handleUpdate({ previousName: info.nome, previousPricing: info.precificacao, newName: proposalName, newPricing: pricing })}
              className="h-9 whitespace-nowrap rounded bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-blue-600 enabled:hover:text-white"
            >
              ATUALIZAR PROPOSTA
            </button>
          </div>
        </div>
      </div>
      {addNewPriceItemModalIsOpen ? (
        <AddPricingItem pricing={pricing} setPricing={setPricing} proposal={info} closeModal={() => setAddNewPriceItemModalIsOpen(false)} />
      ) : null}
      {editFinalPriceModalIsOpen ? (
        <EditFinalPrice pricing={pricing} setPricing={setPricing} alterationLimit={alterationLimit} closeModal={() => setEditFinalPriceModalIsOpen(false)} />
      ) : null}
    </div>
  )
}

export default EditProposal
