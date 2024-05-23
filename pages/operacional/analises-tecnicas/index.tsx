import TechnicalAnalysisCard from '@/components/Cards/TechnicalAnalysisCard'
import MultipleSelectInput from '@/components/Inputs/MultipleSelectInput'
import SelectWithImages from '@/components/Inputs/SelectWithImages'
import TextInput from '@/components/Inputs/TextInput'
import ControlTechnicalAnalysis from '@/components/Modals/TechnicalAnalysis/ControlTechnicalAnalysis'
import { Sidebar } from '@/components/Sidebar'
import FilterMenu from '@/components/TechnicalAnalysis/FilterMenu'
import TechnicalAnalysisPage from '@/components/TechnicalAnalysis/TechnicalAnalysisPage'
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

function TechnicalAnalysis() {
  const { data: session, status } = useSession({ required: true })

  if (status != 'authenticated') return <LoadingPage />
  return <TechnicalAnalysisPage session={session} />
}

export default TechnicalAnalysis
