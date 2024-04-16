import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Sidebar } from '../../components/Sidebar'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { RxDashboard } from 'react-icons/rx'
import axios, { AxiosError } from 'axios'
import { toast } from 'react-hot-toast'
import ContractRequest from '../Modals/RequestContract'

import { useSession } from 'next-auth/react'
import { IProject, IProposalOeMInfo } from '@/utils/models'
import { ImPower, ImPriceTag, ImTab } from 'react-icons/im'
import { TbDownload } from 'react-icons/tb'
import { MdAttachMoney, MdContentCopy } from 'react-icons/md'
import { fileTypes } from '@/utils/constants'
import { FullMetadata, getMetadata, ref } from 'firebase/storage'
import { storage } from '@/services/firebase/storage-config'
import { BsFillCalendarCheckFill, BsPatchCheckFill } from 'react-icons/bs'
import { AiFillCloseCircle, AiFillEdit } from 'react-icons/ai'
import Link from 'next/link'
import JSZip from 'jszip'
import { basename } from 'path'
import { FaUser } from 'react-icons/fa'
import dayjs from 'dayjs'
import EditProposalFile from '../Modals/Proposal/EditFile'
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
type ProposalViewOeMProps = {
  proposal: IProposalOeMInfo
}
function ProposalViewOeM({ proposal }: ProposalViewOeMProps) {
  const router = useRouter()
  const { data: session } = useSession({
    required: true,
  })
  const [newFileModalIsOpen, setNewFileModalIsOpen] = useState<boolean>(false)
  const { id } = router.query
  const queryClient = useQueryClient()
  const [requestContractModal, setRequestContractModal] = useState<boolean>(false)
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

  const { mutate: updateProposal } = useMutation({
    mutationKey: ['editProposal'],
    mutationFn: async (changes: { [key: string]: any }) => {
      try {
        const { data } = await axios.put(`/api/proposals?id=${id}&responsible=${proposal?.autor?.id}`, {
          changes: changes,
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
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: ['proposal', id],
      })
      // await queryClient.refetchQueries({ queryKey: ["project"] });
      if (data.message) toast.success(data.message)
    },
  })

  return (
    <div className="flex h-full flex-col md:flex-row">
      <Sidebar session={session} />
      <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa] p-6">
        <div className="flex w-full items-center justify-between border-b border-gray-200 pb-2">
          <div className="flex flex-col gap-1">
            <h1 className="font-Raleway text-xl font-bold text-gray-800">{proposal?.nome}</h1>
            <Link href={`/projeto/id/${proposal.infoProjeto?._id}`}>
              <div className="flex items-center gap-2">
                <RxDashboard style={{ color: '#15599a' }} />
                <p className="text-xs">{proposal?.infoProjeto?.nome}</p>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <FaUser style={{ color: '#15599a', fontSize: '15px' }} />
              <p className="text-xs">{proposal?.autor?.nome}</p>
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
          <div className="flex min-h-[350px] w-full flex-col justify-around gap-3 lg:flex-row">
            <div className="flex h-full w-full flex-col rounded border border-gray-200 bg-[#fff] p-3 shadow-md lg:w-1/3">
              <div className="flex w-full flex-col items-center">
                <h1 className="w-full text-center font-Raleway text-lg font-bold text-[#15599a]">INFORMAÇÕES GERAIS</h1>
                <p className="text-center text-xs italic text-gray-500">Essas são informações sobre a proposta.</p>
              </div>
              <div className="flex w-full grow flex-col justify-around">
                <div className="flex w-full flex-col items-center gap-2 p-3">
                  <div className="flex w-full flex-col items-center justify-center gap-2 rounded border border-gray-300 p-1">
                    <div className="flex w-full items-center justify-center gap-2">
                      <ImPower style={{ color: 'rgb(239,68,68)', fontSize: '20px' }} />
                      <p className="text-xs font-thin text-gray-600">POTÊNCIA PICO</p>
                    </div>
                    <p className="text-lg font-thin text-gray-600">{proposal?.potenciaPico} kWh</p>
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
                        : 'N/A'}{' '}
                    </p>
                  </div>
                  {/* <div className="flex w-full flex-col items-center gap-2 rounded border border-gray-300 p-1 ">
                    <h1 className="text-lg font-thin text-gray-600">KIT</h1>
                    <div className="flex w-full flex-col">
                      <h1 className="mb-1 w-full text-center text-xs font-thin text-gray-600">
                        INVERSORES
                      </h1>
                      {proposal?.kit?.inversores.map((inverter: any) => (
                        <div className="w-full text-center text-xs font-medium text-gray-500">
                          {inverter.qtde}x{inverter.fabricante} (
                          {inverter.modelo})
                        </div>
                      ))}
                    </div>
                    <div className="flex w-full flex-col">
                      <h1 className="mb-1 w-full text-center text-xs font-thin text-gray-600">
                        MÓDULOS
                      </h1>
                      {proposal?.kit?.modulos.map((module: any) => (
                        <div className="w-full text-center text-xs font-medium text-gray-500">
                          {module.qtde}x{module.fabricante} ({module.modelo})
                        </div>
                      ))}
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
            <div className="flex h-full w-full flex-col rounded border border-gray-200 bg-[#fff] p-3 shadow-md lg:w-1/3">
              <div className="flex w-full flex-col items-center">
                <h1 className="w-full text-center font-Raleway text-lg font-bold text-[#15599a]">PREMISSAS</h1>
                <p className="text-center text-xs italic text-gray-500">Essas foram as premissas de dimensionamento utilizadas para essa proposta.</p>
              </div>
              <div className="flex w-full grow flex-col justify-around">
                <div className="flex w-full items-center justify-between">
                  <h1 className="font-medium">Consumo de energia mensal</h1>
                  <h1>{proposal?.premissas.consumoEnergiaMensal} kWh</h1>
                </div>
                <div className="flex w-full items-center justify-between">
                  <h1 className="font-medium">Tarifa de energia</h1>
                  <h1>R$ {proposal?.premissas.tarifaEnergia} R$/kWh</h1>
                </div>
                <div className="flex w-full items-center justify-between">
                  <h1 className="font-medium">Quantidade de Módulos</h1>
                  <h1>{proposal?.premissas.qtdeModulos}</h1>
                </div>
                <div className="flex w-full items-center justify-between">
                  <h1 className="font-medium">Potência dos Módulos</h1>
                  <h1>{proposal?.premissas.potModulos}</h1>
                </div>
                <div className="flex w-full items-center justify-between">
                  <h1 className="font-medium">Eficiência</h1>
                  <h1>{proposal?.premissas.eficienciaAtual ? proposal?.premissas.eficienciaAtual : 'N/A'}</h1>
                </div>
                <div className="flex w-full items-center justify-between">
                  <h1 className="font-medium">Distância</h1>
                  <h1>{proposal?.premissas.distancia} km</h1>
                </div>
              </div>
            </div>
            <div className="flex h-full w-full flex-col rounded border border-gray-200 bg-[#fff] p-3 shadow-md lg:w-1/3">
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
          <div className="mt-2 flex w-full grow flex-col rounded border border-gray-200 bg-[#fff] p-3 shadow-md">
            <h1 className="w-full text-center font-Raleway text-lg font-bold text-[#15599a]">PLANOS</h1>
            <div className="flex w-full grow flex-col items-start justify-center gap-2 py-2 md:flex-row md:justify-around">
              <div
                onClick={() =>
                  updateProposal({
                    idPlanoEscolhido: 1,
                    valorProposta: proposal.precificacao?.manutencaoSimples.vendaFinal,
                  })
                }
                className={`flex h-[450px] min-h-[400px] ${
                  proposal.idPlanoEscolhido == 1 ? 'bg-green-200' : ''
                } w-full cursor-pointer  flex-col gap-2 rounded border border-gray-300 p-3 shadow-lg duration-300 ease-in-out hover:scale-[1.02] hover:bg-blue-50 md:w-[350px]`}
              >
                <h1 className="text-center text-lg font-medium text-gray-800">MANUTENÇÃO SIMPLES</h1>
                <div className="flex grow flex-col gap-4">
                  <h1 className="text-center text-xs font-medium text-[#fead61]">ITENS DO PLANO</h1>
                  <div className="flex w-full items-center">
                    <div className="flex w-[80%] items-center justify-center">
                      <h1 className="text-center text-xs font-medium text-gray-500">MANUTENÇÃO ELÉTRICA INVERSORES + QUADROS ELÉTRICOS</h1>
                    </div>
                    <div className="flex w-[20%] items-center justify-end text-green-500">
                      <BsPatchCheckFill />
                    </div>
                  </div>
                  <div className="flex w-full items-center">
                    <div className="flex w-[80%] items-center justify-center">
                      <h1 className="text-center text-xs font-medium text-gray-500">REAPERTO CONEXÕES ELÉTRICAS</h1>
                    </div>
                    <div className="flex w-[20%] items-center justify-end text-green-500">
                      <BsPatchCheckFill />
                    </div>
                  </div>
                  <div className="flex w-full items-center">
                    <div className="flex w-[80%] items-center justify-center">
                      <h1 className="text-center text-xs font-medium text-gray-500">ANÁLISE E CONFERÊNCIA DE GRANDEZAS ELÉTRICAS DOS EQUIPAMENTOS ELÉTRICOS</h1>
                    </div>
                    <div className="flex w-[20%] items-center justify-end text-green-500">
                      <BsPatchCheckFill />
                    </div>
                  </div>
                  <div className="flex w-full items-center">
                    <div className="flex w-[80%] items-center justify-center">
                      <h1 className="text-center text-xs font-medium text-gray-500">LIMPEZA NOS MÓDULOS FOTOVOLTAICOS</h1>
                    </div>
                    <div className="flex w-[20%] items-center justify-end text-green-500">
                      <BsPatchCheckFill />
                    </div>
                  </div>
                  <div className="flex w-full items-center">
                    <div className="flex w-[80%] items-center justify-center">
                      <h1 className="text-center text-xs font-medium text-gray-500">DISTRIBUIÇÃO DE CRÉDITOS</h1>
                    </div>
                    <div className="flex w-[20%] items-center justify-end text-red-500">
                      <AiFillCloseCircle />
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-col items-center gap-1">
                  <h1 className="text-xs font-thin text-gray-800">VALOR DO SERVIÇO</h1>
                  <div className="flex items-center justify-center gap-1 rounded border border-green-500 p-1">
                    <MdAttachMoney style={{ color: 'rgb(34,197,94)', fontSize: '20px' }} />
                    <p className="text-lg font-medium text-gray-600">
                      R${' '}
                      {proposal.precificacao?.manutencaoSimples.vendaFinal.toLocaleString('pt-br', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <div
                onClick={() =>
                  updateProposal({
                    idPlanoEscolhido: 2,
                    valorProposta: proposal.precificacao?.planoSol.vendaFinal,
                  })
                }
                className={`flex h-[450px] min-h-[400px] ${
                  proposal.idPlanoEscolhido == 2 ? 'bg-green-200' : ''
                } w-full cursor-pointer  flex-col gap-2 rounded border border-gray-300 p-3 shadow-lg duration-300 ease-in-out hover:scale-[1.02] hover:bg-blue-50 md:w-[350px]`}
              >
                <h1 className="text-center text-lg font-medium text-gray-800">PLANO SOL</h1>
                <div className="flex grow flex-col gap-4">
                  <h1 className="text-center text-xs font-medium text-[#fead61]">ITENS DO PLANO</h1>
                  <div className="flex w-full items-center">
                    <div className="flex w-[80%] items-center justify-center">
                      <h1 className="text-center text-xs font-medium text-gray-500">MANUTENÇÃO ELÉTRICA INVERSORES + QUADROS ELÉTRICOS</h1>
                    </div>
                    <div className="flex w-[20%] items-center justify-end text-green-500">
                      <BsPatchCheckFill />
                    </div>
                  </div>
                  <div className="flex w-full items-center">
                    <div className="flex w-[80%] items-center justify-center">
                      <h1 className="text-center text-xs font-medium text-gray-500">REAPERTO CONEXÕES ELÉTRICAS</h1>
                    </div>
                    <div className="flex w-[20%] items-center justify-end text-green-500">
                      <BsPatchCheckFill />
                    </div>
                  </div>
                  <div className="flex w-full items-center">
                    <div className="flex w-[80%] items-center justify-center">
                      <h1 className="text-center text-xs font-medium text-gray-500">ANÁLISE E CONFERÊNCIA DE GRANDEZAS ELÉTRICAS DOS EQUIPAMENTOS ELÉTRICOS</h1>
                    </div>
                    <div className="flex w-[20%] items-center justify-end text-green-500">
                      <BsPatchCheckFill />
                    </div>
                  </div>
                  <div className="flex w-full items-center">
                    <div className="flex w-[80%] items-center justify-center">
                      <h1 className="text-center text-xs font-medium text-gray-500">LIMPEZA NOS MÓDULOS FOTOVOLTAICOS</h1>
                    </div>
                    <div className="flex w-[20%] items-center justify-end text-green-500">
                      <BsPatchCheckFill />
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-center">
                    <h1 className="text-center text-xs font-medium text-blue-700">MANUTENÇÃO ADICIONAL DURANTE O PLANO POR 50% DO VALOR DO CONTRATO</h1>
                  </div>
                  <div className="flex w-full items-center">
                    <div className="flex w-[80%] items-center justify-center">
                      <h1 className="text-center text-xs font-medium text-gray-500">DISTRIBUIÇÃO DE CRÉDITOS</h1>
                    </div>
                    <div className="flex w-[20%] items-center justify-end gap-2 text-green-500">
                      2x <BsPatchCheckFill />
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-col items-center gap-1">
                  <h1 className="text-xs font-thin text-gray-800">VALOR DO SERVIÇO</h1>
                  <div className="flex items-center justify-center gap-1 rounded border border-green-500 p-1">
                    <MdAttachMoney style={{ color: 'rgb(34,197,94)', fontSize: '20px' }} />
                    <p className="text-lg font-medium text-gray-600">
                      R${' '}
                      {proposal.precificacao?.planoSol.vendaFinal.toLocaleString('pt-br', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <div
                onClick={() =>
                  updateProposal({
                    idPlanoEscolhido: 3,
                    valorProposta: proposal.precificacao?.planoSolPlus.vendaFinal,
                  })
                }
                className={`flex h-[450px] min-h-[400px] ${
                  proposal.idPlanoEscolhido == 3 ? 'bg-green-200' : ''
                } w-full cursor-pointer  flex-col gap-2 rounded border border-gray-300 p-3 shadow-lg duration-300 ease-in-out hover:scale-[1.02] hover:bg-blue-50 md:w-[350px]`}
              >
                <h1 className="text-center text-lg font-medium text-gray-800">PLANO SOL+</h1>
                <div className="flex grow flex-col gap-4">
                  <h1 className="text-center text-xs font-medium text-[#fead61]">ITENS DO PLANO</h1>
                  <div className="flex w-full items-center">
                    <div className="flex w-[80%] items-center justify-center">
                      <h1 className="text-center text-xs font-medium text-gray-500">MANUTENÇÃO ELÉTRICA INVERSORES + QUADROS ELÉTRICOS</h1>
                    </div>
                    <div className="flex w-[20%] items-center justify-end text-green-500">
                      <BsPatchCheckFill />
                    </div>
                  </div>
                  <div className="flex w-full items-center">
                    <div className="flex w-[80%] items-center justify-center">
                      <h1 className="text-center text-xs font-medium text-gray-500">REAPERTO CONEXÕES ELÉTRICAS</h1>
                    </div>
                    <div className="flex w-[20%] items-center justify-end text-green-500">
                      <BsPatchCheckFill />
                    </div>
                  </div>
                  <div className="flex w-full items-center">
                    <div className="flex w-[80%] items-center justify-center">
                      <h1 className="text-center text-xs font-medium text-gray-500">ANÁLISE E CONFERÊNCIA DE GRANDEZAS ELÉTRICAS DOS EQUIPAMENTOS ELÉTRICOS</h1>
                    </div>
                    <div className="flex w-[20%] items-center justify-end text-green-500">
                      <BsPatchCheckFill />
                    </div>
                  </div>
                  <div className="flex w-full items-center">
                    <div className="flex w-[80%] items-center justify-center">
                      <h1 className="text-center text-xs font-medium text-gray-500">LIMPEZA NOS MÓDULOS FOTOVOLTAICOS</h1>
                    </div>
                    <div className="flex w-[20%] items-center justify-end text-green-500">
                      <BsPatchCheckFill />
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-center">
                    <h1 className="text-center text-xs font-medium text-blue-700">MANUTENÇÃO ADICIONAL DURANTE O PLANO POR 70% DO VALOR DO CONTRATO</h1>
                  </div>
                  <div className="flex w-full items-center">
                    <div className="flex w-[80%] items-center justify-center">
                      <h1 className="text-center text-xs font-medium text-gray-500">DISTRIBUIÇÃO DE CRÉDITOS</h1>
                    </div>
                    <div className="flex w-[20%] items-center justify-end text-green-500">ILIMITADO</div>
                  </div>
                </div>
                <div className="flex w-full flex-col items-center gap-1">
                  <h1 className="text-xs font-thin text-gray-800">VALOR DO SERVIÇO</h1>
                  <div className="flex items-center justify-center gap-1 rounded border border-green-500 p-1">
                    <MdAttachMoney style={{ color: 'rgb(34,197,94)', fontSize: '20px' }} />
                    <p className="text-lg font-medium text-gray-600">
                      R${' '}
                      {proposal.precificacao?.planoSolPlus.vendaFinal.toLocaleString('pt-br', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
      {requestContractModal ? <ContractRequest closeModal={() => setRequestContractModal(false)} proposalInfo={proposal} /> : null}
    </div>
  )
}

export default ProposalViewOeM
