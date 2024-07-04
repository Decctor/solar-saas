import { Sidebar } from '@/components/Sidebar'
import LoadingPage from '@/components/utils/LoadingPage'
import { useOpportunityById } from '@/utils/queries/opportunities'
import { TOpportunityDTOWithClientAndPartnerAndFunnelReferences } from '@/utils/schemas/opportunity.schema'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Stripe from 'stripe'

function Testing() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [holder, setHolder] = useState('')

  async function getCustomers() {
    try {
      const { data } = await axios.get('/api/integration/stripe')
      router.push(data.data)
    } catch (error) {
      throw error
    }
  }
  if (status != 'authenticated') return <LoadingPage />
  return (
    <div className="flex h-full flex-col md:flex-row">
      <Sidebar session={session} />
      <div className="flex w-full grow flex-col items-center justify-center">
        <div className={`flex w-full flex-col gap-1 font-Inter lg:w-[350px]`}>
          <button onClick={() => getCustomers()}>TESTE</button>
        </div>
      </div>
    </div>
  )
}

export default Testing
