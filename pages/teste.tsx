import { Sidebar } from '@/components/Sidebar'
import LoadingPage from '@/components/utils/LoadingPage'
import { useOpportunityById } from '@/utils/queries/opportunities'
import { TOpportunityDTOWithClientAndPartnerAndFunnelReferences } from '@/utils/schemas/opportunity.schema'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

function Testing() {
  const { data: session, status } = useSession()
  const [holder, setHolder] = useState('')

  if (status != 'authenticated') return <LoadingPage />
  return (
    <div className="flex h-full flex-col md:flex-row">
      <Sidebar session={session} />
      <div className="flex w-full grow flex-col items-center justify-center">
        <div className={`flex w-full flex-col gap-1 font-Inter lg:w-[350px]`}>
          <label htmlFor={'input-x'} className={'text-xs font-bold text-[#353432]'}>
            NOME DO USUÁRIO
          </label>

          <input
            value={holder}
            onChange={(e) => setHolder(e.target.value)}
            id={'input-x'}
            type="text"
            placeholder={'Preencha o nome do usuário'}
            className="w-full rounded-md border border-gray-200 p-3 text-sm shadow-sm outline-none duration-500 ease-in-out placeholder:italic focus:border-gray-500"
          />
        </div>
      </div>
    </div>
  )
}

export default Testing
