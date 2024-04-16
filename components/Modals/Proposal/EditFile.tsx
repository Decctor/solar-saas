import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { VscChromeClose } from 'react-icons/vsc'

import { handleProposalUpload } from '@/lib/methods/firebase'
import { getErrorMessage } from '../../../lib/methods/errors'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'
type EditProposalFileProps = {
  proposalId: string
  proposalName: string
  projectName: string
  authorId: string
  closeModal: () => void
}
function EditProposalFile({ proposalId, proposalName, projectName, authorId, closeModal }: EditProposalFileProps) {
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()
  const tag = `${proposalName}${(Math.random() * 1000).toFixed(0)}`

  const proposalStorageName = `crm/projetos/${projectName}/${tag}`
  const [newProposalFile, setNewProposalFile] = useState<File | null>(null)
  async function handleFileAlteration() {
    if (!newProposalFile) {
      toast.error('Vincule um arquivo para prosseguir')
      return
    }
    setIsLoading(true)
    try {
      const uploadedUrl = await handleProposalUpload({
        file: newProposalFile,
        storageRef: proposalStorageName,
      })
      const { data } = await axios.put(`/api/proposals?id=${proposalId}&responsible=${authorId}`, {
        changes: {
          linkArquivo: uploadedUrl,
        },
      })
      await queryClient.invalidateQueries({ queryKey: ['proposal', proposalId] })
      toast.success('Arquivo atualizado com sucesso!')
      setIsLoading(false)
      closeModal()
    } catch (error) {
      const msg = getErrorMessage(error)
      toast.error(msg)
      setIsLoading(false)
    }
  }

  return (
    <div id="editFile" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <div className="fixed left-[50%] top-[50%] z-[100] h-fit w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px]  lg:w-[30%]">
        <div className="flex h-full flex-col">
          <div className="flex flex-wrap items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg">
            <h3 className="text-xl font-bold text-[#353432] dark:text-white ">EDITAR ARQUIVO</h3>
            <button
              onClick={() => closeModal()}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
          <div className="flex grow flex-col overflow-y-auto overscroll-y-auto py-4 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            <h1 className="text-center font-black">Altere nesse menu o arquivo da proposta.</h1>
            <p className="mb-4 mt-1 text-center text-sm font-medium italic text-gray-500">Vincule o arquivo alterado ou proposta personalizada abaixo:</p>
            <div className={`flex w-full grow flex-col gap-1`}>
              <label htmlFor={'newProposalFile'} className="font-raleway text-center text-sm font-normal text-gray-500">
                NOVO ARQUIVO DA PROPOSTA
              </label>
              <div className="relative flex h-[46px] w-full items-center justify-center overflow-x-hidden rounded-lg border-2 border-dotted border-blue-700 bg-gray-100 p-2">
                <div className="absolute">
                  {newProposalFile ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-center text-sm font-normal text-gray-400">{newProposalFile ? newProposalFile.name : `-`}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center overflow-x-hidden text-sm">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block w-full overflow-x-hidden font-normal text-gray-400">Anexe aqui o PDF da proposta...</span>
                    </div>
                  )}
                </div>
                <input
                  onChange={(e) => {
                    if (e.target.files) setNewProposalFile(e.target.files[0])
                  }}
                  className="h-full w-full opacity-0"
                  type="file"
                  id={'newProposalFile'}
                  accept={'.pdf'}
                />
              </div>
            </div>
            <div className="mt-4 flex w-full items-center justify-end">
              {}
              <button
                disabled={isLoading}
                onClick={handleFileAlteration}
                className="w-fit rounded border border-blue-500 p-2 font-medium text-blue-500 duration-300 ease-in-out disabled:bg-gray-500 disabled:text-white hover:bg-blue-500 hover:text-white"
              >
                ALTERAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProposalFile
