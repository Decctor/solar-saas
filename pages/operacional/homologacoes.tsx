import HomologationCard from '@/components/Cards/Homologation'
import ControlHomologation from '@/components/Modals/Homologation/ControlHomologation'
import { Sidebar } from '@/components/Sidebar'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingComponent from '@/components/utils/LoadingComponent'
import LoadingPage from '@/components/utils/LoadingPage'
import { useHomologations } from '@/utils/queries/homologations'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'

function HomologationsControlPage() {
  const { data: session, status } = useSession({ required: true })
  const { data: homologations, isLoading, isError, isSuccess, filters, setFilters } = useHomologations()
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState<boolean>(false)
  const [editModal, setEditModal] = useState<{ id: string | null; isOpen: boolean }>({ id: null, isOpen: false })

  if (status != 'authenticated') return <LoadingPage />
  return (
    <div className="flex h-full flex-col md:flex-row">
      <Sidebar session={session} />
      <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#ffffff] p-6">
        <div className="flex flex-col items-center border-b border-[#000] pb-2">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-3xl font-black leading-none tracking-tight md:text-2xl">CONTROLE DE HOMOLOGAÇÕES</h1>
              <p className="tracking-tight text-gray-500">{homologations?.length || '...'} homologações contabilizadas...</p>
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
          {/* <AnimatePresence>
            {dropdownMenuVisible ? (
              <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
                <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                  <TextInput
                    label="NOME DA ANÁLISE"
                    placeholder="Filtre pelo nome da análise..."
                    value={filters.search}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
                  />
                  <MultipleSelectInput
                    label={'STATUS'}
                    selectedItemLabel={'NÃO DEFINIDO'}
                    selected={filters.status}
                    options={TechnicalAnalysisStatus}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, status: value as string[] }))}
                    onReset={() => setFilters((prev) => ({ ...prev, status: [] }))}
                  />
                  <MultipleSelectInput
                    label={'COMPLEXIDADE'}
                    selectedItemLabel={'NÃO DEFINIDO'}
                    selected={filters.complexity}
                    options={TechnicalAnalysisStatus}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, complexity: value as string[] }))}
                    onReset={() => setFilters((prev) => ({ ...prev, complexity: [] }))}
                  />
                  <SelectWithImages
                    label="ANALISTA"
                    value={filters.analyst}
                    options={analysts?.map((a) => ({ id: a._id, label: a.nome, value: a._id, url: a.avatar_url || undefined })) || []}
                    selectedItemLabel="NÃO DEFINIDO"
                    handleChange={(value) => setFilters((prev) => ({ ...prev, analyst: value }))}
                    onReset={() => setFilters((prev) => ({ ...prev, analyst: null }))}
                  />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence> */}
        </div>
        <div className="flex flex-wrap justify-between gap-2 py-2">
          {isLoading ? <LoadingComponent /> : null}
          {isError ? <ErrorComponent msg="Erro ao buscar homologações." /> : null}
          {isSuccess ? (
            homologations.length > 0 ? (
              homologations.map((homologation) => (
                <HomologationCard key={homologation._id} homologation={homologation} openModal={(id) => setEditModal({ id: id, isOpen: true })} />
              ))
            ) : (
              <p className="flex w-full grow items-center justify-center py-2 text-center font-medium italic tracking-tight text-gray-500">
                Não foram encontradas homologações...
              </p>
            )
          ) : null}
        </div>
      </div>
      {editModal.isOpen && editModal.id ? (
        <ControlHomologation session={session} homologationId={editModal.id} closeModal={() => setEditModal({ id: null, isOpen: false })} />
      ) : null}
    </div>
  )
}

export default HomologationsControlPage
