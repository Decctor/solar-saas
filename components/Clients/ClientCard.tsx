import { formatDateAsLocale, formatLocation } from '@/lib/methods/formatting'
import { TClient, TClientDTO, TClientDTOSimplified } from '@/utils/schemas/client.schema'
import { TOpportunity } from '@/utils/schemas/opportunity.schema'
import React from 'react'
import { BsCalendarPlus } from 'react-icons/bs'
import { FaCity, FaPhone } from 'react-icons/fa'
import { MdLocationPin } from 'react-icons/md'
import Avatar from '../utils/Avatar'

type ClientCard = {
  client: TClientDTOSimplified
  openModal: (id: string) => void
}
function ClientCard({ client, openModal }: ClientCard) {
  const location: TOpportunity['localizacao'] = {
    cep: client.cep,
    uf: client.uf,
    cidade: client.cidade,
    bairro: client.bairro,
    endereco: client.endereco,
    numeroOuIdentificador: client.numeroOuIdentificador,
    complemento: client.complemento,
  }
  return (
    <div className="flex w-full flex-col rounded-md border border-gray-500 bg-[#fff] p-4 font-Inter lg:w-[480px]">
      <div className="flex w-full items-center justify-between gap-2">
        <h1 onClick={() => openModal(client._id)} className="grow cursor-pointer text-xs font-black leading-none tracking-tight hover:text-cyan-500 lg:text-sm">
          {client.nome}
        </h1>
        <div className="flex items-center gap-2">
          <FaPhone />
          <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">{client.telefonePrimario}</p>
        </div>
      </div>
      <div className="mt-2 flex w-full flex-wrap items-center justify-between">
        <div className="flex items-center gap-2">
          <FaCity />
          <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">
            {client.cidade} {client.uf ? `(${client.uf})` : null}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <MdLocationPin />
          <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">{formatLocation({ location }) || 'NÃO PREENCHIDO'}</p>
        </div>
      </div>

      <div className="mt-2 flex w-full items-center justify-end gap-2">
        <div className={`flex items-center gap-1`}>
          <BsCalendarPlus />
          <p className="text-[0.65rem] font-medium text-gray-500">{formatDateAsLocale(client.dataInsercao, true)}</p>
        </div>
        <div className="flex items-center gap-1">
          <Avatar fallback={'R'} url={client.autor.avatar_url || undefined} height={20} width={20} />
          <p className="text-[0.65rem] font-medium text-gray-500">{client.autor.nome}</p>
        </div>
      </div>
    </div>
  )
}

export default ClientCard
