import { useEquipments } from '@/utils/queries/utils'
import { TEquipment } from '@/utils/schemas/utils'
import { Session } from 'next-auth'
import React, { useState } from 'react'
import LoadingComponent from '../utils/LoadingComponent'
import ErrorComponent from '../utils/ErrorComponent'
import NewEquipmentMenu from '../Equipments/NewEquipmentMenu'
import EquipmentUtil from '../Cards/EquipmentUtil'

type EquipmentsBlockProps = {
  session: Session
}
function EquipmentsBlock({ session }: EquipmentsBlockProps) {
  const [categoryFilter, setCategoryFilter] = useState<TEquipment['categoria'] | null>('MÓDULO')
  const [newEquipmentMenuIsOpen, setNewEquipmentMenuIsOpen] = useState<boolean>(false)
  const { data: equipments, isLoading, isError, isSuccess } = useEquipments({ category: categoryFilter })
  return (
    <div className="flex min-h-[450px] w-full flex-col rounded border border-blue-500">
      <h1 className="w-full rounded-tl rounded-tr bg-blue-500 p-1 text-center text-sm font-bold text-white">EQUIPAMENTOS</h1>
      <div className="my-1 flex w-full flex-col">
        <p className="w-full text-center text-sm font-light tracking-tighter text-gray-700">
          Os equipamentos aqui cadastrados estarão disponíveis nas listas de equipamentos, como MÓDULOS E INVERSORES.
        </p>
        <p className="w-full text-center text-sm font-light tracking-tighter text-gray-700">Se necessário, cadastre um novo equipamento no menu inferior.</p>
      </div>
      <div className="my-1 flex w-full items-center justify-center gap-4 px-2">
        {['INVERSOR', 'MÓDULO'].map((category, index) => (
          <button
            key={index}
            onClick={() => setCategoryFilter(category as TEquipment['categoria'])}
            className={`rounded-lg ${
              categoryFilter == category ? 'bg-blue-500 text-white' : 'bg-transparent text-blue-500'
            } border border-blue-500 px-2 py-1 text-xs font-bold`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="flex max-h-[600px] w-full grow flex-wrap items-start justify-around gap-2 overflow-y-auto overscroll-y-auto p-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
        {isLoading ? <LoadingComponent /> : null}
        {isError ? <ErrorComponent msg="Erro ao buscar equipamentos." /> : null}
        {isSuccess ? (
          equipments.length > 0 ? (
            equipments.map((equipment) => (
              <div className="w-full lg:w-[450px]">
                <EquipmentUtil key={equipment._id} equipment={equipment} />
              </div>
            ))
          ) : (
            <p className="flex w-full grow items-center justify-center py-2 text-center font-medium italic tracking-tight text-gray-500">
              Nenhum equipamento encontrado.
            </p>
          )
        ) : null}
      </div>
      <div className="flex w-full items-center justify-end p-2">
        {newEquipmentMenuIsOpen ? (
          <button
            className="rounded bg-red-500 p-1 px-4 text-sm font-medium text-white duration-300 ease-in-out hover:bg-red-600"
            onClick={() => setNewEquipmentMenuIsOpen(false)}
          >
            FECHAR MENU
          </button>
        ) : (
          <button
            className="rounded bg-green-500 p-1 px-4 text-sm font-medium text-white duration-300 ease-in-out hover:bg-green-600"
            onClick={() => setNewEquipmentMenuIsOpen(true)}
          >
            NOVO EQUIPAMENTO
          </button>
        )}
      </div>
      {newEquipmentMenuIsOpen ? <NewEquipmentMenu session={session} affectQueryKey={['equipments', categoryFilter]} /> : null}
    </div>
  )
}

export default EquipmentsBlock
