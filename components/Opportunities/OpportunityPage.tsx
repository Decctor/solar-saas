import React, { useState } from 'react'
import { useSession } from 'next-auth/react'

import OpportunityDetails from './OpportunityDetails'
import OpportunityHistory from './OpportunityHistory'
import OpportunityProposals from './OpportunityProposalsList'
import OpportunityFiles from './OpportunityFiles'
import LoadingComponent from '../utils/LoadingComponent'
import Avatar from '../utils/Avatar'
import { Sidebar } from '../Sidebar'

import { GiPositionMarker } from 'react-icons/gi'
import { FaCity } from 'react-icons/fa'
import { HiIdentification } from 'react-icons/hi'
import { BsFillCalendarCheckFill, BsFillMegaphoneFill, BsTelephoneFill } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import { AiFillEdit, AiOutlineUser } from 'react-icons/ai'

import { useRepresentatives, useResponsibles } from '@/utils/methods'
import { useOpportunityById } from '@/utils/queries/opportunities'
import OpportunityLossBlock from './OpportunityLossBlock'
import { formatDateAsLocale } from '@/lib/methods/formatting'
import { Session } from 'next-auth'
import { usePartnerOwnInfo } from '@/utils/queries/partners'
import OpportunityTechnicalAnalysisBlock from './OpportunityTechnicalAnalysisBlock'
import OpportunityHomologations from './OpportunityHomologations'
import OpportunityWonFlag from './OpportunityWonFlag'
import OpportunityContractRequestedFlag from './OpportunityContractRequestedFlag'

export type TOpportunityBlockMode = 'PROPOSES' | 'FILES' | 'TECHNICAL ANALYSIS'

