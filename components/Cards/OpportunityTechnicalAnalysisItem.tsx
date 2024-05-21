import { IKit, ModuleType } from '@/utils/models'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { BsCalendarCheck, BsCalendarFill, BsCalendarPlus, BsFillCalendarCheckFill } from 'react-icons/bs'
import { ImPower, ImPriceTag } from 'react-icons/im'
import { IoMdAdd } from 'react-icons/io'
import Modules from '../../utils/json-files/pvmodules.json'
import { TbTopologyFullHierarchy } from 'react-icons/tb'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { TTechnicalAnalysisDTO } from '@/utils/schemas/technical-analysis.schema'
import Avatar from '../utils/Avatar'
import { formatDateAsLocale, formatNameAsInitials } from '@/lib/methods/formatting'
import { VscChromeClose } from 'react-icons/vsc'
import Link from 'next/link'

function getTagColor(status: string) {
  if (status == 'CONCLUIDO') {
    return 'bg-green-500'
  }
  if (status == 'EM ANÁLISE TÉCNICA') {
    return 'bg-yellow-500'
  }
  if (status == 'PENDÊNCIA COMERCIAL') {
    return 'bg-cyan-500'
  }
  if (status == 'VISITA IN LOCO') {
    return 'bg-indigo-500'
  }
  if (status == 'REJEITADA') {
    return 'bg-red-500'
  }
  if (status == 'PENDENTE') return 'bg-gray-500'
  return 'bg-gray-500'
}
function getStatusColor(status: string) {
  if (status == 'CONCLUIDO') {
    return <h1 className="w-fit self-center rounded border border-green-500 p-1 text-center text-[0.6rem] font-black text-green-500">CONCLUIDO</h1>
  }
  if (status == 'EM ANÁLISE TÉCNICA') {
    return <h1 className="w-fit self-center rounded border border-yellow-500 p-1 text-center text-[0.6rem] font-black text-yellow-500">EM ANÁLISE TÉCNICA</h1>
  }
  if (status == 'PENDÊNCIA COMERCIAL') {
    return <h1 className="w-fit self-center rounded border border-cyan-500 p-1 text-center text-[0.6rem] font-black text-cyan-500">PENDÊNCIA COMERCIAL</h1>
  }
  if (status == 'VISITA IN LOCO') {
    return <h1 className="w-fit self-center rounded border border-indigo-500 p-1 text-center text-[0.6rem] font-black text-indigo-500">VISITA IN LOCO</h1>
  }
  if (status == 'REJEITADA') {
    return <h1 className="w-fit self-center rounded border border-red-500 p-1 text-center text-[0.6rem] font-black text-red-500">REJEITADA</h1>
  }
  if (status == 'PENDENTE')
    return <h1 className="w-fit self-center rounded border border-gray-500 p-1 text-center text-[0.6rem] font-black text-gray-500">PENDENTE</h1>
  return <h1 className="w-fit self-center rounded border border-gray-500 p-1 text-center text-[0.6rem] font-black text-gray-500">PENDENTE</h1>
}

type OpportunityTechnicalAnalysisItemProps = {
  analysis: TTechnicalAnalysisDTO
}
function OpportunityTechnicalAnalysisItem({ analysis }: OpportunityTechnicalAnalysisItemProps) {
  const [reportsMenuIsOpen, setReportsMenuIsOpen] = useState<boolean>(false)
  return (
    <div className="relative flex w-full items-center rounded-md border border-gray-200">
      <div className={`h-full w-[5px] rounded-bl-md rounded-tl-md ${getTagColor(analysis.status)}`}></div>
      <div className="flex grow flex-col p-3">
        <div className="flex w-full grow flex-col gap-1">
          <div className="flex w-full flex-col items-center justify-center gap-1 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex grow flex-col items-center lg:items-start">
              <h1 className="w-full text-center text-sm font-bold leading-none tracking-tight duration-300 lg:text-start">
                {analysis.tipoSolicitacao || 'NÃO DEFINIDO'}
              </h1>
              <p className="mt-1 w-full text-center text-[0.6rem] font-medium text-gray-500 lg:text-start">#{analysis._id}</p>
            </div>
            <div className="flex w-full min-w-fit items-center justify-center lg:w-fit">{getStatusColor(analysis.status)}</div>
          </div>
        </div>
        <div className="mt-2 flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
          {analysis.dataEfetivacao || analysis.status == 'CONCLUIDO' ? (
            <button
              className="rounded bg-cyan-500 px-2 py-1 text-center text-[0.6rem] font-bold text-white"
              onClick={() => setReportsMenuIsOpen((prev) => !prev)}
            >
              LAUDOS
            </button>
          ) : (
            <div></div>
          )}
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            {analysis.dataEfetivacao ? (
              <div className={`flex items-center gap-1`}>
                <BsCalendarCheck color="rgb(34,197,94)" />
                <p className="text-[0.65rem] font-medium text-gray-500">{formatDateAsLocale(analysis.dataEfetivacao, true)}</p>
              </div>
            ) : null}
            <div className={`flex items-center gap-1`}>
              <BsCalendarPlus />
              <p className="text-[0.65rem] font-medium text-gray-500">{formatDateAsLocale(analysis.dataInsercao, true)}</p>
            </div>
            <div className="flex items-center gap-1">
              <Avatar fallback={'R'} url={analysis.requerente.avatar_url || undefined} height={20} width={20} />
              <p className="text-[0.65rem] font-medium text-gray-500">{analysis.requerente.nome}</p>
            </div>
          </div>
        </div>
      </div>
      {reportsMenuIsOpen ? (
        <div
          id="dropdown"
          className="absolute left-12 top-5 z-10 flex h-[230px] max-h-[230px] w-[230px] list-none flex-col divide-y divide-gray-100 rounded-lg bg-[#fff] text-base shadow dark:bg-gray-700 lg:h-[140px] lg:max-h-[145px] lg:w-[250px]"
        >
          <div className="flex w-full items-center justify-between p-2">
            <h1 className="text-xs font-medium tracking-tight text-gray-700">TIPOS DE LAUDO</h1>
            <button
              onClick={() => setReportsMenuIsOpen(false)}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
          <div className="flex w-full grow flex-col gap-2 overflow-y-auto py-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            <Link href={`/operacional/analises-tecnicas/laudo/${analysis._id}?type=LAUDO SIMPLES(URBANO)`}>
              <p className="w-full text-center text-xs font-medium text-gray-500 hover:text-cyan-500">LAUDO SIMPLES(URBANO)</p>
            </Link>
            <Link href={`/operacional/analises-tecnicas/laudo/${analysis._id}?type=LAUDO INTERMEDIÁRIO (URBANO)`}>
              <p className="w-full text-center text-xs font-medium text-gray-500 hover:text-cyan-500">LAUDO INTERMEDIÁRIO (URBANO)</p>
            </Link>
            <Link href={`/operacional/analises-tecnicas/laudo/${analysis._id}?type=LAUDO SIMPLES (RURAL)`}>
              <p className="w-full text-center text-xs font-medium text-gray-500 hover:text-cyan-500">LAUDO SIMPLES (RURAL)</p>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default OpportunityTechnicalAnalysisItem
