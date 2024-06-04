import SelectInput from '@/components/Inputs/SelectInput'
import TextInput from '@/components/Inputs/TextInput'
import { TProject } from '@/utils/schemas/project.schema'
import { ComercialSegments, SigningForms } from '@/utils/select-options'
import React from 'react'
import ProjectObservations from './Utils/ProjectObservations'
import { Session } from 'next-auth'
import { formatToCEP, formatToCPForCNPJ, formatToPhone, getCEPInfo } from '@/utils/methods'
import TextareaInput from '@/components/Inputs/TextareaInput'
import toast from 'react-hot-toast'
import { stateCities } from '@/utils/estados_cidades'
import { useHomologationById } from '@/utils/queries/homologations'
import ReviewActiveHomologation from './Utils/ReviewActiveHomologation'
import ReviewActiveTechnicalAnalysis from './Utils/ReviewActiveTechnicalAnalysis'
import { MdOutlineTimer, MdRepeat } from 'react-icons/md'
import ProductCard from './Utils/ProductCard'
import ServiceCard from './Utils/ServiceCard'
import { TClientDTO } from '@/utils/schemas/client.schema'
import ActivePaymentMethod from './Utils/ActivePaymentMethod'
import CreditorBlock from './Utils/CreditorBlock'
import ReviewClientBlock from './Utils/ReviewClientBlock'
import ReviewGeneralInformation from './Utils/ReviewGeneralInformation'
import ReviewPaymentInformationBlock from './Utils/ReviewPaymentInformationBlock'
import ReviewSaleCompositionBlock from './Utils/ReviewSaleCompositionBlock'

type ReviewInformationBlockProps = {
  infoHolder: TProject
  setInfoHolder: React.Dispatch<React.SetStateAction<TProject>>
  client: TClientDTO
  session: Session
}
function ReviewInformationBlock({ infoHolder, setInfoHolder, session, client }: ReviewInformationBlockProps) {
  async function setGeneralInformationAddressDataByCEP(cep: string) {
    const addressInfo = await getCEPInfo(cep)
    const toastID = toast.loading('Buscando informações sobre o CEP...', {
      duration: 2000,
    })
    setTimeout(() => {
      if (addressInfo) {
        toast.dismiss(toastID)
        toast.success('Dados do CEP buscados com sucesso.', {
          duration: 1000,
        })
        setInfoHolder((prev) => ({
          ...prev,
          localizacao: {
            ...prev.localizacao,
            endereco: addressInfo.logradouro,
            bairro: addressInfo.bairro,
            uf: addressInfo.uf as keyof typeof stateCities,
            cidade: addressInfo.localidade.toUpperCase(),
          },
        }))
      }
    }, 1000)
  }
  function useClientDataInPayment(client: TClientDTO) {
    setInfoHolder((prev) => ({
      ...prev,
      pagamento: {
        ...prev.pagamento,
        pagador: {
          ...prev.pagamento.pagador,
          nome: client.nome,
          cpfCnpj: client.cpfCnpj || '',
          email: client.email || '',
          telefone: client.telefonePrimario,
        },
      },
    }))
  }
  const isFinancing = infoHolder.pagamento.metodo.fracionamento.some((f) => f.metodo == 'FINANCIAMENTO')
  return (
    <div className="flex w-full grow flex-col gap-2">
      <h1 className="w-full rounded bg-green-800 p-1 text-center text-lg font-bold text-white">REVISÃO DE INFORMAÇÕES</h1>
      <div className="my-1 flex w-full flex-col">
        <p className="w-full text-center text-sm font-light tracking-tighter text-gray-700">
          Revise as informações preenchidas para solicitação de projeto e, se necessário, faça correções.
        </p>
      </div>
      <div className="flex w-full grow flex-col gap-2">
        {/** GENERAL INFORMATION */}
        <ReviewGeneralInformation infoHolder={infoHolder} setInfoHolder={setInfoHolder} session={session} />
        {/** CLIENT INFORMATION */}
        <ReviewClientBlock clientId={infoHolder.cliente.id} session={session} />
        {/** HOMOLOGATION INFORMATION */}
        {infoHolder.idHomologacao ? <ReviewActiveHomologation homologationId={infoHolder.idHomologacao} /> : null}
        {/** TECHNICAL ANALYSIS INFORMATION */}
        {infoHolder.idAnaliseTecnica ? (
          <ReviewActiveTechnicalAnalysis analysisId={infoHolder.idAnaliseTecnica} userHasPricingViewPermission={session.user.permissoes.precos.visualizar} />
        ) : null}
        {/** SALE COMPOSITION */}
        <ReviewSaleCompositionBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} session={session} />
        {/** PAYMENT INFORMATION */}
        <ReviewPaymentInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} client={client} />
        {/** DOCUMENTATION INFORMATION */}
      </div>
    </div>
  )
}

export default ReviewInformationBlock
