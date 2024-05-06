import TechnicalAnalysisCard from '@/components/Cards/TechnicalAnalysisCard'
import MultipleSelectInput from '@/components/Inputs/MultipleSelectInput'
import SelectWithImages from '@/components/Inputs/SelectWithImages'
import TextInput from '@/components/Inputs/TextInput'
import ControlTechnicalAnalysis from '@/components/Modals/TechnicalAnalysis/ControlTechnicalAnalysis'
import { Sidebar } from '@/components/Sidebar'
import FilterMenu from '@/components/TechnicalAnalysis/FilterMenu'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingComponent from '@/components/utils/LoadingComponent'
import LoadingPage from '@/components/utils/LoadingPage'
import { getErrorMessage } from '@/lib/methods/errors'
import { useTechnicalAnalysis } from '@/utils/queries/technical-analysis'
import { useTechnicalAnalysts } from '@/utils/queries/users'
import { TechnicalAnalysisStatus } from '@/utils/select-options'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'

function TechnicalAnalysisPage() {
  const { data: session, status } = useSession({ required: true })
  const { data: analysis, isLoading, isSuccess, isError, error, filters, setFilters } = useTechnicalAnalysis()
  const { data: analysts } = useTechnicalAnalysts()
  const [filterMenuIsOpen, setFilterMenuIsOpen] = useState<boolean>(false)
  const [editModal, setEditModal] = useState<{ id: string | null; isOpen: boolean }>({ id: null, isOpen: false })
  if (status != 'authenticated') return <LoadingPage />
  return (
    <div className="flex h-full flex-col md:flex-row">
      <Sidebar session={session} />
      <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa] p-6">
        <div className="flex flex-col items-center border-b border-[#000] pb-2">
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
                <h1 className="text-xl font-black leading-none tracking-tight md:text-2xl">CONTROLE DE ANÁLISES TÉCNICAS</h1>
                <p className="text-sm leading-none tracking-tight text-gray-500">
                  {analysis ? (analysis.length > 0 ? `${analysis.length} análises contabilizadas` : `${analysis.length} análise contabilizada`) : '...'}
                </p>
              </div>
            </div>
          </div>
          {filterMenuIsOpen ? <FilterMenu filters={filters} setFilters={setFilters} analysts={analysts || []} /> : null}
        </div>
        <div className="flex flex-wrap justify-between gap-2 py-2">
          {isLoading ? <LoadingComponent /> : null}
          {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
          {isSuccess
            ? analysis.map((analysisInfo) => (
                <TechnicalAnalysisCard
                  analysis={analysisInfo}
                  handleClick={(id) => setEditModal({ id: id, isOpen: true })}
                  userHasEditPermission={session.user.permissoes.analisesTecnicas.editar}
                />
              ))
            : null}
        </div>
      </div>
      {editModal.isOpen && editModal.id ? (
        <ControlTechnicalAnalysis analysisId={editModal.id} closeModal={() => setEditModal({ id: null, isOpen: false })} session={session} />
      ) : null}
    </div>
  )
}

export default TechnicalAnalysisPage
