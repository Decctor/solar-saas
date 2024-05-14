import React from 'react'
import CreditorsBlock from '../Personalization/CreditorsBlock'
import { Session } from 'next-auth'
import EquipmentsBlock from '../Personalization/EquipmentsBlock'

type PersonalizationProps = {
  session: Session
}
function Personalization({ session }: PersonalizationProps) {
  return (
    <div className="flex h-full grow flex-col">
      <div className="flex w-full items-center justify-between border-b border-gray-200 pb-2">
        <div className="flex flex-col">
          <h1 className={`text-lg font-bold`}>Controle de personalizações</h1>
          <p className="text-sm text-[#71717A]">Gerencie e configure as equipamentos, credores, etc.</p>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2 py-2">
        <CreditorsBlock session={session} />
        <EquipmentsBlock session={session} />
      </div>
    </div>
  )
}

export default Personalization
