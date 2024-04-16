import { getInverterPeakPowerByProducts, getModulesPeakPotByProducts, getPeakPotByModules } from '@/lib/methods/extracting'
import { THomologationDTO } from '@/utils/schemas/homologation.schema'
import { TProductItem } from '@/utils/schemas/kits.schema'
import React from 'react'
import { BsCalendarPlus, BsCode } from 'react-icons/bs'
import { ImPower } from 'react-icons/im'
import Avatar from '../utils/Avatar'
import { formatDateAsLocale, formatNameAsInitials } from '@/lib/methods/formatting'
import { FaSolarPanel } from 'react-icons/fa'

type OpportunityHomologationCardProps = {
  homologation: THomologationDTO
}
function OpportunityHomologationCard({ homologation }: OpportunityHomologationCardProps) {
  return (
    <div className="flex w-full flex-col items-center rounded-md border border-gray-200 p-3">
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

        <h1 className={`rounded-full bg-gray-800 px-2 py-1 text-center text-[0.6rem] font-bold text-white lg:text-[0.65rem]`}>{homologation.status}</h1>
      </div>
      <div className="mt-2 flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <FaSolarPanel />
            <p className="text-xs font-medium tracking-tight text-gray-500">
              {getModulesPeakPotByProducts(homologation.equipamentos as TProductItem[])} kWp EM MÓDULOS
            </p>
          </div>
          <div className="flex items-center gap-1">
            <ImPower />
            <p className="text-xs font-medium tracking-tight text-gray-500">
              {getInverterPeakPowerByProducts(homologation.equipamentos as TProductItem[])} kWp EM INVERSORES
            </p>
          </div>
        </div>
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
  )
}

export default OpportunityHomologationCard
