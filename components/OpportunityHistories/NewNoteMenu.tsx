import { useMutationWithFeedback } from '@/utils/mutations/general-hook'
import { createOpportunityHistory } from '@/utils/mutations/opportunity-history'
import { TOpportunityHistory } from '@/utils/schemas/opportunity-history.schema'
import { useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { Session } from 'next-auth'
import React, { useState } from 'react'

const variants = {
  hidden: {
    opacity: 0.2,
    transition: {
      duration: 0.8, // Adjust the duration as needed
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8, // Adjust the duration as needed
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.01, // Adjust the duration as needed
    },
  },
}

type NewOpportunityNoteMenuProps = {
  session: Session
  opportunity: { id: string; nome: string; identificador: string }
  closeMenu: () => void
}
function NewOpportunityNoteMenu({ session, opportunity, closeMenu }: NewOpportunityNoteMenuProps) {
  const queryClient = useQueryClient()
  const [newNoteHolder, setNewNoteHolder] = useState<TOpportunityHistory>({
    oportunidade: opportunity,
    idParceiro: session.user.idParceiro || '',
    categoria: 'ANOTAÇÃO',
    conteudo: '',
    autor: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },
    dataInsercao: new Date().toISOString(),
  })
  const { mutate: handleCreateOpportunityHistory, isPending } = useMutationWithFeedback({
    mutationKey: ['create-opportunity-history'],
    mutationFn: createOpportunityHistory,
    queryClient: queryClient,
    affectedQueryKey: [],
  })
  return (
    <AnimatePresence>
      <motion.div variants={variants} initial="hidden" animate="visible" exit="exit" className="flex w-full flex-col gap-2 p-2">
        <div className="flex w-full flex-col gap-1">
          <label htmlFor={'opportunity-note'} className={'font-sans font-bold  text-[#353432]'}>
            ANOTAÇÃO
          </label>
          <textarea
            id={'opportunity-note'}
            placeholder="Preencha aqui uma anotação sobre a oportunidade..."
            value={newNoteHolder.conteudo}
            onChange={(e) => {
              setNewNoteHolder((prev) => ({ ...prev, conteudo: e.target.value }))
            }}
            className="min-h-[80px] w-full resize-none rounded-md border border-gray-200  p-3 text-center text-sm shadow-sm outline-none"
          />
        </div>
        <div className="flex w-full items-center justify-between">
          <button
            onClick={() => closeMenu()}
            className="whitespace-nowrap rounded bg-gray-500 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-gray-800 enabled:hover:text-white"
          >
            FECHAR
          </button>
          <button
            disabled={isPending}
            // @ts-ignore
            onClick={() => handleCreateOpportunityHistory({ info: newNoteHolder })}
            className="whitespace-nowrap rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-gray-800 enabled:hover:text-white"
          >
            CRIAR ANOTAÇÃO
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default NewOpportunityNoteMenu
