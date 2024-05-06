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
import { formatNameAsInitials } from '@/lib/methods/formatting'
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

  return 'bg-blue-500'
}
function getStatusColor(status: string) {
  if (status == 'CONCLUIDO') {
    return 'border-green-500 text-green-500'
  }
  if (status == 'EM ANÁLISE TÉCNICA') {
    return 'border-yellow-500 text-yellow-500'
  }
  if (status == 'PENDÊNCIA COMERCIAL') {
    return 'border-cyan-500 text-cyan-500'
  }
  if (status == 'VISITA IN LOCO') {
    return 'border-indigo-500 text-indigo-500'
  }
  if (status == 'REJEITADA') {
    return 'border-red-500 text-red-500'
  }

  return 'border-gray-500 text-gray-500'
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
        <div className="flex w-full items-start justify-between">
          <div className="flex flex-col">
            <h1 className="w-full text-start text-sm font-bold leading-none tracking-tight">{analysis.tipoSolicitacao}</h1>
          </div>
          <h1 className={`w-fit self-center rounded border p-1 text-center text-[0.6rem] font-black ${getStatusColor(analysis.status)}`}>
            {analysis.status || 'NÃO DEFINIDO'}
          </h1>
        </div>
        <p className="mt-1 text-[0.6rem] font-bold text-gray-500">
          <strong className="text-[#fead41]">{analysis.oportunidade.identificador}</strong> {analysis.oportunidade.nome}
        </p>
        <div className="mt-1 flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <div className="flex items-center gap-1">
              <Avatar
                url={analysis.requerente.avatar_url || undefined}
                fallback={formatNameAsInitials(analysis.requerente.nome || analysis.requerente.apelido)}
                height={25}
                width={25}
              />
              <p className="text-xs font-medium">{analysis.requerente.nome || analysis.requerente.apelido}</p>
            </div>

            <div className={`flex items-center gap-1`}>
              <BsCalendarPlus />
              <p className="text-xs font-medium">{dayjs(analysis.dataInsercao).format('DD/MM/YYYY HH:mm')}</p>
            </div>

            {analysis.dataEfetivacao ? (
              <div className={`flex items-center gap-1 text-green-500`}>
                <BsCalendarCheck />
                <p className="text-xs font-medium">{dayjs(analysis.dataEfetivacao).format('DD/MM/YYYY HH:mm')}</p>
              </div>
            ) : null}
          </div>
          {/* {analysis.status == 'CONCLUIDO' && analysis.dataEfetivacao ? (
            <button
              onClick={() => setReportsMenuIsOpen((prev) => !prev)}
              className="flex w-fit items-center gap-2 rounded border border-cyan-500 p-1 font-medium text-cyan-500 duration-300 ease-in-out hover:bg-cyan-300 hover:text-black"
            >
              <p className="text-xs">LAUDOS</p>
            </button>
          ) : null} */}
        </div>
      </div>
      {/* {reportsMenuIsOpen ? (
        <div
          id="dropdown"
          className="z-1 absolute right-2 top-5 flex h-[230px] max-h-[230px] w-[230px]  list-none flex-col divide-y divide-gray-100 rounded-lg bg-white text-base shadow dark:bg-gray-700 lg:h-[140px] lg:max-h-[145px] lg:w-[250px]"
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
          <ul className="overflow-y-auto py-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300" aria-labelledby="dropdownButton">
            <li className="w-full break-words text-start">
              <Link href={`/operacional/analises-tecnicas/laudo/${analysis._id}?type=LAUDO SIMPLES(URBANO)`}>
                <p className="w-fit rounded border border-black px-2 py-1 text-center font-bold shadow-sm hover:bg-black hover:text-white">
                  LAUDO SIMPLES(URBANO)
                </p>
              </Link>
            </li>
            <li className="w-full break-words text-start">
              <Link href={`/operacional/analises-tecnicas/laudo/${analysis._id}?type=LAUDO INTERMEDIÁRIO (URBANO)`}>
                <p className="w-fit rounded border border-black px-2 py-1 text-center font-bold shadow-sm hover:bg-black hover:text-white">
                  LAUDO INTERMEDIÁRIO (URBANO)
                </p>
              </Link>
            </li>
            <li className="w-full break-words text-start">
              <Link href={`/operacional/analises-tecnicas/laudo/${analysis._id}?type=LAUDO SIMPLES (RURAL)`}>
                <p className="w-fit rounded border border-black px-2 py-1 text-center font-bold shadow-sm hover:bg-black hover:text-white">
                  LAUDO SIMPLES (RURAL)
                </p>
              </Link>
            </li>
          </ul>
        </div>
      ) : null} */}
    </div>
  )
}

export default OpportunityTechnicalAnalysisItem
