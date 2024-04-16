import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Sidebar } from '../../components/Sidebar'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { RxDashboard } from 'react-icons/rx'
import axios, { AxiosError } from 'axios'
import { toast } from 'react-hot-toast'

import { checkQueryEnableStatus, getEstimatedGen, getInverterStr } from '@/utils/methods'
import { useSession } from 'next-auth/react'
import { IProject, IProposalInfo } from '@/utils/models'
import { ImPower, ImPriceTag, ImTab } from 'react-icons/im'
import { TbDownload } from 'react-icons/tb'
import { MdContentCopy } from 'react-icons/md'
import { fileTypes } from '@/utils/constants'
import { FullMetadata, getMetadata, ref } from 'firebase/storage'
import { storage } from '@/services/firebase/storage-config'
import { ONGridPricing, PricesObj, PricesPromoObj, Pricing, getMarginValue, getProposaldPrice, getTaxValue, priceDescription } from '@/utils/pricing/methods'
import { getPrices } from '@/utils/pricing/methods'
import Link from 'next/link'
import RequestContract from '../Modals/RequestContract'
import { BsFillCalendarCheckFill, BsPatchCheckFill } from 'react-icons/bs'
import JSZip from 'jszip'
import { basename } from 'path'
import { FaUser } from 'react-icons/fa'
import dayjs from 'dayjs'
import { AiFillEdit, AiFillStar } from 'react-icons/ai'
import EditProposalFile from '../Modals/Proposal/EditFile'
type ProposalViewUFProps = {
  proposal: IProposalInfo
}
function copyToClipboard(text: string | undefined) {
  if (text) {
    var dummy = document.createElement('textarea')
    // to avoid breaking orgain page when copying more words
    // cant copy when adding below this code
    // dummy.style.display = 'none'
    document.body.appendChild(dummy)
    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
    dummy.value = text
    dummy.select()
    document.execCommand('copy')
    document.body.removeChild(dummy)
    toast.success('Link copiado para área de transferência.')
  } else {
    toast.error('Link não disponível para cópia.')
  }
}
async function handleDownload(url: string | undefined, proposalName: string) {
  if (!url) {
    toast.error('Houve um erro com o link. Por favor, tente novamente.')
    return
  }
  let fileRef = ref(storage, url)
  const metadata = await getMetadata(fileRef)
  const md = metadata as FullMetadata

  const filePath = fileRef.fullPath
  // @ts-ignore
  const extension = fileTypes[metadata.contentType]?.extension
  const toastID = toast.loading('Baixando arquivo...')
  try {
    const response = await axios.get(`/api/utils/downloadFirebase?filePath=${encodeURIComponent(filePath)}`, {
      responseType: 'blob',
    })

    // Given that the API now returns zipped files for reduced size, we gotta decompress
    const zip = new JSZip()
    const unzippedFiles = await zip.loadAsync(response.data)
    const proposal = await unzippedFiles.file(basename(filePath))?.async('arraybuffer')
    if (!proposal) {
      toast.error('Erro ao descomprimir o arquivo da proposta.')
      throw 'Erro ao descomprimir proposta.'
    }
    const url = window.URL.createObjectURL(new Blob([proposal]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${proposalName}${extension}`)
    document.body.appendChild(link)
    link.click()
    toast.dismiss(toastID)
    link.remove()
  } catch (error) {
    toast.error('Houve um erro no download do arquivo.')
  }
}

function ProposalViewUF({ proposal }: ProposalViewUFProps) {
  const router = useRouter()
  const [newFileModalIsOpen, setNewFileModalIsOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const [requestContractModal, setRequestContractModal] = useState<boolean>(false)
  const { data: session } = useSession({
    required: true,
  })
  function renderContractRequestInfo(proposalId: string, contractRequest?: IProject['solicitacaoContrato']) {
    if (!contractRequest) return null
    return (
      <div className="flex w-[80%] flex-col items-center rounded-md bg-[#fead41]  p-2 shadow-md lg:w-fit">
        <h1 className="text-center font-Raleway text-xs font-bold text-black">CONTRATO SOLICITADO</h1>
        {contractRequest.idProposta != proposalId ? (
          <p className="text-center font-Raleway text-xxs font-thin text-gray-700">(ATRAVÉS DE OUTRA PROPOSTA)</p>
        ) : null}
        <div className="flex items-center justify-center gap-2">
          <BsPatchCheckFill style={{ color: '#000', fontSize: '15px' }} />
          <p className="text-center text-xs font-bold text-black">
            {contractRequest.dataSolicitacao ? dayjs(contractRequest.dataSolicitacao).add(3, 'hours').format('DD/MM/YYYY') : '-'}
          </p>
        </div>
      </div>
    )
  }
  function renderContractSigningInfo(proposalId: string, contract?: IProject['contrato']) {
    if (!contract) return null
    return (
      <div className="flex w-[80%] flex-col items-center rounded-md bg-green-400  p-2 shadow-md lg:w-fit">
        <h1 className="text-center font-Raleway text-xs font-bold text-black">CONTRATO ASSINADO</h1>
        {contract.idProposta != proposalId ? <p className="text-center font-Raleway text-xxs font-thin text-gray-700">(ATRAVÉS DE OUTRA PROPOSTA)</p> : null}
        <div className="flex items-center justify-center gap-2">
          <BsFillCalendarCheckFill style={{ color: '#000', fontSize: '15px' }} />
          <p className="text-center text-xs font-bold text-black">
            {contract.dataAssinatura ? dayjs(contract.dataAssinatura).add(3, 'hours').format('DD/MM/YYYY') : '-'}
          </p>
        </div>
      </div>
    )
  }
  function getTotals() {
    if (proposal?.infoProjeto) {
      const pricing = proposal.precificacao ? proposal.precificacao : getPrices(proposal?.infoProjeto, proposal, null)
      switch (proposal.kit?.tipo) {
        case 'PROMOCIONAL':
          var totalCosts = 0
          var totalTaxes = 0
          var totalProfits = 0
          var finalProposalPrice = 0
          const promotionalPricing = pricing as PricesPromoObj
          Object.keys(promotionalPricing).forEach((priceType) => {
            const pricesObj = promotionalPricing[priceType as keyof PricesPromoObj]
            if (!pricesObj) return
            const { custo, vendaFinal, margemLucro, imposto } = pricesObj

            const taxValue = getTaxValue(custo, vendaFinal, margemLucro) * vendaFinal
            const marginValue = getMarginValue(custo, vendaFinal, imposto) * vendaFinal

            totalCosts = totalCosts + custo
            totalTaxes = totalTaxes + taxValue
            totalProfits = totalProfits + marginValue
            finalProposalPrice = finalProposalPrice + vendaFinal
          })
          return {
            totalCosts,
            totalTaxes,
            totalProfits,
            finalProposalPrice,
          }
        case 'TRADICIONAL':
          var totalCosts = 0
          var totalTaxes = 0
          var totalProfits = 0
          var finalProposalPrice = 0
          const traditionalPricing = pricing as PricesObj
          Object.keys(traditionalPricing).forEach((priceType) => {
            const pricesObj = traditionalPricing[priceType as keyof PricesObj]
            if (!pricesObj) return
            const { custo, vendaFinal, margemLucro, imposto } = pricesObj

            const taxValue = getTaxValue(custo, vendaFinal, margemLucro) * vendaFinal
            const marginValue = getMarginValue(custo, vendaFinal, imposto) * vendaFinal

            totalCosts = totalCosts + custo
            totalTaxes = totalTaxes + taxValue
            totalProfits = totalProfits + marginValue
            finalProposalPrice = finalProposalPrice + vendaFinal
          })
          return {
            totalCosts,
            totalTaxes,
            totalProfits,
            finalProposalPrice,
          }

        default:
          var totalCosts = 0
          var totalTaxes = 0
          var totalProfits = 0
          var finalProposalPrice = 0
          Object.keys(pricing).forEach((priceType) => {
            const pricesObj = pricing[priceType as keyof Pricing]
            if (!pricesObj) return
            const { custo, vendaFinal, margemLucro, imposto } = pricesObj
            const finalSellingPrice = vendaFinal
            const taxValue = getTaxValue(custo, finalSellingPrice, margemLucro) * finalSellingPrice
            const marginValue = getMarginValue(custo, finalSellingPrice, imposto) * finalSellingPrice

            totalCosts = totalCosts + custo
            totalTaxes = totalTaxes + taxValue
            totalProfits = totalProfits + marginValue
            finalProposalPrice = finalProposalPrice + finalSellingPrice
          })
          return {
            totalCosts,
            totalTaxes,
            totalProfits,
            finalProposalPrice,
          }
      }
    }
  }
  const { mutate: setProposalAsActive } = useMutation({
    mutationKey: ['editProject'],
    mutationFn: async () => {
      try {
        const { data } = await axios.put(`/api/projects?id=${proposal.infoProjeto?._id}&responsavel=${proposal.infoProjeto?.responsavel.id}`, {
          changes: {
            propostaAtiva: proposal._id,
          },
        })
        // queryClient.invalidateQueries({ queryKey: ["project"] });
        // if (data.message) toast.success(data.message);
        return data
      } catch (error) {
        if (error instanceof AxiosError) {
          let errorMsg = error.response?.data.error.message
          toast.error(errorMsg)
          return
        }
        if (error instanceof Error) {
          let errorMsg = error.message
          toast.error(errorMsg)
          return
        }
      }
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['proposal', proposal._id] })
    },
    onSettled: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: ['proposal', proposal._id],
      })
      // await queryClient.refetchQueries({ queryKey: ["project"] });
      if (data.message) toast.success(data.message)
    },
  })
  return (
    <div className="flex h-full flex-col md:flex-row">
      <Sidebar />
      <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa] p-6">
        <div className="flex w-full flex-col items-center justify-between border-b border-gray-200 pb-2 lg:flex-row">
          <div className="flex flex-col gap-1">
            <h1 className="text-center font-Raleway text-xl font-bold text-gray-800 lg:text-start">{proposal?.nome}</h1>
            <div className="flex items-center gap-2">
              <Link href={`/projeto/id/${proposal.infoProjeto?._id}`}>
                <div className="flex items-center gap-2">
                  <RxDashboard style={{ color: '#15599a', fontSize: '15px' }} />
                  <p className="text-xs">{proposal?.infoProjeto?.nome}</p>
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <FaUser style={{ color: '#15599a', fontSize: '15px' }} />
                <p className="text-xs">{proposal?.autor?.nome}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex w-full flex-col items-center gap-4 lg:mt-0 lg:w-fit lg:flex-row">
            {proposal.infoProjeto?.solicitacaoContrato || proposal.infoProjeto?.contrato ? null : (
              <button
                onClick={() => setRequestContractModal(true)}
                className="items-center rounded border border-green-500 p-1 font-medium text-green-500 duration-300 ease-in-out hover:scale-105 hover:bg-green-500 hover:text-white"
              >
                REQUISITAR CONTRATO
              </button>
            )}
            {/** Showing */}
            {renderContractRequestInfo(proposal._id as string, proposal.infoProjeto?.solicitacaoContrato)}
            {renderContractSigningInfo(proposal._id as string, proposal.infoProjeto?.contrato)}
          </div>
        </div>
        <div className="flex w-full grow flex-col py-2">
          {proposal.infoProjeto?.contrato || proposal.infoProjeto?.solicitacaoContrato || proposal.infoProjeto?.propostaAtiva == proposal._id ? null : (
            <div className="my-2 flex w-full items-center justify-center">
              <button
                onClick={() => setProposalAsActive()}
                className="flex w-fit items-center gap-2 rounded bg-blue-300 p-2 text-xs font-black text-white hover:bg-blue-500"
              >
                <h1>USAR COMO PROPOSTA ATIVA</h1>
                <AiFillStar />
              </button>
            </div>
          )}
          <div className="flex min-h-[350px] w-full flex-col justify-around gap-3 lg:flex-row">
            <div className="flex h-full w-full flex-col rounded border border-gray-200 bg-[#fff] p-6 shadow-md lg:w-1/3">
              <div className="flex w-full flex-col items-center">
                <h1 className="w-full text-center font-Raleway text-lg font-bold text-[#15599a]">INFORMAÇÕES GERAIS</h1>
                <p className="text-center text-xs italic text-gray-500">Essas são informações sobre a proposta.</p>
              </div>
              <div className="flex w-full grow flex-col justify-around">
                <div className="flex w-full flex-col items-center gap-2 p-3">
                  <div className="flex w-full flex-col items-center justify-center gap-2 rounded border border-gray-300 p-1">
                    <div className="flex w-full items-center justify-center gap-2">
                      <ImPower style={{ color: 'rgb(239,68,68)', fontSize: '20px' }} />
                      <p className="text-xs font-thin text-gray-600">POTÊNCIA PICO E GERAÇÃO ESTIMADA</p>
                    </div>
                    <div className="flex w-full items-center justify-center gap-2">
                      <p className="text-lg font-thin text-gray-600">
                        {proposal?.potenciaPico?.toLocaleString('pt-br', {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}{' '}
                        kWp
                      </p>
                      <p className="text-lg font-thin text-gray-600">
                        {getEstimatedGen(
                          proposal.potenciaPico || 0,
                          proposal.infoProjeto?.cliente?.cidade,
                          proposal.infoProjeto?.cliente?.uf,
                          proposal.premissas.orientacao
                        ).toLocaleString('pt-br', {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}{' '}
                        kWh
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-center justify-center gap-2 rounded border border-gray-300 p-1 ">
                    <div className="flex w-full items-center justify-center gap-2">
                      <ImPriceTag style={{ color: 'rgb(34 ,197,94)', fontSize: '20px' }} />
                      <p className="text-xs font-thin text-gray-600">VALOR DA PROPOSTA</p>
                    </div>
                    <p className="text-lg font-thin text-gray-600">
                      R${' '}
                      {proposal?.valorProposta
                        ? proposal.valorProposta.toLocaleString('pt-br', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : null}{' '}
                    </p>
                  </div>
                  <div className="flex w-full flex-col items-center gap-2 rounded border border-gray-300 p-1 ">
                    <h1 className="text-lg font-thin text-gray-600">KIT</h1>
                    <div className="flex w-full flex-col">
                      <h1 className="mb-1 w-full text-center text-xs font-thin text-gray-600">INVERSORES</h1>
                      {proposal?.kit?.inversores.map((inverter: any) => (
                        <div className="w-full text-center text-xs font-medium text-gray-500">
                          {inverter.qtde}x{inverter.fabricante} ({inverter.modelo})
                        </div>
                      ))}
                    </div>
                    <div className="flex w-full flex-col">
                      <h1 className="mb-1 w-full text-center text-xs font-thin text-gray-600">MÓDULOS</h1>
                      {proposal?.kit?.modulos.map((module: any) => (
                        <div className="w-full text-center text-xs font-medium text-gray-500">
                          {module.qtde}x{module.fabricante} ({module.modelo})
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex h-full w-full flex-col rounded border border-gray-200 bg-[#fff] p-6 shadow-md lg:w-1/3">
              <div className="flex w-full flex-col items-center">
                <h1 className="w-full text-center font-Raleway text-lg font-bold text-[#15599a]">PREMISSAS</h1>
                <p className="text-center text-xs italic text-gray-500">Essas foram as premissas de dimensionamento utilizadas para essa proposta.</p>
              </div>
              <div className="flex w-full grow flex-col justify-around">
                <div className="flex w-full flex-col items-center justify-between lg:flex-row">
                  <h1 className="font-medium text-gray-500">Consumo de energia mensal</h1>
                  <h1 className="font-bold text-gray-800 lg:font-medium">{proposal?.premissas.consumoEnergiaMensal} kWh</h1>
                </div>
                <div className="flex w-full flex-col items-center justify-between lg:flex-row">
                  <h1 className="font-medium text-gray-500">Tarifa de energia</h1>
                  <h1 className="font-bold text-gray-800 lg:font-medium">R$ {proposal?.premissas.tarifaEnergia} R$/kWh</h1>
                </div>
                <div className="flex w-full flex-col items-center justify-between lg:flex-row">
                  <h1 className="font-medium text-gray-500">Tarifa TUSD</h1>
                  <h1 className="font-bold text-gray-800 lg:font-medium">{proposal?.premissas.tarifaTUSD} R$/kWh</h1>
                </div>
                <div className="flex w-full flex-col items-center justify-between lg:flex-row">
                  <h1 className="font-medium text-gray-500">Tensão da rede</h1>
                  <h1 className="font-bold text-gray-800 lg:font-medium">{proposal?.premissas.tensaoRede}</h1>
                </div>
                <div className="flex w-full flex-col items-center justify-between lg:flex-row">
                  <h1 className="font-medium text-gray-500">Fase</h1>
                  <h1 className="font-bold text-gray-800 lg:font-medium">{proposal?.premissas.fase}</h1>
                </div>
                <div className="flex w-full flex-col items-center justify-between lg:flex-row">
                  <h1 className="font-medium text-gray-500">Fator de simultaneidade</h1>
                  <h1 className="font-bold text-gray-800 lg:font-medium">{proposal?.premissas.fatorSimultaneidade}</h1>
                </div>
                <div className="flex w-full flex-col items-center justify-between lg:flex-row">
                  <h1 className="font-medium text-gray-500">Tipo de estrutura</h1>
                  <h1 className="font-bold text-gray-800 lg:font-medium">{proposal?.premissas.tipoEstrutura}</h1>
                </div>
                <div className="flex w-full flex-col items-center justify-between lg:flex-row">
                  <h1 className="font-medium text-gray-500">Distância</h1>
                  <h1 className="font-bold text-gray-800 lg:font-medium">{proposal?.premissas.distancia} km</h1>
                </div>
              </div>
            </div>
            <div className="flex h-full w-full flex-col rounded border border-gray-200 bg-[#fff] p-6 shadow-md lg:w-1/3">
              <div className="flex w-full flex-col items-center">
                <h1 className="w-full text-center font-Raleway text-lg font-bold text-[#15599a]">ARQUIVO</h1>
                <p className="text-center text-xs italic text-gray-500">
                  Faça o download do arquivo da proposta utilize do link para acessá-lo a qualquer momento.
                </p>
              </div>
              <div className="mt-4 flex w-full grow flex-col justify-center gap-4 lg:mt-0">
                <button
                  onClick={() => handleDownload(proposal?.linkArquivo, proposal?.nome ? proposal.nome : 'PROPOSTA')}
                  className="flex w-fit items-center gap-2 self-center rounded-lg border border-dashed border-[#15599a] p-2 text-[#15599a]"
                >
                  <p>DOWNLOAD DO PDF</p>
                  <TbDownload />
                </button>
                <button
                  onClick={() => copyToClipboard(proposal?.linkArquivo)}
                  className="flex w-fit items-center gap-2 self-center rounded-lg border border-dashed border-[#fead61] p-2 font-medium text-[#fead61]"
                >
                  <p>COPIAR LINK DO ARQUIVO</p>
                  <MdContentCopy />
                </button>
                {session?.user.permissoes.propostas.editar ? (
                  <button
                    onClick={() => setNewFileModalIsOpen(true)}
                    className="flex w-fit items-center gap-2 self-center rounded-lg border border-dashed border-black p-2 font-medium text-black"
                  >
                    <p>EDITAR ARQUIVO</p>
                    <AiFillEdit />
                  </button>
                ) : null}
              </div>
            </div>
          </div>
          {session?.user.permissoes.precos.visualizar ? (
            <>
              <div className="mt-4 hidden w-full flex-col gap-1 border border-gray-200 bg-[#fff]  shadow-md lg:flex">
                <div className="flex w-full items-center rounded bg-gray-200">
                  <div className="flex w-4/12 items-center justify-center p-1">
                    <h1 className="font-Raleway font-bold text-gray-500">ITEM</h1>
                  </div>
                  <div className="flex w-2/12 items-center justify-center p-1">
                    <h1 className="font-Raleway font-bold text-gray-500">CUSTO</h1>
                  </div>
                  <div className="flex w-2/12 items-center justify-center p-1">
                    <h1 className="font-Raleway font-bold text-gray-500">IMPOSTO</h1>
                  </div>
                  <div className="flex w-2/12 items-center justify-center p-1">
                    <h1 className="font-Raleway font-bold text-gray-500">LUCRO</h1>
                  </div>
                  <div className="flex w-2/12 items-center justify-center p-1">
                    <h1 className="font-Raleway font-bold text-gray-500">VENDA</h1>
                  </div>
                </div>
                {proposal.precificacao
                  ? Object.keys(proposal.precificacao).map((priceType, index) => {
                      if (!proposal?.precificacao) return
                      const pricesObj = proposal?.precificacao[priceType as keyof ONGridPricing]
                      if (!pricesObj) return
                      const { custo, vendaFinal, margemLucro, imposto, vendaProposto } = pricesObj
                      const description = priceType == 'kit' ? proposal.kit?.nome : priceDescription[priceType]

                      const taxValue = getTaxValue(custo, vendaFinal, margemLucro) * vendaFinal
                      const marginValue = getMarginValue(custo, vendaFinal, imposto) * vendaFinal
                      return (
                        <div className="flex w-full items-center rounded" key={index}>
                          <div className="flex w-4/12 items-center justify-center p-1">
                            <h1 className="text-gray-500">{description}</h1>
                          </div>
                          <div className="flex w-2/12 items-center justify-center p-1">
                            <h1 className="text-gray-500">
                              R${' '}
                              {custo.toLocaleString('pt-br', {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              })}
                            </h1>
                          </div>
                          <div className="flex w-2/12 items-center justify-center p-1">
                            <h1 className="text-gray-500">
                              R${' '}
                              {taxValue.toLocaleString('pt-br', {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              })}
                            </h1>
                          </div>
                          <div className="flex w-2/12 items-center justify-center p-1">
                            <h1 className="text-gray-500">
                              R${' '}
                              {marginValue.toLocaleString('pt-br', {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              })}
                            </h1>
                          </div>
                          <div className="flex w-2/12 items-center justify-center p-1">
                            <h1 className="text-gray-500">
                              R${' '}
                              {vendaFinal.toLocaleString('pt-br', {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              })}
                            </h1>
                          </div>
                        </div>
                      )
                    })
                  : null}
                <div className="flex w-full items-center rounded border-t border-gray-200 py-1">
                  <div className="flex w-4/12 items-center justify-center p-1">
                    <h1 className="font-bold text-gray-800">TOTAIS</h1>
                  </div>
                  <div className="flex w-2/12 items-center justify-center p-1">
                    <h1 className="font-medium text-gray-800">
                      R${' '}
                      {getTotals()?.totalCosts.toLocaleString('pt-br', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </h1>
                  </div>
                  <div className="flex w-2/12 items-center justify-center p-1">
                    <h1 className="font-medium text-gray-800">
                      R${' '}
                      {getTotals()?.totalTaxes.toLocaleString('pt-br', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </h1>
                  </div>
                  <div className="flex w-2/12 items-center justify-center p-1">
                    <h1 className="font-medium text-gray-800">
                      R${' '}
                      {getTotals()?.totalProfits.toLocaleString('pt-br', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </h1>
                  </div>
                  <div className="flex w-2/12 items-center justify-center p-1">
                    <h1 className="font-medium text-gray-800">
                      R${' '}
                      {getTotals()?.finalProposalPrice.toLocaleString('pt-br', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </h1>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-col rounded border border-gray-200 bg-[#fff] shadow-md lg:hidden">
                <h1 className="rounded-tl-md rounded-tr-md bg-gray-500 p-2 text-center font-Raleway font-bold text-white">ITENS</h1>
                {Object.keys(getPrices(proposal?.infoProjeto, proposal, null)).map((priceType, index) => {
                  if (proposal.precificacao) {
                    const pricesObj = proposal?.precificacao[priceType as keyof ONGridPricing]
                    if (!pricesObj) return
                    const { custo, vendaFinal, margemLucro, imposto, vendaProposto } = pricesObj
                    const description = priceType == 'kit' ? proposal.kit?.nome : priceDescription[priceType]

                    const taxValue = getTaxValue(custo, vendaFinal, margemLucro) * vendaFinal
                    const marginValue = getMarginValue(custo, vendaFinal, imposto) * vendaFinal
                    return (
                      <div className="flex w-full flex-col items-center rounded px-4" key={index}>
                        <div className="flex w-full items-center justify-center p-1">
                          <h1 className="font-medium text-gray-800">{description}</h1>
                        </div>
                        <div className="grid w-full grid-cols-2  items-center gap-1">
                          <div className="col-span-1 flex flex-col items-center justify-center p-1">
                            <h1 className="text-sm font-thin text-gray-500">CUSTO</h1>
                            <h1 className="text-center text-xs font-bold text-[#15599a]">
                              R${' '}
                              {custo.toLocaleString('pt-br', {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              })}
                            </h1>
                          </div>
                          <div className="col-span-1 flex flex-col items-center justify-center p-1">
                            <h1 className="text-sm font-thin text-gray-500">IMPOSTO</h1>
                            <h1 className="text-center text-xs font-bold text-[#15599a]">
                              R${' '}
                              {taxValue.toLocaleString('pt-br', {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              })}
                            </h1>
                          </div>
                          <div className="col-span-1 flex flex-col items-center justify-center p-1">
                            <h1 className="text-sm font-thin text-gray-500">LUCRO</h1>
                            <h1 className="text-center text-xs font-bold text-[#15599a]">
                              R${' '}
                              {marginValue.toLocaleString('pt-br', {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              })}
                            </h1>
                          </div>
                          <div className="col-span-1 flex flex-col items-center justify-center p-1">
                            <h1 className="text-sm font-thin text-gray-500">VENDA</h1>
                            <h1 className="text-center text-xs font-bold text-[#fead41]">
                              R${' '}
                              {vendaFinal.toLocaleString('pt-br', {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              })}
                            </h1>
                          </div>
                        </div>
                      </div>
                    )
                  }
                })}
                <h1 className="mt-4 bg-gray-800 p-2 text-center font-Raleway font-bold text-white">TOTAIS</h1>
                <div className="grid w-full grid-cols-2  items-center gap-1 p-2">
                  <div className="col-span-1 flex flex-col items-center justify-center p-1">
                    <h1 className="text-sm font-thin text-gray-500">CUSTO</h1>
                    <h1 className="text-center text-xs font-bold text-[#15599a]">
                      R${' '}
                      {getTotals()?.totalCosts.toLocaleString('pt-br', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </h1>
                  </div>
                  <div className="col-span-1 flex flex-col items-center justify-center p-1">
                    <h1 className="text-sm font-thin text-gray-500">IMPOSTO</h1>
                    <h1 className="text-center text-xs font-bold text-[#15599a]">
                      R${' '}
                      {getTotals()?.totalTaxes.toLocaleString('pt-br', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </h1>
                  </div>
                  <div className="col-span-1 flex flex-col items-center justify-center p-1">
                    <h1 className="text-sm font-thin text-gray-500">LUCRO</h1>
                    <h1 className="text-center text-xs font-bold text-[#15599a]">
                      R${' '}
                      {getTotals()?.totalProfits.toLocaleString('pt-br', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </h1>
                  </div>
                  <div className="col-span-1 flex flex-col items-center justify-center p-1">
                    <h1 className="text-sm font-thin text-gray-500">VENDA</h1>
                    <h1 className="text-center text-xs font-bold text-[#fead41]">
                      R${' '}
                      {getTotals()?.finalProposalPrice.toLocaleString('pt-br', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </h1>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="mt-4 flex w-full flex-col gap-1 border border-gray-200 bg-[#fff] shadow-md">
              <div className="flex w-full items-center rounded bg-gray-200">
                <div className="flex w-8/12 items-center justify-center p-1">
                  <h1 className="font-Raleway font-bold text-gray-500">ITEM</h1>
                </div>
                <div className="flex w-4/12 items-center justify-center p-1">
                  <h1 className="font-Raleway font-bold text-gray-500">VENDA</h1>
                </div>
              </div>
              {Object.keys(getPrices(proposal?.infoProjeto, proposal, null)).map((priceType, index) => {
                //@ts-ignore
                const pricing = proposal.precificacao ? proposal.precificacao : getPrices(proposal?.infoProjeto, proposal, null)
                const pricesObj = pricing[priceType as keyof ONGridPricing]
                if (!pricesObj) return
                const { custo, vendaFinal, margemLucro, imposto, vendaProposto } = pricesObj
                const description = priceType == 'kit' ? proposal.kit?.nome : priceDescription[priceType]
                return (
                  <div className="flex w-full items-center rounded" key={index}>
                    <div className="flex w-8/12 items-center justify-center p-1">
                      <h1 className="text-gray-500">{description}</h1>
                    </div>

                    <div className="flex w-4/12 items-center justify-center p-1">
                      <h1 className="text-gray-500">
                        R${' '}
                        {vendaFinal.toLocaleString('pt-br', {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </h1>
                    </div>
                  </div>
                )
              })}
              <div className="flex w-full items-center rounded border-t border-gray-200 py-1">
                <div className="flex w-8/12 items-center justify-center p-1">
                  <h1 className="font-bold text-gray-800">TOTAIS</h1>
                </div>

                <div className="flex w-4/12 items-center justify-center p-1">
                  <h1 className="font-medium text-gray-800">
                    R${' '}
                    {getTotals()?.finalProposalPrice.toLocaleString('pt-br', {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </h1>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {newFileModalIsOpen ? (
        <EditProposalFile
          proposalId={proposal._id || ''}
          projectName={proposal.projeto.nome || ''}
          proposalName={proposal.nome || ''}
          authorId={proposal.autor?.id || ''}
          closeModal={() => setNewFileModalIsOpen(false)}
        />
      ) : null}
      {requestContractModal ? <RequestContract closeModal={() => setRequestContractModal(false)} proposalInfo={proposal} /> : null}
    </div>
  )
}

export default ProposalViewUF
