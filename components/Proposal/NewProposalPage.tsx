import React, { useEffect, useState } from 'react'

import { Sidebar } from '@/components/Sidebar'

import LoadingPage from '@/components/utils/LoadingPage'

import { useOpportunityById } from '@/utils/queries/opportunities'
import { TProposal } from '@/utils/schemas/proposal.schema'
import { Session } from 'next-auth'
import ErrorComponent from '../utils/ErrorComponent'

import ProposalWithKits from './ProposalsCreationByCategory/ProposeWithKits'
import ProposalWithPlans from './ProposalsCreationByCategory/ProposeWithPlans'
import ProposalWithProducts from './ProposalsCreationByCategory/ProposeWithProducts'
import ProposalWithServices from './ProposalsCreationByCategory/ProposeWithServices'
import { useOpportunityTechnicalAnalysis } from '@/utils/queries/technical-analysis'
type NewProposalPageprops = {
  session: Session
  opportunityId: string
}
function NewProposalPage({ session, opportunityId }: NewProposalPageprops) {
  const partnerId = session.user.idParceiro

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
  if (opportunitySuccess)
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
            <ProposalWithKits
              opportunity={opportunity}
              partner={opportunity.parceiro}
              session={session}
              infoHolder={infoHolder}
              setInfoHolder={setInfoHolder}
            />
          ) : null}
          {saleCategory == 'PLANO' ? (
            <ProposalWithPlans
              opportunity={opportunity}
              partner={opportunity.parceiro}
              session={session}
              infoHolder={infoHolder}
              setInfoHolder={setInfoHolder}
            />
          ) : null}
          {saleCategory == 'PRODUTOS' ? (
            <ProposalWithProducts
              opportunity={opportunity}
              partner={opportunity.parceiro}
              session={session}
              infoHolder={infoHolder}
              setInfoHolder={setInfoHolder}
            />
          ) : null}
          {saleCategory == 'SERVIÇOS' ? (
            <ProposalWithServices
              opportunity={opportunity}
              partner={opportunity.parceiro}
              session={session}
              infoHolder={infoHolder}
              setInfoHolder={setInfoHolder}
            />
          ) : null}
        </div>
      </div>
    )
  return <ErrorComponent msg="Erro ao carregar informações sobre a oportunidade." />
}

export default NewProposalPage
