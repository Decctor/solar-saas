import { getInverterPeakPowerByProducts, getModulesPeakPotByProducts } from '@/lib/methods/extracting'
import { formatDateAsLocale, formatNameAsInitials } from '@/lib/methods/formatting'
import { THomologationDTO } from '@/utils/schemas/homologation.schema'
import { TProductItem } from '@/utils/schemas/kits.schema'
import React from 'react'
import { BsCalendarCheck, BsCalendarPlus, BsCode } from 'react-icons/bs'
import { FaSolarPanel } from 'react-icons/fa'
import { ImPower } from 'react-icons/im'
import Avatar from '../utils/Avatar'

type HomologationCardProps = {
  homologation: THomologationDTO
  openModal: (id: string) => void
}
function HomologationCard({ homologation, openModal }: HomologationCardProps) {
  return (
    <div className="flex w-full flex-col items-center rounded-md border border-gray-200 p-3 lg:w-[450px]">
      <div className="flex w-full items-start justify-between">
        <div className="flex grow flex-col">
          <h1
            onClick={() => openModal(homologation._id)}
            className="cursor-pointer text-center text-sm font-black leading-none tracking-tight duration-300 ease-in-out hover:text-cyan-500 lg:text-start"
          >
            {homologation.titular.nome}
          </h1>
          <div className="flex items-center gap-1">
            <BsCode />
            <p className="text-xs font-medium tracking-tight text-gray-500">INSTALAÇÃO Nº {homologation.instalacao.numeroInstalacao}</p>
          </div>
        </div>
        <h1 className={`rounded-full bg-gray-800 px-2 py-1 text-center text-[0.65rem] font-bold text-white lg:text-xs`}>{homologation.status}</h1>
      </div>
      <div className="mt-2 flex w-full items-center justify-start gap-2">
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
      <div className="mt-2 flex w-full items-center justify-start gap-2">
        <Avatar url={homologation.autor.avatar_url || undefined} fallback={formatNameAsInitials(homologation.autor.nome || 'U')} width={20} height={20} />
        <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">
          REQUERIDO POR <strong className="text-cyan-500">{homologation.autor.nome?.toUpperCase() || 'NÃO DEFINIDO'}</strong>
        </p>
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        {homologation.dataEfetivacao ? (
          <div className="flex items-center gap-1">
            <BsCalendarCheck />
            <p className="text-xs font-medium tracking-tight">{formatDateAsLocale(homologation.dataEfetivacao, true)}</p>
          </div>
        ) : (
          <div></div>
        )}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <BsCalendarPlus />
            <p className="text-xs font-medium tracking-tight">{formatDateAsLocale(homologation.dataInsercao, true)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomologationCard
