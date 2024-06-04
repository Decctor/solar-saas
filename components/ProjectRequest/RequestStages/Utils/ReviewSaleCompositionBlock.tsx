import React from 'react'
import { MdOutlineTimer, MdRepeat } from 'react-icons/md'
import ProductCard from './ProductCard'
import ServiceCard from './ServiceCard'
import ProjectObservations from './ProjectObservations'
import { TProject } from '@/utils/schemas/project.schema'
import { Session } from 'next-auth'

type ReviewSaleCompositionBlockProps = {
  infoHolder: TProject
  setInfoHolder: React.Dispatch<React.SetStateAction<TProject>>
  session: Session
}
function ReviewSaleCompositionBlock({ infoHolder, setInfoHolder, session }: ReviewSaleCompositionBlockProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="w-full rounded bg-gray-800 p-1 text-center font-bold text-white">COMPOSIÇÃO DA VENDA</h1>
      <div className="flex w-full flex-col gap-2">
        <div className="my-1 flex w-full flex-col">
          <p className="w-full text-center text-sm font-light tracking-tighter text-gray-700">A composição de venda é feita de PRODUTOS e SERVIÇOS.</p>
          <p className="w-full text-center text-sm font-light tracking-tighter text-gray-700">
            As categorias de venda são KITS, PLANOS, PRODUTOS avulsos e SERVIÇOS avulsos.
          </p>
        </div>
        <div className="my-2 flex flex-col self-center rounded border border-[#fead41] p-3 px-6 shadow-sm">
          <h1 className="w-full text-center font-black tracking-tight text-[#fead41]">VENDA {infoHolder.venda.tipo}</h1>
          {infoHolder.venda.tipo == 'ÚNICA' ? null : (
            <div className="flex w-full items-center justify-center gap-2">
              <div className="flex items-center gap-1">
                <MdRepeat />
                <p className="text-[0.65rem] font-bold lg:text-xs">{infoHolder.venda.intervalo}</p>
              </div>
              <div className="flex items-center gap-1">
                <MdOutlineTimer />
                <p className="text-[0.65rem] font-bold lg:text-xs">{infoHolder.venda.espacamento}</p>
              </div>
            </div>
          )}
        </div>
        <h1 className="w-full rounded-md bg-blue-500 p-1 text-center text-sm font-bold text-white">PRODUTOS</h1>
        <div className="flex w-full flex-wrap items-center justify-start gap-2">
          {infoHolder.produtos.map((product, index) => (
            <div className="w-full lg:w-[400px]">
              <ProductCard key={index} product={product} />
            </div>
          ))}
        </div>
        <h1 className="w-full rounded-md bg-blue-500 p-1 text-center text-sm font-bold text-white">SERVIÇOS</h1>
        <div className="flex w-full flex-wrap items-center justify-start gap-2">
          {infoHolder.servicos.map((service, index) => (
            <div className="w-full lg:w-[400px]">
              <ServiceCard key={index} service={service} />
            </div>
          ))}
        </div>
        <ProjectObservations session={session} infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
      </div>
    </div>
  )
}

export default ReviewSaleCompositionBlock
