import { TOpportunityDTOWithClient, TOpportunityDTOWithClientAndPartnerAndFunnelReferences } from '@/utils/schemas/opportunity.schema'
import { TPartnerSimplifiedDTO } from '@/utils/schemas/partner.schema'
import { TProposal } from '@/utils/schemas/proposal.schema'
import { Session } from 'next-auth'
import React, { useState } from 'react'
import { BsBookmarksFill } from 'react-icons/bs'
import { ImFileEmpty } from 'react-icons/im'
import { IoMdOptions } from 'react-icons/io'
import { MdAttachMoney, MdSell } from 'react-icons/md'
import GeneralSizing from '../NewProposalStages/GeneralSizing'
import PlansSelection from '../NewProposalStages/PlansSelection'
import PlansShowcase from '../NewProposalStages/PlansShowcase'
import { useSignaturePlanWithPricingMethod } from '@/utils/queries/signature-plans'
import Proposal from '../NewProposalStages/Proposal'
import { useProjectTypes } from '@/utils/queries/project-types'
import Pricing from '../NewProposalStages/Pricing'

type ProposalWithPlansProps = {
  opportunity: TOpportunityDTOWithClientAndPartnerAndFunnelReferences
  infoHolder: TProposal
  setInfoHolder: React.Dispatch<React.SetStateAction<TProposal>>
  session: Session
  partner: TPartnerSimplifiedDTO
}
function ProposalWithPlans({ opportunity, infoHolder, setInfoHolder, session, partner }: ProposalWithPlansProps) {
  const { data: signaturePlans, isLoading, isError, isSuccess } = useSignaturePlanWithPricingMethod()
  const { data: projectTypes } = useProjectTypes()
  const [stage, setStage] = useState<number>(1)
  console.log(infoHolder)
  return (
    <div className="m-6 flex h-fit flex-col rounded-md border border-gray-200 bg-[#fff] p-2 shadow-lg">
      <div className="grid min-h-[50px] w-full grid-cols-1 grid-rows-5 items-center gap-6 border-b border-gray-200 pb-4 lg:grid-cols-5 lg:grid-rows-1 lg:gap-1">
        <div className={`flex items-center justify-center gap-1 ${stage == 1 ? 'text-cyan-500' : 'text-gray-600'} `}>
          <IoMdOptions style={{ fontSize: '23px' }} />
          <p className="text-sm font-bold lg:text-lg">DIMENSIONAMENTO</p>
        </div>
        <div className={`flex items-center justify-center gap-1 ${stage == 2 ? 'text-cyan-500' : 'text-gray-600'} `}>
          <BsBookmarksFill style={{ fontSize: '23px' }} />
          <p className="text-sm font-bold lg:text-lg">OPÇÕES DE PLANO</p>
        </div>
        <div className={`flex items-center justify-center gap-1 ${stage == 3 ? 'text-cyan-500' : 'text-gray-600'} `}>
          <MdSell style={{ fontSize: '23px' }} />
          <p className="text-sm font-bold lg:text-lg">VENDA</p>
        </div>
        <div className={`flex items-center justify-center gap-1 ${stage == 4 ? 'text-cyan-500' : 'text-gray-600'} `}>
          <ImFileEmpty style={{ fontSize: '23px' }} />
          <p className="text-sm font-bold lg:text-lg">PROPOSTA</p>
        </div>
      </div>
      {stage == 1 ? (
        <GeneralSizing
          infoHolder={infoHolder}
          setInfoHolder={setInfoHolder}
          opportunity={opportunity}
          projectTypes={projectTypes || []}
          session={session}
          moveToNextStage={() => setStage((prev) => prev + 1)}
        />
      ) : null}
      {stage == 2 ? (
        <PlansSelection
          signaturePlans={signaturePlans}
          plansError={isError}
          plansLoading={isLoading}
          infoHolder={infoHolder}
          setInfoHolder={setInfoHolder}
          opportunity={opportunity}
          moveToNextStage={() => setStage((prev) => prev + 1)}
          moveToPreviousStage={() => setStage((prev) => prev - 1)}
          session={session}
        />
      ) : null}
      {/**In case there multiple plan options defined, showing the plans showcase */}
      {stage == 3 && infoHolder.planos.length > 1 ? (
        <PlansShowcase
          signaturePlans={signaturePlans || []}
          infoHolder={infoHolder}
          setInfoHolder={setInfoHolder}
          opportunity={opportunity}
          moveToNextStage={() => setStage((prev) => prev + 1)}
          moveToPreviousStage={() => setStage((prev) => prev - 1)}
          session={session}
        />
      ) : null}
      {stage == 3 && infoHolder.planos.length == 1 ? (
        <Pricing
          infoHolder={infoHolder}
          setInfoHolder={setInfoHolder}
          opportunity={opportunity}
          moveToPreviousStage={() => setStage((prev) => prev - 1)}
          moveToNextStage={() => setStage((prev) => prev + 1)}
          session={session}
        />
      ) : null}

      {stage == 4 ? (
        <Proposal
          infoHolder={infoHolder}
          setInfoHolder={setInfoHolder}
          opportunity={opportunity}
          projectTypes={projectTypes || []}
          moveToPreviousStage={() => setStage((prev) => prev - 1)}
          moveToNextStage={() => setStage((prev) => prev + 1)}
          session={session}
          partner={partner}
        />
      ) : null}
    </div>
  )
}

export default ProposalWithPlans
