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
import { useHomologationById } from '@/utils/queries/homologations'
import LoadingComponent from '@/components/utils/LoadingComponent'
import ErrorComponent from '@/components/utils/ErrorComponent'
import ActiveHomologation from './ActiveHomologation'

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
  if (status == 'PENDENTE')
    return <h1 className={`w-fit self-center rounded border border-gray-500 p-1 text-center text-[0.6rem] font-black text-gray-500`}>{status}</h1>
  if (status == 'ELABORANDO DOCUMENTAÇÕES')
    return <h1 className={`w-fit self-center rounded border border-blue-500 p-1 text-center text-[0.6rem] font-black text-blue-500`}>{status}</h1>
  if (['AGUARDANDO ASSINATURA', 'AGUARDANDO FATURAMENTO', 'AGUARDANDO PENDÊNCIAS'].includes(status))
    return <h1 className={`w-fit self-center rounded border border-orange-500 p-1 text-center text-[0.6rem] font-black text-orange-500`}>{status}</h1>
  if (status == 'REPROVADO COM REDUÇÃO')
    return <h1 className={`w-fit self-center rounded border border-orange-700 p-1 text-center text-[0.6rem] font-black text-orange-700`}>{status}</h1>
  if (['APROVADO COM OBRAS', 'APROVADO COM REDUÇÃO'].includes(status))
    return <h1 className={`w-fit self-center rounded border border-green-700 p-1 text-center text-[0.6rem] font-black text-green-700`}>{status}</h1>
  if (status == 'APROVADO')
    return <h1 className={`w-fit self-center rounded border border-green-500 p-1 text-center text-[0.6rem] font-black text-green-500`}>{status}</h1>
  return <h1 className={`w-fit self-center rounded border border-gray-500 p-1 text-center text-[0.6rem] font-black text-gray-500`}>{status}</h1>
}
type ReviewActiveHomologationProps = {
  homologationId: string
}
function ReviewActiveHomologation({ homologationId }: ReviewActiveHomologationProps) {
  const { data: homologation, isLoading, isError, isSuccess } = useHomologationById({ id: homologationId })
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="w-full rounded bg-gray-800 p-1 text-center font-bold text-white">INFORMAÇÕES DA HOMOLOGAÇÃO</h1>
      <div className="flex w-full flex-col gap-2">
        {isLoading ? <LoadingComponent /> : null}
        {isError ? <ErrorComponent msg="Oops, houve um erro ao buscar informações da homologação escolhida." /> : null}
        {isSuccess ? (
          <div className="mb-6 flex w-full flex-col items-center justify-center rounded border border-green-500">
            <h1 className="w-full rounded-md rounded-tl rounded-tr bg-green-500 p-1 text-center text-sm font-bold text-white">HOMOLOGAÇÃO ATIVA</h1>
            <div className="flex w-full items-center justify-center p-2">
              <ActiveHomologation homologation={homologation} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ReviewActiveHomologation
