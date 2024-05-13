import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingComponent from '@/components/utils/LoadingComponent'
import { useOpportunityHomologations } from '@/utils/queries/homologations'
import { TProject } from '@/utils/schemas/project.schema'
import { Session } from 'next-auth'
import React from 'react'
import SelectableHomologation from './Utils/SelectableHomologation'
import ActiveHomologation from './Utils/ActiveHomologation'

type HomologationBlockProps = {
  infoHolder: TProject
  setInfoHolder: React.Dispatch<React.SetStateAction<TProject>>
  moveToNextStage: () => void
  moveToPreviousStage: () => void
  session: Session
}
function HomologationBlock({ infoHolder, setInfoHolder, moveToNextStage, moveToPreviousStage, session }: HomologationBlockProps) {
  const opportunityId = infoHolder.oportunidade.id
  const { data: homologations, isLoading, isError, isSuccess } = useOpportunityHomologations({ opportunityId })

  const activeHomologation = infoHolder.idHomologacao ? homologations?.find((h) => h._id == infoHolder.idHomologacao) : null
  const selectableHomologations = homologations?.filter((h) => h._id != infoHolder.idHomologacao)
  function validateAndProceed() {
    moveToNextStage()
  }
  return (
    <div className="flex w-full grow flex-col gap-2">
      <h1 className="w-full rounded bg-gray-800 p-1 text-center font-bold text-white">INFORMAÇÕES DA HOMOLOGAÇÃO</h1>
      <div className="flex w-full grow flex-col gap-2">
        {isLoading ? <LoadingComponent /> : null}
        {isError ? <ErrorComponent msg="Oops, houve um erro ao buscar as homologações vinculadas a oportunidade." /> : null}
        {isSuccess ? (
          <>
            {activeHomologation ? (
              <div className="mb-6 flex w-full flex-col items-center justify-center rounded border border-green-500">
                <h1 className="w-full rounded-md rounded-tl rounded-tr bg-green-500 p-1 text-center text-sm font-bold text-white">HOMOLOGAÇÃO ATIVA</h1>
                <div className="flex w-full items-center justify-center p-2">
                  <ActiveHomologation homologation={activeHomologation} />
                </div>
              </div>
            ) : null}
            <h1 className="text-[0.65rem] font-bold leading-none tracking-tight text-gray-500 lg:text-xs">LISTA DE HOMOLOGAÇÕES DA OPORTUNIDADE</h1>
            {selectableHomologations ? (
              selectableHomologations.length > 0 ? (
                selectableHomologations.map((homologation) => (
                  <SelectableHomologation
                    key={homologation._id}
                    homologation={homologation}
                    selectHomologation={(id) => setInfoHolder((prev) => ({ ...prev, idHomologacao: id }))}
                  />
                ))
              ) : (
                <p className="w-full text-center text-sm font-medium tracking-tight text-gray-500">Nenhuma homologação encontrada.</p>
              )
            ) : null}
          </>
        ) : null}
      </div>
      <div className="flex w-full items-center justify-between">
        <button
          onClick={() => {
            moveToPreviousStage()
          }}
          className="rounded p-2 font-bold text-gray-500 duration-300 hover:scale-105"
        >
          Voltar
        </button>
        {activeHomologation ? (
          <button
            onClick={() => validateAndProceed()}
            className="rounded bg-black px-4 py-1 text-sm font-medium text-white duration-300 ease-in-out hover:bg-gray-700"
          >
            PROSSEGUIR
          </button>
        ) : (
          <button
            onClick={() => validateAndProceed()}
            className="rounded bg-orange-700 px-4 py-1 text-sm font-medium text-white duration-300 ease-in-out hover:bg-orange-800"
          >
            PROSSEGUIR SEM HOMOLOGAÇÃO
          </button>
        )}
      </div>
    </div>
  )
}

export default HomologationBlock
