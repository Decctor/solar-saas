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
import ClientsPage from '@/components/Clients/ClientsPage'

const currentDate = new Date()
const firstDayOfYear = getFirstDayOfYear(currentDate.toISOString()).toISOString()
const lastDayOfYear = getLastDayOfYear(currentDate.toISOString()).toISOString()

function Clients() {
  const { data: session, status } = useSession({ required: true })

  if (status != 'authenticated') return <LoadingPage />
  return <ClientsPage session={session} />
}

export default Clients
