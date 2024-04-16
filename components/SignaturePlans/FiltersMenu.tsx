import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import CheckboxInput from '../Inputs/CheckboxInput'
import TextInput from '../Inputs/TextInput'
import MultipleSelectInput from '../Inputs/MultipleSelectInput'

import { ProductItemCategories, SignaturePlanIntervalTypes } from '@/utils/select-options'

import { UseComercialProductsFilters } from '@/utils/queries/products'
import { GeneralVisibleHiddenExitMotionVariants } from '@/utils/constants'
import { UseSignaturePlansFilters } from '@/utils/queries/signature-plans'
import SelectInput from '../Inputs/SelectInput'

type FiltersMenuProps = {
  filters: UseSignaturePlansFilters
  setFilters: React.Dispatch<React.SetStateAction<UseSignaturePlansFilters>>
}
function FiltersMenu({ filters, setFilters }: FiltersMenuProps) {
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
            label="PESQUISA"
            placeholder="Filtre pelo fabricante e modelo do produto..."
            value={filters.search}
            handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
            labelClassName="text-xs font-medium tracking-tight text-black"
          />
          <SelectInput
            label="TIPO DE INTERVALO"
            labelClassName="text-xs font-medium tracking-tight text-black"
            value={filters.intervalType}
            handleChange={(value) => setFilters((prev) => ({ ...prev, intervalType: value }))}
            options={SignaturePlanIntervalTypes}
            selectedItemLabel="NÃO DEFINIDO"
            onReset={() => setFilters((prev) => ({ ...prev, intervalType: null }))}
          />
        </div>
        <div className="flex w-full flex-col flex-wrap items-center justify-start gap-2 lg:flex-row">
          <div className="w-fit">
            <CheckboxInput
              labelFalse="SOMENTE PLANOS ATIVOS"
              labelTrue="SOMENTE PLANOS ATIVOS"
              checked={filters.onlyActive}
              handleChange={(value) => setFilters((prev) => ({ ...prev, onlyActive: value }))}
            />
          </div>
          <div className="w-fit">
            <CheckboxInput
              labelFalse="SOMENTE PLANOS INATIVOS"
              labelTrue="SOMENTE PLANOS INATIVOS"
              checked={filters.onlyInactive}
              handleChange={(value) => setFilters((prev) => ({ ...prev, onlyInactive: value }))}
            />
          </div>
          <div
            onClick={() => setFilters((prev) => ({ ...prev, powerOrder: null, priceOrder: prev.priceOrder == 'ASC' ? null : 'ASC' }))}
            className={`flex w-full cursor-pointer items-center justify-center rounded-md border border-cyan-500 p-2 px-4 text-center font-Inter text-xs font-bold leading-none tracking-tight lg:w-fit ${
              filters.priceOrder == 'ASC' ? 'bg-cyan-500 text-white' : 'bg-transparent text-cyan-500'
            }`}
          >
            PREÇO CRESCENTE
          </div>
          <div
            onClick={() => setFilters((prev) => ({ ...prev, powerOrder: null, priceOrder: prev.priceOrder == 'DESC' ? null : 'DESC' }))}
            className={`flex w-full cursor-pointer items-center justify-center rounded-md border border-cyan-500 p-2 px-4 text-center font-Inter text-xs font-bold leading-none tracking-tight lg:w-fit ${
              filters.priceOrder == 'DESC' ? 'bg-cyan-500 text-white' : 'bg-transparent text-cyan-500'
            }`}
          >
            PREÇO DECRESCENTE
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FiltersMenu
