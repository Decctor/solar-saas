import { GeneralVisibleHiddenExitMotionVariants } from '@/utils/constants'
import { UseTechnicalAnalysisFilters } from '@/utils/queries/technical-analysis'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import TextInput from '../Inputs/TextInput'
import MultipleSelectInput from '../Inputs/MultipleSelectInput'
import { TechnicalAnalysisComplexity, TechnicalAnalysisStatus } from '@/utils/select-options'
import SelectWithImages from '../Inputs/SelectWithImages'
import { TUserDTOSimplified } from '@/utils/schemas/user.schema'

type FilterMenuProps = {
  filters: UseTechnicalAnalysisFilters
  setFilters: React.Dispatch<React.SetStateAction<UseTechnicalAnalysisFilters>>
  analysts: TUserDTOSimplified[]
}
function FilterMenu({ filters, setFilters, analysts }: FilterMenuProps) {
  return (
    <AnimatePresence>
      <motion.div
        key={'editor'}
        variants={GeneralVisibleHiddenExitMotionVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="mt-2 flex w-full flex-col gap-2 rounded-md border border-gray-300 bg-[#fff] p-2"
      >
        <h1 className="text-sm font-bold tracking-tight">FILTROS</h1>
        <div className="flex w-full flex-col flex-wrap items-center justify-start gap-2 lg:flex-row">
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
            selected={filters.status}
            options={TechnicalAnalysisComplexity}
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
    </AnimatePresence>
  )
}

export default FilterMenu
