import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { VscChromeClose } from 'react-icons/vsc'

import { handleProposalUpload, uploadFile } from '@/lib/methods/firebase'
import { getErrorMessage } from '../../../lib/methods/errors'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { Session } from 'next-auth'
import { BsCheck2All, BsCloudUploadFill } from 'react-icons/bs'
import { formatLongString } from '@/utils/methods'
import { editProposal } from '@/utils/mutations/proposals'
import { useMutationWithFeedback } from '@/utils/mutations/general-hook'

type EditProposalFileProps = {
  proposalName: string
  proposalId: string
  opportunityId: string
  closeModal: () => void
}
function EditProposalFile({ proposalName, proposalId, opportunityId, closeModal }: EditProposalFileProps) {
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()
  const [fileHolder, setFileHolder] = useState<File | null>(null)
  async function vinculateNewFile(file: File | null) {
    if (!file) return toast.error('Oops, anexe o arquivo a ser vinculado.')
    try {
      // Using uploadFile method to upload new proposal file to databse and retrieve the file url
      const { url } = await uploadFile({ file: file, fileName: proposalName, vinculationId: opportunityId })
      // Updating the proposal document with the new url
      await editProposal({ id: proposalId, changes: { urlArquivo: url } })

      return 'Alteração concluída com sucesso !'
    } catch (error) {
      throw error
    }
  }

  const {
    mutate: handleVinculateNewFile,
    isPending,
    isError,
    isSuccess,
  } = useMutationWithFeedback({
    mutationKey: ['edit-proposal-file'],
    mutationFn: vinculateNewFile,
    queryClient: queryClient,
    affectedQueryKey: ['proposal-by-id', proposalId],
    callbackFn: () => closeModal(),
  })
  return (
    <div id="edit-proposal-file" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <div className="fixed left-[50%] top-[50%] z-[100] h-fit w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px]  lg:w-[30%]">
        <div className="flex h-full flex-col">
          <div className="flex flex-wrap items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg">
            <h3 className="text-xl font-bold text-[#353432] dark:text-white ">EDITAR ARQUIVO DA PROPOSTA</h3>
            <button
              onClick={() => closeModal()}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
          <div className="flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto px-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            <div className="my-2 flex flex-col">
              <p className="text-center text-gray-500">Anexe aqui o novo arquivo da proposta.</p>
            </div>
            <div className="relative flex w-full items-center justify-center">
              <label
                htmlFor="dropzone-file"
                className={`flex min-h-[58px] w-full cursor-pointer flex-col items-center justify-center rounded-md border border-gray-200  bg-[#fff] p-3 hover:border-blue-300 hover:bg-blue-100`}
              >
                <div className="flex w-full items-center gap-2">
                  {fileHolder ? (
                    <p className="grow text-center leading-none tracking-tight text-gray-500">{formatLongString(fileHolder.name, 30)}</p>
                  ) : (
                    <p className="grow text-center leading-none tracking-tight text-gray-500">
                      <span className="font-semibold text-cyan-500">Clique para escolher um arquivo</span> ou o arraste para a àrea demarcada
                    </p>
                  )}
                  {fileHolder ? <BsCheck2All size={30} color={'rgb(34,197,94)'} /> : <BsCloudUploadFill size={30} />}
                </div>
                <input
                  onChange={(e) => {
                    if (e.target.files) return setFileHolder(e.target.files[0])
                    else return setFileHolder(null)
                  }}
                  id="dropzone-file"
                  type="file"
                  className="absolute h-full w-full opacity-0"
                  multiple={false}
                  accept=".pdf"
                />
              </label>
            </div>
          </div>

          <div className="mt-4 flex w-full items-center justify-end">
            {isError ? <p className="text-sm font-medium text-red-500">Oops, houve um erro ao vincular o novo arquivo.</p> : null}
            <button
              disabled={isPending}
              // @ts-ignore
              onClick={() => handleVinculateNewFile(fileHolder)}
              className="h-9 whitespace-nowrap rounded bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-blue-600 enabled:hover:text-white"
            >
              ATUALIZAR PROPOSTA
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProposalFile
