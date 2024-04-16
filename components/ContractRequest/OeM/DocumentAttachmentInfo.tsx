import { storage } from '@/services/firebase/storage-config'
import { fileTypes } from '@/utils/constants'
import { formatLongString, isFile } from '@/utils/methods'
import { IContractRequest, IProject, IProposalOeMInfo } from '@/utils/models'
import { FullMetadata, UploadResult, getDownloadURL, getMetadata, ref, uploadBytes } from 'firebase/storage'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { BsCheckCircleFill } from 'react-icons/bs'

type DocumentAttachmentInfoProps = {
  projectInfo?: IProject
  requestInfo: IContractRequest
  setRequestInfo: React.Dispatch<React.SetStateAction<IContractRequest>>
  goToPreviousStage: () => void
  goToNextStage: () => void
  proposalInfo: IProposalOeMInfo
}
function DocumentAttachmentInfo({ projectInfo, requestInfo, setRequestInfo, goToPreviousStage, goToNextStage, proposalInfo }: DocumentAttachmentInfoProps) {
  const savingRef = projectInfo ? `formSolicitacao/${projectInfo.nome}` : `formSolicitacao/naodefinido`

  const [uploadOK, setUploadOK] = useState<boolean | 'loading'>(false)
  const [files, setFiles] = useState<{
    [key: string]: File | null | string
  }>({
    contaDeEnergia: projectInfo?.anexos?.contaDeEnergia ? projectInfo?.anexos?.contaDeEnergia : null,
    documentoComFoto: projectInfo?.anexos?.documentoComFoto ? projectInfo?.anexos?.documentoComFoto : null,
    iptu: projectInfo?.anexos?.iptu ? projectInfo?.anexos?.iptu : null,
    propostaComercial: proposalInfo.linkArquivo ? proposalInfo.linkArquivo : null,
  })
  function validateDocuments() {
    if (!files.propostaComercial) {
      toast.error('Anexe o arquivo da proposta comercial.')
      return false
    }
    if (!files.documentoComFoto) {
      toast.error('Anexe um foto de um documento com foto do cliente.')
      return false
    }
    if (!files.comprovanteEnderecoCorrespondente) {
      toast.error('Anexe um comprovante de endereço do cliente.')
      return false
    }
    if (requestInfo.tipoDoTitular == 'PESSOA JURIDICA') {
      if (!files.contratoSocial) {
        toast.error('Anexe o contrato social da empresa do cliente.')
        return false
      }
      if (!files.cartaoCnpj) {
        toast.error('Anexe o cartão CNPJ da empresa do cliente.')
        return false
      }
      if (!files.comprovanteEnderecoRepresentante) {
        toast.error('Anexe o comprovante de endereço do representante legal.')
        return false
      }
      if (!files.documentoComFotoSocios) {
        toast.error('Anexe o documento com foto dos sócios.')
        return false
      }
    }
    return true
  }
  async function getPreviouslyAttachedFiles(
    links: { title: string; link: string; format: string }[],
    attachments: IProject['anexos'],
    proposalFileLink?: string
  ) {
    if (attachments) {
      if (attachments.contaDeEnergia) {
        let fileRef = ref(storage, attachments.contaDeEnergia)
        const metadata = await getMetadata(fileRef)
        const md = metadata as FullMetadata
        links.push({
          title: 'CONTA DE ENERGIA',
          link: attachments.contaDeEnergia,
          format: metadata.contentType && fileTypes[metadata.contentType] ? fileTypes[metadata.contentType].title : 'INDEFINIDO',
        })
      }
      if (attachments.documentoComFoto) {
        let fileRef = ref(storage, attachments.documentoComFoto)
        const metadata = await getMetadata(fileRef)
        const md = metadata as FullMetadata
        links.push({
          title: 'DOCUMENTO COM FOTO',
          link: attachments.documentoComFoto,
          format: metadata.contentType && fileTypes[metadata.contentType] ? fileTypes[metadata.contentType].title : 'INDEFINIDO',
        })
      }
      if (attachments.iptu) {
        let fileRef = ref(storage, attachments.iptu)
        const metadata = await getMetadata(fileRef)
        const md = metadata as FullMetadata
        links.push({
          title: 'IPTU',
          link: attachments.iptu,
          format: metadata.contentType && fileTypes[metadata.contentType] ? fileTypes[metadata.contentType].title : 'INDEFINIDO',
        })
      }
      if (proposalFileLink) {
        let fileRef = ref(storage, proposalFileLink)
        const metadata = await getMetadata(fileRef)
        const md = metadata as FullMetadata
        links.push({
          title: 'PROPOSTA COMERCIAL',
          link: proposalFileLink,
          format: metadata.contentType && fileTypes[metadata.contentType] ? fileTypes[metadata.contentType].title : 'INDEFINIDO',
        })
      }
    }
    return links
  }
  async function uploadFiles() {
    if (validateDocuments()) {
      var holder
      var links: { title: string; link: string; format: string }[] = []
      const toastID = toast.loading('Enviando arquivos...')
      try {
        setUploadOK('loading')
        if (files.contaDeEnergia && typeof files.contaDeEnergia != 'string') {
          var imageRef = ref(storage, `${savingRef}/contaDeEnergia${(Math.random() * 10000).toFixed(0)}`)
          let res = await uploadBytes(imageRef, files.contaDeEnergia)
          const uploadResult = res as UploadResult

          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: 'CONTA DE ENERGIA',
            link: url,
            format:
              uploadResult.metadata.contentType && fileTypes[uploadResult.metadata.contentType]
                ? fileTypes[uploadResult.metadata.contentType].title
                : 'INDEFINIDO',
          })
        }
        if (files.laudo && typeof files.laudo != 'string') {
          var imageRef = ref(storage, `${savingRef}/laudo${(Math.random() * 10000).toFixed(0)}`)
          let res = await uploadBytes(imageRef, files.laudo)
          const uploadResult = res as UploadResult
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: 'LAUDO',
            link: url,
            format:
              uploadResult.metadata.contentType && fileTypes[uploadResult.metadata.contentType]
                ? fileTypes[uploadResult.metadata.contentType].title
                : 'INDEFINIDO',
          })
        }
        if (files.propostaComercial && typeof files.propostaComercial != 'string') {
          var imageRef = ref(storage, `${savingRef}/propostaComercial${(Math.random() * 10000).toFixed(0)}`)
          let res = await uploadBytes(imageRef, files.propostaComercial)
          const uploadResult = res as UploadResult
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: 'PROPOSTA COMERCIAL',
            link: url,
            format:
              uploadResult.metadata.contentType && fileTypes[uploadResult.metadata.contentType]
                ? fileTypes[uploadResult.metadata.contentType].title
                : 'INDEFINIDO',
          })
        }
        if (files.comprovanteEnderecoCorrespondente && typeof files.comprovanteEnderecoCorrespondente != 'string') {
          var imageRef = ref(storage, `formSolicitacao/${requestInfo.nomeDoContrato}/comprovanteEnderecoCorrespondente${(Math.random() * 10000).toFixed(0)}`)
          let res = await uploadBytes(imageRef, files.comprovanteEnderecoCorrespondente)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          const uploadResult = res as UploadResult
          links.push({
            title: 'COMPROVANTE DE ENDEREÇO - CORRESPONDÊNCIA',
            link: url,
            format:
              uploadResult.metadata.contentType && fileTypes[uploadResult.metadata.contentType]
                ? fileTypes[uploadResult.metadata.contentType].title
                : 'INDEFINIDO',
          })
        }
        if (requestInfo.tipoDaInstalacao == 'RURAL') {
          if (files.car && typeof files.car != 'string') {
            var imageRef = ref(storage, `${savingRef}/car${(Math.random() * 10000).toFixed(0)}`)
            let res = await uploadBytes(imageRef, files.car)
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
            const uploadResult = res as UploadResult
            links.push({
              title: 'CAR',
              link: url,
              format:
                uploadResult.metadata.contentType && fileTypes[uploadResult.metadata.contentType]
                  ? fileTypes[uploadResult.metadata.contentType].title
                  : 'INDEFINIDO',
            })
          }
          if (files.matricula && typeof files.matricula != 'string') {
            var imageRef = ref(storage, `${savingRef}/matricula${(Math.random() * 10000).toFixed(0)}`)
            let res = await uploadBytes(imageRef, files.matricula)
            const uploadResult = res as UploadResult
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
            links.push({
              title: 'MATRÍCULA',
              link: url,
              format:
                uploadResult.metadata.contentType && fileTypes[uploadResult.metadata.contentType]
                  ? fileTypes[uploadResult.metadata.contentType].title
                  : 'INDEFINIDO',
            })
          }
        }
        if (files.documentoComFoto && typeof files.documentoComFoto != 'string') {
          var imageRef = ref(storage, `${savingRef}/documentoComFoto${(Math.random() * 10000).toFixed(0)}`)
          let res = await uploadBytes(imageRef, files.documentoComFoto)
          const uploadResult = res as UploadResult
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: 'DOCUMENTO COM FOTO',
            link: url,
            format:
              uploadResult.metadata.contentType && fileTypes[uploadResult.metadata.contentType]
                ? fileTypes[uploadResult.metadata.contentType].title
                : 'INDEFINIDO',
          })
        }

        if (requestInfo.tipoDoTitular == 'PESSOA JURIDICA') {
          if (files.contratoSocial && typeof files.contratoSocial != 'string') {
            var imageRef = ref(storage, `${savingRef}/contratoSocial${(Math.random() * 10000).toFixed(0)}`)
            let res = await uploadBytes(imageRef, files.contratoSocial)
            const uploadResult = res as UploadResult
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
            links.push({
              title: 'CONTRATO SOCIAL',
              link: url,
              format:
                uploadResult.metadata.contentType && fileTypes[uploadResult.metadata.contentType]
                  ? fileTypes[uploadResult.metadata.contentType].title
                  : 'INDEFINIDO',
            })
          }
          if (files.cartaoCnpj && typeof files.cartaoCnpj != 'string') {
            var imageRef = ref(storage, `${savingRef}/cartaoCnpj${(Math.random() * 10000).toFixed(0)}`)
            let res = await uploadBytes(imageRef, files.cartaoCnpj)
            const uploadResult = res as UploadResult
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
            links.push({
              title: 'CARTÃO CNPJ',
              link: url,
              format:
                uploadResult.metadata.contentType && fileTypes[uploadResult.metadata.contentType]
                  ? fileTypes[uploadResult.metadata.contentType].title
                  : 'INDEFINIDO',
            })
          }
          if (files.comprovanteEnderecoRepresentante && typeof files.comprovanteEnderecoRepresentante != 'string') {
            var imageRef = ref(storage, `formSolicitacao/${requestInfo.nomeDoContrato}/comprovanteEnderecoRepresentante${(Math.random() * 10000).toFixed(0)}`)
            let res = await uploadBytes(imageRef, files.comprovanteEnderecoRepresentante)
            const uploadResult = res as UploadResult
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
            links.push({
              title: 'COMPROVANTE DE ENDEREÇO - REPRESENTANTE',
              link: url,
              format:
                uploadResult.metadata.contentType && fileTypes[uploadResult.metadata.contentType]
                  ? fileTypes[uploadResult.metadata.contentType].title
                  : 'INDEFINIDO',
            })
          }
          if (files.documentoComFotoSocios && typeof files.documentoComFotoSocios != 'string') {
            var imageRef = ref(storage, `${savingRef}/documentoComFotoSocios${(Math.random() * 10000).toFixed(0)}`)
            let res = await uploadBytes(imageRef, files.documentoComFotoSocios)
            const uploadResult = res as UploadResult
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
            links.push({
              title: 'DOCUMENTO COM FOTO DOS SÓCIOS',
              link: url,
              format:
                uploadResult.metadata.contentType && fileTypes[uploadResult.metadata.contentType]
                  ? fileTypes[uploadResult.metadata.contentType].title
                  : 'INDEFINIDO',
            })
          }
        }
        if (requestInfo.possuiDistribuicao == 'SIM') {
          for (let i = 0; i < requestInfo.distribuicoes.length; i++) {
            var imageRef = ref(storage, `${savingRef}/recebedora${i + 1}${(Math.random() * 10000).toFixed(0)}`)
            const key: string = `recebedora${i + 1}`
            if (isFile(files[key]) && files[key]) {
              // @ts-ignore
              let res = await uploadBytes(imageRef, files[key])

              const uploadResult = res as UploadResult
              let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
              links.push({
                title: `RECEBEDORA ${i + 1}`,
                link: url,
                format:
                  uploadResult.metadata.contentType && fileTypes[uploadResult.metadata.contentType]
                    ? fileTypes[uploadResult.metadata.contentType].title
                    : 'INDEFINIDO',
              })
            }
          }
        }
      } catch (error) {
        toast.error('Houve um erro no envio das imagens. Por favor, tente novamente.')
      }
      if (holder === undefined) {
        setUploadOK(true)
        links = await getPreviouslyAttachedFiles(links, projectInfo?.anexos, proposalInfo.linkArquivo)
        setRequestInfo((prev) => ({ ...prev, links: links }))
        toast.dismiss(toastID)
        toast.success('Arquivos enviados com sucesso !')
      }
    }
  }
  return (
    <div className="flex w-full grow flex-col bg-[#fff] pb-2">
      <span className="py-2 text-center text-lg font-bold uppercase text-[#15599a]">DOCUMENTAÇÃO</span>
      <div className="flex w-full grow flex-col">
        <div className="mt-2 grid w-full grid-cols-1  gap-2 lg:grid-cols-2">
          <div className="flex w-full flex-col items-center justify-center self-center">
            <div className="flex items-center gap-2">
              <label className="ml-2 text-center text-sm font-bold text-[#15599a]" htmlFor="propostaComercial">
                PROPOSTA COMERCIAL ATUALIZADA
              </label>
              {files.propostaComercial ? <BsCheckCircleFill style={{ color: 'rgb(34,197,94)' }} /> : null}
            </div>
            <div className="relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 bg-gray-100 p-2">
              <div className="absolute">
                {files.propostaComercial ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-center font-normal text-gray-400">
                      {typeof files.propostaComercial != 'string' ? files.propostaComercial.name : formatLongString(files.propostaComercial, 35)}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block font-normal text-gray-400">Adicione o arquivo aqui</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setFiles({
                    ...files,
                    propostaComercial: e.target.files ? e.target.files[0] : null,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center self-center">
            <div className="flex items-center gap-2">
              <label className="ml-2 text-center text-sm font-bold text-[#15599a]" htmlFor="documentoComFoto">
                DOCUMENTO COM FOTO
              </label>
              {files.documentoComFoto ? <BsCheckCircleFill style={{ color: 'rgb(34,197,94)' }} /> : null}
            </div>
            <div className="relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 bg-gray-100 p-2">
              <div className="absolute">
                {files.documentoComFoto ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-center font-normal text-gray-400">
                      {typeof files.documentoComFoto != 'string' ? files.documentoComFoto.name : formatLongString(files.documentoComFoto, 35)}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block font-normal text-gray-400">Adicione o arquivo aqui</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setFiles({
                    ...files,
                    documentoComFoto: e.target.files ? e.target.files[0] : null,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center self-center">
            <div className="flex items-center gap-2">
              <label className="ml-2 text-center text-sm font-bold text-[#15599a]" htmlFor="comprovanteEnderecoCorrespondente">
                COMPROVANTE DE ENDEREÇO (DA CORRESPONDÊNCIA)
              </label>
              {files.comprovanteEnderecoCorrespondente ? <BsCheckCircleFill style={{ color: 'rgb(34,197,94)' }} /> : null}
            </div>
            <div className="relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 bg-gray-100 p-2">
              <div className="absolute">
                {files.comprovanteEnderecoCorrespondente ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-center font-normal text-gray-400">
                      {typeof files.comprovanteEnderecoCorrespondente != 'string'
                        ? files.comprovanteEnderecoCorrespondente.name
                        : formatLongString(files.comprovanteEnderecoCorrespondente, 35)}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block font-normal text-gray-400">Adicione o arquivo aqui</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setFiles({
                    ...files,
                    comprovanteEnderecoCorrespondente: e.target.files ? e.target.files[0] : null,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          {requestInfo.tipoDoTitular == 'PESSOA JURIDICA' && (
            <>
              <div className="flex w-full flex-col items-center justify-center self-center">
                <div className="flex items-center gap-2">
                  <label className="ml-2 text-center text-sm font-bold text-[#15599a]" htmlFor="contratoSocial">
                    CONTRATO SOCIAL
                  </label>
                  {files.contratoSocial ? <BsCheckCircleFill style={{ color: 'rgb(34,197,94)' }} /> : null}
                </div>
                <div className="relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 bg-gray-100 p-2">
                  <div className="absolute">
                    {files.contratoSocial ? (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-center font-normal text-gray-400">
                          {typeof files.contratoSocial != 'string' ? files.contratoSocial.name : formatLongString(files.contratoSocial, 35)}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block font-normal text-gray-400">Adicione o arquivo aqui</span>
                      </div>
                    )}
                  </div>
                  <input
                    onChange={(e) =>
                      setFiles({
                        ...files,
                        contratoSocial: e.target.files ? e.target.files[0] : null,
                      })
                    }
                    className="h-full w-full opacity-0"
                    type="file"
                    accept=".png, .jpeg, .pdf"
                  />
                </div>
              </div>
              <div className="flex w-full flex-col items-center justify-center self-center">
                <div className="flex items-center gap-2">
                  <label className="ml-2 text-center text-sm font-bold text-[#15599a]" htmlFor="cartaoCnpj">
                    CARTÃO CNPJ
                  </label>
                  {files.cartaoCnpj ? <BsCheckCircleFill style={{ color: 'rgb(34,197,94)' }} /> : null}
                </div>
                <div className="relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 bg-gray-100 p-2">
                  <div className="absolute">
                    {files.cartaoCnpj ? (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-center font-normal text-gray-400">
                          {typeof files.cartaoCnpj != 'string' ? files.cartaoCnpj.name : formatLongString(files.cartaoCnpj, 35)}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block font-normal text-gray-400">Adicione o arquivo aqui</span>
                      </div>
                    )}
                  </div>
                  <input
                    onChange={(e) =>
                      setFiles({
                        ...files,
                        cartaoCnpj: e.target.files ? e.target.files[0] : null,
                      })
                    }
                    className="h-full w-full opacity-0"
                    type="file"
                    accept=".png, .jpeg, .pdf"
                  />
                </div>
              </div>
              <div className="flex w-full flex-col items-center justify-center self-center">
                <div className="flex items-center gap-2">
                  <label className="ml-2 text-center text-sm font-bold text-[#15599a]" htmlFor="comprovanteEnderecoRepresentante">
                    COMPROVANTE DE ENDEREÇO (REPRESENTANTE LEGAL)
                  </label>
                  {files.comprovanteEnderecoRepresentante ? <BsCheckCircleFill style={{ color: 'rgb(34,197,94)' }} /> : null}
                </div>
                <div className="relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 bg-gray-100 p-2">
                  <div className="absolute">
                    {files.comprovanteEnderecoRepresentante ? (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-center font-normal text-gray-400">
                          {typeof files.comprovanteEnderecoRepresentante != 'string'
                            ? files.comprovanteEnderecoRepresentante.name
                            : formatLongString(files.comprovanteEnderecoRepresentante, 35)}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block font-normal text-gray-400">Adicione o arquivo aqui</span>
                      </div>
                    )}
                  </div>
                  <input
                    onChange={(e) =>
                      setFiles({
                        ...files,
                        comprovanteEnderecoRepresentante: e.target.files ? e.target.files[0] : null,
                      })
                    }
                    className="h-full w-full opacity-0"
                    type="file"
                    accept=".png, .jpeg, .pdf"
                  />
                </div>
              </div>
              <div className="flex w-full flex-col items-center justify-center self-center">
                <div className="flex items-center gap-2">
                  <label className="ml-2 text-center text-sm font-bold text-[#15599a]" htmlFor="documentoComFotoSocios">
                    DOCUMENTO COM FOTO (DE TODOS OS SÓCIOS)
                  </label>
                  {files.documentoComFotoSocios ? <BsCheckCircleFill style={{ color: 'rgb(34,197,94)' }} /> : null}
                </div>
                <div className="relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 bg-gray-100 p-2">
                  <div className="absolute">
                    {files.documentoComFotoSocios ? (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-center font-normal text-gray-400">
                          {typeof files.documentoComFotoSocios != 'string'
                            ? files.documentoComFotoSocios.name
                            : formatLongString(files.documentoComFotoSocios, 35)}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block font-normal text-gray-400">Adicione o arquivo aqui</span>
                      </div>
                    )}
                  </div>
                  <input
                    onChange={(e) =>
                      setFiles({
                        ...files,
                        documentoComFotoSocios: e.target.files ? e.target.files[0] : null,
                      })
                    }
                    className="h-full w-full opacity-0"
                    type="file"
                    accept=".png, .jpeg, .pdf"
                  />
                </div>
              </div>
            </>
          )}
          {requestInfo.possuiDistribuicao == 'SIM' && (
            <>
              {requestInfo.distribuicoes.map((dist, index) => (
                <div key={index} className="flex w-full flex-col items-center justify-center self-center">
                  <div className="flex items-center gap-2">
                    <label className="ml-2 text-center text-sm font-bold text-[#15599a]" htmlFor={`recebedora${index + 1}`}>
                      RECEBEDORA Nº{index + 1}
                    </label>
                    {files[`recebedora${index + 1}`] ? <BsCheckCircleFill style={{ color: 'rgb(34,197,94)' }} /> : null}
                  </div>
                  <div className="relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 bg-gray-100 p-2">
                    <div className="absolute">
                      {files[`recebedora${index + 1}`] ? (
                        <div className="flex flex-col items-center">
                          <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                          <span className="block text-center font-normal text-gray-400">
                            {typeof files[`recebedora${index + 1}`] != 'string'
                              ? //@ts-ignore
                                files[`recebedora${index + 1}`]?.name
                              : `RECEBEDORA ${index + 1}`}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                          <span className="block font-normal text-gray-400">Adicione o arquivo aqui</span>
                        </div>
                      )}
                    </div>
                    <input
                      onChange={(e) =>
                        setFiles({
                          ...files,
                          [`recebedora${index + 1}`]: e.target.files ? e.target.files[0] : null,
                        })
                      }
                      className="h-full w-full opacity-0"
                      type="file"
                      accept=".png, .jpeg, .pdf"
                    />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <div className="mt-2 flex w-full flex-wrap justify-between  gap-2">
        <button
          onClick={() => {
            goToPreviousStage()
          }}
          className="rounded p-2 font-bold text-gray-500 duration-300 hover:scale-105"
        >
          Voltar
        </button>
        {uploadOK == true ? (
          <button
            onClick={() => {
              goToNextStage()
            }}
            className="rounded p-2 font-bold disabled:bg-gray-300 hover:bg-black hover:text-white"
          >
            Prosseguir
          </button>
        ) : (
          <button
            onClick={() => {
              uploadFiles()
            }}
            disabled={uploadOK == 'loading'}
            className="rounded p-2 font-bold disabled:bg-gray-300 hover:bg-black hover:text-white"
          >
            {uploadOK == 'loading' ? 'Carregando...' : 'Enviar arquivos'}
          </button>
        )}
      </div>
    </div>
  )
}

export default DocumentAttachmentInfo
