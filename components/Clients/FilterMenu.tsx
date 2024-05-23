import React from 'react'

import TextInput from '../Inputs/TextInput'
import MultipleSelectInput from '../Inputs/MultipleSelectInput'
import { UseKitsFilters } from '@/utils/queries/kits'

import NumberInput from '../Inputs/NumberInput'
import { AnimatePresence, motion } from 'framer-motion'
import { GeneralVisibleHiddenExitMotionVariants } from '@/utils/constants'
import CheckboxInput from '../Inputs/CheckboxInput'
import { useEquipments } from '@/utils/queries/utils'
import StatesAndCities from '@/utils/json-files/cities.json'

import { UseClientsPersonalizedFilter } from '@/utils/queries/clients'
import MultipleSelectInputVirtualized from '../Inputs/MultipleSelectInputVirtualized'
import { CustomersAcquisitionChannels } from '@/utils/select-options'
const AllCities = StatesAndCities.flatMap((s) => s.cidades).map((c, index) => ({ id: index + 1, label: c, value: c }))

type FilterMenuProps = {
  filters: UseClientsPersonalizedFilter
  setFilters: React.Dispatch<React.SetStateAction<UseClientsPersonalizedFilter>>
  updateMatch: (filters: UseClientsPersonalizedFilter) => void
  queryLoading: boolean
}
function FilterMenu({ filters, setFilters, updateMatch, queryLoading }: FilterMenuProps) {
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
            value={filters.search}
            handleChange={(value) => {
              setFilters((prev) => ({ ...prev, search: value }))
            }}
            placeholder="Filtre pelo nome do cliente..."
            labelClassName="text-xs font-medium tracking-tight text-black"
          />
          <TextInput
            label="TELEFONE"
            value={filters.phone}
            handleChange={(value) => {
              setFilters((prev) => ({ ...prev, phone: value }))
            }}
            placeholder="Filtre pelo telefone do cliente..."
            labelClassName="text-xs font-medium tracking-tight text-black"
          />
          <div className="w-full lg:w-[200px]">
            <MultipleSelectInputVirtualized
              label="CIDADE"
              selected={filters.city}
              options={AllCities}
              selectedItemLabel="NÃO DEFINIDO"
              handleChange={(value) => {
                setFilters((prev) => ({
                  ...prev,
                  city: value as string[],
                }))
              }}
              onReset={() => {
                setFilters((prev) => ({
                  ...prev,
                  city: [],
                }))
              }}
              width="100%"
              labelClassName="text-xs font-medium tracking-tight text-black"
            />
          </div>
          <div className="w-full lg:w-[200px]">
            <MultipleSelectInput
              label="CANAL DE AQUISIÇÃO"
              selected={filters.acquisitionChannel}
              options={CustomersAcquisitionChannels}
              selectedItemLabel="NÃO DEFINIDO"
              handleChange={(value) => {
                setFilters((prev) => ({
                  ...prev,
                  acquisitionChannel: value as string[],
                }))
              }}
              onReset={() => {
                setFilters((prev) => ({
                  ...prev,
                  acquisitionChannel: [],
                }))
              }}
              width="100%"
              labelClassName="text-xs font-medium tracking-tight text-black"
            />
          </div>
        </div>
        <div className="flex w-full flex-col flex-wrap items-center justify-end gap-2 lg:flex-row">
          <button
            disabled={queryLoading}
            onClick={() => {
              updateMatch(filters)
            }}
            className="h-9 whitespace-nowrap rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-blue-700 enabled:hover:text-white"
          >
            PESQUISAR
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FilterMenu
