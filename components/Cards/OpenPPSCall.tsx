import { IPPSCall } from '@/utils/models'
import React from 'react'
import Avatar from '../utils/Avatar'
import { BsCalendarFill } from 'react-icons/bs'
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'

function getBarColor(status?: string | null) {
  if (status == 'EM ANDAMENTO') return 'bg-blue-500'
  if (status == 'REALIZADO') return 'bg-green-500'
  if (status == 'PENDENTE') return 'bg-red-400'
  return 'bg-red-400'
}
type OpenPPSCallProps = {
  call: IPPSCall
}
function OpenPPSCall({ call }: OpenPPSCallProps) {
  const { data: session } = useSession()
  return (
    <div className="flex w-full  gap-2 rounded-md border border-gray-300 shadow-sm">
      <div className={`h-full w-[7px] ${getBarColor(call.status)} rounded-bl-md rounded-tl-md`}></div>
      <div className="flex w-full grow flex-col gap-1 p-3">
        <div className="flex w-full grow flex-col">
          <h1 className="w-full text-start text-xs font-bold leading-none tracking-tight ">{call.tipoSolicitacao}</h1>
          {call.requerente.avatar_url && session?.user.visibilidade == 'GERAL' ? (
            <div className="mt-1 flex w-full items-center justify-start gap-2">
              <Avatar fallback={'R'} url={call.requerente?.avatar_url} height={20} width={20} />

              <p className="text-[0.6rem] font-medium text-gray-500">{call.requerente && call.requerente.apelido}</p>
            </div>
          ) : (
            <p className="mt-1 w-full text-start text-xs text-gray-500">{call.requerente ? call.requerente.nomeCRM : 'Requerente não definido'}</p>
          )}
        </div>
        <div className="flex w-full items-center justify-between">
          <div className={`flex items-center gap-2 ${call.dataEfetivacao ? 'text-green-500' : 'text-gray-500'}`}>
            <BsCalendarFill />
            <p className="text-[0.6rem] font-medium">
              {dayjs(call.dataEfetivacao ? call.dataEfetivacao : call.dataInsercao).format('DD/MM/YYYY HH:mm')}
            </p>
          </div>
          <p className="tracking-tig mt-1 text-[0.6rem] font-medium uppercase leading-none text-gray-500">
            <strong className="text-[#fead41]">{call.projeto?.codigo}</strong> {call.projeto?.nome}
          </p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-sm font-medium text-gray-500">Volts</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OpenPPSCall
