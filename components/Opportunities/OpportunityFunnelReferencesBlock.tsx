import { useFunnels } from '@/utils/queries/funnels'
import { TFunnelReference, TFunnelReferenceDTO } from '@/utils/schemas/funnel-reference.schema'
import { TFunnelDTO } from '@/utils/schemas/funnel.schema'
import { TOpportunityDTOWithClientAndPartnerAndFunnelReferences } from '@/utils/schemas/opportunity.schema'
import React, { useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { BsFunnelFill } from 'react-icons/bs'
import { MdDelete } from 'react-icons/md'
import SelectInput from '../Inputs/SelectInput'
import { createFunnelReference, deleteFunnelReference, updateFunnelReference } from '@/utils/mutations/funnel-references'
import { useMutationWithFeedback } from '@/utils/mutations/general-hook'
import { useQueryClient } from '@tanstack/react-query'
import { Session } from 'next-auth'
import toast from 'react-hot-toast'
import OpportunityFunnelReference from '../Cards/OpportunityFunnelReference'

type GetFunnelInfoParams = {
  funnelId: TFunnelReferenceDTO['idFunil']
  funnels: TFunnelDTO[] | undefined
}
function getFunnelInfo({ funnelId, funnels }: GetFunnelInfoParams) {
  if (!funnels) return { funnelLabel: null, funnelStageLabel: null, stageOptions: [] }

  const funnel = funnels.find((f) => f._id == funnelId)
  if (!funnel) return { funnelLabel: null, funnelStageLabel: null, stageOptions: [] }
  const funnelLabel = funnel.nome

  const stageOptions = funnel.etapas.map((e) => ({ id: e.id, value: e.id.toString(), label: e.nome }))

  return { funnelLabel, stageOptions }
}

type GetNewFunnelReferenceInfoParams = {
  funnelReferences: TFunnelReferenceDTO[]
  funnels: TFunnelDTO[] | undefined
}
function getNewFunnelReferenceOptions({ funnelReferences, funnels }: GetNewFunnelReferenceInfoParams) {
  if (!funnels) return null
  // Filtering funnels to those which are not yet present in the opportunity s funnel references
  const options = funnels.filter((f) => !funnelReferences.map((fr) => fr.idFunil).includes(f._id))
  if (options.length < 1) return null
  return options
}

type OpportunityFunnelReferencesBlockProps = {
  opportunity: TOpportunityDTOWithClientAndPartnerAndFunnelReferences
  setOpportunity: React.Dispatch<React.SetStateAction<TOpportunityDTOWithClientAndPartnerAndFunnelReferences>>
}
function OpportunityFunnelReferencesBlock({ opportunity, setOpportunity }: OpportunityFunnelReferencesBlockProps) {
  const queryClient = useQueryClient()
  const { data: funnels } = useFunnels()

  async function updateOpportunityFunnelReference({ id, newStageId }: { id: string; newStageId: string }) {
    try {
      const response = await updateFunnelReference({ funnelReferenceId: id, newStageId: newStageId })
      return 'Referência de funil atualizada com sucesso !'
    } catch (error) {
      throw error
    }
  }
  const { mutate: handleUpdateOpportunityFunnelReference, isPending } = useMutationWithFeedback({
    mutationKey: ['update-funnel-reference'],
    mutationFn: updateOpportunityFunnelReference,
    queryClient: queryClient,
    affectedQueryKey: ['opportunity-by-id', opportunity._id],
  })

  const newFunnelReferencesOptions = getNewFunnelReferenceOptions({ funnelReferences: opportunity.referenciasFunil, funnels })
  const [newFunnelReferenceMenuIsOpen, setNewFunnelReferenceMenuIsOpen] = useState<boolean>(false)
  const [newFunnelReference, setNewFunnelReference] = useState<TFunnelReference>({
    idParceiro: opportunity.idParceiro || '',
    idOportunidade: opportunity._id,
    idFunil: '',
    idEstagioFunil: '',
    estagios: {},
    dataInsercao: new Date().toISOString(),
  })
  async function addNewFunnelReference(info: TFunnelReference) {
    try {
      const response = await createFunnelReference({ info })

      return 'Funil adicionado com sucesso !'
    } catch (error) {
      throw error
    }
  }
  const { mutate: handleAddNewOpportunityFunnelReference, isPending: addNewFunnelReferencePending } = useMutationWithFeedback({
    mutationKey: ['add-new-funnel-reference'],
    mutationFn: addNewFunnelReference,
    queryClient: queryClient,
    affectedQueryKey: ['opportunity-by-id', opportunity._id],
  })

  async function removeFunnelReference({
    funnelReferenceToRemoveIndex,
    opportunityFunnelReferences,
  }: {
    funnelReferenceToRemoveIndex: number
    opportunityFunnelReferences: TFunnelReferenceDTO[]
  }) {
    try {
      if (opportunityFunnelReferences.length == 1) return toast.error('Não é possível remover a única referência de funil da oportundiade.')

      const funnelReferenceId = opportunityFunnelReferences[funnelReferenceToRemoveIndex]._id
      const response = await deleteFunnelReference({ id: funnelReferenceId })
      const newReferences = [...opportunity.referenciasFunil]
      newReferences.splice(funnelReferenceToRemoveIndex, 1)
      setOpportunity((prev) => ({ ...prev, referenciasFunil: newReferences }))
      return response
    } catch (error) {
      throw error
    }
  }
  const { mutate: handleRemoveFunnelReference, isPending: removeFunnelReferencePending } = useMutationWithFeedback({
    mutationKey: ['remove-funnel-reference'],
    mutationFn: removeFunnelReference,
    queryClient: queryClient,
    affectedQueryKey: ['opportunity-by-id', opportunity._id],
  })
  return (
    <div className=" flex w-full flex-col gap-2">
      <h1 className="w-full rounded-md bg-[#fead41] p-1 text-center text-sm font-medium text-white">FUNIS</h1>
      <div className="flex flex-col gap-2">
        {opportunity.referenciasFunil.map((funnelReference, index) => (
          <OpportunityFunnelReference
            key={funnelReference._id}
            reference={funnelReference}
            referenceIndex={index}
            funnels={funnels}
            opportunity={opportunity}
            setOpportunity={setOpportunity}
          />
        ))}
      </div>
      {!!newFunnelReferencesOptions ? (
        <>
          <div className="flex w-full items-center justify-end">
            <button
              onClick={() => setNewFunnelReferenceMenuIsOpen((prev) => !prev)}
              className={`${
                newFunnelReferenceMenuIsOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              } rounded  p-1 px-4 text-xs font-medium text-white duration-300 ease-in-out `}
            >
              {newFunnelReferenceMenuIsOpen ? 'FECHAR' : 'ADICIONAR FUNIL'}
            </button>
          </div>
          {newFunnelReferenceMenuIsOpen ? (
            <div className="flex w-full flex-col gap-2">
              <div className="flex w-full gap-2">
                <div className="w-2/3">
                  <SelectInput
                    label="FUNIL"
                    value={newFunnelReference.idFunil}
                    options={newFunnelReferencesOptions?.map((funnel) => ({
                      id: funnel._id,
                      label: funnel.nome,
                      value: funnel._id,
                    }))}
                    handleChange={(value) => {
                      const selectedFunnel = newFunnelReferencesOptions.find((f) => f._id == value)
                      const firstStage = selectedFunnel?.etapas[0].id || ''
                      setNewFunnelReference((prev) => ({ ...prev, idFunil: value, idEstagioFunil: firstStage.toString() }))
                    }}
                    selectedItemLabel="NÃO DEFINIDO"
                    onReset={() => setNewFunnelReference((prev) => ({ ...prev, idFunil: '', idEstagioFunil: '' }))}
                    width="100%"
                  />
                </div>
                <div className="w-1/3">
                  <SelectInput
                    label="ETAPA"
                    value={newFunnelReference.idEstagioFunil}
                    options={getFunnelInfo({ funnelId: newFunnelReference.idFunil, funnels: funnels }).stageOptions}
                    handleChange={(value) => setNewFunnelReference((prev) => ({ ...prev, idEstagioFunil: value.toString() }))}
                    selectedItemLabel="NÃO DEFINIDO"
                    onReset={() => setNewFunnelReference((prev) => ({ ...prev, idEstagioFunil: '' }))}
                    width="100%"
                  />
                </div>
              </div>
              <div className="flex w-full items-center justify-end">
                <button
                  disabled={addNewFunnelReferencePending}
                  // @ts-ignore
                  onClick={() => handleAddNewOpportunityFunnelReference(newFunnelReference)}
                  className={
                    'rounded bg-green-500 p-1 px-4 text-xs font-medium text-white duration-300 ease-in-out disabled:bg-gray-500 enabled:hover:bg-green-600'
                  }
                >
                  ADICIONAR
                </button>
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}

export default OpportunityFunnelReferencesBlock
