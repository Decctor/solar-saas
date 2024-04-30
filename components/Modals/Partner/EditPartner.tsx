import CheckboxInput from '@/components/Inputs/CheckboxInput'
import DateInput from '@/components/Inputs/DateInput'
import SelectInput from '@/components/Inputs/SelectInput'
import TextInput from '@/components/Inputs/TextInput'
import AddressInformationBlock from '@/components/Partners/AddressInformationBlock'
import ContactInformationBlock from '@/components/Partners/ContactInformationBlock'
import GeneralInformationBlock from '@/components/Partners/GeneralInformationBlock'
import MediaInformationBlock from '@/components/Partners/MediaInformationBlock'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingComponent from '@/components/utils/LoadingComponent'
import LoadingPage from '@/components/utils/LoadingPage'
import { formatDateInputChange } from '@/lib/methods/formatting'
import { stateCities } from '@/utils/estados_cidades'
import { formatDate, formatToCEP, formatToCPForCNPJ, formatToPhone, getCEPInfo } from '@/utils/methods'
import { useMutationWithFeedback } from '@/utils/mutations/general-hook'
import { createPartner, editPartner } from '@/utils/mutations/partners'
import { usePartnerById } from '@/utils/queries/partners'
import { TPartner } from '@/utils/schemas/partner.schema'
import { SignaturePlans } from '@/utils/select-options'
import { useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { BsCheckLg } from 'react-icons/bs'
import { VscChromeClose } from 'react-icons/vsc'
type EditPartnerProps = {
  partnerId: string
  closeModal: () => void
}
function EditPartner({ partnerId, closeModal }: EditPartnerProps) {
  const queryClient = useQueryClient()

  const [image, setImage] = useState<File | null>()
  const [editImage, setEditImage] = useState<boolean>(false)
  const [infoHolder, setInfoHolder] = useState<TPartner>({
    nome: '',
    cpfCnpj: '',
    contatos: {
      telefonePrimario: '',
      telefoneSecundario: null,
      email: '',
    },
    slogan: '',
    midias: {
      instagram: '',
      website: '',
      facebook: '',
    },
    localizacao: {
      cep: null,
      uf: '',
      cidade: '',
      bairro: undefined,
      endereco: undefined,
      numeroOuIdentificador: undefined,
      complemento: undefined,
      // distancia: z.number().optional().nullable(),
    },
    logo_url: null,
    descricao: '',
    ativo: true,
    dataInsercao: new Date().toISOString(),
  })
  const { data: partner, isSuccess, isLoading, isError } = usePartnerById({ id: partnerId })

  const { mutate: handleEditPartner } = useMutationWithFeedback({
    mutationKey: ['edit-partner', partnerId],
    mutationFn: editPartner,
    queryClient: queryClient,
    affectedQueryKey: ['partners'],
    callbackFn: () => closeModal(),
  })
  useEffect(() => {
    if (partner) setInfoHolder(partner)
  }, [partner])

  return (
    <div id="newCost" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <div className="fixed left-[50%] top-[50%] z-[100] h-[90%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:h-[80%] lg:w-[60%]">
        <div className="flex h-full flex-col">
          <div className="flex flex-wrap items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg">
            <h3 className="text-xl font-bold text-[#353432] dark:text-white ">EDITAR PARCEIRO</h3>
            <button
              onClick={() => closeModal()}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
          {isLoading ? <LoadingComponent /> : null}
          {isError ? <ErrorComponent msg="Erro ao buscar informações do parceiro." /> : null}
          {isSuccess && infoHolder && partner ? (
            <>
              <div className="flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                <div className="flex flex-col items-center justify-center">
                  <div className="relative flex h-[200px] w-[200px] flex-col items-center justify-center gap-2 rounded-full ">
                    {partner.logo_url && !editImage ? (
                      <div className="flex h-[150px] w-full flex-col items-center gap-2">
                        <div className="flex h-[120px] w-[120px] items-center justify-center self-center">
                          <Image src={partner.logo_url} width={120} height={120} style={{ borderRadius: '100%' }} alt="Logo do Parceiro" />
                        </div>
                        <button
                          onClick={() => setEditImage(true)}
                          className="w-fit rounded border border-black p-1 font-Raleway text-xs font-medium duration-300 ease-in-out hover:bg-black hover:text-white"
                        >
                          EDITAR IMAGEM
                        </button>
                      </div>
                    ) : (
                      <div className="flex h-[150px] flex-col items-center justify-center">
                        <div className="relative flex h-[120px] w-[120px] items-center justify-center rounded-full border border-gray-300 bg-gray-200">
                          {image ? (
                            <div className="absolute flex items-center justify-center">
                              <BsCheckLg style={{ color: 'green', fontSize: '25px' }} />
                            </div>
                          ) : (
                            <p className="absolute w-full text-center text-xs font-bold text-gray-700">ESCOLHA UMA LOGO</p>
                          )}
                          <input
                            onChange={(e) => {
                              if (e.target.files) setImage(e.target.files[0])
                            }}
                            className="h-full w-full opacity-0"
                            type="file"
                            accept=".png, .jpeg"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <GeneralInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
                <AddressInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
                <ContactInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
                <MediaInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
              </div>
              <div className="mt-2 flex w-full items-center justify-end">
                <button
                  // @ts-ignore
                  onClick={() => handleEditPartner({ id: partnerId, info: infoHolder, logo: image })}
                  className="h-9 whitespace-nowrap rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-gray-800 enabled:hover:text-white"
                >
                  EDITAR
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default EditPartner
