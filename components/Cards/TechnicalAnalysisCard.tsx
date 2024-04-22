import dayjs from 'dayjs'
import React from 'react'
import { FaCity, FaHourglass, FaHourglassHalf, FaUser } from 'react-icons/fa'
import { FaDiamond, FaLocationDot } from 'react-icons/fa6'
import { IoMdAlert } from 'react-icons/io'
import { MdCategory } from 'react-icons/md'

import { BsCalendarCheck, BsCalendarFill, BsCalendarPlus, BsCode, BsFillCalendarCheckFill } from 'react-icons/bs'
import { TTechnicalAnalysisDTO } from '@/utils/schemas/technical-analysis.schema'
import Avatar from '../utils/Avatar'
import { formatDateAsLocale, formatNameAsInitials } from '@/lib/methods/formatting'
import { TbAtom, TbWorld } from 'react-icons/tb'

const StatusColors = {
  CONCLUIDO: 'bg-green-500',
  'EM ANÁLISE TÉCNICA': 'bg-yellow-500',
  'PENDÊNCIA COMERCIAL': 'bg-cyan-500',
  'PENDÊNCIA OPERACIONAL': 'bg-indigo-500',
  REJEITADA: 'bg-red-300',
  PENDENTE: 'bg-gray-500',
}

function getBarColor(status: string) {
  const color = StatusColors[status as keyof typeof StatusColors]
  if (!color) return 'bg-gray-500'
  return color
  // if (status == 'CONCLUIDO') return 'bg-green-500'
  // if (status == 'EM ANÁLISE TÉCNICA') return 'bg-yellow-500'
  // if (status == 'PENDÊNCIA COMERCIAL') return 'bg-cyan-500'
  // if (status == 'PENDÊNCIA OPERACIONAL') return 'bg-indigo-500'
  // if (status == 'REJEITADA') return 'bg-red-300'
  // return 'bg-gray-500'
}
function getStatusTag(status: string) {
  const color = StatusColors[status as keyof typeof StatusColors] || 'bg-gray-500'
  return <h1 className={`rounded-full ${color} px-2 py-1 text-center text-[0.65rem] font-bold text-white lg:text-xs`}>{status}</h1>
}

type TechnicalAnalysisCardProps = {
  analysis: TTechnicalAnalysisDTO
  handleOpenModal: (id: string) => void
}
function TechnicalAnalysisCard({ analysis, handleOpenModal }: TechnicalAnalysisCardProps) {
  return (
    <div key={analysis._id} className="flex min-h-[180px] w-full gap-2 rounded-md border border-gray-300 shadow-sm lg:w-[500px]">
      <div className={`h-full w-[7px] ${getBarColor(analysis.status)} rounded-bl-md rounded-tl-md`}></div>
      <div className="flex w-full grow flex-col p-3">
        <div className="flex w-full grow flex-col">
          <div className="flex w-full items-center justify-between gap-2">
            <h1
              onClick={() => handleOpenModal(analysis._id)}
              className="grow cursor-pointer text-center text-sm font-black leading-none tracking-tight duration-300 ease-in-out hover:text-cyan-500 lg:text-start"
            >
              {analysis.nome || 'NÃO DEFINIDO'}
            </h1>
            {getStatusTag(analysis.status)}
          </div>
          <div className="flex w-full items-center gap-2">
            <FaDiamond />
            <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">{analysis.tipoSolicitacao}</p>
          </div>
          <div className="mt-2 flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <BsCode size={18} />
              <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">
                {analysis.oportunidade.nome || 'OPORTUNIDADE NÃO VINCULADA'}
              </p>
            </div>
            <div className="flex items-end gap-2">
              <TbWorld size={18} />
              <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">
                {analysis.complexidade || 'OPORTUNIDADE NÃO VINCULADA'}
              </p>
            </div>
          </div>
          <div className="mt-2 flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar
                url={analysis.requerente.avatar_url || undefined}
                fallback={formatNameAsInitials(analysis.requerente.nome || 'U')}
                width={20}
                height={20}
              />
              <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">
                REQUERIDO POR <strong className="text-cyan-500">{analysis.requerente.nome?.toUpperCase() || 'NÃO DEFINIDO'}</strong>
              </p>
            </div>
            <div className="flex items-end gap-2">
              <FaLocationDot size={18} />
              <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">
                {analysis.localizacao.cidade || ''} / {analysis.localizacao.uf || ''}
              </p>
            </div>
          </div>

          {/* <div className="mt-1 flex w-full items-center justify-start gap-2">
            <Avatar fallback={'R'} url={analysis.requerente?.avatar_url || undefined} height={20} width={20} />
            <p className="text-xs font-medium text-gray-500">{analysis.requerente.nome || analysis.requerente.apelido}</p>
          </div>
          <div className="mt-2 flex w-full items-center justify-center gap-2">
            {analysis.oportunidade.identificador ? (
              <p className="text-xs font-bold leading-none tracking-tight text-[#fead41]">({analysis.oportunidade.identificador})</p>
            ) : null}
            <p className="text-xs font-semibold leading-none tracking-tight text-gray-500">{analysis.oportunidade.nome || 'NÃO DEFINIDO'}</p>
          </div> */}
        </div>
        <div className="flex w-full items-center justify-between">
          <div className={`flex items-center gap-2`}>
            <div className="ites-center flex gap-1">
              <BsCalendarPlus />
              <p className={`text-xs font-medium text-gray-500`}>{formatDateAsLocale(analysis.dataInsercao, true)}</p>
            </div>
            {analysis.dataEfetivacao ? (
              <div className="ites-center flex gap-1">
                <BsCalendarCheck color="rgb(34,197,94)" />
                <p className={`text-xs font-medium text-gray-500`}>{formatDateAsLocale(analysis.dataEfetivacao)}</p>
              </div>
            ) : null}
          </div>
          <div className="flex items-center justify-center gap-1">
            <Avatar fallback={'U'} height={20} width={20} url={analysis.analista?.avatar_url || undefined} />
            <p className="text-xs font-medium text-gray-500">{analysis.analista?.apelido || 'ANALISTA A DEFINIR'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TechnicalAnalysisCard
