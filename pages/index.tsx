import React, { useState } from 'react'
import { useSession } from 'next-auth/react'

import LoadingPage from '@/components/utils/LoadingPage'
import { getFirstDayOfMonth, getLastDayOfMonth } from '@/utils/methods'

import MainDashboardPage from '@/components/Stats/MainDashboard/MainDashboardPage'

const currentDate = new Date()
const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()).toISOString()
const lastDayOfMonth = getLastDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()).toISOString()

function EstatisticaPrincipal() {
  const { data: session, status } = useSession({ required: true })

  if (status != 'authenticated') return <LoadingPage />
  return <MainDashboardPage session={session} />
}

export default EstatisticaPrincipal