type OpportunityPageProps = {
  session: Session
  opportunityId: string
}
function OpportunityPage({ session, opportunityId }: OpportunityPageProps) {
  const [blockMode, setBlockMode] = useState<TOpportunityBlockMode>('PROPOSES')
  const {
    data: opportunity,
    status,
    isLoading: opportunityLoading,
    isSuccess: opportunitySuccess,
    isError: opportunityError,
  } = useOpportunityById({ opportunityId: opportunityId })

  if (opportunityLoading) return <LoadingComponent />
  if (opportunityError)
    return (
      <div className="flex h-full flex-col md:flex-row">
        <Sidebar session={session} />
        <div className="flex w-full max-w-full grow flex-col items-center justify-center overflow-x-hidden bg-[#f8f9fa] p-6">
          <p className="text-lg italic text-gray-700">Oops, houve um erro no carregamento das informações do projeto em questão.</p>
        </div>
      </div>
    )
  if (opportunitySuccess)
    return (
      <div className="flex h-full flex-col md:flex-row">
        <Sidebar session={session} />
        <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa] p-6">
          <div className="flex w-full flex-col items-start justify-between border-b border-[#000] pb-2 lg:flex-row">
            <div className="flex w-full flex-col items-start">
              <div className="mb-2 flex w-full flex-col items-center gap-0 lg:mb-0 lg:w-fit lg:flex-row lg:gap-2">
                <h1 className="flex text-center font-Raleway text-2xl font-bold text-[#fead41] lg:text-start">{opportunity.identificador}</h1>
                <h1 className="flex text-center font-Raleway text-2xl font-bold text-blue-900 lg:text-start">{opportunity.nome}</h1>
                {opportunity.idMarketing ? (
                  <div className="flex items-center gap-1 rounded border border-[#3e53b2] p-1 text-[#3e53b2]">
                    <BsFillMegaphoneFill />
                    <p className="text-sm font-bold italic leading-none tracking-tight">VINDO DE MARKETING</p>
                  </div>
                ) : null}
              </div>
              <p className="w-full text-start text-xs italic text-gray-500">{opportunity.descricao}</p>
              <div className="mt-1 flex w-full flex-row flex-wrap items-start gap-3">
                {opportunity.responsaveis.map((resp) => (
                  <div className="flex items-center gap-1">
                    <Avatar width={20} height={20} url={resp.avatar_url || undefined} fallback={resp.nome} />
                    <p className="text-sm font-medium leading-none tracking-tight text-gray-500">{resp.nome}</p>{' '}
                    <p className="ml-1 rounded-md border border-cyan-400 p-1 text-xxs font-bold text-cyan-400">{resp.papel}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex w-full flex-col items-center gap-4 lg:mt-0 lg:w-fit lg:flex-row">
              {!!opportunity.ganho.data ? null : (
                <OpportunityLossBlock
                  opportunityId={opportunity._id}
                  opportunityIsLost={!!opportunity.perda.data}
                  opportunityLossDate={opportunity.perda.data}
                  idMarketing={opportunity.idMarketing}
                  opportunityEmail={opportunity.cliente.email}
                />
              )}
              <OpportunityContractRequestedFlag requestDate={opportunity.ganho.dataSolicitacao} />
              <OpportunityWonFlag wonDate={opportunity.ganho.data} />
            </div>
          </div>

          {/* <div className="flex w-full flex-col items-start gap-6 py-4 lg:flex-row"></div> */}
          <div className="flex w-full flex-col gap-6 lg:flex-row">
            <div className="flex w-full flex-col gap-4 lg:w-[40%] ">
              <div className="flex h-[300px] w-full flex-col rounded-md border border-gray-200 bg-[#fff] p-3 shadow-lg lg:h-[250px]">
                <div className="flex h-[40px] items-center justify-between border-b border-gray-200 pb-2">
                  <h1 className="font-bold text-black">Dados do Cliente</h1>
                </div>
                <div className="mt-3 flex w-full grow flex-col gap-1 lg:flex-row">
                  <div className="flex h-full w-full flex-col items-start justify-around gap-2 lg:w-[50%] lg:items-center">
                    <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
                      <AiOutlineUser style={{ color: '#15599a', fontSize: '20px' }} />
                      <p className="font-Poppins text-sm text-gray-500">{opportunity.cliente.nome}</p>
                    </div>
                    <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
                      <MdEmail style={{ color: '#15599a', fontSize: '20px' }} />
                      <p className="break-all font-Poppins text-sm text-gray-500">{opportunity.cliente.email || 'NÃO DEFINIDO'}</p>
                    </div>
                    <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
                      <BsTelephoneFill style={{ color: '#15599a', fontSize: '20px' }} />
                      <p className="font-Poppins text-sm text-gray-500">{opportunity.cliente.telefonePrimario}</p>
                    </div>
                  </div>
                  <div className="flex h-full w-full flex-col items-start justify-around gap-2 lg:w-[50%] lg:items-center">
                    <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
                      <HiIdentification style={{ color: '#15599a', fontSize: '20px' }} />
                      <p className="font-Poppins text-sm text-gray-500">{opportunity.cliente.cpfCnpj || 'NÃO DEFINIDO'}</p>
                    </div>
                    <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
                      <FaCity style={{ color: '#15599a', fontSize: '20px' }} />
                      <p className="font-Poppins text-sm text-gray-500">
                        {opportunity.localizacao.cidade} ({opportunity.localizacao.uf})
                      </p>
                    </div>
                    <div className="flex w-full items-center justify-center gap-2 lg:justify-start">
                      <GiPositionMarker style={{ color: '#15599a', fontSize: '20px' }} />
                      <p className="font-Poppins text-sm text-gray-500">
                        {opportunity.localizacao.endereco || 'NÃO DEFINIDO'}, {opportunity.localizacao.bairro || 'NÃO DEFINIDO'}, Nº{' '}
                        {opportunity.localizacao.numeroOuIdentificador}, CEP: {opportunity.localizacao.cep || 'NÃO DEFINIDO'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <OpportunityDetails info={opportunity} session={session} opportunityId={opportunity._id} />
            </div>

            <div className="flex w-full flex-col gap-4 lg:w-[60%]">
              <OpportunityProposals
                city={opportunity.localizacao.cidade}
                uf={opportunity.localizacao.uf}
                session={session}
                opportunityId={opportunity._id ? opportunity._id : ''}
                idActiveProposal={opportunity.idPropostaAtiva || undefined}
                setBlockMode={setBlockMode}
                opportunityHasContractRequested={!!opportunity.ganho.dataSolicitacao}
                opportunityIsWon={!!opportunity.ganho.data}
                opportunityWonProposalId={opportunity.ganho.idProposta}
              />
              <OpportunityFiles opportunityId={opportunity._id} clientId={opportunity.idCliente} session={session} />
              <OpportunityTechnicalAnalysisBlock session={session} opportunity={opportunity} />
              <OpportunityHomologations opportunity={opportunity} session={session} />
              <OpportunityHistory
                opportunityName={opportunity.nome}
                opportunityId={opportunity._id}
                opportunityIdentifier={opportunity.identificador || ''}
                session={session}
              />
            </div>
          </div>
        </div>
      </div>
    )
  return <></>
}

export default OpportunityPage
