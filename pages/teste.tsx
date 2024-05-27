import { Sidebar } from '@/components/Sidebar'
import LoadingPage from '@/components/utils/LoadingPage'
import { useOpportunityById } from '@/utils/queries/opportunities'
import { TOpportunityDTOWithClientAndPartnerAndFunnelReferences } from '@/utils/schemas/opportunity.schema'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

function Testing() {
  const { data: session, status } = useSession()
  const [infoHolder, setInfoHolder] = useState<TOpportunityDTOWithClientAndPartnerAndFunnelReferences | null>(null)
  const { data: opportunity } = useOpportunityById({ opportunityId: '664b7c2b1c66e9f6f8eed711' })

  useEffect(() => {
    if (opportunity) setInfoHolder(opportunity)
  }, [opportunity])
  if (status != 'authenticated') return <LoadingPage />
  return (
    <div className="flex h-full flex-col md:flex-row">
      <Sidebar session={session} />
      <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa] p-6"></div>
    </div>
  )
}

export default Testing
