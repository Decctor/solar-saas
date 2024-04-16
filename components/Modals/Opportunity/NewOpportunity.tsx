import React, { useEffect, useState } from 'react'
import { Session } from 'next-auth'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { VscChromeClose } from 'react-icons/vsc'
import { AiFillPhone } from 'react-icons/ai'
import { MdDelete, MdEmail } from 'react-icons/md'

import Avatar from '../../utils/Avatar'
import DropdownSelect from '../../Inputs/DropdownSelect'
import TextInput from '../../Inputs/TextInput'

import SelectInput from '../../Inputs/SelectInput'

import { formatNameAsInitials } from '@/lib/methods/formatting'
import { getUserAvatarUrl } from '@/lib/methods/extracting'
import { getErrorMessage } from '@/lib/methods/errors'

import { stateCities } from '../../../utils/estados_cidades'

import { useSearchClients } from '@/utils/queries/clients'
import { CustomersAcquisitionChannels, OpportunityResponsibilityRoles, OpportunityTypes } from '@/utils/select-options'
import { formatToCEP, formatToCPForCNPJ, formatToPhone, getCEPInfo } from '@/utils/methods'

import { TUserDTOSimplified } from '@/utils/schemas/user.schema'
import { InsertClientSchema, TClient, TSimilarClientSimplifiedDTO } from '@/utils/schemas/client.schema'
import { InsertOpportunitySchema, TOpportunity } from '@/utils/schemas/opportunity.schema'
import { TFunnelDTO, TFunnelEntity } from '@/utils/schemas/funnel.schema'
import { TFunnelReference } from '@/utils/schemas/funnel-reference.schema'
import SelectWithImages from '../../Inputs/SelectWithImages'
import { createClient } from '@/utils/mutations/clients'
import { createClientOpportunityAndFunnelReference, createOpportunity } from '@/utils/mutations/opportunities'
import { useMutationWithFeedback } from '@/utils/mutations/general-hook'
import { createFunnelReference } from '@/utils/mutations/funnel-references'
import axios from 'axios'
import { useProjectTypes } from '@/utils/queries/project-types'
import SimilarClients from '@/components/Opportunities/SimilarClients'
import ResponsiblesInformationBlock from '@/components/Opportunities/Creation/ResponsiblesInformationBlock'
import GeneralInformationBlock from '@/components/Opportunities/Creation/GeneralInformationBlock'
import FunnelReferenceInformationBlock from '@/components/Opportunities/Creation/FunnelReferenceInformationBlock'
import OpportunityClientInformationBlock from '@/components/Opportunities/Creation/OpportunityClientInformationBlock'
import AddressInformationBlock from '@/components/Opportunities/Creation/AddressInformationBlock'

function getCurrentActiveFunnelOptions(funnelId: number | string, funnels: TFunnelDTO[]) {
  let funnel = funnels.filter((funnel) => funnel._id.toString() == funnelId)[0]
  return funnel.etapas.map((stage) => {
    return {
      id: stage.id,
      label: stage.nome,
      value: stage.id,
    }
  })
}

