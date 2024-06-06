import TextInput from '@/components/Inputs/TextInput'
import { TFileReference } from '@/utils/schemas/file-reference.schema'
import { Session } from 'next-auth'
import React, { useState } from 'react'
import { VscChromeClose } from 'react-icons/vsc'
import { BsCloudUploadFill } from 'react-icons/bs'
import CheckboxInput from '@/components/Inputs/CheckboxInput'
import toast from 'react-hot-toast'
import { storage } from '@/services/firebase/storage-config'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { getErrorMessage } from '@/lib/methods/errors'
import { fileTypes } from '@/utils/constants'
import { uploadFile } from '@/lib/methods/firebase'
import { createFileReference } from '@/utils/mutations/file-references'
import { useMutationWithFeedback } from '@/utils/mutations/general-hook'
import { useQueryClient } from '@tanstack/react-query'
type NewFileReferenceProps = {
  opportunityId: string
  clientId: string
  session: Session
  closeModal: () => void
}
function NewFileReference({ opportunityId, clientId, session, closeModal }: NewFileReferenceProps) {
  const queryClient = useQueryClient()
  const [fileHolder, setFileHolder] = useState<File | null>(null)
  const [infoHolder, setInfoHolder] = useState<TFileReference>({
    titulo: '',
    idParceiro: session.user.idParceiro || '',
    idOportunidade: opportunityId,
    formato: '',
    url: '',
    autor: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },
    dataInsercao: new Date().toISOString(),
  })
  function resetStates() {
    setInfoHolder({
      titulo: '',
      idOportunidade: opportunityId,
      idParceiro: session.user.idParceiro || '',
      formato: '',
      url: '',
      autor: {
        id: session.user.id,
        nome: session.user.nome,
        avatar_url: session.user.avatar_url,
      },
      dataInsercao: new Date().toISOString(),
    })
    setFileHolder(null)
  }
  // async function uploadFile({ file, fileReference }: { file: File | null; fileReference: TFileReference }) {
  //   try {
  //     if (!file) return toast.error('Anexe o arquivo desejado.')
  //     if (!fileReference.idCliente && !fileReference.idOportunidade) return toast.error('Escolha ao menos uma opção de vínculo para o arquivo.')
  //     if (fileReference.titulo.trim().length < 2) return toast.error('Preencha um titulo de ao menos 2 letras.')

  //     const formattedFileName = fileReference.titulo.toLowerCase().replaceAll(' ', '_')
  //     const vinculationId = fileReference.idOportunidade || fileReference.idCliente || 'naodefinido'
  //     const datetime = new Date().toISOString()
  //     const fileRef = ref(storage, `saas/(${vinculationId}) ${formattedFileName} - ${datetime}`)
  //     const uploadResponse = await uploadBytes(fileRef, file)
  //     const url = await getDownloadURL(ref(storage, uploadResponse.metadata.fullPath))
  //     const format =
  //       uploadResponse.metadata.contentType && fileTypes[uploadResponse.metadata.contentType]
  //         ? fileTypes[uploadResponse.metadata.contentType].title
  //         : 'INDEFINIDO'

  //     console.log('UPLOAD RESPONSE', uploadResponse)
  //     console.log('URL', url)
  //     console.log(formattedFileName)
  //   } catch (error) {
  //     const msg = getErrorMessage(error)
  //     toast.error(msg)
  //   }
  // }
  async function handleFileReferenceCreation() {
    try {
      // Validating file attachment and fields
      if (!fileHolder) return toast.error('Anexe o arquivo desejado.')
      if (!infoHolder.idCliente && !infoHolder.idOportunidade) return toast.error('Escolha ao menos uma opção de vínculo para o arquivo.')
      if (infoHolder.titulo.trim().length < 2) return toast.error('Preencha um titulo de ao menos 2 letras.')
      const formattedFileName = infoHolder.titulo.toLowerCase().replaceAll(' ', '_')
      const vinculationId = infoHolder.idOportunidade || infoHolder.idCliente || 'naodefinido'
      // Uploading file to Firebase and getting url and format
      const { url, format } = await uploadFile({ file: fileHolder, fileName: formattedFileName, vinculationId: vinculationId })
      // Callign endpoint for file reference creation
      const fileReference = { ...infoHolder, formato: format, url: url }
      const insertResponse = await createFileReference({ info: fileReference })
      return insertResponse
    } catch (error) {
      throw error
    }
  }
  const { mutate, isPending } = useMutationWithFeedback({
    mutationKey: ['create-file-reference'],
    mutationFn: handleFileReferenceCreation,
    affectedQueryKey: ['file-references-by-opportunity', opportunityId],
    queryClient: queryClient,
    callbackFn: () => resetStates(),
  })
  console.log('FILE', fileHolder)
  console.log('INFO', infoHolder)
  return (
    <div id="newCost" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <div className="fixed left-[50%] top-[50%] z-[100] h-[60%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:w-[40%]">
        <div className="flex h-full flex-col">
          <div className="flex flex-wrap items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg">
            <h3 className="text-xl font-bold text-[#353432] dark:text-white ">ANEXAR ARQUIVO</h3>
            <button
              onClick={() => closeModal()}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
          <div className="flex grow flex-col overflow-y-auto overscroll-y-auto py-4 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            <div className="mb-2 w-full">
              <TextInput
                label="TITULO DO ARQUIVO"
                placeholder="Preencha aqui o nome a ser dado ao arquivo..."
                value={infoHolder.titulo}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, titulo: value }))}
                width="100%"
              />
            </div>
            <div className="relative mb-4 flex w-full items-center justify-center">
              <label
                htmlFor="dropzone-file"
                className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pb-6 pt-5 text-gray-800">
                  <BsCloudUploadFill color={'rgb(31,41,55)'} size={50} />

                  {fileHolder ? (
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">{fileHolder.name}</p>
                  ) : (
                    <p className="mb-2 px-2 text-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Clique para escolher um arquivo</span> ou o arraste para a àrea demarcada
                    </p>
                  )}
                </div>
                <input
                  onChange={(e) => {
                    if (e.target.files) return setFileHolder(e.target.files[0])
                    else return setFileHolder(null)
                  }}
                  id="dropzone-file"
                  type="file"
                  className="absolute h-full w-full opacity-0"
                />
              </label>
            </div>
            <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="w-full lg:w-1/2">
                <CheckboxInput
                  labelFalse="VINCULAR AO CLIENTE"
                  labelTrue="VINCULAR AO CLIENTE"
                  checked={!!infoHolder.idCliente}
                  justify="justify-center"
                  handleChange={() => setInfoHolder((prev) => ({ ...prev, idCliente: clientId }))}
                />
              </div>
              <div className="w-full lg:w-1/2">
                <CheckboxInput
                  labelFalse="VINCULAR A OPORTUNIDADE"
                  labelTrue="VINCULAR A OPORTUNIDADE"
                  checked={!!infoHolder.idOportunidade}
                  justify="justify-center"
                  handleChange={() => setInfoHolder((prev) => ({ ...prev, idOportunidade: opportunityId }))}
                />
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-end">
            <button
              // @ts-ignore
              disabled={isPending}
              onClick={() => mutate()}
              className="h-9 whitespace-nowrap rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-gray-800 enabled:hover:text-white"
            >
              ANEXAR
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewFileReference
