import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { AnimatePresence, motion } from 'framer-motion'

import NewClientModal from '@/components/Modals/Client/NewClient'
import { Sidebar } from '@/components/Sidebar'
import LoadingComponent from '@/components/utils/LoadingComponent'
import ErrorComponent from '@/components/utils/ErrorComponent'
import ClientCard from '@/components/Clients/ClientCard'
import EditClient from '@/components/Modals/Client/EditClient'
import LoadingPage from '@/components/utils/LoadingPage'

import StatesAndCities from '@/utils/json-files/cities.json'

import { useClients, useClientsByPersonalizedFilters } from '@/utils/queries/clients'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import TextInput from '@/components/Inputs/TextInput'
import MultipleSelectInput from '@/components/Inputs/MultipleSelectInput'
import MultipleSelectInputVirtualized from '@/components/Inputs/MultipleSelectInputVirtualized'
import { useUsers } from '@/utils/queries/users'
import { usePartnersSimplified } from '@/utils/queries/partners'
import dayjs from 'dayjs'
import { getFirstDayOfMonth, getFirstDayOfYear, getLastDayOfMonth, getLastDayOfYear } from '@/utils/methods'
import FilterMenu from '@/components/Clients/FilterMenu'
import ClientsPagination from '@/components/Clients/Pagination'

const currentDate = new Date()
const firstDayOfYear = getFirstDayOfYear(currentDate.toISOString()).toISOString()
const lastDayOfYear = getLastDayOfYear(currentDate.toISOString()).toISOString()

function ClientsPage() {
  const { data: session, status } = useSession({ required: true })
  const [filterMenuIsOpen, setFilterMenuIsOpen] = useState<boolean>(false)
  const [newClientModalIsOpen, setNewClientModalIsOpen] = useState(false)
  const [editClient, setEditClient] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null })

  // Queries and functions
  const [page, setPage] = useState<number>(1)
  const [period, setPeriod] = useState<{ after: string | null; before: string | null }>({ after: null, before: null })
  const [authors, setAuthors] = useState<string[] | null>(null)
  const [partners, setPartners] = useState<string[] | null>(null)
  const { data: authorOptions } = useUsers()
  const { data: partnersOptions } = usePartnersSimplified()
  const { data, isLoading, isError, isSuccess, updateFilters } = useClientsByPersonalizedFilters({
    after: period.after,
    before: period.before,
    authors: authors,
    partners: partners,
    page: page,
  })
  const clients = data?.clients
  const clientsMatched = data?.clientsMatched
  const totalPages = data?.totalPages
  if (status != 'authenticated') return <LoadingPage />
  return (
    <div className="flex h-full flex-col md:flex-row">
      <Sidebar session={session} />
      <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa] p-6">
        <div className="flex w-full flex-col gap-2 border-b border-black pb-2">
          <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
            <div className="flex items-center gap-1">
              {filterMenuIsOpen ? (
                <div className="cursor-pointer text-gray-600 hover:text-blue-400">
                  <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setFilterMenuIsOpen(false)} />
                </div>
              ) : (
                <div className="cursor-pointer text-gray-600 hover:text-blue-400">
                  <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setFilterMenuIsOpen(true)} />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <h1 className="text-xl font-black leading-none tracking-tight md:text-2xl">BANCO DE CLIENTES</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {session?.user.permissoes.clientes.criar ? (
                <button
                  onClick={() => setNewClientModalIsOpen(true)}
                  className="h-9 whitespace-nowrap rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-gray-800 enabled:hover:text-white"
                >
                  CRIAR CLIENTE
                </button>
              ) : null}
            </div>
          </div>
          {filterMenuIsOpen ? (
            <FilterMenu
              updateFilters={updateFilters}
              queryLoading={isLoading}
              session={session}
              selectedAuthors={authors}
              setAuthors={setAuthors}
              selectedPartners={partners}
              setPartners={setPartners}
              authorsOptions={authorOptions}
              partnersOptions={partnersOptions}
              resetSelectedPage={() => setPage(1)}
            />
          ) : null}
        </div>
        <ClientsPagination
          activePage={page}
          totalPages={totalPages || 0}
          selectPage={(x) => setPage(x)}
          queryLoading={isLoading}
          clientsMatched={clientsMatched}
          clientsShowing={clients?.length}
        />
        <div className="flex flex-wrap justify-between gap-2 py-2">
          {isLoading ? <LoadingComponent /> : null}
          {isError ? <ErrorComponent msg="Houve um erro ao buscar clientes." /> : null}
          {isSuccess && clients ? (
            clients.length > 0 ? (
              clients.map((client) => <ClientCard key={client._id} client={client} openModal={(id) => setEditClient({ isOpen: true, id: id })} />)
            ) : (
              <p className="w-full text-center italic text-gray-500">Nenhum cliente encontrado...</p>
            )
          ) : null}
        </div>
      </div>
      {newClientModalIsOpen ? (
        <NewClientModal session={session} partnerId={session.user.idParceiro || ''} closeModal={() => setNewClientModalIsOpen(false)} />
      ) : null}
      {editClient.isOpen && editClient.id ? (
        <EditClient
          clientId={editClient.id}
          session={session}
          partnerId={session.user.idParceiro || ''}
          closeModal={() => setEditClient({ isOpen: false, id: null })}
        />
      ) : null}
    </div>
  )
}

export default ClientsPage
