import Avatar from '@/components/utils/Avatar'
import { formatNameAsInitials } from '@/lib/methods/formatting'
import { useLeadReceivers } from '@/utils/queries/users'
import React from 'react'

function LeadReceiversBlock() {
  const { data: leadReceivers, isLoading: receiversLoading } = useLeadReceivers()
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="text-xs font-medium leading-none tracking-tight text-gray-500">RECEBEDORES DE LEAD</h1>
      <div className="flex w-full items-center justify-start gap-4">
        {leadReceivers ? (
          leadReceivers.length > 0 ? (
            leadReceivers.map((receiver) => (
              <div key={receiver._id} className="flex items-center gap-2 rounded-lg border border-cyan-500 p-1 px-2 shadow-sm">
                <Avatar width={20} height={20} url={receiver.avatar_url || undefined} fallback={formatNameAsInitials(receiver.nome)} />
                <p className="text-xs font-medium tracking-tight text-gray-500">{receiver.nome}</p>
              </div>
            ))
          ) : (
            <h1 className="text-center text-xs font-medium leading-none tracking-tight text-gray-500">Não há recebedores de leads configurados.</h1>
          )
        ) : null}
      </div>
    </div>
  )
}

export default LeadReceiversBlock
