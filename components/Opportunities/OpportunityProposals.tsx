import React from 'react'
import LoadingComponent from '../utils/LoadingComponent'

import { MdAdd } from 'react-icons/md'

import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import ProposalItem from '../Cards/ProposalItem'
import { useOpportunityProposals } from '@/utils/queries/proposals'
import { Session } from 'next-auth'
import ErrorComponent from '../utils/ErrorComponent'
import { TOpportunityBlockMode } from './OpportunityPage'

type OpportunityProposalsProps = {
  city?: string | null
  uf?: string | null
  session: Session
  opportunityId: string
  idActiveProposal?: string
  setBlockMode: React.Dispatch<React.SetStateAction<TOpportunityBlockMode>>
  opportunityHasContractRequested: boolean
  opportunityIsWon: boolean
  opportunityWonProposalId?: string | null
}
function OpportunityProposals({
  city,
  uf,
  opportunityId,
  idActiveProposal,
  session,
  opportunityHasContractRequested,
  opportunityIsWon,
  opportunityWonProposalId,
  setBlockMode,
}: OpportunityProposalsProps) {
  const router = useRouter()
  const {
    data: opportunityProposals,
    isLoading: opportunityProposalsLoading,
    isSuccess: opportunityProposalsSuccess,
    isError: opportunityProposalsError,
  } = useOpportunityProposals({ opportunityId: opportunityId })
  console.log('PROPOSTAS DA OPORTUNIDADE', opportunityProposals)

  return (
    <div className="flex h-[250px] w-full flex-col rounded-md border border-gray-200 bg-[#fff] p-3 shadow-lg">
      <div className="flex  h-[40px] items-center  justify-between border-b border-gray-200 pb-2">
        <div className="flex items-center justify-center gap-5">
          <h1 className="p-1 text-center font-bold text-black">Propostas</h1>
          {/* <h1
            onClick={() => setBlockMode('FILES')}
            className="w-[120px] cursor-pointer border-b border-transparent p-1 text-center font-bold text-black hover:border-blue-500"
          >
            Arquivos
          </h1>
          <h1
            onClick={() => setBlockMode('TECHNICAL ANALYSIS')}
            className="w-[150px] cursor-pointer border-b border-transparent p-1 text-center font-bold text-black hover:border-blue-500"
          >
            Análises Técnicas
          </h1> */}
        </div>
        {opportunityIsWon ? null : (
          <>
            <button
              onClick={() => {
                router.push(`/comercial/oportunidades/proposta/${opportunityId}`)
              }}
              className="hidden rounded bg-green-600 p-1 text-[0.7rem] font-bold text-white lg:flex"
            >
              GERAR PROPOSTA
            </button>
            <button
              onClick={() => {
                if (!city || !uf) {
                  toast.error('Por favor, preecha a cidade e o estado do cliente antes de prosseguir para geração de propostas.')
                } else {
                  router.push(`/comercial/oportunidades/proposta/${opportunityId}`)
                }
              }}
              className="flex rounded bg-green-600 p-1 text-sm font-bold text-white lg:hidden"
            >
              <MdAdd />
            </button>
          </>
        )}
      </div>
      <div className="overscroll-y flex w-full grow flex-col gap-1 overflow-y-auto py-1 pr-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
        {opportunityProposalsLoading ? (
          <div className="flex grow items-center justify-center">
            <LoadingComponent />
          </div>
        ) : null}
        {opportunityProposalsError ? <ErrorComponent msg="Oops, erro ao buscar propostas da oportunidade." /> : null}
        {opportunityProposalsSuccess ? (
          opportunityProposals.length > 0 ? (
            opportunityProposals.map((proposal, index) => (
              <ProposalItem
                key={index}
                info={proposal}
                opportunityHasContractRequested={opportunityHasContractRequested}
                opportunityIsWon={opportunityIsWon}
                opportunityActiveProposalId={idActiveProposal}
                opportunityWonProposalId={opportunityWonProposalId}
              />
            ))
          ) : (
            <p className="flex w-full grow items-center justify-center py-2 text-center font-medium italic tracking-tight text-gray-500">
              Sem propostas vinculadas a essa oportunidade.
            </p>
          )
        ) : null}
      </div>
    </div>
  )
  // return (
  //   <div className="flex h-[300px] w-full flex-col rounded-md border border-gray-200 bg-[#fff] p-3 shadow-lg lg:w-[60%]">
  //     <div className="flex  h-[40px] items-center  justify-between border-b border-gray-200 pb-2">
  //       <div className="flex items-center justify-center gap-5">
  //         <h1 className="w-[120px] cursor-pointer border-b border-blue-500 p-1 text-center font-bold text-black hover:border-blue-500">Propostas</h1>
  //         <h1
  //           onClick={() => setBlockMode('FILES')}
  //           className="w-[120px] cursor-pointer border-b border-transparent p-1 text-center font-bold text-black hover:border-blue-500"
  //         >
  //           Arquivos
  //         </h1>
  //         <h1
  //           onClick={() => setBlockMode('TECHNICAL ANALYSIS')}
  //           className="w-[150px] cursor-pointer border-b border-transparent p-1 text-center font-bold text-black hover:border-blue-500"
  //         >
  //           Análises Técnicas
  //         </h1>
  //       </div>
  //       {opportunityIsWon ? null : (
  //         <>
  //           <button
  //             onClick={() => {
  //               router.push(`/comercial/oportunidades/proposta/${opportunityId}`)
  //             }}
  //             className="hidden rounded bg-green-600 p-1 text-[0.7rem] font-bold text-white lg:flex"
  //           >
  //             GERAR PROPOSTA
  //           </button>
  //           <button
  //             onClick={() => {
  //               if (!city || !uf) {
  //                 toast.error('Por favor, preecha a cidade e o estado do cliente antes de prosseguir para geração de propostas.')
  //               } else {
  //                 router.push(`/comercial/oportunidades/id/${opportunityId}`)
  //               }
  //             }}
  //             className="flex rounded bg-green-600 p-1 text-sm font-bold text-white lg:hidden"
  //           >
  //             <MdAdd />
  //           </button>
  //         </>
  //       )}
  //     </div>
  //     <div className="overscroll-y flex w-full grow flex-col gap-1 overflow-y-auto py-1 pr-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
  //       {opportunityProposalsLoading ? (
  //         <div className="flex grow items-center justify-center">
  //           <LoadingComponent />
  //         </div>
  //       ) : null}
  //       {opportunityProposalsError ? <ErrorComponent msg="Oops, erro ao buscar propostas da oportunidade." /> : null}
  //       {opportunityProposalsSuccess ? (
  //         opportunityProposals.length > 0 ? (
  //           opportunityProposals.map((proposal, index) => (
  //             <ProposalItem
  //               key={index}
  //               info={proposal}
  //               opportunityIsWon={opportunityIsWon}
  //               opportunityActiveProposalId={idActiveProposal}
  //               opportunityWonProposalId={opportunityWonProposalId}
  //             />
  //           ))
  //         ) : (
  //           <p className="flex w-full grow items-center justify-center py-2 text-center font-medium italic tracking-tight text-gray-500">
  //             Sem propostas vinculadas a essa oportunidade.
  //           </p>
  //         )
  //       ) : null}
  //     </div>
  //   </div>
  // )
}

export default OpportunityProposals
