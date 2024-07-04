import { TSignUpHolder } from '@/pages/auth/signup'
import React from 'react'
import Logo from '@/utils/images/logo.png'
import Image from 'next/image'
import TextInput from '../Inputs/TextInput'
type SecondStageProps = {
  signUpHolder: TSignUpHolder
  setSignUpHolder: React.Dispatch<React.SetStateAction<TSignUpHolder>>
  goToNextStage: () => void
}
function SecondStage({ signUpHolder, setSignUpHolder, goToNextStage }: SecondStageProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#091c2e] p-3 lg:flex-row">
      <div className="flex h-fit w-full flex-col items-center justify-center px-2 py-4 lg:h-full lg:w-2/3 lg:px-4 lg:py-6">
        <Image src={Logo} height={250} width={250} alt="Logo CRM" />
        <h1 className="w-full text-center text-2xl font-black text-white lg:text-4xl">Começe agora sua jornada conosco.</h1>
        <h1 className="w-full text-center font-medium text-white">Conheça a plataforma de experiência completa em energia solar.</h1>
      </div>
      <div className="flex h-full w-full flex-col items-center rounded-md bg-[#fff] p-6 py-36 lg:w-1/3">
        <h1 className="text-3xl font-black text-cyan-500">SOBRE A SUA EMPRESA</h1>
        <div className="flex w-[90%] grow flex-col items-center justify-center gap-6 self-center lg:w-[70%]">
          <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col">
              <h1 className="mt-4 text-xl font-black">Preencha as informações abaixo</h1>
              <p className="mt-2 text-sm leading-none tracking-tight">Nos conte um pouco sobre a sua empresa.</p>
            </div>

            <TextInput
              label="Nome da empresa"
              placeholder="Preencha aqui o nome da empresa para qual você trabalha..."
              value={signUpHolder.nomeParceiro}
              handleChange={(value) => setSignUpHolder((prev) => ({ ...prev, nomeParceiro: value }))}
              width="100%"
            />
            <TextInput
              label="Cnpj da empresa"
              placeholder="Preencha aqui o CNPJ da empresa..."
              value={signUpHolder.emailUsuario}
              handleChange={(value) => setSignUpHolder((prev) => ({ ...prev, emailUsuario: value }))}
              width="100%"
            />
          </div>
          <div className="flex w-full flex-col gap-2">
            <button
              onClick={() => handleGoToNextStage()}
              className="h-12 w-full self-center rounded bg-black px-2 py-3 text-center text-xs font-bold text-white duration-500 ease-in-out hover:bg-gray-800"
            >
              EXPLORAR A SOLAR SALES
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

export default SecondStage
