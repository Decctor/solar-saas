import AttachFiles from '@/components/Homologations/AttachFiles'
import EquipmentsComposition from '@/components/Homologations/EquipmentsComposition'
import HolderInformation from '@/components/Homologations/HolderInformation'
import InstallationInformation from '@/components/Homologations/InstallationInformation'
import LocationInformation from '@/components/Homologations/LocationInformation'
import SelectInput from '@/components/Inputs/SelectInput'
import TextInput from '@/components/Inputs/TextInput'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingComponent from '@/components/utils/LoadingComponent'
import { getErrorMessage } from '@/lib/methods/errors'
import { uploadFile } from '@/lib/methods/firebase'
import { storage } from '@/services/firebase/storage-config'
import { fileTypes } from '@/utils/constants'
import { stateCities } from '@/utils/estados_cidades'
import { formatToCEP, formatToCPForCNPJ, formatToPhone, getCEPInfo } from '@/utils/methods'
import { createManyFileReferences } from '@/utils/mutations/file-references'
import { useMutationWithFeedback } from '@/utils/mutations/general-hook'
import { createHomologation } from '@/utils/mutations/homologations'
import { TFileHolder, TFileReference } from '@/utils/schemas/file-reference.schema'
import { THomologation } from '@/utils/schemas/homologation.schema'
import { TOpportunityDTO, TOpportunityDTOWithClient } from '@/utils/schemas/opportunity.schema'
import { ElectricalInstallationGroups } from '@/utils/select-options'
import { useQueryClient } from '@tanstack/react-query'
import { getMetadata, ref } from 'firebase/storage'
import { Session } from 'next-auth'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { BsCode, BsFillClipboardCheckFill } from 'react-icons/bs'
import { MdCode } from 'react-icons/md'
import { VscChromeClose } from 'react-icons/vsc'

