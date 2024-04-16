import NewKit from '@/components/Modals/Kit/NewKit'
import { Sidebar } from '@/components/Sidebar'
import LoadingComponent from '@/components/utils/LoadingComponent'

import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

import Modules from '../../utils/json-files/pvmodules.json'

import LoadingPage from '@/components/utils/LoadingPage'
import NotAuthorizedPage from '@/components/utils/NotAuthorizedPage'
import Kit from '@/components/Cards/Kit'

import EditKit from '@/components/Modals/Kit/EditKit'
import FilterMenu from '@/components/Kits/FilterMenu'
import { useKits } from '@/utils/queries/kits'
import { TKit } from '@/utils/schemas/kits.schema'
import ErrorComponent from '@/components/utils/ErrorComponent'

type Filters = {
  suppliers: string[]
  topology: string[]
  search: string
  order: null | 'ASC' | 'DESC'
}

type TEditModal = {
  isOpen: boolean
  info: TKit | null
}
function Kits() {
  const { data: session, status } = useSession({ required: true })

  const { data: kits = [], status: kitsStatus, isSuccess, isLoading, isError, filters, setFilters } = useKits()

  const [editModal, setEditModal] = useState<TEditModal>({
    isOpen: false,
    info: null,
  })
  const [editModalIsOpen, setEditModalIsOpen] = useState(false)
  const [editKitInfo, setEditKitInfo] = useState<TKit | null>()

  const [newKitModalIsOpen, setNewKitModalIsOpen] = useState(false)

  if (status != 'authenticated') return <LoadingPage />
  if (session.user.permissoes.kits.visualizar)
    return (
      <div className="flex h-full flex-col md:flex-row">
        <Sidebar session={session} />
        <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa] p-6">
          <div className="flex flex-col items-center border-b border-[#000] pb-2 ">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="flex font-Raleway text-2xl font-black text-black">KITS</h1>
                <h1 className="flex font-Raleway text-2xl font-bold text-[#fead61]">({kits ? kits.length : 0})</h1>
              </div>

              {session?.user.permissoes.kits.editar ? (
                <button onClick={() => setNewKitModalIsOpen(true)} className="rounded bg-[#15599a] p-2 text-sm font-bold text-white">
                  NOVO KIT
                </button>
              ) : null}
            </div>
            <FilterMenu setFilters={setFilters} filters={filters} />
          </div>
          <div className="flex flex-wrap justify-between  gap-2 py-2">
            {isLoading ? <LoadingComponent /> : null}
            {isError ? <ErrorComponent msg="Oops, houve um erro ao buscar kits..." /> : null}
            {isSuccess
              ? kits.map((kit, index) => (
                  <Kit
                    key={index}
                    kit={kit}
                    userHasEditPermission={session.user?.permissoes.kits.editar}
                    handleClick={(info) => {
                      if (!session.user?.permissoes.kits.editar) return
                      return setEditModal({ isOpen: true, info: info })
                    }}
                  />
                ))
              : null}
            {kitsStatus == 'error' ? (
              <div className="flex w-full grow items-center justify-center">
                <p className="font-medium text-red-400">Parece que ocorreu um erro no carregamento dos kits. Por favor, tente novamente mais tarde.</p>
              </div>
            ) : null}
          </div>
        </div>
        {newKitModalIsOpen ? <NewKit isOpen={newKitModalIsOpen} session={session} closeModal={() => setNewKitModalIsOpen(false)} /> : null}
        {editModal.isOpen && editModal.info ? (
          <EditKit info={editModal.info} session={session} closeModal={() => setEditModal({ isOpen: false, info: null })} />
        ) : null}
      </div>
    )
  if (!session.user.permissoes.kits.visualizar) return <NotAuthorizedPage session={session} />
}
export default Kits
