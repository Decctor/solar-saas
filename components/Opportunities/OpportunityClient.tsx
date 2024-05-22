import { formatDateAsLocale } from '@/lib/methods/formatting'
import { TClientDTO } from '@/utils/schemas/client.schema'
import React, { useState } from 'react'
import { AiFillEdit, AiOutlineUser } from 'react-icons/ai'
import { BsCalendarPlus, BsTelephoneFill } from 'react-icons/bs'
import { FaCity, FaUser } from 'react-icons/fa'
import { GiPositionMarker } from 'react-icons/gi'
import { HiIdentification } from 'react-icons/hi'
import { MdEmail } from 'react-icons/md'
import Avatar from '../utils/Avatar'
import { Session } from 'next-auth'
import EditClient from '../Modals/Client/EditClient'

type OpportunityClientProps = {
  opportunityId: string
  client: TClientDTO
  session: Session
}
function OpportunityClient({ opportunityId, client, session }: OpportunityClientProps) {
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false)
  const userScope = session.user.permissoes.clientes.escopo
  const userHasClientEditPermission = !userScope || userScope.includes(client.autor.id)
  return (
    <div className="flex h-[450px] w-full flex-col rounded-md border border-gray-200 bg-[#fff] p-3 shadow-lg lg:h-[300px]">
      <div className="flex h-[40px] items-center justify-between border-b border-gray-200 pb-2">
        <h1 className="font-bold text-black">Dados do Cliente</h1>
        {userHasClientEditPermission ? (
          <button onClick={() => setEditModalIsOpen(true)} className="text-md text-gray-400 duration-300 ease-in-out hover:text-blue-800">
            <AiFillEdit />
          </button>
        ) : null}
      </div>
      <div className="mt-3 flex w-full grow flex-col gap-1 lg:flex-row">
        <div className="flex h-full w-full flex-col items-start justify-around gap-2 lg:w-[50%] lg:items-center">
          <div className="flex w-full items-start justify-center gap-2 lg:justify-start">
            <div className="flex h-[25px] min-h-[25px] w-[25px] min-w-[25px] items-center justify-center rounded-full border border-black p-1">
              <FaUser size={12} />
            </div>
            <p className="font-Poppins text-sm text-gray-500">{client.nome}</p>
          </div>
          <div className="flex w-full items-start justify-center gap-2 lg:justify-start">
            <div className="flex h-[25px] min-h-[25px] w-[25px] min-w-[25px] items-center justify-center rounded-full border border-black p-1">
              <MdEmail size={12} />
            </div>
            <p className="break-all font-Poppins text-sm text-gray-500">{client.email || 'NÃO DEFINIDO'}</p>
          </div>
          <div className="flex w-full items-start justify-center gap-2 lg:justify-start">
            <div className="flex h-[25px] min-h-[25px] w-[25px] min-w-[25px] items-center justify-center rounded-full border border-black p-1">
              <BsTelephoneFill size={12} />
            </div>
            <p className="font-Poppins text-sm text-gray-500">{client.telefonePrimario}</p>
          </div>
        </div>
        <div className="flex h-full w-full flex-col items-start justify-around gap-2 lg:w-[50%] lg:items-center">
          <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
            <div className="flex h-[25px] min-h-[25px] w-[25px] min-w-[25px] items-center justify-center rounded-full border border-black p-1">
              <HiIdentification size={12} />
            </div>
            <p className="font-Poppins text-sm text-gray-500">{client.cpfCnpj || 'NÃO DEFINIDO'}</p>
          </div>
          <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
            <div className="flex h-[25px] min-h-[25px] w-[25px] min-w-[25px] items-center justify-center rounded-full border border-black p-1">
              <FaCity size={12} />
            </div>
            <p className="font-Poppins text-sm text-gray-500">
              {client.cidade} ({client.uf})
            </p>
          </div>
          <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
            <div className="flex h-[25px] min-h-[25px] w-[25px] min-w-[25px] items-center justify-center rounded-full border border-black p-1">
              <GiPositionMarker size={12} />
            </div>
            <p className="font-Poppins text-sm text-gray-500">
              {client.endereco || 'NÃO DEFINIDO'}, {client.bairro || 'NÃO DEFINIDO'}, Nº {client.numeroOuIdentificador}, CEP: {client.cep || 'NÃO DEFINIDO'}
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-end gap-2">
        <div className={`flex items-center gap-1`}>
          <BsCalendarPlus />
          <p className="text-[0.65rem] font-medium text-gray-500">{formatDateAsLocale(client.dataInsercao, true)}</p>
        </div>
        <div className="flex items-center gap-1">
          <Avatar fallback={'R'} url={client.autor.avatar_url || undefined} height={20} width={20} />
          <p className="text-[0.65rem] font-medium text-gray-500">{client.autor.nome}</p>
        </div>
      </div>
      {editModalIsOpen ? (
        <EditClient
          clientId={client._id}
          session={session}
          partnerId={client.idParceiro}
          closeModal={() => setEditModalIsOpen(false)}
          additionalAffectedQuery={['opportunity-by-id', opportunityId]}
        />
      ) : null}
    </div>
  )
}

export default OpportunityClient
