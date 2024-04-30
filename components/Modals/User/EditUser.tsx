import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

import { VscChromeClose } from 'react-icons/vsc'
import { BsCheckLg } from 'react-icons/bs'

import TextInput from '../../Inputs/TextInput'
import DropdownSelect from '../../Inputs/DropdownSelect'
import CheckboxInput from '../../Inputs/CheckboxInput'
import NumberInput from '../../Inputs/NumberInput'
import ScopeSelection from '../../Users/ScopeSelection'

import { TUser, TUserDTO, TUserEntity } from '@/utils/schemas/user.schema'
import { UserGroups } from '@/utils/select-options'

import { storage } from '@/services/firebase/storage-config'
import { createUser, editUser } from '@/utils/mutations/users'
import { formatToPhone } from '@/utils/methods'
import { useMutationWithFeedback } from '@/utils/mutations/general-hook'
import { useUserById } from '@/utils/queries/users'
import LoadingComponent from '../../utils/LoadingComponent'
import ErrorComponent from '../../utils/ErrorComponent'
import PermissionsPannel from '../../Users/PermissionsPannel'
import { Session } from 'next-auth'
import { usePartnersSimplified } from '@/utils/queries/partners'
import SelectWithImages from '@/components/Inputs/SelectWithImages'
type EditUserProps = {
  users?: TUserDTO[]
  closeModal: () => void
  userId: string
  partnerId: string
  session: Session
}

