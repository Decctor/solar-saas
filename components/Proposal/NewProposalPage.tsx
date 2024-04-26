import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import { Sidebar } from '@/components/Sidebar'

import LoadingPage from '@/components/utils/LoadingPage'

import { useOpportunityById } from '@/utils/queries/opportunities'
import { TProposal } from '@/utils/schemas/proposal.schema'
import { Session } from 'next-auth'
import ErrorComponent from '../utils/ErrorComponent'
import { IoMdOptions } from 'react-icons/io'
import { SlEnergy } from 'react-icons/sl'
import { MdAttachMoney, MdSell } from 'react-icons/md'
import { ImFileEmpty } from 'react-icons/im'
import KitsSelection from './NewProposalStages/KitsSelection'
import Pricing from './NewProposalStages/Pricing'
import Proposal from './NewProposalStages/Proposal'
import Payment from './NewProposalStages/Payment'
import { usePartnerOwnInfo } from '@/utils/queries/partners'
import { BsBookmarksFill } from 'react-icons/bs'
import Composition from './NewProposalStages/Composition'

import { useProjectTypes } from '@/utils/queries/project-types'
import ProposalWithKits from './ProposalsCreationByCategory/ProposeWithKits'
import ProposalWithPlans from './ProposalsCreationByCategory/ProposeWithPlans'
import ProposalWithProducts from './ProposalsCreationByCategory/ProposeWithProducts'
import ProposalWithServices from './ProposalsCreationByCategory/ProposeWithServices'
type NewProposalPageprops = {
  session: Session
  opportunityId: string
}
function NewProposalPage({ session, opportunityId }: NewProposalPageprops) {
  const partnerId = session.user.idParceiro

  const { data: partner } = usePartnerOwnInfo({ id: partnerId || '' })
  const {
    data: opportunity,
    status,
    isLoading: opportunityLoading,
    isSuccess: opportunitySuccess,
    isError: opportunityError,
  } = useOpportunityById({ opportunityId: opportunityId })
  const saleCategory = opportunity?.categoriaVenda

  const [infoHolder, setInfoHolder] = useState<TProposal>({
    nome: '',
    idParceiro: session.user.idParceiro || '',
    idCliente: '',
    idMetodologiaPrecificacao: '',
    valor: 0,
    premissas: {
      consumoEnergiaMensal: null,
      fatorSimultaneidade: null,
      tarifaEnergia: null,
      tarifaFioB: null,
      tipoEstrutura: null,
      orientacao: null,
    },
    oportunidade: {
      id: opportunityId,
      nome: opportunity?.nome || '',
    },
    kits: [],
    planos: [],
    produtos: [],
    servicos: [],
    precificacao: [],
    pagamento: {
      metodos: [],
    },
    potenciaPico: null,
    urlArquivo: null,
    autor: {
      id: session?.user.id || '',
      nome: session?.user.nome || '',
      avatar_url: session?.user.avatar_url,
    },
    dataInsercao: new Date().toISOString(),
  })
  useEffect(() => {
    if (opportunity) setInfoHolder((prev) => ({ ...prev, oportunidade: { id: opportunity._id, nome: opportunity.nome }, idCliente: opportunity.idCliente }))
  }, [opportunity])

  if (opportunityLoading) return <LoadingPage />
  if (opportunityError) return <ErrorComponent msg="Erro ao carregar informações sobre a oportunidade." />
  if (opportunitySuccess && partner)
    return (
      <div className="flex h-full flex-col md:flex-row">
        <Sidebar session={session} />
        <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa]">
          <div className="flex h-[70px] w-full items-center justify-around bg-black">
            <div className="flex flex-col items-center">
              <h1 className="text-sm text-gray-400">NOME DA OPORTUNIDADE</h1>
              <h1 className="font-bold text-white">{opportunity.nome}</h1>
            </div>
            <div className="hidden flex-col items-center lg:flex">
              <h1 className="text-sm text-gray-400">CÓD. DO PROJETO</h1>
              <h1 className="font-bold text-white"># {opportunity.identificador}</h1>
            </div>
          </div>
          {saleCategory == 'KIT' ? (
            <ProposalWithKits opportunity={opportunity} partner={partner} session={session} infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
          ) : null}
          {saleCategory == 'PLANO' ? (
            <ProposalWithPlans opportunity={opportunity} partner={partner} session={session} infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
          ) : null}
          {saleCategory == 'PRODUTOS' ? (
            <ProposalWithProducts opportunity={opportunity} partner={partner} session={session} infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
          ) : null}
          {saleCategory == 'SERVIÇOS' ? (
            <ProposalWithServices opportunity={opportunity} partner={partner} session={session} infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
          ) : null}
          {/* <div className="m-6 flex h-fit flex-col rounded-md border border-gray-200 bg-[#fff] p-2 shadow-lg">
            <div className="grid min-h-[50px] w-full grid-cols-1 grid-rows-5 items-center gap-6 border-b border-gray-200 pb-4 lg:grid-cols-5 lg:grid-rows-1 lg:gap-1">
              <div className={`flex items-center justify-center gap-1 ${stage == 1 ? 'text-cyan-500' : 'text-gray-600'} `}>
                <IoMdOptions style={{ fontSize: '23px' }} />
                <p className="text-sm font-bold lg:text-lg">DIMENSIONAMENTO</p>
              </div>
              <div className={`flex items-center justify-center gap-1 ${stage == 2 ? 'text-cyan-500' : 'text-gray-600'} `}>
                <SlEnergy style={{ fontSize: '23px' }} />
                <p className="text-sm font-bold lg:text-lg">COMPOSIÇÃO</p>
              </div>
              <div className={`flex items-center justify-center gap-1 ${stage == 3 ? 'text-cyan-500' : 'text-gray-600'} `}>
                <MdSell style={{ fontSize: '23px' }} />
                <p className="text-sm font-bold lg:text-lg">VENDA</p>
              </div>
              <div className={`flex items-center justify-center gap-1 ${stage == 4 ? 'text-cyan-500' : 'text-gray-600'} `}>
                <MdAttachMoney style={{ fontSize: '23px' }} />
                <p className="text-sm font-bold lg:text-lg">PAGAMENTO</p>
              </div>
              <div className={`flex items-center justify-center gap-1 ${stage == 5 ? 'text-cyan-500' : 'text-gray-600'} `}>
                <ImFileEmpty style={{ fontSize: '23px' }} />
                <p className="text-sm font-bold lg:text-lg">PROPOSTA</p>
              </div>
            </div>
            {stage == 1 ? (
              <Sizing infoHolder={infoHolder} setInfoHolder={setInfoHolder} opportunity={opportunity} moveToNextStage={() => setStage((prev) => prev + 1)} />
            ) : null}
            {stage == 2 ? (
              <KitsSelection
                infoHolder={infoHolder}
                setInfoHolder={setInfoHolder}
                opportunity={opportunity}
                moveToPreviousStage={() => setStage((prev) => prev - 1)}
                moveToNextStage={() => setStage((prev) => prev + 1)}
              />
            ) : null}
            {stage == 3 ? (
              <Pricing
                infoHolder={infoHolder}
                setInfoHolder={setInfoHolder}
                opportunity={opportunity}
                moveToPreviousStage={() => setStage((prev) => prev - 1)}
                moveToNextStage={() => setStage((prev) => prev + 1)}
                session={session}
              />
            ) : null}
            {stage == 4 ? (
              <Payment
                infoHolder={infoHolder}
                setInfoHolder={setInfoHolder}
                opportunity={opportunity}
                moveToPreviousStage={() => setStage((prev) => prev - 1)}
                moveToNextStage={() => setStage((prev) => prev + 1)}
                session={session}
              />
            ) : null}
            {stage == 5 ? (
              <Proposal
                infoHolder={infoHolder}
                setInfoHolder={setInfoHolder}
                opportunity={opportunity}
                moveToPreviousStage={() => setStage((prev) => prev - 1)}
                moveToNextStage={() => setStage((prev) => prev + 1)}
                session={session}
                partner={partner}
              />
            ) : null}
          </div> */}
        </div>
      </div>
    )
  return <ErrorComponent msg="Erro ao carregar informações sobre a oportunidade." />
}

export default NewProposalPage
