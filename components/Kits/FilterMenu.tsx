import React from 'react'

import TextInput from '../Inputs/TextInput'
import MultipleSelectInput from '../Inputs/MultipleSelectInput'
import { UseKitsFilters } from '@/utils/queries/kits'
import Suppliers from '@/utils/json-files/pvsuppliers.json'
import Modules from '@/utils/json-files/pvmodules.json'
import Inverters from '@/utils/json-files/pvinverters.json'
import NumberInput from '../Inputs/NumberInput'
import { AnimatePresence, motion } from 'framer-motion'
import { GeneralVisibleHiddenExitMotionVariants } from '@/utils/constants'
import CheckboxInput from '../Inputs/CheckboxInput'

const ModuleManufacturers = [...new Set(Modules.flatMap((module) => module.fabricante))]
const InverterManufacturers = [...new Set(Inverters.flatMap((inverter) => inverter.fabricante))]
type FilterMenuProps = {
  filters: UseKitsFilters
  setFilters: React.Dispatch<React.SetStateAction<UseKitsFilters>>
}
function FilterMenu({ filters, setFilters }: FilterMenuProps) {
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
            placeholder="Filtre pelo nome do kit..."
            labelClassName="text-xs font-medium tracking-tight text-black"
          />
          <div className="flex flex-col gap-1">
            <h1 className="text-xs font-medium tracking-tight text-black">FAIXA DE POTÊNCIA (kWp)</h1>
            <div className="flex items-center gap-1">
              <div className="w-[120px]">
                <NumberInput
                  showLabel={false}
                  label="MIN"
                  placeholder="MIN"
                  value={filters.powerRange.min}
                  handleChange={(value) => setFilters((prev) => ({ ...prev, powerRange: { ...prev.powerRange, min: value } }))}
                  width="100%"
                />
              </div>
              <div className="w-[120px]">
                <NumberInput
                  showLabel={false}
                  label="MÁX"
                  placeholder="MÁX"
                  value={filters.powerRange.max}
                  handleChange={(value) => setFilters((prev) => ({ ...prev, powerRange: { ...prev.powerRange, max: value } }))}
                  width="100%"
                />
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[200px]">
            <MultipleSelectInput
              label="TOPOLOGIA"
              selected={filters.topology}
              options={[
                { id: 1, label: 'INVERSOR', value: 'INVERSOR' },
                {
                  id: 2,
                  label: 'MICRO-INVERSOR',
                  value: 'MICRO-INVERSOR',
                },
              ]}
              selectedItemLabel="NÃO DEFINIDO"
              handleChange={(value: string[] | []) => {
                setFilters((prev) => ({
                  ...prev,
                  topology: value,
                }))
              }}
              onReset={() => {
                setFilters((prev) => ({
                  ...prev,
                  topology: [],
                }))
              }}
              width="100%"
              labelClassName="text-xs font-medium tracking-tight text-black"
            />
          </div>
          <div className="w-full lg:w-[200px]">
            <MultipleSelectInput
              label="MARCA (MÓDULOS)"
              selected={filters.moduleManufacturer.length > 0 ? filters.moduleManufacturer.map((manufacturer) => manufacturer) : null}
              options={ModuleManufacturers.map((manufacturer, index) => {
                return {
                  id: index + 1,
                  label: manufacturer,
                  value: manufacturer,
                }
              })}
              selectedItemLabel="NÃO DEFINIDO"
              handleChange={(value: string[] | []) => {
                setFilters((prev) => ({
                  ...prev,
                  moduleManufacturer: value,
                }))
              }}
              onReset={() => {
                setFilters((prev) => ({
                  ...prev,
                  moduleManufacturer: [],
                }))
              }}
              width="100%"
              labelClassName="text-xs font-medium tracking-tight text-black"
            />
          </div>
          <div className="w-full lg:w-[200px]">
            <MultipleSelectInput
              label="MARCA (INVERSORES)"
              selected={filters.inverterManufacturer.length > 0 ? filters.inverterManufacturer.map((manufacturer) => manufacturer) : null}
              options={InverterManufacturers.map((manufacturer, index) => {
                return {
                  id: index + 1,
                  label: manufacturer,
                  value: manufacturer,
                }
              })}
              selectedItemLabel="NÃO DEFINIDO"
              handleChange={(value: string[] | []) => {
                setFilters((prev) => ({
                  ...prev,
                  inverterManufacturer: value,
                }))
              }}
              onReset={() => {
                setFilters((prev) => ({
                  ...prev,
                  inverterManufacturer: [],
                }))
              }}
              width="100%"
              labelClassName="text-xs font-medium tracking-tight text-black"
            />
          </div>
        </div>
        <div className="flex w-full flex-col flex-wrap items-center justify-start gap-2 lg:flex-row">
          <div className="w-fit">
            <CheckboxInput
              labelFalse="SOMENTE KITS ATIVOS"
              labelTrue="SOMENTE KITS ATIVOS"
              checked={filters.onlyActive}
              handleChange={(value) => setFilters((prev) => ({ ...prev, onlyActive: value }))}
            />
          </div>
          <div className="w-fit">
            <CheckboxInput
              labelFalse="SOMENTE KITS INATIVOS"
              labelTrue="SOMENTE KITS INATIVOS"
              checked={filters.onlyInactive}
              handleChange={(value) => setFilters((prev) => ({ ...prev, onlyInactive: value }))}
            />
          </div>
          <div
            onClick={() => setFilters((prev) => ({ ...prev, powerOrder: prev.powerOrder == 'ASC' ? null : 'ASC', priceOrder: null }))}
            className={`flex w-full cursor-pointer items-center justify-center rounded-md border border-[rgb(239,68,68)] p-2 px-4 text-center font-Inter text-xs font-bold leading-none tracking-tight lg:w-fit ${
              filters.powerOrder == 'ASC' ? 'bg-[rgb(239,68,68)] text-white' : 'bg-transparent text-[rgb(239,68,68)]'
            }`}
          >
            POTÊNCIA CRESCENTE
          </div>
          <div
            onClick={() => setFilters((prev) => ({ ...prev, powerOrder: prev.powerOrder == 'DESC' ? null : 'DESC', priceOrder: null }))}
            className={`flex w-full cursor-pointer items-center justify-center rounded-md border border-[rgb(239,68,68)] p-2 px-4 text-center font-Inter text-xs font-bold leading-none tracking-tight lg:w-fit ${
              filters.powerOrder == 'DESC' ? 'bg-[rgb(239,68,68)] text-white' : 'bg-transparent text-[rgb(239,68,68)]'
            }`}
          >
            POTÊNCIA DECRESCENTE
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
  return (
    <div className="mt-2 flex w-full flex-col items-center justify-between gap-1">
      <div className="flex w-full flex-col items-end justify-between gap-2 lg:flex-row">
        <TextInput
          label="PESQUISA"
          value={filters.search}
          handleChange={(value) => {
            setFilters((prev) => ({ ...prev, search: value }))
          }}
          placeholder="Pesquisa aqui o nome do kit..."
        />
        <div className="flex w-full grow flex-col items-end gap-1 lg:w-fit lg:flex-row">
          <div
            onClick={() => setFilters((prev) => ({ ...prev, powerOrder: prev.powerOrder == 'ASC' ? null : 'ASC', priceOrder: null }))}
            className={`flex w-full cursor-pointer items-center justify-center rounded-md border border-[rgb(239,68,68)] p-2 px-4 text-center font-Inter text-xs font-bold leading-none tracking-tight lg:w-fit ${
              filters.powerOrder == 'ASC' ? 'bg-[rgb(239,68,68)] text-white' : 'bg-transparent text-[rgb(239,68,68)]'
            }`}
          >
            POTÊNCIA CRESCENTE
          </div>
          <div
            onClick={() => setFilters((prev) => ({ ...prev, powerOrder: prev.powerOrder == 'DESC' ? null : 'DESC', priceOrder: null }))}
            className={`flex w-full cursor-pointer items-center justify-center rounded-md border border-[rgb(239,68,68)] p-2 px-4 text-center font-Inter text-xs font-bold leading-none tracking-tight lg:w-fit ${
              filters.powerOrder == 'DESC' ? 'bg-[rgb(239,68,68)] text-white' : 'bg-transparent text-[rgb(239,68,68)]'
            }`}
          >
            POTÊNCIA DECRESCENTE
          </div>
          <div
            onClick={() => setFilters((prev) => ({ ...prev, powerOrder: null, priceOrder: prev.priceOrder == 'ASC' ? null : 'ASC' }))}
            className={`flex w-full cursor-pointer items-center justify-center rounded-md border border-cyan-500 p-2 px-4 text-center font-Inter font-medium leading-none tracking-tight lg:w-fit ${
              filters.priceOrder == 'ASC' ? 'bg-cyan-500 text-white' : 'bg-transparent text-cyan-500'
            }`}
          >
            PREÇO CRESCENTE
          </div>
          <div
            onClick={() => setFilters((prev) => ({ ...prev, powerOrder: null, priceOrder: prev.priceOrder == 'DESC' ? null : 'DESC' }))}
            className={`flex w-full cursor-pointer items-center justify-center rounded-md border border-cyan-500 p-2 px-4 text-center font-Inter font-medium leading-none tracking-tight lg:w-fit ${
              filters.priceOrder == 'DESC' ? 'bg-cyan-500 text-white' : 'bg-transparent text-cyan-500'
            }`}
          >
            PREÇO DECRESCENTE
          </div>
        </div>
      </div>
      <div className="mt-1 flex w-full flex-col items-end justify-center gap-3 lg:flex-row">
        <div className="w-full lg:w-[200px]">
          <MultipleSelectInput
            label="MARCA (MÓDULOS)"
            selected={filters.moduleManufacturer.length > 0 ? filters.moduleManufacturer.map((manufacturer) => manufacturer) : null}
            options={ModuleManufacturers.map((manufacturer, index) => {
              return {
                id: index + 1,
                label: manufacturer,
                value: manufacturer,
              }
            })}
            selectedItemLabel="NÃO DEFINIDO"
            handleChange={(value: string[] | []) => {
              setFilters((prev) => ({
                ...prev,
                moduleManufacturer: value,
              }))
            }}
            onReset={() => {
              setFilters((prev) => ({
                ...prev,
                moduleManufacturer: [],
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-[200px]">
          <MultipleSelectInput
            label="MARCA (INVERSORES)"
            selected={filters.inverterManufacturer.length > 0 ? filters.inverterManufacturer.map((manufacturer) => manufacturer) : null}
            options={InverterManufacturers.map((manufacturer, index) => {
              return {
                id: index + 1,
                label: manufacturer,
                value: manufacturer,
              }
            })}
            selectedItemLabel="NÃO DEFINIDO"
            handleChange={(value: string[] | []) => {
              setFilters((prev) => ({
                ...prev,
                inverterManufacturer: value,
              }))
            }}
            onReset={() => {
              setFilters((prev) => ({
                ...prev,
                inverterManufacturer: [],
              }))
            }}
            width="100%"
          />
        </div>

        <div className="w-full lg:w-[200px]">
          <MultipleSelectInput
            label="TOPOLOGIA"
            selected={filters.topology.length > 0 ? filters.topology.map((supplier) => supplier) : null}
            options={[
              { id: 1, label: 'INVERSOR', value: 'INVERSOR' },
              {
                id: 2,
                label: 'MICRO-INVERSOR',
                value: 'MICRO-INVERSOR',
              },
            ]}
            selectedItemLabel="NÃO DEFINIDO"
            handleChange={(value: string[] | []) => {
              setFilters((prev) => ({
                ...prev,
                topology: value,
              }))
            }}
            onReset={() => {
              setFilters((prev) => ({
                ...prev,
                topology: [],
              }))
            }}
            width="100%"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className='"font-sans text-[#353432]"  font-bold'>FAIXA DE POTÊNCIA (kWp)</h1>
        <div className="flex items-center gap-1">
          <div className="w-[120px]">
            <NumberInput
              showLabel={false}
              label="MIN"
              placeholder="MIN"
              value={filters.powerRange.min}
              handleChange={(value) => setFilters((prev) => ({ ...prev, powerRange: { ...prev.powerRange, min: value } }))}
              width="100%"
            />
          </div>
          <div className="w-[120px]">
            <NumberInput
              showLabel={false}
              label="MÁX"
              placeholder="MÁX"
              value={filters.powerRange.max}
              handleChange={(value) => setFilters((prev) => ({ ...prev, powerRange: { ...prev.powerRange, max: value } }))}
              width="100%"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterMenu
