import React, { useEffect, useState } from 'react'
import System from '../Proposal/NewProposalStages/KitsSelection'
import Sizing from '../Proposal/NewProposalStages/GeneralSizing'
import Sale from '../Proposal/NewProposalStages/Pricing'
import Proposal from '../Proposal/NewProposalStages/Proposal'
import { IoMdOptions } from 'react-icons/io'
import { SlEnergy } from 'react-icons/sl'
import { MdAttachMoney, MdSell } from 'react-icons/md'
import { ImFileEmpty } from 'react-icons/im'
import { IProject, IProposalInfo, ITechnicalAnalysis } from '@/utils/models'
import { checkQueryEnableStatus, useTechnicalAnalysis } from '@/utils/methods'
import { useSession } from 'next-auth/react'

type SolarSystemProposalTypes = {
  project: IProject
}
function SolarSystemProposal({ project }: SolarSystemProposalTypes) {
  const { data: session } = useSession()
  const { data: technicalAnalysis } = useTechnicalAnalysis(project.identificador, checkQueryEnableStatus(session, project.identificador), 'CONCLUIDO')

  const [selectedAnalysis, setSelectedAnalysis] = useState<ITechnicalAnalysis | null>(null)
  const [proposalStage, setProposalStage] = useState(1)
  const [proposalInfo, setProposalInfo] = useState<IProposalInfo>({
    projeto: {
      nome: project?.nome,
      id: project?._id,
    },
    premissas: {
      consumoEnergiaMensal: 0,
      distribuidora: 'CEMIG D',
      subgrupo: undefined,
      tarifaEnergia: 0,
      tarifaTUSD: 0,
      tensaoRede: '127/220V',
      fase: 'Bifásico',
      fatorSimultaneidade: 0,
      tipoEstrutura: 'Fibrocimento',
      orientacao: 'NORTE',
      distancia: 0,
    },
  })
  useEffect(() => {
    setProposalInfo((prev) => ({
      ...prev,
      projeto: {
        id: project?._id,
        nome: project?.nome,
      },
    }))
  }, [project])
  console.log('VISITAS', technicalAnalysis)
  return (
    <div className="m-6 flex h-fit flex-col rounded-md border border-gray-200 bg-[#fff] p-2 shadow-lg">
      <div className="grid min-h-[50px] w-full grid-cols-1 grid-rows-5 items-center gap-6 border-b border-gray-200 pb-4 lg:grid-cols-5 lg:grid-rows-1 lg:gap-1">
        <div className={`flex items-center justify-center gap-1 ${proposalStage == 1 ? 'text-[#15599a]' : 'text-gray-600'} `}>
          <IoMdOptions style={{ fontSize: '23px' }} />
          <p className="text-sm font-bold lg:text-lg">DIMENSIONAMENTO</p>
        </div>
        <div className={`flex items-center justify-center gap-1 ${proposalStage == 2 ? 'text-[#15599a]' : 'text-gray-600'} `}>
          <SlEnergy style={{ fontSize: '23px' }} />
          <p className="text-sm font-bold lg:text-lg">SISTEMA</p>
        </div>
        <div className={`flex items-center justify-center gap-1 ${proposalStage == 3 ? 'text-[#15599a]' : 'text-gray-600'} `}>
          <MdSell style={{ fontSize: '23px' }} />
          <p className="text-sm font-bold lg:text-lg">VENDA</p>
        </div>
        <div className={`flex items-center justify-center gap-1 ${proposalStage == 5 ? 'text-[#15599a]' : 'text-gray-600'} `}>
          <MdAttachMoney style={{ fontSize: '23px' }} />
          <p className="text-sm font-bold lg:text-lg">FINANCEIRO</p>
        </div>
        <div className={`flex items-center justify-center gap-1 ${proposalStage == 4 ? 'text-[#15599a]' : 'text-gray-600'} `}>
          <ImFileEmpty style={{ fontSize: '23px' }} />
          <p className="text-sm font-bold lg:text-lg">PROPOSTA</p>
        </div>
      </div>

      {proposalStage == 1 ? (
        <Sizing
          proposalInfo={proposalInfo}
          project={project}
          setProposalInfo={setProposalInfo}
          moveToNextStage={() => setProposalStage((prev) => prev + 1)}
          technicalAnalysis={technicalAnalysis}
          selectedAnalysis={selectedAnalysis}
          setSelectedAnalysis={setSelectedAnalysis}
        />
      ) : null}
      {proposalStage == 2 ? (
        <System
          proposalInfo={proposalInfo}
          setProposalInfo={setProposalInfo}
          project={project}
          moveToPreviousStage={() => setProposalStage((prev) => prev - 1)}
          moveToNextStage={() => setProposalStage((prev) => prev + 1)}
        />
      ) : null}
      {proposalStage == 3 ? (
        <Sale
          proposalInfo={proposalInfo}
          setProposalInfo={setProposalInfo}
          project={project}
          moveToPreviousStage={() => setProposalStage((prev) => prev - 1)}
          moveToNextStage={() => setProposalStage((prev) => prev + 1)}
          selectedAnalysis={selectedAnalysis}
        />
      ) : null}
      {proposalStage == 4 ? (
        <Proposal
          proposalInfo={proposalInfo}
          setProposalInfo={setProposalInfo}
          project={project}
          moveToPreviousStage={() => setProposalStage((prev) => prev - 1)}
          selectedAnalysis={selectedAnalysis}
        />
      ) : null}
    </div>
  )
}

export default SolarSystemProposal
