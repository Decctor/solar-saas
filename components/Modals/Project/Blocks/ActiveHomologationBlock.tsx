import ActiveHomologation from '@/components/ProjectRequest/RequestStages/Utils/ActiveHomologation'
import { TProjectDTOWithReferences } from '@/utils/schemas/project.schema'
import React from 'react'

type ActiveHomologationBlockProps = {
  infoHolder: TProjectDTOWithReferences
  setInfoHolder: React.Dispatch<React.SetStateAction<TProjectDTOWithReferences>>
}
function ActiveHomologationBlock({ infoHolder, setInfoHolder }: ActiveHomologationBlockProps) {
  const activeHomologation = infoHolder.homologacaoDados
  return (
    <div className="flex w-full flex-col gap-2 rounded border border-gray-800">
      <h1 className="w-full rounded bg-gray-800 p-1 text-center font-bold text-white">HOMOLOGAÇÃO ATIVA</h1>
      <div className="flex w-full grow flex-col gap-2 p-2">
        {!!activeHomologation ? (
          <ActiveHomologation homologation={activeHomologation} />
        ) : (
          <div className="flex items-center justify-center p-2">
            <h1 className="text-center font-medium italic tracking-tight text-gray-500">
              Não foi possível encontrar nenhuma homologação ativa para o projeto.
            </h1>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActiveHomologationBlock
