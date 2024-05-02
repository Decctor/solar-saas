import React, { useState } from 'react'
import ContractInfo from './SolarSystem/ContractInfo'
import JourneyInfo from './SolarSystem/JourneyInfo'
import HomologationInfo from './SolarSystem/HomologationInfo'
import SystemInfo from './SolarSystem/SystemInfo'
import StructureInfo from './SolarSystem/StructureInfo'
import PAInfo from './SolarSystem/PAInfo'
import OeMPlansInfo from './SolarSystem/OeMPlansInfo'
import PaymentInfo from './SolarSystem/PaymentInfo'
import CreditDistributionInfo from './SolarSystem/CreditDistributionInfo'
import DocumentAttachmentInfo from './SolarSystem/DocumentAttachmentInfo'
import ReviewInfo from './SolarSystem/ReviewInfo'

import { getModulesQty } from '@/utils/methods'
import DocumentAttachment from './SolarSystem/DocumentAttachment'

import toast from 'react-hot-toast'
import { UploadResult, getDownloadURL, getMetadata, ref, uploadBytes } from 'firebase/storage'

import { fileTypes } from '@/utils/constants'
import axios from 'axios'
import { TContractRequest } from '@/utils/schemas/integrations/app-ampere/contract-request.schema'
import { TProposalDTOWithOpportunity } from '@/utils/schemas/proposal.schema'
import { storage } from '@/services/firebase/storage-config'
import { createContractRequest } from '@/utils/mutations/contract-request'
type SolarSystemFormProps = {
  requestInfo: TContractRequest
  setRequestInfo: React.Dispatch<React.SetStateAction<TContractRequest>>
  proposeInfo: TProposalDTOWithOpportunity
}
function SolarSystemForm({ requestInfo, setRequestInfo, proposeInfo }: SolarSystemFormProps) {
  const [stage, setStage] = useState(1)
  const [sameProjectHolder, setSameProjectHolder] = useState<boolean>(false)
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
  async function handleRequestContract() {
    try {
      // Getting documents links
      const fileUploadLoadingToast = toast.loading('Vinculando arquivos...')
      const links = await handleUploadFiles(documentsFileHolder)
      toast.dismiss(fileUploadLoadingToast)
      // Creating contract request
      const requestCreationLoadingToast = toast.loading('Criando formulário...')
      const previsaoValorDoKit = proposeInfo?.precificacao?.find((p) => p.descricao.includes('KIT'))
        ? proposeInfo?.precificacao?.find((p) => p.descricao.includes('KIT'))?.valorFinal
        : null
      const idProjetoCRM = proposeInfo.oportunidadeDados?._id || ''
      const idPropostaCRM = proposeInfo._id || ''
      const contractRequest = { ...requestInfo, previsaoValorDoKit, idProjetoCRM, idPropostaCRM, links }
      const insertedId = await createContractRequest({ info: contractRequest, returnId: true })
      toast.dismiss(requestCreationLoadingToast)
      return 'Solicitação finalizada com sucesso !'
    } catch (error) {
      toast.dismiss()
      throw error
    }
  }
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
          sameProjectHolder={sameProjectHolder}
          setSameProjectHolder={setSameProjectHolder}
          goToPreviousStage={() => setStage((prev) => prev - 1)}
          goToNextStage={() => setStage((prev) => prev + 1)}
        />
      ) : null}
      {stage == 4 ? (
        <SystemInfo
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          goToPreviousStage={() => setStage((prev) => prev - 1)}
          goToNextStage={() => setStage((prev) => prev + 1)}
          proposal={proposeInfo}
        />
      ) : null}
      {stage == 5 ? (
        <StructureInfo
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          goToPreviousStage={() => setStage((prev) => prev - 1)}
          goToNextStage={() => setStage((prev) => prev + 1)}
        />
      ) : null}
      {stage == 6 ? (
        <PAInfo
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          goToPreviousStage={() => setStage((prev) => prev - 1)}
          goToNextStage={() => setStage((prev) => prev + 1)}
        />
      ) : null}
      {stage == 7 ? (
        <OeMPlansInfo
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          goToPreviousStage={() => setStage((prev) => prev - 1)}
          goToNextStage={() => setStage((prev) => prev + 1)}
          modulesQty={getModulesQty(proposeInfo.produtos)}
          distance={proposeInfo.premissas.distancia || 0}
          propose={proposeInfo}
        />
      ) : null}
      {stage == 8 ? (
        <PaymentInfo
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          goToPreviousStage={() => setStage((prev) => prev - 1)}
          goToNextStage={() => setStage((prev) => prev + 1)}
        />
      ) : null}
      {stage == 9 ? (
        <CreditDistributionInfo
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          goToPreviousStage={() => setStage((prev) => prev - 1)}
          goToNextStage={() => setStage((prev) => prev + 1)}
        />
      ) : null}
      {stage == 10 ? (
        <DocumentAttachment
          projectInfo={proposeInfo.oportunidadeDados}
          requestInfo={requestInfo}
          proposeInfo={proposeInfo}
          setRequestInfo={setRequestInfo}
          sameProjectHolder={sameProjectHolder}
          goToPreviousStage={() => setStage((prev) => prev - 1)}
          goToNextStage={() => setStage((prev) => prev + 1)}
          documentsFile={documentsFileHolder}
          setDocumentsFile={setDocumentsFileHolder}
        />
      ) : null}
      {stage == 11 ? (
        <ReviewInfo
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          modulesQty={getModulesQty(proposeInfo.produtos)}
          distance={proposeInfo.premissas.distancia || 0}
          projectId={proposeInfo?.oportunidadeDados?._id}
          proposeInfo={proposeInfo}
          documentsFile={documentsFileHolder}
          handleRequestContract={handleRequestContract}
        />
      ) : null}
    </>
  )
}

export default SolarSystemForm