type NewOpportunityProps = {
  session: Session
  opportunityCreators: TUserDTOSimplified[]
  funnels: TFunnelDTO[]
  closeModal: () => void
}
function NewOpportunity({ session, closeModal, opportunityCreators, funnels }: NewOpportunityProps) {
  const queryClient = useQueryClient()
  const { data: projectTypes } = useProjectTypes()
  const [similarClient, setSimilarClient] = useState<TSimilarClientSimplifiedDTO | null>(null)
  const [newClient, setNewClient] = useState<TClient & { _id?: string | null }>({
    _id: null,
    nome: '',
    idParceiro: session.user.idParceiro || '',
    cpfCnpj: null,
    telefonePrimario: '',
    telefoneSecundario: '',
    email: '',
    cep: null,
    uf: '',
    cidade: '',
    bairro: null,
    endereco: null,
    numeroOuIdentificador: null,
    complemento: null,
    dataNascimento: undefined,
    profissao: undefined,
    canalAquisicao: CustomersAcquisitionChannels[0].value,
    dataInsercao: new Date().toISOString(),
    idMarketing: undefined,
    indicador: {
      contato: null,
      nome: null,
    },
    autor: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },
  })
  const [newOpportunity, setNewOpportunity] = useState<TOpportunity>({
    nome: '',
    idParceiro: session.user.idParceiro || '',
    tipo: {
      id: '6615785ddcb7a6e66ede9785',
      titulo: 'SISTEMA FOTOVOLTAICO',
    },
    categoriaVenda: 'KIT',
    descricao: '',
    identificador: '',
    responsaveis: [],
    idCliente: '',
    localizacao: {
      cep: null,
      uf: '',
      cidade: '',
      bairro: undefined,
      endereco: undefined,
      numeroOuIdentificador: undefined,
      complemento: undefined,
      // distancia: z.number().optional().nullable(),
    },
    perda: {
      idMotivo: undefined,
      descricaoMotivo: undefined,
      data: undefined,
    },
    ganho: {
      idProjeto: undefined,
      data: undefined,
    },
    instalacao: {
      concessionaria: null,
      numero: undefined,
      grupo: undefined,
      tipoLigacao: undefined,
      tipoTitular: undefined,
      nomeTitular: undefined,
    },
    autor: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },
    dataInsercao: new Date().toISOString(),
    // adicionar contrato e solicitação de contrato futuramente
  })
  const [newFunnelReference, setNewFunnelReference] = useState<TFunnelReference>({
    idParceiro: session.user.idParceiro || '',
    idOportunidade: 'id-holder',
    idFunil: '',
    idEstagioFunil: '',
    dataInsercao: new Date().toISOString(),
  })
  const [newOpportunityResponsible, setNewOpportunityResponsible] = useState<{
    nome: string | null
    id: string | null
    papel: string | null
    avatar_url?: string | null
  }>({
    nome: session.user.nome,
    id: session.user.id,
    papel: null,
    avatar_url: session.user.avatar_url,
  })
  const {
    data: similarClients,
    isSuccess: clientsSuccess,
    isLoading: clientsLoading,
    isError: clientsError,
    refetch,
  } = useSearchClients({
    cpfCnpj: newClient.cpfCnpj || '',
    email: newClient.email || '',
    phoneNumber: newClient.telefonePrimario,
    enabled: false,
  })
  const [createdProjectId, setCreateProjectId] = useState<string | null>(null)
  async function setAddressDataByCEP(cep: string) {
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
        setNewClient((prev) => ({
          ...prev,
          endereco: addressInfo.logradouro,
          bairro: addressInfo.bairro,
          uf: addressInfo.uf as keyof typeof stateCities,
          cidade: addressInfo.localidade.toUpperCase(),
        }))
      }
    }, 1000)
  }
  async function handleOpportunityCreation() {
    try {
      const insertedOpportunityId = await createClientOpportunityAndFunnelReference({
        clientId: similarClient?._id || null,
        client: newClient,
        opportunity: newOpportunity,
        funnelReference: newFunnelReference,
        returnId: true,
      })
      setCreateProjectId(insertedOpportunityId)
      return 'Oportunidade criada com sucesso !'
    } catch (error) {
      throw error
    }
  }
  const { mutate, isPending, isSuccess } = useMutationWithFeedback({
    mutationKey: ['create-project'],
    mutationFn: handleOpportunityCreation,
    queryClient: queryClient,
    affectedQueryKey: ['opportunities'],
  })
  function addOpportunityResponsible() {
    if (!newOpportunityResponsible.nome || !newOpportunityResponsible.id) return toast.error('Responsável inválido ou não preenchido.')
    if (!newOpportunityResponsible.papel) return toast.error('Papel de responsável inválido.')
    const opportunityResponsibles = [...newOpportunity.responsaveis]
    const responsible = {
      nome: newOpportunityResponsible.nome,
      id: newOpportunityResponsible.id,
      papel: newOpportunityResponsible.papel,
      avatar_url: newOpportunityResponsible.avatar_url,
    }
    opportunityResponsibles.push(responsible)
    setNewOpportunity((prev) => ({ ...prev, responsaveis: opportunityResponsibles }))
    setNewOpportunityResponsible({
      nome: session.user.nome,
      id: session.user.id,
      papel: null,
      avatar_url: session.user.avatar_url,
    })
    return toast.success('Responsável adicionado com sucesso !')
  }
  function removeOpportunityResponsible(index: number) {
    const opportunityResponsibles = [...newOpportunity.responsaveis]
    opportunityResponsibles.splice(index, 1)
    setNewOpportunity((prev) => ({ ...prev, responsaveis: opportunityResponsibles }))
  }

  function handleSelectSimilarClient(client: TSimilarClientSimplifiedDTO) {
    setSimilarClient(client)
    const { nome, telefonePrimario, email, autor, cpfCnpj, dataInsercao, cep, uf, cidade, bairro, endereco, numeroOuIdentificador, complemento } = client
    const location = { cep, uf, cidade, bairro, endereco, numeroOuIdentificador, complemento }
    setNewOpportunity((prev) => ({ ...prev, localizacao: location }))
    setNewClient((prev) => ({ ...prev, nome, telefonePrimario, email, cpfCnpj, autor }))
    return toast.success('Cliente vinculado com sucesso !')
  }
  useEffect(() => {
    const getData = setTimeout(() => {
      refetch()
    }, 2000)
    return () => clearTimeout(getData)
  }, [newClient.cpfCnpj, newClient.email, newClient.telefonePrimario])
  console.log('CLIENTE', newClient)
  return (
    <div id="defaultModal" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <div className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[93%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px]">
        <div className="flex h-full flex-col">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <h3 className="text-xl font-bold text-[#353432] dark:text-white ">NOVA OPORTUNIDADE</h3>
            <button
              onClick={closeModal}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
          <div className="flex h-full flex-col gap-y-2 overflow-y-auto overscroll-y-auto border-b border-gray-200 py-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 lg:flex-row">
            <div className="flex w-full flex-col gap-2 px-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 lg:h-full lg:max-h-full lg:w-[60%] lg:overflow-y-auto">
              <ResponsiblesInformationBlock opportunity={newOpportunity} setOpportunity={setNewOpportunity} opportunityCreators={opportunityCreators} />
              <GeneralInformationBlock opportunity={newOpportunity} setOpportunity={setNewOpportunity} projectTypes={projectTypes} />
              <FunnelReferenceInformationBlock funnelReference={newFunnelReference} setFunnelReference={setNewFunnelReference} funnels={funnels || []} />
              <OpportunityClientInformationBlock
                opportunity={newOpportunity}
                setOpportunity={setNewOpportunity}
                client={newClient}
                setClient={setNewClient}
                similarClient={similarClient}
                setSimilarClient={setSimilarClient}
                similarClients={similarClients || []}
              />
              <AddressInformationBlock opportunity={newOpportunity} setOpportunity={setNewOpportunity} client={newClient} setClient={setNewClient} />
            </div>
            <div className="flex w-full lg:w-[40%]">
              <SimilarClients
                clients={similarClients || []}
                isSuccess={clientsSuccess}
                isLoading={clientsLoading}
                isError={clientsError}
                selectedClientId={similarClient?._id || null}
                handleSelectSimilarClient={handleSelectSimilarClient}
              />
            </div>
          </div>
          <div className="my-2 flex w-full items-center justify-end gap-4 px-4">
            {createdProjectId ? (
              <Link href={`/comercial/oportunidades/id/${createdProjectId}`}>
                <button className="font-medium text-green-500 duration-300 ease-in-out hover:scale-110">IR PARA O PROJETO CRIADO</button>
              </Link>
            ) : null}
            <button
              disabled={isPending}
              // @ts-ignore
              onClick={() => mutate()}
              className="h-9 whitespace-nowrap rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-gray-800 enabled:hover:text-white"
            >
              CRIAR OPORTUNIDADE
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewOpportunity
