import { TServiceItem } from '@/utils/schemas/kits.schema'
import React from 'react'
import { AiOutlineSafety } from 'react-icons/ai'
import { MdOutlineMiscellaneousServices } from 'react-icons/md'

type ServiceCardProps = {
  service: TServiceItem
}
function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="mt-1 flex flex-col gap-1 rounded-md border border-gray-200 p-2">
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <div className="flex h-[20px] w-[20px] items-center justify-center rounded-full border border-black p-1">
            <MdOutlineMiscellaneousServices />
          </div>
          <p className="text-[0.6rem] font-medium leading-none tracking-tight lg:text-xs">{service.descricao}</p>
        </div>
      </div>
      <div className="flex w-full items-center justify-end gap-1">
        <AiOutlineSafety size={12} />
        <p className="text-[0.6rem] font-light text-gray-500">{service.garantia > 1 ? `${service.garantia} ANOS` : `${service.garantia} ANO`} </p>
      </div>
    </div>
  )
}

export default ServiceCard
