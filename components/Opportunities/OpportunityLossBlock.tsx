import React, { useState } from 'react'
import DropdownSelect from '../Inputs/DropdownSelect'
import { leadLoseJustification } from '@/utils/constants'
import { VscChromeClose } from 'react-icons/vsc'
import { TiCancel } from 'react-icons/ti'
import { toast } from 'react-hot-toast'
import axios, { AxiosError } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { AiFillCloseCircle } from 'react-icons/ai'
import dayjs from 'dayjs'
import { RxReload } from 'react-icons/rx'
import { useMutationWithFeedback } from '@/utils/mutations/general-hook'
import { updateOpportunity } from '@/utils/mutations/opportunities'
import { updateRDOpportunity } from '@/utils/mutations/rd-opportunities'

type LoseProjectProps = {
  opportunityId: string
  opportunityIsLost: boolean
  opportunityLossDate?: string | null
  opportunityEmail?: string | null
  idMarketing?: string | null
}
type ReactivationBlockProps = {
  lossDate: string
}
function OpportunityLossBlock({ opportunityId, opportunityIsLost, opportunityLossDate, opportunityEmail, idMarketing }: LoseProjectProps) {
  const queryClient = useQueryClient()
  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const [cause, setCause] = useState<string | null>(null)
  const { mutate: handleOpportunityUpdate } = useMutationWithFeedback({
    mutationKey: ['update-opportunity', opportunityId],
    mutationFn: updateOpportunity,
    queryClient: queryClient,
    affectedQueryKey: ['opportunity-by-id', opportunityId],
  })
  async function handleLoseProject() {
    // In case opportunity came from RD station TODO
    if (idMarketing && opportunityEmail)
      await updateRDOpportunity({ operation: 'OPPORTUNITY_LOST', email: opportunityEmail || '', reason: cause || '' })

    // @ts-ignore
    handleOpportunityUpdate({ id: opportunityId, changes: { 'perda.data': new Date().toISOString(), 'perda.descricaoMotivo': cause } })
  }
  function handleReactiveProject() {
    // @ts-ignore
    handleOpportunityUpdate({ id: opportunityId, changes: { 'perda.data': null, 'perda.descricaoMotivo': null } })
  }

  function ReactivationBlock({ lossDate }: ReactivationBlockProps) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex w-[80%] min-w-[200px] flex-col items-center rounded-md  bg-red-500 p-2 shadow-md lg:w-fit">
          <h1 className="text-center font-Raleway text-xs font-bold text-black">PERDIDO</h1>

          <div className="flex items-center justify-center gap-2">
            <AiFillCloseCircle style={{ color: '#000', fontSize: '15px' }} />
            <p className="text-center text-xs font-bold text-black">{lossDate ? dayjs(lossDate).add(3, 'hours').format('DD/MM/YYYY') : '-'}</p>
          </div>
        </div>
        <button
          onClick={() => handleReactiveProject()}
          className="flex h-full cursor-pointer flex-col items-center rounded-md bg-cyan-300 p-2 text-black shadow-md duration-300 ease-in-out hover:bg-cyan-500 hover:text-white"
        >
          <h1 className="text-center font-Raleway text-xs font-bold ">RESETAR</h1>
          <RxReload size={'15px'} />
        </button>
      </div>
    )
  }
  function LoseProjectBlock() {
    return (
      <div className="flex w-fit items-center justify-center">
        {menuIsOpen ? (
          <div className="flex w-[450ox] items-center gap-1">
            <div className="grow">
              <DropdownSelect
                categoryName="MOTIVO DA PERDA"
                value={cause ? Object.keys(leadLoseJustification).indexOf(cause) + 1 : null}
                options={Object.keys(leadLoseJustification).map((justification, index) => {
                  return {
                    id: index + 1,
                    label: justification,
                    value: justification,
                  }
                })}
                onChange={(value) => {
                  setCause(value.value)
                }}
                onReset={() => {
                  setCause(null)
                }}
                selectedItemLabel="NÃO DEFINIDO"
                width="250px"
              />
            </div>
            <button
              onClick={() => {
                if (cause) return handleLoseProject()
                else return toast.error('Por favor, preencha o motivo da perda.')
              }}
              className="h-[40px] rounded-md bg-red-300 p-1 text-white shadow-sm hover:bg-red-500"
            >
              <VscChromeClose />
            </button>
            <button onClick={() => setMenuIsOpen(false)} className="h-[40px] rounded-md bg-gray-300 p-1 text-white shadow-sm hover:bg-gray-500">
              <TiCancel />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setMenuIsOpen(true)}
            className="flex w-fit min-w-[250px] items-center justify-center gap-2  rounded bg-red-300 p-2 font-medium text-white duration-300 hover:scale-[1.02] hover:bg-red-500"
          >
            <p className="text-xs">PERDER PROJETO</p>
            {/* <VscChromeClose /> */}
          </button>
        )}
      </div>
    )
  }
  if (!opportunityLossDate) return <LoseProjectBlock />
  else return <ReactivationBlock lossDate={opportunityLossDate} />
}

export default OpportunityLossBlock
