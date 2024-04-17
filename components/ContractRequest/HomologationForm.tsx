import { IContractRequest } from '@/utils/models'

import React, { useState } from 'react'
import ContractInfo from './SolarSystem/ContractInfo'
import JourneyInfo from './SolarSystem/JourneyInfo'

import PAInfo from './SolarSystem/PAInfo'
import PaymentInfo from './SolarSystem/PaymentInfo'
import HomologationInfo from './Homologation/HomologationInfo'

import { Session } from 'next-auth'
import DocumentationInfo from './Homologation/DocumentationInfo'
import { UploadResult, getDownloadURL, getMetadata, ref, uploadBytes } from 'firebase/storage'

import { fileTypes } from '@/utils/constants'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useMutationWithFeedback } from '@/utils/mutations/general-hook'
import { useQueryClient } from '@tanstack/react-query'
import LoadingComponent from '../utils/LoadingComponent'
import ErrorComponent from '../utils/ErrorComponent'
import { BsFillClipboardCheckFill } from 'react-icons/bs'
import { TProposalDTOWithOpportunity } from '@/utils/schemas/proposal.schema'
import { TClientDTO } from '@/utils/schemas/client.schema'
import { storage } from '@/services/firebase/storage-config'
import { TContractRequest } from '@/utils/schemas/contract-request.schema'
import { createContractRequest } from '@/utils/mutations/contract-request'

type HomologationFormProps = {
  requestInfo: TContractRequest
  setRequestInfo: React.Dispatch<React.SetStateAction<TContractRequest>>
  proposeInfo: TProposalDTOWithOpportunity
  client?: TClientDTO
  session: Session
}
function HomologationForm({ requestInfo, setRequestInfo, proposeInfo, client, session }: HomologationFormProps) {
  const queryClient = useQueryClient()
  const [stage, setStage] = useState(1)
  const [documentsFileHolder, setDocumentsFileHolder] = useState<{ [key: string]: File | string | null }>({})

  async function handleUploadFiles(files: { [key: string]: File | string | null }) {
    var links: { title: string; link: string; format: string }[] = []
    try {
      const uploadPromises = Object.entries(files).map(async ([key, value]) => {
        const file = value
        if (!file) return
        if (typeof file == 'string') {
          const fileRef = ref(storage, file)
          const metaData = await getMetadata(fileRef)
          const link = {
            title: key,
            link: file,
            format: fileTypes[metaData.contentType || '']?.title || 'NÃO DEFINIDO',
          }
          links.push(link)
        }
        if (typeof file != 'string') {
          const storageStr = `formSolicitacao/${requestInfo.nomeDoContrato}/${key} - ${new Date().toISOString()}`
          const fileRef = ref(storage, storageStr)
          const firebaseUploadResponse = await uploadBytes(fileRef, file)
          const uploadResult = firebaseUploadResponse as UploadResult
          const fileUrl = await getDownloadURL(ref(storage, firebaseUploadResponse.metadata.fullPath))
          const link = {
            title: key,
            link: fileUrl,
            format: fileTypes[uploadResult.metadata.contentType || '']?.title || 'NÃO DEFINIDO',
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
  async function requestContract() {
    try {
      // Getting documents links
      const fileUploadLoadingToast = toast.loading('Vinculando arquivos...')
      const links = await handleUploadFiles(documentsFileHolder)
      toast.dismiss(fileUploadLoadingToast)
      // Creating contract request
      const requestCreationLoadingToast = toast.loading('Criando formulário...')
      const idProjetoCRM = proposeInfo.oportunidadeDados?._id || ''
      const idPropostaCRM = proposeInfo._id || ''
      const contractRequest = { ...requestInfo, idProjetoCRM, idPropostaCRM, links }
      const insertedId = await createContractRequest({ info: contractRequest, returnId: true })
      toast.dismiss(requestCreationLoadingToast)

      return 'Solicitação finalizada com sucesso !'
    } catch (error) {
      toast.dismiss()
      throw error
    }
  }
  const {
    mutate: handleRequestContract,
    isPending,
    isError,
    isSuccess,
  } = useMutationWithFeedback({
    mutationKey: ['create-contract-request'],
    mutationFn: requestContract,
    queryClient: queryClient,
    affectedQueryKey: ['projects'],
  })
  if (isPending) return <LoadingComponent />
  if (isError) return <ErrorComponent />
  if (isSuccess)
    return (
      <div className="flex w-full grow flex-col items-center justify-center gap-2 text-green-500">
        <BsFillClipboardCheckFill color="rgb(34,197,94)" size={35} />
        <p className="text-lg font-medium tracking-tight text-gray-500">Contrato requisitado com sucesso !</p>
      </div>
    )
  if (!isPending && !isError && !isSuccess)
    return (
      <>
        {stage == 1 ? <ContractInfo requestInfo={requestInfo} setRequestInfo={setRequestInfo} goToNextStage={() => setStage((prev) => prev + 1)} /> : null}
        {stage == 2 ? (
          <JourneyInfo
            requestInfo={requestInfo}
            setRequestInfo={setRequestInfo}
            goToPreviousStage={() => setStage((prev) => prev - 1)}
            goToNextStage={() => setStage((prev) => prev + 1)}
          />
        ) : null}
        {stage == 3 ? (
          <HomologationInfo
            requestInfo={requestInfo}
            setRequestInfo={setRequestInfo}
            goToPreviousStage={() => setStage((prev) => prev - 1)}
            goToNextStage={() => setStage((prev) => prev + 1)}
            opportunity={proposeInfo.oportunidadeDados}
            client={client}
            session={session}
          />
        ) : null}
        {stage == 4 ? (
          <PAInfo
            requestInfo={requestInfo}
            setRequestInfo={setRequestInfo}
            goToPreviousStage={() => setStage((prev) => prev - 1)}
            goToNextStage={() => setStage((prev) => prev + 1)}
          />
        ) : null}
        {stage == 5 ? (
          <PaymentInfo
            requestInfo={requestInfo}
            setRequestInfo={setRequestInfo}
            goToPreviousStage={() => setStage((prev) => prev - 1)}
            goToNextStage={() => setStage((prev) => prev + 1)}
          />
        ) : null}
        {stage == 6 ? (
          <DocumentationInfo
            requestInfo={requestInfo}
            setRequestInfo={setRequestInfo}
            goToPreviousStage={() => setStage((prev) => prev - 1)}
            goToNextStage={() => setStage((prev) => prev + 1)}
            documentsFile={documentsFileHolder}
            setDocumentsFile={setDocumentsFileHolder}
            projectInfo={proposeInfo.oportunidadeDados}
            handleRequestContract={handleRequestContract}
          />
        ) : null}
      </>
    )
  return <></>
}

export default HomologationForm