type NewHomologationProps = {
  opportunity: TOpportunityDTOWithClient
  session: Session
  closeModal: () => void
}
function NewHomologation({ opportunity, session, closeModal }: NewHomologationProps) {
  const queryClient = useQueryClient()
  const [infoHolder, setInfoHolder] = useState<THomologation>({
    status: 'PENDENTE',
    idParceiro: session.user.idParceiro || '',
    distribuidora: '',
    idProposta: opportunity.idPropostaAtiva,
    oportunidade: {
      id: opportunity._id,
      nome: opportunity.nome,
    },
    titular: {
      nome: opportunity.instalacao.nomeTitular || '',
      identificador: opportunity.cliente.cpfCnpj || '',
      contato: opportunity.cliente.telefonePrimario || '',
    },
    equipamentos: [],
    localizacao: {
      cep: opportunity.localizacao.cep,
      uf: opportunity.localizacao.uf,
      cidade: opportunity.localizacao.cidade,
      bairro: opportunity.localizacao.bairro,
      endereco: opportunity.localizacao.endereco,
      numeroOuIdentificador: opportunity.localizacao.numeroOuIdentificador,
      complemento: opportunity.localizacao.complemento,
      // distancia: z.number().optional().nullable(),
    },
    instalacao: {
      numeroInstalacao: opportunity.instalacao.numero || '',
      numeroCliente: '',
      grupo: opportunity.instalacao.grupo || 'RESIDENCIAL',
    },
    documentacao: {
      formaAssinatura: 'FÍSICA',
      dataLiberacao: null,
      dataAssinatura: null,
    },
    acesso: {
      codigo: '',
      dataSolicitacao: null,
      dataResposta: null,
    },
    atualizacoes: [],
    vistoria: {
      dataSolicitacao: null,
      dataEfetivacao: null,
    },
    autor: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },
    dataInsercao: new Date().toISOString(),
  })
  const [files, setFiles] = useState<TFileHolder>({})
  async function handleUploadFiles({ files, homologationId }: { files: TFileHolder; homologationId: string }) {
    var links: TFileReference[] = []
    try {
      const uploadPromises = Object.entries(files).map(async ([key, value]) => {
        const file = value
        if (!file) return
        if (typeof file == 'string') {
          const fileRef = ref(storage, file)
          const metaData = await getMetadata(fileRef)
          const format = metaData.contentType && fileTypes[metaData.contentType] ? fileTypes[metaData.contentType].title : 'INDEFINIDO'
          const link: TFileReference = {
            idParceiro: session.user.idParceiro || '',
            idHomologacao: homologationId,
            titulo: key,
            formato: format,
            url: file,
            tamanho: metaData.size,
            autor: {
              id: session.user.id,
              nome: session.user.nome,
              avatar_url: session.user.avatar_url,
            },
            dataInsercao: new Date().toISOString(),
          }
          links.push(link)
        }
        if (typeof file != 'string') {
          const formattedFileName = key.toLowerCase().replaceAll(' ', '_')
          const vinculationId = homologationId
          // Uploading file to Firebase and getting url and format
          const { url, format, size } = await uploadFile({ file: file, fileName: formattedFileName, vinculationId: vinculationId })
          const link: TFileReference = {
            idParceiro: session.user.idParceiro || '',
            idHomologacao: homologationId,
            titulo: key,
            formato: format,
            url: url,
            tamanho: size,
            autor: {
              id: session.user.id,
              nome: session.user.nome,
              avatar_url: session.user.avatar_url,
            },
            dataInsercao: new Date().toISOString(),
          }
          links.push(link)
        }
      })
      await Promise.all(uploadPromises)
      return links
    } catch (error) {
      throw error
    }
  }

  async function requestHomologation({ info, files }: { info: THomologation; files: TFileHolder }) {
    try {
      // Creating the homologation document in db via api call
      const creationLoadingToastId = toast.loading('Criando homologação...')
      const insertedHomologationId = await createHomologation({ info, returnId: true })
      toast.dismiss(creationLoadingToastId)
      // Generating the file references for homologation
      const fileUploadLoadingToastId = toast.loading('Subindo arquivos...')
      const links = await handleUploadFiles({ files: files, homologationId: insertedHomologationId })
      // Inserting  file references
      const insertFileReferencesResponse = await createManyFileReferences({ info: links })
      toast.dismiss(fileUploadLoadingToastId)

      return 'Homologação requisitada com sucesso !'
    } catch (error) {
      throw error
    }
  }

  const {
    mutate: handleCreateHomologation,
    isPending,
    isError,
    isSuccess,
    error,
  } = useMutationWithFeedback({
    mutationKey: ['create-homologation'],
    mutationFn: requestHomologation,
    queryClient: queryClient,
    affectedQueryKey: ['opportunity-homologations', opportunity._id],
  })
  return (
    <div id="new-technical-analysis" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <div className="relative left-[50%] top-[50%] z-[100] h-[80%] max-h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-md bg-[#fff] p-[10px] lg:w-[80%]">
        <div className="flex h-full w-full flex-col">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <h3 className="text-xl font-bold text-[#353432] dark:text-white ">NOVA HOMOLOGAÇÃO</h3>
            <button
              onClick={() => closeModal()}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
          {isPending ? <LoadingComponent /> : null}
          {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
          {isSuccess ? (
            <div className="flex w-full grow flex-col items-center justify-center gap-2 text-green-500">
              <BsFillClipboardCheckFill color="rgb(34,197,94)" size={35} />
              <p className="text-lg font-medium tracking-tight text-gray-500">Homologação requisitada com sucesso !</p>
            </div>
          ) : null}
          {!isPending && !isError && !isSuccess ? (
            <>
              <div className="flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto px-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                <div className="my-2 flex flex-col items-center justify-center">
                  <h1 className="font-bold">OPORTUNIDADE</h1>
                  <div className="flex items-center gap-1 rounded-lg bg-cyan-500 px-2 py-1 text-white">
                    <MdCode />
                    <p className="text-sm font-bold tracking-tight">{infoHolder.oportunidade.nome}</p>
                  </div>
                </div>
                <HolderInformation infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
                <InstallationInformation infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
                <LocationInformation infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
                <EquipmentsComposition infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
                <AttachFiles opportunityId={opportunity._id} files={files} setFiles={setFiles} />
              </div>
              <div className="flex w-full items-center justify-end p-2">
                <button
                  disabled={isPending}
                  // @ts-ignore
                  onClick={() => handleCreateHomologation({ info: infoHolder, files: files })}
                  className="h-9 whitespace-nowrap rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-gray-800 enabled:hover:text-white"
                >
                  SOLICITAR HOMOLOGAÇÃO
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default NewHomologation
