import { useProjectJourneyTypes } from '@/utils/queries/project-journey-types'
import { Session } from 'next-auth'
import React, { useState } from 'react'
import LoadingComponent from '../utils/LoadingComponent'
import ErrorComponent from '../utils/ErrorComponent'
import ProjectJourneyType from '../Cards/ProjectJourneyType'
import { AnimatePresence } from 'framer-motion'
import NewProjectJourneyTypeMenu from '../ProjectJourneyTypes/NewProjectJourneyTypeMenu'

type ProjectJourneyTypesBlockProps = {
  session: Session
}
function ProjectJourneyTypesBlock({ session }: ProjectJourneyTypesBlockProps) {
  const [newProjectJourneyType, setNewProjectJourneyType] = useState<boolean>(false)
  const { data: journeyTypes, isLoading, isError, isSuccess } = useProjectJourneyTypes()
  return (
    <div className="flex min-h-[450px] w-full flex-col rounded border border-[#b990e7]">
      <h1 className="w-full rounded-tl rounded-tr bg-[#b990e7] p-1 text-center text-sm font-bold text-white">TIPOS DE JORNADA DE PROJETO</h1>
      <div className="my-1 flex w-full flex-col">
        <p className="w-full text-center text-sm font-light tracking-tighter text-gray-700">
          Os tipos de jornada de projeto aqui cadastrados serão opções na configuração do projeto.
        </p>
      </div>
      <div className="flex max-h-[600px] w-full grow flex-wrap items-start justify-around gap-2 overflow-y-auto overscroll-y-auto p-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
        {isLoading ? <LoadingComponent /> : null}
        {isError ? <ErrorComponent msg="Erro ao buscar tipos de jornada." /> : null}
        {isSuccess ? (
          journeyTypes.length > 0 ? (
            journeyTypes.map((journeyType) => (
              <div className="w-full">
                <ProjectJourneyType key={journeyType._id} journeyType={journeyType} handleClick={() => {}} />
              </div>
            ))
          ) : (
            <p className="flex w-full grow items-center justify-center py-2 text-center font-medium italic tracking-tight text-gray-500">
              Nenhum tipo de jornada encontrado.
            </p>
          )
        ) : null}
      </div>
      <div className="flex w-full items-center justify-end p-2">
        {newProjectJourneyType ? (
          <button
            className="rounded bg-red-500 p-1 px-4 text-sm font-medium text-white duration-300 ease-in-out hover:bg-red-600"
            onClick={() => setNewProjectJourneyType(false)}
          >
            FECHAR MENU
          </button>
        ) : (
          <button
            className="rounded bg-green-500 p-1 px-4 text-sm font-medium text-white duration-300 ease-in-out hover:bg-green-600"
            onClick={() => setNewProjectJourneyType(true)}
          >
            NOVO TIPO DE JORNADA
          </button>
        )}
      </div>
      <AnimatePresence>{newProjectJourneyType ? <NewProjectJourneyTypeMenu session={session} /> : null}</AnimatePresence>
    </div>
  )
}

export default ProjectJourneyTypesBlock
