import { useProposalById } from '@/utils/queries/proposals'
import { Session } from 'next-auth'
import React, { useState } from 'react'
import { Sidebar } from '../Sidebar'
import LoadingComponent from '../utils/LoadingComponent'
import ErrorComponent from '../utils/ErrorComponent'
import Link from 'next/link'
import { RxDashboard } from 'react-icons/rx'
import { FaExternalLinkAlt, FaIndustry, FaUser } from 'react-icons/fa'
import Avatar from '../utils/Avatar'
import { formatDecimalPlaces, formatInverterStr, formatModuleStr, formatNameAsInitials, formatProductStr } from '@/lib/methods/formatting'
import { ImPower, ImPriceTag } from 'react-icons/im'
import { formatToMoney, getEstimatedGen } from '@/utils/methods'
import { TbDownload, TbPercentage } from 'react-icons/tb'
import { copyToClipboard } from '@/lib/hooks'
import { MdContentCopy, MdMiscellaneousServices, MdOutlineMiscellaneousServices, MdSignalCellularAlt } from 'react-icons/md'
import { AiFillEdit, AiFillStar, AiOutlineSafety } from 'react-icons/ai'
import { getPricingTotals } from '@/utils/pricing/methods'

import { useClientById } from '@/utils/queries/clients'
import { renderCategoryIcon } from '@/lib/methods/rendering'
import { usePricingMethods } from '@/utils/queries/pricing-methods'
import { TPricingMethodDTO } from '@/utils/schemas/pricing-method.schema'
import { usePartnerById } from '@/utils/queries/partners'
import WinBlock from './WinBlock'
import { useMutationWithFeedback } from '@/utils/mutations/general-hook'
import { setOpportunityActiveProposal } from '@/utils/mutations/opportunities'
import { useQueryClient } from '@tanstack/react-query'
import ProposalViewPricingBlock from './Blocks/ProposalViewPricingBlock'
import ProposalViewPlansBlock from './Blocks/ProposalViewPlansBlock'
import EditProposal from '../Modals/Proposal/EditProposal'
import ProposalUpdateRecords from './ProposalUpdateRecords'
import NewContractRequest from '../Modals/ContractRequest/NewContractRequest'
import { handleDownload } from '@/lib/methods/download'

