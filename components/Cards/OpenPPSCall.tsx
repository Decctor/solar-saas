import React from 'react'
import Avatar from '../utils/Avatar'
import { BsCalendarCheck, BsCalendarFill, BsCalendarPlus } from 'react-icons/bs'
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'
import { TPPSCallDTO } from '@/utils/schemas/integrations/app-ampere/pps-calls.schema'
import { Session } from 'next-auth'
import { formatDateAsLocale } from '@/lib/methods/formatting'

function getBarColor(status?: TPPSCallDTO['status'] | null) {
  if (status == 'EM ANDAMENTO') return 'bg-blue-500'
  if (status == 'REALIZADO') return 'bg-green-500'
  if (status == 'PENDENTE') return 'bg-red-400'
  if (status == 'AGUARDANDO VENDEDOR') return 'bg-orange-400'
  return 'bg-red-400'
}
function getStatusTag(status?: TPPSCallDTO['status'] | null) {
  if (status == 'EM ANDAMENTO')
    return <h1 className={`min-w-fit rounded-full bg-blue-500 px-2 py-1 text-center text-[0.55rem] font-bold text-white`}>EM ANDAMENTO</h1>
  if (status == 'REALIZADO')
    return <h1 className={`min-w-fit rounded-full bg-green-500 px-2 py-1 text-center text-[0.55rem] font-bold text-white`}>REALIZADO</h1>
  if (status == 'PENDENTE') return <h1 className={`min-w-fit rounded-full bg-red-400 px-2 py-1 text-center text-[0.55rem] font-bold text-white`}>PENDENTE</h1>

  if (status == 'AGUARDANDO VENDEDOR')
    return <h1 className={`min-w-fit rounded-full bg-orange-400 px-2 py-1 text-center text-[0.55rem] font-bold text-white`}>AG. VENDENDOR</h1>
  return <h1 className={`min-w-fit rounded-full bg-red-400 px-2 py-1 text-center text-[0.55rem] font-bold text-white`}>PENDENTE</h1>
}
type PPSCallCardProps = {
  session: Session
  call: TPPSCallDTO
}
function PPSCallCard({ call, session }: PPSCallCardProps) {
  return (
    <div className="flex w-full gap-2 rounded-md border border-gray-300 shadow-sm">
      <div className={`h-full w-[7px] ${getBarColor(call.status)} rounded-bl-md rounded-tl-md`}></div>
      <div className="flex w-full grow flex-col gap-1 p-3">
        <div className="flex w-full grow flex-col">
          <div className="flex w-full items-center justify-between gap-2">
            <h1 className="text-start text-xs font-bold leading-none tracking-tight ">{call.tipoSolicitacao}</h1>
            {getStatusTag(call.status)}
          </div>
          {call.requerente.avatar_url && !session?.user.permissoes.oportunidades.escopo ? (
            <div className="flex w-full items-center justify-start gap-2">
              <Avatar fallback={'R'} url={call.requerente?.avatar_url} height={20} width={20} />

              <p className="text-[0.6rem] font-medium text-gray-500">{call.requerente && call.requerente.apelido}</p>
            </div>
          ) : (
            <p className="w-full text-start text-xs text-gray-500">{call.requerente ? call.requerente.nomeCRM : 'Requerente não definido'}</p>
          )}
        </div>
        <div className="mt-2 flex w-full items-center justify-between">
          <div className={`flex items-center gap-2`}>
            <div className="ites-center flex gap-1">
              <BsCalendarPlus />
              <p className={`text-xs font-medium text-gray-500`}>{formatDateAsLocale(call.dataInsercao, true)}</p>
            </div>
            {call.dataEfetivacao ? (
              <div className="ites-center flex gap-1">
                <BsCalendarCheck color="rgb(34,197,94)" />
                <p className={`text-xs font-medium text-gray-500`}>{formatDateAsLocale(call.dataEfetivacao)}</p>
              </div>
            ) : null}
          </div>
          <div className="flex items-center justify-center gap-1">
            <p className="text-xs font-medium text-gray-500">VOLTS</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PPSCallCard
