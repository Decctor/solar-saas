import { TDocumentationConditionData } from '@/utils/project-documentation/helpers'
import { useProjectTypeById } from '@/utils/queries/project-types'
import { TOpportunity } from '@/utils/schemas/opportunity.schema'
import { TProject } from '@/utils/schemas/project.schema'
import React from 'react'
import { TDocumentationHolder } from '../NewProjectRequest'
import { handleDocumentationDefinition } from '@/utils/project-documentation/methods'
import { useFileReferencesByOpportunityId } from '@/utils/queries/file-references'
import DocumentFileInput from '@/components/Inputs/DocumentFileInput'
import DocumentationInput from '@/components/Inputs/DocumentationInput'

type DocumentationInformationBlockProps = {
  infoHolder: TProject
  setInfoHolder: React.Dispatch<React.SetStateAction<TProject>>
  documentationHolder: TDocumentationHolder
  setDocumentationHolder: React.Dispatch<React.SetStateAction<TDocumentationHolder>>
  moveToNextStage: () => void
  moveToPreviousStage: () => void
}
function DocumentationInformationBlock({
  infoHolder,
  setInfoHolder,
  documentationHolder,
  setDocumentationHolder,
  moveToPreviousStage,
  moveToNextStage,
}: DocumentationInformationBlockProps) {
  const { data: fileReferences } = useFileReferencesByOpportunityId({ opportunityId: infoHolder?.oportunidade.id || '' })

  const projectTypeId = infoHolder.tipo.id
  const { data: projectType } = useProjectTypeById({ id: projectTypeId })
  const requiredDocuments = handleDocumentationDefinition({
    projectTypeDocumentation: projectType?.documentacao || [],
    conditionData: documentationHolder.conditionData,
  })
  function validateAndProceed() {}
  return (
    <div className="flex w-full grow flex-col gap-2">
      <h1 className="w-full rounded bg-gray-800 p-1 text-center font-bold text-white">DOCUMENTAÇÃO</h1>
      <h1 className="my-2 w-full text-center text-xs font-medium tracking-tight lg:text-base">
        Anexe aqui os documentos necessários para solicitação de projeto.
      </h1>
      <h1 className="my-2 w-full text-center text-xs font-medium tracking-tight lg:text-base">
        Se existirem arquivos vinculados a oportunidade, você pode utilizá-los clicando em <strong className="text-blue-800">USAR REFERÊNCIAS</strong> e
        escolhendo o arquivo desejado.
      </h1>
      <div className="flex w-full grow flex-wrap items-start justify-center gap-4">
        {requiredDocuments?.map((document, index) => (
          <div key={index} className="w-full">
            <DocumentationInput
              label={document.titulo}
              value={documentationHolder.filesHolder[document.titulo]}
              description={document.descricao}
              obligatory={true}
              handleChange={(value) => setDocumentationHolder((prev) => ({ ...prev, filesHolder: { ...prev.filesHolder, [document.titulo]: value } }))}
              fileReferences={fileReferences}
              multiple={document.multiplo}
            />
          </div>
        ))}
      </div>
      <div className="flex w-full items-center justify-between">
        <button
          onClick={() => {
            moveToPreviousStage()
          }}
          className="rounded p-2 font-bold text-gray-500 duration-300 hover:scale-105"
        >
          VOLTAR
        </button>
        <button
          onClick={() => validateAndProceed()}
          className="rounded bg-black px-4 py-1 text-sm font-medium text-white duration-300 ease-in-out hover:bg-gray-700"
        >
          PROSSEGUIR
        </button>
      </div>
    </div>
  )
}

export default DocumentationInformationBlock
