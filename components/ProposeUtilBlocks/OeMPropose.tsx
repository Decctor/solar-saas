import React, { useEffect, useState } from 'react'
import System from '../Proposal/NewProposalStages/KitsSelection'
import Sizing from '../Proposal/NewProposalStages/GeneralSizing'
import Sale from '../Proposal/NewProposalStages/Pricing'
import Proposal from '../Proposal/NewProposalStages/Proposal'
import { IoMdOptions } from 'react-icons/io'
import { SlEnergy } from 'react-icons/sl'
import { MdAttachMoney, MdSell } from 'react-icons/md'
import { ImFileEmpty } from 'react-icons/im'
import { IProject, IProposalInfo, IProposalOeMInfo } from '@/utils/models'
import SizingOeM from '../ProposalStages/oem/SizingOeM'
import SaleOeM from '../ProposalStages/oem/SaleOeM'
import ProposalOeM from '../ProposalStages/oem/ProposalOeM'

type OeMProposalTypes = {
  project: IProject
}
function OeMProposal({ project }: OeMProposalTypes) {
  const [proposalStage, setProposalStage] = useState(1)
  const [proposalInfo, setProposalInfo] = useState<IProposalOeMInfo>({
    projeto: {
      nome: project?.nome,
      id: project?._id,
    },
    premissas: {
      consumoEnergiaMensal: 0,
      tarifaEnergia: 0,
      distancia: 0,
      qtdeModulos: 0,
      potModulos: 0,
      eficienciaAtual: 0,
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
  return (
    <div className="m-6 flex h-fit flex-col rounded-md border border-gray-200 bg-[#fff] p-2 shadow-lg">
      <div className="grid min-h-[50px] w-full grid-cols-1 grid-rows-3 items-center gap-6 border-b border-gray-200 pb-4 lg:grid-cols-3 lg:grid-rows-1 lg:gap-1">
        <div className={`flex items-center justify-center gap-1 ${proposalStage == 1 ? 'text-[#15599a]' : 'text-gray-600'} `}>
          <IoMdOptions style={{ fontSize: '23px' }} />
          <p className="text-sm font-bold lg:text-lg">DIMENSIONAMENTO</p>
        </div>
        <div className={`flex items-center justify-center gap-1 ${proposalStage == 2 ? 'text-[#15599a]' : 'text-gray-600'} `}>
          <MdSell style={{ fontSize: '23px' }} />
          <p className="text-sm font-bold lg:text-lg">VENDA</p>
        </div>
        <div className={`flex items-center justify-center gap-1 ${proposalStage == 3 ? 'text-[#15599a]' : 'text-gray-600'} `}>
          <ImFileEmpty style={{ fontSize: '23px' }} />
          <p className="text-sm font-bold lg:text-lg">PROPOSTA</p>
        </div>
      </div>
      {proposalStage == 1 ? (
        <SizingOeM
          proposalInfo={proposalInfo}
          project={project}
          setProposalInfo={setProposalInfo}
          moveToNextStage={() => setProposalStage((prev) => prev + 1)}
        />
      ) : null}
      {proposalStage == 2 ? (
        <SaleOeM
          proposalInfo={proposalInfo}
          setProposalInfo={setProposalInfo}
          project={project}
          moveToPreviousStage={() => setProposalStage((prev) => prev - 1)}
          moveToNextStage={() => setProposalStage((prev) => prev + 1)}
        />
      ) : null}
      {proposalStage == 3 ? (
        <ProposalOeM
          proposalInfo={proposalInfo}
          setProposalInfo={setProposalInfo}
          project={project}
          moveToPreviousStage={() => setProposalStage((prev) => prev - 1)}
        />
      ) : null}
    </div>
  )
}

export default OeMProposal
