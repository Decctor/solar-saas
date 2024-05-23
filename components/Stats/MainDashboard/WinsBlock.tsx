import Avatar from '@/components/utils/Avatar'
import { formatToMoney } from '@/lib/methods/formatting'
import { formatLongString } from '@/utils/methods'
import { TGeneralStats } from '@/utils/schemas/stats.schema'
import { Session } from 'next-auth'
import Link from 'next/link'
import React from 'react'
import { BsCode, BsFillMegaphoneFill } from 'react-icons/bs'
import { MdOutlineAttachMoney, MdSell } from 'react-icons/md'

type WinsBlockProps = {
  data: TGeneralStats['ganhos']
  session: Session
}
function WinsBlock({ data, session }: WinsBlockProps) {
  return (
    <div className="flex h-[650px] w-full flex-col rounded-xl  border border-gray-200 bg-[#fff] p-6 shadow-sm lg:h-[450px]">
      <div className="flex min-h-[42px] w-full flex-col">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-medium uppercase tracking-tight">Projetos ganhos</h1>
          <MdSell />
        </div>
        <p className="text-sm text-gray-500">{data.length || 0} no período de escolha</p>
      </div>
      <div className="flex grow flex-col justify-start gap-2 overflow-y-auto overscroll-y-auto py-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
        {data.length > 0 ? (
          data.map((win, index: number) => (
            <div key={index} className="flex w-full flex-col items-center justify-between border-b  border-gray-200 p-2 md:flex-row md:border-b-0">
              <div className="flex w-full items-start gap-4 md:grow">
                <div className="flex h-[30px] min-h-[30px] w-[30px] min-w-[30px] items-center justify-center rounded-full border border-black">
                  <MdOutlineAttachMoney />
                </div>
                <div className="flex grow flex-col items-start">
                  <Link href={`/comercial/proposta/${win.proposta?._id}`}>
                    <h1 className="w-full text-start text-sm font-medium leading-none tracking-tight duration-300 ease-in-out hover:text-cyan-500">
                      {formatLongString(win?.proposta?.nome.toUpperCase() || '', 30)}
                    </h1>
                  </Link>

                  <div className="mt-1 flex w-full items-center justify-start gap-2">
                    <Link href={`/comercial/oportunidades/id/${win._id}`} className="text-gray-500 duration-300 ease-in-out hover:text-cyan-500">
                      <div className="flex items-center gap-1">
                        <BsCode />
                        <p className="text-xs">#{win.nome}</p>
                      </div>
                    </Link>
                    {win.idMarketing ? (
                      <div className="flex items-center justify-center rounded-full border border-[#3e53b2] p-1 text-[#3e53b2]">
                        <BsFillMegaphoneFill size={10} />
                      </div>
                    ) : null}
                    {win.responsaveis.map((resp) => (
                      <div className="flex items-center gap-2">
                        <Avatar fallback={'R'} url={resp?.avatar_url || undefined} height={20} width={20} />
                        <p className="text-xs text-gray-500">{resp.nome}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex min-w-fit items-center gap-1">
                <p className="font-medium">{win.proposta?.valor ? formatToMoney(win.proposta.valor) : 'N/A'}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex grow items-center justify-center">
            <p className="text-center text-sm italic text-gray-500">Sem projetos ganhos no período.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default WinsBlock
