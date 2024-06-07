import { Sidebar } from '@/components/Sidebar'
import LoadingPage from '@/components/utils/LoadingPage'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'

function ComercialSectorMainPage() {
  const { data: session, status } = useSession()
  const [filterMenuIsOpen, setFilterMenuIsOpen] = useState<boolean>(false)
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
                <h1 className="text-xl font-black leading-none tracking-tight md:text-2xl">CONTROLE DE PROJETOS NO ESTÁGIO COMERCIAL</h1>
              </div>
            </div>
          </div>
          {/* {filterMenuIsOpen ? <FilterMenu filters={filters} setFilters={setFilters} /> : null} */}
        </div>
        <div className="flex flex-wrap justify-between gap-2 py-2"></div>
      </div>
    </div>
  )
}

export default ComercialSectorMainPage
