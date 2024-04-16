import { IContractRequest, IProposalInfo, IProposalOeMInfo } from '@/utils/models'
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
import DocumentAttachmentInfo from './OeM/DocumentAttachmentInfo'
import ReviewInfo from './OeM/ReviewInfo'
import { getModulesQty } from '@/utils/methods'
import PersonalizedSystemInfo from './OeM/PersonalizedSystemInfo'
type OeMFormProps = {
  requestInfo: IContractRequest
  setRequestInfo: React.Dispatch<React.SetStateAction<IContractRequest>>
  proposalInfo: IProposalOeMInfo
}
function OeMForm({ requestInfo, setRequestInfo, proposalInfo }: OeMFormProps) {
  const [stage, setStage] = useState(1)
  return (
    <>
      {' '}
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
        />
      ) : null}
      {stage == 4 ? (
        <PersonalizedSystemInfo
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          goToPreviousStage={() => setStage((prev) => prev - 1)}
          goToNextStage={() => setStage((prev) => prev + 1)}
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
          proposal={proposalInfo}
          activePlanId={proposalInfo.idPlanoEscolhido}
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
        <DocumentAttachmentInfo
          projectInfo={proposalInfo.infoProjeto}
          requestInfo={requestInfo}
          proposalInfo={proposalInfo}
          setRequestInfo={setRequestInfo}
          goToPreviousStage={() => setStage((prev) => prev - 1)}
          goToNextStage={() => setStage((prev) => prev + 1)}
        />
      ) : null}
      {stage == 11 ? (
        <ReviewInfo
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          goToPreviousStage={() => setStage((prev) => prev - 1)}
          goToNextStage={() => setStage((prev) => prev + 1)}
          distance={proposalInfo.premissas.distancia}
          projectId={proposalInfo?.infoProjeto?._id}
          proposalInfo={proposalInfo}
        />
      ) : null}
    </>
  )
}

export default OeMForm
