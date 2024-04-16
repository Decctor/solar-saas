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
import { IContractRequest, IProposalInfo } from '@/utils/models'
import { getModulesQty } from '@/utils/methods'
type SolarSystemFormProps = {
  requestInfo: IContractRequest
  setRequestInfo: React.Dispatch<React.SetStateAction<IContractRequest>>
  proposalInfo: IProposalInfo
}
function SolarSystemForm({ requestInfo, setRequestInfo, proposalInfo }: SolarSystemFormProps) {
  const [stage, setStage] = useState(1)
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
        />
      ) : null}
      {stage == 4 ? (
        <SystemInfo
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          goToPreviousStage={() => setStage((prev) => prev - 1)}
          goToNextStage={() => setStage((prev) => prev + 1)}
          kit={proposalInfo.kit}
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
          modulesQty={getModulesQty(proposalInfo.kit?.modulos)}
          distance={proposalInfo.premissas.distancia}
          proposal={proposalInfo}
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
          kit={proposalInfo.kit}
          modulesQty={getModulesQty(proposalInfo.kit?.modulos)}
          distance={proposalInfo.premissas.distancia}
          projectId={proposalInfo?.infoProjeto?._id}
          proposalInfo={proposalInfo}
        />
      ) : null}
    </>
  )
}

export default SolarSystemForm
