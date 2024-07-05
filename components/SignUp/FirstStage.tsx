import React, { useState } from 'react'
import Logo from '@/utils/images/logo.png'
import Image from 'next/image'
import TextInput from '../Inputs/TextInput'
import GoogleLogo from '@/utils/images/google-logo.svg'
import { signIn } from 'next-auth/react'
import toast from 'react-hot-toast'
import { formatToPhone } from '@/utils/methods'
import { TSignUpSetup, TSignUpSetupWithHolder } from '@/utils/schemas/sign-up-setup.schema'
import { createSignUpSetup } from '@/utils/mutations/sign-up-setup'
type FirstStageProps = {
  signUpHolder: TSignUpSetupWithHolder
  setSignUpHolder: React.Dispatch<React.SetStateAction<TSignUpSetupWithHolder>>
  goToNextStage: () => void
}
function FirstStage({ signUpHolder, setSignUpHolder, goToNextStage }: FirstStageProps) {
  const [signUpSetupCreationStatus, setSignUpSetupCreationStatus] = useState<'loading' | 'success' | 'error' | null>(null)
  async function handleGoToNextStage() {
    setSignUpSetupCreationStatus(null)
    try {
      setSignUpSetupCreationStatus('loading')
      if (signUpHolder.usuario.nome.trim().length < 2) {
        setSignUpSetupCreationStatus('error')
        return toast.error('Oops, preencha um nome da ao menos 2 caractéres para prosseguir.')
      }
      if (signUpHolder.usuario.email.trim().length < 10) {
        setSignUpSetupCreationStatus('error')
        return toast.error('Oops, preencha um email válido para prosseguir.')
      }
      const setupId = await createSignUpSetup({ info: signUpHolder })
      setSignUpHolder((prev) => ({ ...prev, setupId, estagiosCadastro: { ...prev.estagiosCadastro, inicio: new Date().toISOString() } }))
      setSignUpSetupCreationStatus('success')
      goToNextStage()
    } catch (error) {}
  }

  const isLoading = signUpSetupCreationStatus == 'loading'
  const isError = signUpSetupCreationStatus == 'error'
  const isSuccess = signUpSetupCreationStatus == 'success'
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#091c2e] p-3 lg:flex-row">
      <div className="flex h-fit w-full flex-col items-center justify-center px-2 py-4 lg:h-full lg:w-[60%] lg:px-4 lg:py-6">
        <Image src={Logo} height={250} width={250} alt="Logo CRM" />
        <h1 className="w-full text-center text-2xl font-black text-white lg:text-4xl">Começe agora sua jornada conosco.</h1>
        <h1 className="w-full text-center font-medium text-white">Conheça a plataforma de experiência completa em energia solar.</h1>
      </div>
      <div className="flex h-full w-full flex-col items-center rounded-md bg-[#fff] p-6 py-36 lg:w-[40%]">
        <h1 className="text-3xl font-black text-cyan-500">VAMOS COMEÇAR !</h1>
        <div className="flex w-[90%] grow flex-col items-center justify-center gap-6 self-center lg:w-[70%]">
          <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col">
              <h1 className="mt-4 text-xl font-black">Crie já a sua conta Solar Sales.</h1>
              <p className="mt-2 text-sm leading-none tracking-tight">Nos conte um pouco sobre você.</p>
            </div>
            <TextInput
              label="Seu nome"
              placeholder="Preencha aqui o seu nome..."
              value={signUpHolder.usuario.nome}
              handleChange={(value) => setSignUpHolder((prev) => ({ ...prev, usuario: { ...prev.usuario, nome: value } }))}
              width="100%"
            />
            <TextInput
              label="Seu email"
              placeholder="Preencha aqui o seu email..."
              value={signUpHolder.usuario.email}
              handleChange={(value) => setSignUpHolder((prev) => ({ ...prev, usuario: { ...prev.usuario, email: value } }))}
              width="100%"
            />
            <TextInput
              label="Seu telefone"
              placeholder="Preencha aqui o seu telefone..."
              value={signUpHolder.usuario.telefone}
              handleChange={(value) => setSignUpHolder((prev) => ({ ...prev, usuario: { ...prev.usuario, telefone: formatToPhone(value) } }))}
              width="100%"
            />
          </div>
          <div className="flex w-full flex-col gap-2">
            <button
              disabled={isLoading}
              onClick={() => handleGoToNextStage()}
              className="h-12 w-full self-center rounded bg-black px-2 py-3 text-center text-xs font-bold text-white duration-500 ease-in-out hover:bg-gray-800"
            >
              COMEÇAR
            </button>
            {/* <div className="flex w-full items-center gap-2">
              <div className="h-[1px] grow bg-gray-700"></div>
              <p className="text-sm font-medium tracking-tight text-gray-700">OU</p>
              <div className="h-[1px] grow bg-gray-700"></div>
            </div>
            <button
              onClick={() => signIn('google', { redirect: true, callbackUrl: '/configuracoes' })}
              className="flex h-12 w-full items-center gap-2 rounded border border-gray-400 px-2 py-3 duration-500 ease-in-out hover:border-gray-600 hover:bg-gray-50"
            >
              <div style={{ width: 20, height: 20 }} className="relative flex items-center justify-center">
                <Image src={GoogleLogo} alt="Logo da Google" fill={true} style={{ borderRadius: '100%' }} />
              </div>
              <p className="grow text-center text-xs font-bold text-gray-700">CONTINUAR COM SUA CONTA CONTA GOOGLE</p>
            </button> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FirstStage