function EditUser({ closeModal, users, userId, partnerId, session }: EditUserProps) {
  const queryClient = useQueryClient()
  const { data: user, isLoading, isError, isSuccess } = useUserById({ id: userId })
  const { data: partners } = usePartnersSimplified()
  const [image, setImage] = useState<File | null>()
  const [userInfo, setUserInfo] = useState<TUserDTO>({
    _id: 'id-holder',
    nome: '',
    administrador: false,
    telefone: '',
    email: '',
    senha: '',
    avatar_url: null,
    idParceiro: partnerId,
    idGrupo: '',
    permissoes: UserGroups[0].permissoes,
    comissoes: {
      comSDR: null,
      semSDR: null,
    },
    ativo: true,
    dataInsercao: new Date().toISOString(),
  })

  async function handleUserUpdate() {
    try {
      var avatar_url = userInfo.avatar_url
      if (userInfo.nome.trim().length < 3) return toast.error('Preencha um nome de ao menos 3 caracteres.')
      if (!!image) {
        let storageName = `saas-crm/usuarios/${userInfo.nome}`
        const fileRef = ref(storage, storageName)
        const firebaseResponse = await uploadBytes(fileRef, image)
        const fileUrl = await getDownloadURL(ref(storage, firebaseResponse.metadata.fullPath))
        avatar_url = fileUrl
      }
      const response = await editUser({ userId: userId, changes: { ...userInfo, avatar_url: avatar_url } })
      return response
    } catch (error) {
      throw error
    }
  }
  const { mutate, isPending } = useMutationWithFeedback({
    mutationKey: ['edit-user', userId],
    mutationFn: handleUserUpdate,
    affectedQueryKey: ['user-by-id', userId],
    queryClient: queryClient,
    callbackFn: async () => await queryClient.invalidateQueries({ queryKey: ['users'] }),
  })
  useEffect(() => {
    if (user) setUserInfo(user)
  }, [user])
  return (
    <div id="defaultModal" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <div className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:w-[50%]">
        <div className="flex h-full flex-col">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <h3 className="text-xl font-bold text-[#353432] dark:text-white ">EDITAR USUÁRIO</h3>
            <button
              onClick={closeModal}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
          {isLoading ? <LoadingComponent /> : null}
          {isError ? <ErrorComponent msg="Erro ao buscar informações do usuário." /> : null}
          {isSuccess ? (
            <>
              <div className="flex h-full grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto p-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                <div className="flex h-[200px]  flex-col items-center justify-center">
                  {!image && userInfo.avatar_url ? (
                    <div className="relative mb-3 h-[120px] w-[120px] cursor-pointer rounded-full">
                      <Image
                        src={userInfo.avatar_url}
                        // width={96}
                        // height={96}
                        fill={true}
                        alt="AVATAR"
                        style={{
                          borderRadius: '100%',
                          objectFit: 'cover',
                          position: 'absolute',
                        }}
                      />
                      <input
                        onChange={(e) => {
                          if (e.target.files) setImage(e.target.files[0])
                        }}
                        className="h-full w-full opacity-0"
                        type="file"
                        accept="image/png, image/jpeg"
                      />
                    </div>
                  ) : image ? (
                    <div className="relative mb-3 flex h-[120px] w-[120px] cursor-pointer items-center justify-center rounded-full bg-gray-200">
                      <div className="absolute flex items-center justify-center">
                        <BsCheckLg style={{ color: 'green', fontSize: '25px' }} />
                      </div>
                      <input
                        onChange={(e) => {
                          if (e.target.files) setImage(e.target.files[0])
                        }}
                        className="h-full w-full opacity-0"
                        type="file"
                        accept="image/png, image/jpeg"
                      />
                    </div>
                  ) : (
                    <div className="relative flex h-[120px] w-[120px] items-center justify-center rounded-full border border-gray-300 bg-gray-200">
                      {image ? (
                        <div className="absolute flex items-center justify-center">
                          <BsCheckLg style={{ color: 'green', fontSize: '25px' }} />
                        </div>
                      ) : (
                        <p className="absolute w-full text-center text-xs font-bold text-gray-700">ESCOLHA UMA IMAGEM</p>
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
                  )}
                </div>
                <div className="grid w-full grid-cols-1 grid-rows-2 items-center gap-2 lg:grid-cols-2 lg:grid-rows-1">
                  <TextInput
                    label="NOME E SOBRENOME"
                    value={userInfo.nome}
                    placeholder="Preencha aqui o nome do usuário."
                    handleChange={(value) =>
                      setUserInfo((prev) => ({
                        ...prev,
                        nome: value,
                      }))
                    }
                    width="100%"
                  />
                  <TextInput
                    label="EMAIL"
                    value={userInfo.email}
                    placeholder="Preencha aqui o email do usuário."
                    handleChange={(value) =>
                      setUserInfo((prev) => ({
                        ...prev,
                        email: value,
                      }))
                    }
                    width="100%"
                  />
                </div>
                <div className="grid w-full grid-cols-1 grid-rows-2 items-center gap-2 lg:grid-cols-2 lg:grid-rows-1">
                  <TextInput
                    label="TELEFONE"
                    value={userInfo.telefone || ''}
                    placeholder="Preencha aqui o telefone do usuário."
                    handleChange={(value) =>
                      setUserInfo((prev) => ({
                        ...prev,
                        telefone: formatToPhone(value),
                      }))
                    }
                    width="100%"
                  />
                  <TextInput
                    label="SENHA"
                    value={userInfo.senha}
                    placeholder="Preencha aqui o senha do usuário."
                    handleChange={(value) =>
                      setUserInfo((prev) => ({
                        ...prev,
                        senha: value,
                      }))
                    }
                    width="100%"
                  />
                </div>
                <div className="flex w-full flex-col gap-1">
                  <div className="flex w-full items-center gap-2">
                    <div className="w-[50%]">
                      <NumberInput
                        label="COMISSÃO SEM SDR"
                        placeholder="% SEM SDR"
                        value={userInfo.comissoes?.semSDR || null}
                        handleChange={(value) =>
                          setUserInfo((prev) => ({
                            ...prev,
                            comissoes: {
                              ...prev.comissoes,
                              semSDR: value,
                            },
                          }))
                        }
                        width="100%"
                      />
                    </div>
                    <div className="w-[50%]">
                      <NumberInput
                        label="COMISSÃO COM SDR"
                        placeholder="% COM SDR"
                        value={userInfo.comissoes?.comSDR || null}
                        handleChange={(value) =>
                          setUserInfo((prev) => ({
                            ...prev,
                            comissoes: {
                              ...prev.comissoes,
                              comSDR: value,
                            },
                          }))
                        }
                        width="100%"
                      />
                    </div>
                  </div>
                  <div className="flex w-full items-center">
                    <SelectWithImages
                      label="PARCEIRO"
                      value={userInfo.idParceiro}
                      handleChange={(value) => setUserInfo((prev) => ({ ...prev, idParceiro: value }))}
                      options={partners?.map((p) => ({ id: p._id, label: p.nome, value: p._id, url: p.logo_url || undefined })) || []}
                      selectedItemLabel="NÃO DEFINIDO"
                      onReset={() => setUserInfo((prev) => ({ ...prev, idParceiro: partners ? partners[0]._id : '' }))}
                      width="100%"
                    />
                  </div>
                  <div className="flex w-full flex-col gap-1">
                    <label className="font-sans font-bold  text-[#353432]">GRUPO DE PERMISSÃO</label>
                    <DropdownSelect
                      selectedItemLabel="A SELECIONAR"
                      categoryName="GRUPO DE PERMISSÃO"
                      value={userInfo.idGrupo || null}
                      options={UserGroups.map((role) => {
                        return {
                          id: role.id,
                          label: role.grupo,
                          value: role.permissoes,
                        }
                      })}
                      width="100%"
                      onChange={(value) => {
                        const permissions: TUser['permissoes'] = {
                          usuarios: {
                            visualizar: value.value.usuarios.visualizar,
                            criar: value.value.usuarios.criar,
                            editar: value.value.usuarios.editar,
                          },
                          comissoes: {
                            visualizar: value.value.comissoes.visualizar,
                            editar: value.value.comissoes.editar,
                          },
                          kits: {
                            visualizar: value.value.kits.visualizar,
                            editar: value.value.kits.editar,
                            criar: value.value.kits.criar,
                          },
                          produtos: {
                            visualizar: value.value.produtos.visualizar,
                            editar: value.value.produtos.editar,
                            criar: value.value.produtos.criar,
                          },
                          servicos: {
                            visualizar: value.value.servicos.visualizar,
                            editar: value.value.servicos.editar,
                            criar: value.value.servicos.criar,
                          },
                          planos: {
                            visualizar: value.value.planos.visualizar,
                            editar: value.value.planos.editar,
                            criar: value.value.planos.criar,
                          },
                          propostas: {
                            escopo: [userId],
                            visualizar: value.value.propostas.visualizar,
                            editar: value.value.propostas.editar,
                            criar: value.value.propostas.criar,
                          },
                          oportunidades: {
                            escopo: [userId], // refere-se ao escopo de atuação
                            visualizar: value.value.oportunidades.visualizar,
                            editar: value.value.oportunidades.editar,
                            criar: value.value.oportunidades.criar,
                          },
                          analisesTecnicas: {
                            escopo: [userId], // refere-se ao escopo de atuação
                            visualizar: value.value.analisesTecnicas.visualizar,
                            editar: value.value.analisesTecnicas.editar,
                            criar: value.value.analisesTecnicas.criar,
                          },
                          clientes: {
                            escopo: [userId],
                            visualizar: value.value.clientes.visualizar,
                            editar: value.value.clientes.editar,
                            criar: value.value.clientes.criar,
                          },
                          parceiros: {
                            escopo: session.user.idParceiro ? [session.user.idParceiro] : null,
                            visualizar: value.value.clientes.visualizar,
                            editar: value.value.clientes.editar,
                            criar: value.value.clientes.criar,
                          },
                          precos: {
                            visualizar: value.value.precos.visualizar,
                            editar: value.value.precos.editar,
                          },
                          resultados: {
                            escopo: [userId], // refere-se ao escopo de atuação
                            visualizarComercial: false,
                            visualizarOperacional: false,
                          },
                          configuracoes: {
                            funis: false,
                            parceiro: false,
                            precificacao: false,
                            metodosPagamento: false,
                            tiposProjeto: false,
                          },
                        }
                        setUserInfo((prev) => ({
                          ...prev,
                          idGrupo: value.id.toString(),
                          permissoes: permissions,
                        }))
                      }}
                      onReset={() =>
                        setUserInfo((prev) => ({
                          ...prev,
                          idGrupo: '',
                        }))
                      }
                    />
                  </div>
                </div>

                <PermissionsPannel
                  referenceId={userId}
                  userInfo={userInfo as TUser}
                  setUserInfo={setUserInfo as React.Dispatch<React.SetStateAction<TUser>>}
                  users={users}
                  session={session}
                />
              </div>
              <div className="mt-1 flex w-full items-end justify-end">
                <button
                  disabled={isPending}
                  //@ts-ignore
                  onClick={() => mutate()}
                  className="h-9 whitespace-nowrap rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-gray-800 enabled:hover:text-white"
                >
                  SALVAR ALTERAÇÕES
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default EditUser
