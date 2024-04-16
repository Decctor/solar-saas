import { IKit, ModuleType } from '@/utils/models'
import dayjs from 'dayjs'
import React from 'react'
import { BsCalendarCheck, BsCalendarFill, BsCalendarPlus, BsFillCalendarCheckFill } from 'react-icons/bs'
import { ImPower, ImPriceTag } from 'react-icons/im'
import { IoMdAdd } from 'react-icons/io'
import Modules from '../../utils/json-files/pvmodules.json'
import { TbTopologyFullHierarchy } from 'react-icons/tb'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { TTechnicalAnalysisDTO } from '@/utils/schemas/technical-analysis.schema'
import Avatar from '../utils/Avatar'
import { formatNameAsInitials } from '@/lib/methods/formatting'

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

type TechAnalysisItemProps = {
  analysis: TTechnicalAnalysisDTO
}
function TechAnalysisItem({ analysis }: TechAnalysisItemProps) {
  return (
    <div className="flex w-full items-center rounded-md border border-gray-200">
      <div className={`h-full w-[5px] rounded-bl-md rounded-tl-md ${getTagColor(analysis.status)}`}></div>
      <div className="flex grow flex-col p-3">
        <div className="flex w-full items-start justify-between">
          <div className="flex flex-col">
            <h1 className="w-full text-start text-sm font-bold leading-none tracking-tight">{analysis.tipoSolicitacao}</h1>
            <p className="mt-1 text-[0.6rem] font-bold text-gray-500">
              <strong className="text-[#fead41]">{analysis.oportunidade.identificador}</strong> {analysis.oportunidade.nome}
            </p>
          </div>
          <h1 className={`w-fit self-center rounded border p-1 text-center text-[0.6rem] font-black ${getStatusColor(analysis.status)}`}>
            {analysis.status || 'NÃO DEFINIDO'}
          </h1>
        </div>

        <div className="mt-1 flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar
              url={analysis.requerente.avatar_url || undefined}
              fallback={formatNameAsInitials(analysis.requerente.nome || analysis.requerente.apelido)}
              height={25}
              width={25}
            />
            <p className="text-xs font-medium">{analysis.requerente.nome || analysis.requerente.apelido}</p>
            <div className={`flex items-center gap-2`}>
              <BsCalendarPlus />
              <p className="text-xs font-medium">{dayjs(analysis.dataInsercao).format('DD/MM/YYYY HH:mm')}</p>
            </div>

            {analysis.dataEfetivacao ? (
              <div className={`flex items-center gap-2 text-green-500`}>
                <BsCalendarCheck />
                <p className="text-xs font-medium">{dayjs(analysis.dataEfetivacao).format('DD/MM/YYYY HH:mm')}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TechAnalysisItem