function getPricingMethodById({ methods, id }: { methods?: TPricingMethodDTO[]; id: string }) {
  if (!methods) return 'NÃO DEFINIDO'
  const method = methods.find((m) => m._id == id)
  if (!method) return 'NÃO DEFINIDO'
  return method.nome
}
type ProposalPageProps = {
  proposalId: string
  session: Session
}
function ProposalPage({ proposalId, session }: ProposalPageProps) {
  const queryClient = useQueryClient()
  const [editProposalModalIsOpen, setEditProposalModalIsOpen] = useState<boolean>(false)
  const [newContractRequestIsOpen, setNewContractRequestIsOpen] = useState<boolean>(false)
  const { data: proposal, isLoading: proposalLoading, isError: proposalError, isSuccess: proposalSuccess } = useProposalById({ id: proposalId })
  const clientId = proposal?.oportunidadeDados.idCliente
  const { data: client } = useClientById({ id: clientId || '' })
  const { data: pricingMethods } = usePricingMethods()

  const userHasPricingViewPermission = session?.user.permissoes.precos.visualizar
  const userHasPricingEditPermission = session?.user.permissoes.precos.editar

  const { mutate: handleSetActiveProposal } = useMutationWithFeedback({
    mutationKey: ['set-active-proposal', proposalId],
    mutationFn: setOpportunityActiveProposal,
    queryClient: queryClient,
    affectedQueryKey: ['proposal-by-id', proposalId],
  })
  if (proposalLoading)
    return (
      <div className="flex h-full flex-col md:flex-row">
        <Sidebar session={session} />
        <div className="flex w-full max-w-full grow flex-col items-center justify-center overflow-x-hidden bg-[#f8f9fa] p-6">
          <LoadingComponent />
        </div>
      </div>
    )
  if (proposalError)
    return (
      <div className="flex h-full flex-col md:flex-row">
        <Sidebar session={session} />
        <div className="flex w-full max-w-full grow flex-col items-center justify-center overflow-x-hidden bg-[#f8f9fa] p-6">
          <ErrorComponent msg="Erro ao carregar informações da proposta." />
        </div>
      </div>
    )
  if (proposalSuccess) {
    return (
      <div className="flex h-full flex-col md:flex-row">
        <Sidebar session={session} />
        <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa] p-6">
          <div className="flex w-full flex-col items-center justify-between border-b border-gray-200 pb-2 lg:flex-row">
            <div className="flex flex-col gap-1">
              <h1 className="tracking-tightl text-center text-2xl font-bold leading-none text-gray-800 lg:text-start">{proposal?.nome}</h1>
              <div className="flex items-center gap-2">
                <Link href={`/comercial/oportunidades/id/${proposal.oportunidade.id}`}>
                  <div className="flex items-center gap-2">
                    <RxDashboard style={{ color: '#15599a', fontSize: '15px' }} />
                    <p className="text-xs">{proposal?.oportunidade.nome}</p>
                  </div>
                </Link>
                <div className="flex items-center gap-2">
                  <FaUser style={{ color: '#15599a', fontSize: '15px' }} />
                  <p className="text-xs">Criada por: </p>
                  <Avatar url={proposal.autor.avatar_url || undefined} fallback={formatNameAsInitials(proposal.autor.nome)} height={30} width={30} />
                  <p className="text-xs">{proposal?.autor?.nome}</p>
                </div>
              </div>
            </div>

            <WinBlock
              opportunityId={proposal.oportunidade.id}
              proposalId={proposalId}
              isWon={!!proposal.oportunidadeDados.ganho.data}
              wonDate={proposal.oportunidadeDados.ganho.data}
              contractRequestDate={proposal.oportunidadeDados.ganho.dataSolicitacao}
              wonProposalId={proposal.oportunidadeDados.ganho.idProposta}
              proposalValue={proposal.valor}
              idMarketing={proposal.oportunidadeDados.idMarketing}
              opportunityEmail={client?.email}
              handleWin={() => setNewContractRequestIsOpen(true)}
            />
          </div>
          <div className="flex w-full grow flex-col py-2">
            <div className="my-2 flex w-full items-center justify-end gap-2">
              {session.user.permissoes.propostas.editar ? (
                <button
                  // @ts-ignore
                  onClick={() => setEditProposalModalIsOpen(true)}
                  className="flex w-fit items-center gap-2 rounded bg-orange-400 p-2 text-xs font-black hover:bg-orange-500"
                >
                  <h1>EDITAR PROPOSTA</h1>
                  <AiFillEdit />
                </button>
              ) : null}
              {proposalId != proposal.oportunidadeDados.idPropostaAtiva ? (
                <button
                  // @ts-ignore
                  onClick={() => handleSetActiveProposal({ proposalId, opportunityId: proposal.oportunidade.id })}
                  className="flex w-fit items-center gap-2 rounded bg-blue-700 p-2 text-xs font-black text-white hover:bg-blue-800"
                >
                  <h1>USAR COMO PROPOSTA ATIVA</h1>
                  <AiFillStar />
                </button>
              ) : null}
            </div>
            <div className="flex min-h-[350px] w-full flex-col justify-around gap-3 lg:flex-row">
              <div className="flex h-full w-full flex-col rounded border border-gray-500 bg-[#fff] p-6 shadow-md lg:w-1/4">
                <div className="mb-2 flex w-full flex-col items-center">
                  <h1 className="w-full text-center font-Raleway text-lg font-bold text-[#15599a]">INFORMAÇÕES GERAIS</h1>
                  <p className="text-center text-xs italic text-gray-500">Essas são informações sobre a proposta.</p>
                </div>
                <div className="flex w-full grow flex-col justify-around gap-3">
                  <div className="flex w-full flex-col items-center justify-between gap-1 lg:flex-row">
                    <p className="text-xs font-medium leading-none tracking-tight text-gray-500">NOME DA PROPOSTA</p>
                    <p className="text-base font-medium leading-none tracking-tight lg:text-xs">{proposal.nome}</p>
                  </div>
                  <div className="flex w-full flex-col items-center justify-between gap-1 lg:flex-row">
                    <p className="text-xs font-medium leading-none tracking-tight text-gray-500">VALOR DA PROPOSTA</p>
                    <p className="text-base font-medium leading-none tracking-tight lg:text-xs">{formatToMoney(proposal.valor)}</p>
                  </div>
                  <div className="flex w-full flex-col items-center justify-between gap-1 lg:flex-row">
                    <p className="text-xs font-medium leading-none tracking-tight text-gray-500">POTÊNCIA PICO</p>
                    <p className="text-base font-medium leading-none tracking-tight lg:text-xs">{formatDecimalPlaces(proposal.potenciaPico || 0)} kWp</p>
                  </div>
                  <div className="flex w-full flex-col items-center justify-between gap-1 lg:flex-row">
                    <p className="text-xs font-medium leading-none tracking-tight text-gray-500">GERAÇÃO ESTIMADA</p>
                    <p className="text-base font-medium leading-none tracking-tight lg:text-xs">
                      {formatDecimalPlaces(
                        getEstimatedGen(
                          proposal.potenciaPico || 0,
                          proposal.oportunidadeDados?.localizacao.cidade,
                          proposal.oportunidadeDados?.localizacao.uf,
                          proposal.premissas.orientacao || 'NORTE'
                        )
                      )}
                      kWh
                    </p>
                  </div>
                  <div className="flex w-full flex-col items-center justify-between gap-1 lg:flex-row">
                    <p className="text-xs font-medium leading-none tracking-tight text-gray-500">METODOLOGIA</p>
                    <p className="text-end text-sm font-medium leading-none tracking-tight lg:text-xs">
                      {getPricingMethodById({ methods: pricingMethods, id: proposal.idMetodologiaPrecificacao })}
                    </p>
                  </div>
                  <div className="flex w-full flex-col items-center justify-between gap-1 lg:flex-row">
                    <p className="text-xs font-medium leading-none tracking-tight text-gray-500">KIT</p>
                    <p className="text-end text-sm font-medium leading-none tracking-tight lg:text-xs">
                      {proposal.kits.map((kit, index) => (index + 1 == proposal.kits.length ? kit.nome : `${kit.nome} + `))}
                    </p>
                  </div>
                  <Link href={`/comercial/proposta/documento/${proposal._id}`}>
                    <h1 className="flex w-full items-center justify-center gap-2 self-center rounded-lg border border-dashed border-[#fead61] p-2 font-medium text-[#fead61]">
                      <p>LINK DA PROPOSTA</p>
                      <FaExternalLinkAlt />
                    </h1>
                  </Link>

                  {proposal.urlArquivo ? (
                    <>
                      <button
                        onClick={() => handleDownload({ fileName: proposal.nome, fileUrl: proposal.urlArquivo || '' })}
                        className="flex w-fit items-center gap-2 self-center rounded-lg border border-dashed border-[#15599a] p-2 text-[#15599a]"
                      >
                        <p>DOWNLOAD DO PDF</p>
                        <TbDownload />
                      </button>
                      <button
                        onClick={() => copyToClipboard(proposal.urlArquivo || '')}
                        className="flex w-fit items-center gap-2 self-center rounded-lg border border-dashed border-[#fead61] p-2 font-medium text-[#fead61]"
                      >
                        <p>COPIAR LINK DO ARQUIVO</p>
                        <MdContentCopy />
                      </button>

                      {session?.user.permissoes.propostas.editar ? (
                        <button
                          //   onClick={() => setNewFileModalIsOpen(true)}
                          className="flex w-fit items-center gap-2 self-center rounded-lg border border-dashed border-black p-2 font-medium text-black"
                        >
                          <p>EDITAR ARQUIVO</p>
                          <AiFillEdit />
                        </button>
                      ) : null}
                    </>
                  ) : null}
                </div>
              </div>
              <div className="flex h-full w-full flex-col rounded border border-gray-500 bg-[#fff] p-6 shadow-md lg:w-1/4">
                <div className="mb-2 flex w-full flex-col items-center">
                  <h1 className="w-full text-center font-Raleway text-lg font-bold text-[#15599a]">PREMISSAS</h1>
                  <p className="text-center text-xs italic text-gray-500">Essas são as premissas de dimensionamento dessa proposta.</p>
                </div>
                <div className="flex w-full grow flex-col justify-around">
                  <div className="flex w-full flex-col items-center justify-between gap-1 lg:flex-row">
                    <h1 className="text-xs font-medium uppercase leading-none tracking-tight text-gray-500">Consumo de energia mensal</h1>
                    <h1 className="text-end text-sm font-medium leading-none tracking-tight lg:text-xs">{proposal?.premissas.consumoEnergiaMensal} kWh</h1>
                  </div>
                  <div className="flex w-full flex-col items-center justify-between gap-1 lg:flex-row">
                    <h1 className="text-xs font-medium uppercase leading-none tracking-tight text-gray-500">Tarifa de energia</h1>
                    <h1 className="text-end text-sm font-medium leading-none tracking-tight lg:text-xs">R$ {proposal?.premissas.tarifaEnergia} R$/kWh</h1>
                  </div>
                  <div className="flex w-full flex-col items-center justify-between gap-1 lg:flex-row">
                    <h1 className="text-xs font-medium uppercase leading-none tracking-tight text-gray-500">Tarifa TUSD</h1>
                    <h1 className="text-end text-sm font-medium leading-none tracking-tight lg:text-xs">{proposal?.premissas.tarifaFioB} R$/kWh</h1>
                  </div>
                  <div className="flex w-full flex-col items-center justify-between gap-1 lg:flex-row">
                    <h1 className="text-xs font-medium uppercase leading-none tracking-tight text-gray-500">Fator de simultaneidade</h1>
                    <h1 className="text-end text-sm font-medium leading-none tracking-tight lg:text-xs">{proposal?.premissas.fatorSimultaneidade} %</h1>
                  </div>
                  <div className="flex w-full flex-col items-center justify-between gap-1 lg:flex-row">
                    <h1 className="text-xs font-medium uppercase leading-none tracking-tight text-gray-500">Tipo de estrutura</h1>
                    <h1 className="text-end text-sm font-medium leading-none tracking-tight lg:text-xs">{proposal?.premissas.tipoEstrutura}</h1>
                  </div>
                  <div className="flex w-full flex-col items-center justify-between gap-1 lg:flex-row">
                    <h1 className="text-xs font-medium uppercase leading-none tracking-tight text-gray-500">Distância</h1>
                    <h1 className="text-end text-sm font-medium leading-none tracking-tight lg:text-xs">{proposal?.premissas.distancia} km</h1>
                  </div>
                </div>
              </div>
              <div className="flex h-full w-full flex-col rounded border border-gray-500 bg-[#fff] p-6 shadow-md lg:w-1/4">
                <div className="mb-2 flex w-full flex-col items-center">
                  <h1 className="w-full text-center font-Raleway text-lg font-bold text-[#15599a]">PRODUTOS</h1>
                  <p className="text-center text-xs italic text-gray-500">Esses são os produtos vinculados à essa proposta</p>
                  <div className="mt-2 flex w-full flex-col gap-2">
                    {proposal.produtos.length > 0 ? (
                      proposal.produtos.map((product, index) => (
                        <div key={index} className="mt-1 flex w-full flex-col rounded-md border border-gray-200 p-2">
                          <div className="flex w-full flex-col items-start justify-between gap-2">
                            <div className="flex items-center gap-1">
                              <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full border border-black p-1 text-[15px]">
                                {renderCategoryIcon(product.categoria)}
                              </div>
                              <p className="text-[0.6rem] font-medium leading-none tracking-tight lg:text-xs">
                                <strong className="text-[#FF9B50]">{product.qtde}</strong> x {product.modelo}
                              </p>
                            </div>
                            <div className="flex w-full grow items-end justify-end gap-2 pl-2">
                              <div className="flex items-center gap-1">
                                <FaIndustry size={15} />
                                <p className="text-[0.6rem] font-light text-gray-500">{product.fabricante}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <ImPower size={15} />
                                <p className="text-[0.6rem] font-light text-gray-500">{product.potencia} W</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <AiOutlineSafety size={15} />
                                <p className="text-[0.6rem] font-light text-gray-500">{product.garantia} ANOS</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="w-full text-center text-sm italic text-gray-500">Nenhum produto vinculado à proposta...</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex h-full w-full flex-col rounded border border-gray-500 bg-[#fff] p-6 shadow-md lg:w-1/4">
                <div className="mb-2 flex w-full flex-col items-center">
                  <h1 className="w-full text-center font-Raleway text-lg font-bold text-[#15599a]">SERVIÇOS</h1>
                  <p className="text-center text-xs italic text-gray-500">Esses são os serviços vinculados à essa proposta</p>
                  <div className="mt-2 flex w-full flex-col gap-2">
                    {proposal.servicos.length > 0 ? (
                      proposal.servicos.map((service, index) => (
                        <div key={index} className="mt-1 flex w-full flex-col rounded-md border border-gray-200 p-2">
                          <div className="flex w-full items-center justify-between gap-2">
                            <div className="flex  items-center gap-1">
                              <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full border border-black p-1">
                                <MdOutlineMiscellaneousServices />
                              </div>
                              <p className="text-[0.6rem] font-medium leading-none tracking-tight lg:text-xs">{service.descricao}</p>
                            </div>
                            <div className="flex  grow items-center justify-end gap-2 pl-2">
                              <div className="flex items-center gap-1">
                                <AiOutlineSafety size={15} />
                                <p className="text-[0.6rem] font-light text-gray-500">{service.garantia} ANOS</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="w-full text-center text-sm italic text-gray-500">Nenhum serviço vinculado à proposta...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {proposal.planos.length > 0 ? <ProposalViewPlansBlock plans={proposal.planos} /> : null}
            {proposal.precificacao.length > 0 ? (
              <ProposalViewPricingBlock userHasPricingViewPermission={userHasPricingViewPermission} pricing={proposal.precificacao} />
            ) : null}
            <ProposalUpdateRecords proposalId={proposalId} />
          </div>
        </div>
        {editProposalModalIsOpen ? (
          <EditProposal
            session={session}
            info={proposal}
            userHasPricingEditPermission={userHasPricingEditPermission}
            closeModal={() => setEditProposalModalIsOpen(false)}
          />
        ) : null}
        {newContractRequestIsOpen && client ? (
          <NewContractRequest
            responsible={{
              _id: session.user.id,
              nome: session.user.email,
              email: session.user.email,
              avatar_url: session.user.avatar_url,
              telefone: session.user.telefone,
            }}
            client={client}
            proposeInfo={proposal}
            closeModal={() => setNewContractRequestIsOpen(false)}
          />
        ) : null}
      </div>
    )
  }
  return <></>
}

export default ProposalPage
