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

import { useClients } from '@/utils/queries/clients'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import TextInput from '@/components/Inputs/TextInput'
import MultipleSelectInput from '@/components/Inputs/MultipleSelectInput'
import MultipleSelectInputVirtualized from '@/components/Inputs/MultipleSelectInputVirtualized'

const AllCities = StatesAndCities.flatMap((s) => s.cidades).map((c, index) => ({ id: index + 1, label: c, value: c }))

function ClientsPage() {
  const { data: session, status } = useSession({ required: true })
  // States
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState<boolean>(false)
  const [newClientModalIsOpen, setNewClientModalIsOpen] = useState(false)
  const [editClient, setEditClient] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null })

  // Queries and functions
  const { data: clients, isLoading, isError, isSuccess, filters, setFilters } = useClients({ author: null })

  console.log(AllCities)
  if (status != 'authenticated') return <LoadingPage />
  return (
    <div className="flex h-full flex-col md:flex-row">
      <Sidebar session={session} />
      <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa] p-6">
        <div className="flex w-full flex-col gap-2 border-b border-black pb-2">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-black leading-none tracking-tight md:text-2xl">BANCO DE CLIENTES</h1>
              <p className="text-sm leading-none tracking-tight text-gray-500">{clients?.length || '...'} clientes cadastrados</p>
            </div>
            {dropdownMenuVisible ? (
              <div className="cursor-pointer text-gray-600 hover:text-blue-400">
                <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(false)} />
              </div>
            ) : (
              <div className="cursor-pointer text-gray-600 hover:text-blue-400">
                <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(true)} />
              </div>
            )}
          </div>
          <div className="flex w-full items-center justify-end">
            <button
              onClick={() => setNewClientModalIsOpen(true)}
              className="h-9 whitespace-nowrap rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-gray-800 enabled:hover:text-white"
            >
              CRIAR CLIENTE
            </button>
          </div>
          <AnimatePresence>
            {dropdownMenuVisible ? (
              <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
                <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                  <TextInput
                    label="NOME DO CLIENTE"
                    placeholder="Filtre pelo nome do cliente..."
                    value={filters.search}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
                  />
                  <MultipleSelectInputVirtualized
                    label="CIDADE"
                    options={AllCities}
                    selected={filters.city}
                    selectedItemLabel="NÃO DEFINIDO"
                    handleChange={(value) => setFilters((prev) => ({ ...prev, city: value as string[] }))}
                    onReset={() => setFilters((prev) => ({ ...prev, city: [] }))}
                  />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        {isLoading ? <LoadingComponent /> : null}
        {isError ? <ErrorComponent msg="Houve um erro ao buscar clientes." /> : null}
        {isSuccess ? (
          clients.length > 0 ? (
            <div className="flex w-full flex-wrap items-start justify-around gap-3 py-2">
              {clients.map((client) => (
                <ClientCard key={client._id} client={client} openModal={(id) => setEditClient({ isOpen: true, id: id })} />
              ))}
            </div>
          ) : (
            <p className="w-full text-center italic text-gray-500">Nenhum cliente encontrado...</p>
          )
        ) : null}
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
