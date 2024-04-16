import React, { useState } from 'react'
import { Inter } from 'next/font/google'
import { Session } from 'next-auth'
import NewFunnel from '../Modals/NewFunnel'
import { useFunnels } from '@/utils/queries/funnels'
import LoadingComponent from '../utils/LoadingComponent'
import ErrorComponent from '../utils/ErrorComponent'
import { BsFunnelFill } from 'react-icons/bs'

type FunnelsProps = {
  session: Session
}
function Funnels({ session }: FunnelsProps) {
  const [newFunnelModalIsOpen, setNewFunnelModalIsOpen] = useState<boolean>(false)
  const { data: funnels, isSuccess, isLoading, isError } = useFunnels()
  return (
    <div className="flex h-full grow flex-col">
      <div className="flex w-full items-center justify-between border-b border-gray-200 pb-2">
        <div className="flex flex-col">
          <h1 className={`text-lg font-bold`}>Controle de funis</h1>
          <p className="text-sm text-[#71717A]">Gerencie, adicione e edite os funis existentes</p>
        </div>
        <button
          onClick={() => setNewFunnelModalIsOpen(true)}
          className="h-9 whitespace-nowrap rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-gray-800 enabled:hover:text-white"
        >
          NOVO FUNIL
        </button>
      </div>
      {newFunnelModalIsOpen ? <NewFunnel session={session} closeModal={() => setNewFunnelModalIsOpen(false)} /> : null}
      <div className="flex w-full flex-col gap-2 py-2">
        {isLoading ? <LoadingComponent /> : null}
        {isError ? <ErrorComponent msg="Erro ao buscar funis" /> : null}
        {isSuccess &&
          funnels.map((funnel, index: number) => (
            <div key={funnel._id.toString()} className="flex w-full flex-col rounded-md border border-gray-200 p-2">
              <div className="flex grow items-center gap-1">
                <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full border border-black p-1">
                  <BsFunnelFill />
                </div>
                <p className="text-sm font-medium leading-none tracking-tight">{funnel.nome}</p>
              </div>
              <h1 className='"w-full mt-2 text-start text-xs font-medium'>ETAPAS</h1>
              <div className="flex w-full items-center justify-start gap-2">
                {funnel.etapas.map((stage) => (
                  <div key={stage.id} className="rounded-lg border border-gray-300 bg-gray-50 px-2 py-1 text-[0.57rem] font-medium">
                    {stage.nome}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Funnels
