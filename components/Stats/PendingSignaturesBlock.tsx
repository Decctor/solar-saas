import { formatLongString, formatToMoney } from '@/utils/methods'
import React from 'react'
import Avatar from '../utils/Avatar'
import { FaSignature } from 'react-icons/fa'
import { ISession } from '@/utils/models'
import Link from 'next/link'
import { Session } from 'next-auth'
import { TStats } from '@/utils/queries/stats'
type PendingSignaturesBlockProps = {
  data?: TStats
  session: Session
}

function PendingSignaturesBlock({ data, session }: PendingSignaturesBlockProps) {
  function getIdleMoney(list?: any) {
    if (!list) return 0
    const total = list.reduce((acc: any, current: any) => {
      const proposalValue = current.valorProposta || 0
      return acc + proposalValue
    }, 0)
    return total
  }
  return (
    <div className="flex h-[450px] w-full flex-col items-center rounded-xl border border-gray-200 bg-[#fff] p-6 shadow-sm lg:w-[40%]">
      <div className="flex min-h-[42px] w-full flex-col">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-medium uppercase tracking-tight">Contratos para Assinar</h1>
          <FaSignature />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">{data?.assinaturasPendentes ? data.assinaturasPendentes.length : 0} assinaturas para coletar</p>
          <p className="text-sm text-gray-500">{formatToMoney(getIdleMoney(data?.assinaturasPendentes))}</p>
        </div>
      </div>
      <div className="flex w-full grow flex-col justify-start gap-2 overflow-y-auto overscroll-y-auto py-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
        {data?.assinaturasPendentes ? (
          data?.assinaturasPendentes.length > 0 ? (
            data?.assinaturasPendentes.map((project, index: number) => (
              <div key={index} className="flex w-full flex-col items-center justify-between border-b  border-gray-200 p-2 md:flex-row md:border-b-0">
                <div className="flex w-full items-start gap-4 md:grow">
                  <div className="flex grow flex-col items-start">
                    <Link href={`/projeto/id/${project._id}`}>
                      <h1 className="w-full text-start text-sm font-medium leading-none tracking-tight hover:text-cyan-500">
                        {formatLongString(project?.nome.toUpperCase() || '', 30)}
                      </h1>
                    </Link>
                    <div className="mt-1 flex w-full items-center justify-start gap-2">
                      {project.responsaveis.map((resp) => (
                        <div className="flex items-center gap-2">
                          <Avatar fallback={'R'} url={resp?.avatar_url || undefined} height={20} width={20} />

                          <p className="text-xs text-gray-500">{resp?.nome}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex min-w-[120px] items-center justify-center gap-1 lg:justify-end">
                  <p className="font-medium">{project?.valorProposta ? formatToMoney(project.valorProposta) : 'N/A'}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex grow items-center justify-center">
              <p className="text-center text-sm italic text-gray-500">Sem assinaturas pendentes...</p>
            </div>
          )
        ) : null}
      </div>
    </div>
  )
}

export default PendingSignaturesBlock
