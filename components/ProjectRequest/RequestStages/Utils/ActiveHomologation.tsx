import { getInverterPeakPowerByProducts, getModulesPeakPotByProducts, getPeakPotByModules } from '@/lib/methods/extracting'
import { THomologationDTO } from '@/utils/schemas/homologation.schema'
import { TProductItem } from '@/utils/schemas/kits.schema'
import React from 'react'
import { BsCalendarPlus, BsCode } from 'react-icons/bs'
import { ImPower } from 'react-icons/im'

import { formatDateAsLocale, formatDecimalPlaces, formatNameAsInitials } from '@/lib/methods/formatting'
import { FaSolarPanel } from 'react-icons/fa'
import { FaBolt } from 'react-icons/fa6'
import Avatar from '@/components/utils/Avatar'

function getTagColor(status: string) {
  if (status == 'PENDENTE') return 'bg-gray-800'
  if (status == 'ELABORANDO DOCUMENTAÇÕES') return 'bg-blue-500'
  if (['AGUARDANDO ASSINATURA', 'AGUARDANDO FATURAMENTO', 'AGUARDANDO PENDÊNCIAS'].includes(status)) return 'bg-orange-500'
  if (status == 'REPROVADO COM REDUÇÃO') return 'bg-orange-700'
  if (['APROVADO COM OBRAS', 'APROVADO COM REDUÇÃO'].includes(status)) return 'bg-green-700'
  if (status == 'APROVADO') return 'bg-green-500'
  return 'bg-gray-800'
}
function getStatusTag(status: string) {
  if (status == 'PENDENTE') return <h1 className={`rounded-full bg-gray-800 px-2 py-1 text-center text-[0.65rem] font-bold text-white lg:text-xs`}>{status}</h1>
  if (status == 'ELABORANDO DOCUMENTAÇÕES')
    return <h1 className={`rounded-full bg-blue-500 px-2 py-1 text-center text-[0.65rem] font-bold text-white lg:text-xs`}>{status}</h1>
  if (['AGUARDANDO ASSINATURA', 'AGUARDANDO FATURAMENTO', 'AGUARDANDO PENDÊNCIAS'].includes(status))
    return <h1 className={`rounded-full bg-orange-500 px-2 py-1 text-center text-[0.65rem] font-bold text-white lg:text-xs`}>{status}</h1>
  if (status == 'REPROVADO COM REDUÇÃO')
    return <h1 className={`rounded-full bg-orange-700 px-2 py-1 text-center text-[0.65rem] font-bold text-white lg:text-xs`}>{status}</h1>
  if (['APROVADO COM OBRAS', 'APROVADO COM REDUÇÃO'].includes(status))
    return <h1 className={`rounded-full bg-green-700 px-2 py-1 text-center text-[0.65rem] font-bold text-white lg:text-xs`}>{status}</h1>
  if (status == 'APROVADO')
    return <h1 className={`rounded-full bg-green-500 px-2 py-1 text-center text-[0.65rem] font-bold text-white lg:text-xs`}>{status}</h1>
  return <h1 className={`rounded-full bg-gray-800 px-2 py-1 text-center text-[0.65rem] font-bold text-white lg:text-xs`}>{status}</h1>
}
type ActiveHomologationProps = {
  homologation: THomologationDTO
}
function ActiveHomologation({ homologation }: ActiveHomologationProps) {
  return (
    <div className="flex w-full items-center rounded-md border border-gray-200 p-3">
      <div className={`h-full w-[5px] rounded-bl-md rounded-tl-md ${getTagColor(homologation.status)}`}></div>
      <div className="flex grow flex-col p-3">
        <div className="flex w-full items-start justify-between">
          <div className="flex flex-col">
            <h1 className="grow cursor-pointer text-center text-sm font-black leading-none tracking-tight duration-300 ease-in-out hover:text-cyan-500 lg:text-start">
              {homologation.titular.nome}
            </h1>
            <div className="flex items-center gap-1">
              <BsCode />
              <p className="text-xs font-medium tracking-tight text-gray-500">INSTALAÇÃO Nº {homologation.instalacao.numeroInstalacao}</p>
            </div>
          </div>

          {getStatusTag(homologation.status)}
        </div>
        <div className="mt-2 flex w-full items-center justify-between gap-2">
          <div className="flex flex-col items-start">
            <h1 className="text-[0.65rem] font-light leading-none tracking-tight text-gray-500 lg:text-xs">REQUISITADO</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded p-1">
                <FaSolarPanel />
                <p className="text-xs font-medium tracking-tight text-gray-500">
                  {formatDecimalPlaces(getModulesPeakPotByProducts(homologation.equipamentos as TProductItem[]))} kWp EM MÓDULOS
                </p>
              </div>
              <div className="flex items-center gap-1 rounded p-1">
                <ImPower />
                <p className="text-xs font-medium tracking-tight text-gray-500">
                  {formatDecimalPlaces(getInverterPeakPowerByProducts(homologation.equipamentos as TProductItem[]))} kWp EM INVERSORES
                </p>
              </div>
            </div>
          </div>
          {!!homologation.potencia && homologation.potencia > 0 ? (
            <div className="flex flex-col items-end">
              <h1 className="text-[0.65rem] font-light leading-none tracking-tight text-gray-500 lg:text-xs">LIBERADO</h1>
              <div className="flex items-center gap-1 rounded bg-green-50 p-1 text-green-500">
                <FaBolt />
                <p className="text-xs font-medium tracking-tight">{formatDecimalPlaces(homologation.potencia)} kWp EM INVERSORES</p>
              </div>
            </div>
          ) : null}
        </div>
        <div className="mt-2 flex w-full items-center justify-end gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Avatar url={homologation.autor.avatar_url || undefined} fallback={formatNameAsInitials(homologation.autor.nome)} height={25} width={25} />
              <p className="text-xs font-medium tracking-tight">{homologation.autor.nome}</p>
            </div>
            <div className="flex items-center gap-1">
              <BsCalendarPlus />
              <p className="text-xs font-medium tracking-tight">{formatDateAsLocale(homologation.dataInsercao, true)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActiveHomologation
