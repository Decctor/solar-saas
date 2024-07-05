import Image from 'next/image'
import React, { useEffect } from 'react'
import Logo from '@/utils/images/logo.png'
import TextInput from '../Inputs/TextInput'
import { FaMinus, FaPlus, FaStar } from 'react-icons/fa'
import { formatToMoney } from '@/lib/methods/formatting'
import { PRICE_BY_USER_QTY, SASS_SIGN_UP_MAIN_FEATURES } from '@/utils/sass-pricing'
import { TSignUpSetup, TSignUpSetupWithHolder } from '@/utils/schemas/sign-up-setup.schema'
import { editSignUpSetup } from '@/utils/mutations/sign-up-setup'

type ThirdStageProps = {
  signUpHolder: TSignUpSetupWithHolder
  setSignUpHolder: React.Dispatch<React.SetStateAction<TSignUpSetupWithHolder>>
  goToNextStage: () => void
}
function ThirdStage({ signUpHolder, setSignUpHolder, goToNextStage }: ThirdStageProps) {
  async function handleGoToNextStage() {
    if (!!signUpHolder.setupId) await editSignUpSetup({ id: signUpHolder.setupId, changes: signUpHolder })
    goToNextStage()
  }
  useEffect(() => {
    setSignUpHolder((prev) => ({ ...prev, quantidadeUsuarios: 10 }))
  }, [])
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#091c2e] p-3 lg:flex-row">
      <div className="flex h-fit w-full flex-col items-center justify-center px-2 py-4 lg:h-full lg:w-[60%] lg:px-4 lg:py-6">
        <Image src={Logo} height={250} width={250} alt="Logo CRM" />
        <h1 className="w-full text-center text-2xl font-black text-white lg:text-4xl">Começe agora sua jornada conosco.</h1>
        <h1 className="w-full text-center font-medium text-white">Conheça a plataforma de experiência completa em energia solar.</h1>
      </div>
      <div className="flex h-full w-full flex-col items-center rounded-md bg-[#fff] p-6 py-32 lg:w-[40%]">
        <h1 className="text-3xl font-black text-cyan-500">UM PLANO IDEAL PRA VOCÊ</h1>
        <div className="flex w-[90%] grow flex-col items-center justify-center gap-6 self-center lg:w-[70%]">
          <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col">
              <h1 className="mt-4 text-xl font-black">Qual o tamanho do seu time ?</h1>
              <p className="mt-2 text-sm leading-none tracking-tight">Nos conte sobre a quantidade de colaboradores que farão uso da Solar Sales.</p>
              <p className="mt-2 text-sm leading-none tracking-tight">Isso nos ajuda a definir uma solução sob medida pra você.</p>
            </div>
            <div className="flex w-full items-center justify-between gap-4 self-center">
              <button
                onClick={() =>
                  setSignUpHolder((prev) => ({
                    ...prev,
                    quantidadeUsuarios: (prev.quantidadeUsuarios || 0) - 1 < 0 ? 0 : (prev.quantidadeUsuarios || 0) - 1,
                  }))
                }
                className="flex items-center justify-center rounded-full border border-gray-500 bg-[#fff] p-3 text-xs duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:text-lg"
              >
                <FaMinus />
              </button>
              <h1 className="text-3xl font-black lg:text-4xl ">{signUpHolder.quantidadeUsuarios}</h1>
              <button
                onClick={() => setSignUpHolder((prev) => ({ ...prev, quantidadeUsuarios: (prev.quantidadeUsuarios || 0) + 1 }))}
                className="flex items-center justify-center rounded-full border border-gray-500 bg-[#fff] p-3 text-xs duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:text-lg"
              >
                <FaPlus />
              </button>
            </div>
            <div className="flex w-full items-center justify-between gap-3">
              <button
                onClick={() => setSignUpHolder((prev) => ({ ...prev, quantidadeUsuarios: 10 }))}
                className="min-w-1/5 flex w-[40%] items-center justify-center rounded-md border border-gray-500 bg-white p-2 py-4 text-xs font-bold duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:w-1/4 lg:p-3 lg:py-6 lg:text-base"
              >
                10 USUÁRIOS
              </button>
              <button
                onClick={() => setSignUpHolder((prev) => ({ ...prev, quantidadeUsuarios: 25 }))}
                className="min-w-1/5 flex w-[40%] items-center justify-center rounded-md border border-gray-500 bg-white p-2 py-4 text-xs font-bold duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:w-1/4 lg:p-3 lg:py-6 lg:text-base"
              >
                25 USUÁRIOS
              </button>
              <button
                onClick={() => setSignUpHolder((prev) => ({ ...prev, quantidadeUsuarios: 50 }))}
                className="min-w-1/5 flex w-[40%] items-center justify-center rounded-md border border-gray-500 bg-white p-2 py-4 text-xs font-bold duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:w-1/4 lg:p-3 lg:py-6 lg:text-base"
              >
                50 USUÁRIOS
              </button>
              <button
                onClick={() => setSignUpHolder((prev) => ({ ...prev, quantidadeUsuarios: 100 }))}
                className="min-w-1/5 flex w-[40%] items-center justify-center rounded-md border border-gray-500 bg-white p-2 py-4 text-xs font-bold duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:w-1/4 lg:p-3 lg:py-6 lg:text-base"
              >
                100 USUÁRIOS
              </button>
            </div>
            <div className="mt-2 flex min-h-[80px] flex-col justify-center gap-2">
              <p className="text-sm leading-none tracking-tight">Obtenha já:</p>
              <div className="flex w-full flex-wrap items-center justify-start gap-2">
                {SASS_SIGN_UP_MAIN_FEATURES.map((p, index) => (
                  <div key={index} className="flex items-center gap-1 rounded-lg border border-cyan-500 px-1 py-2 font-bold text-cyan-500">
                    <FaStar size={10} />
                    <p className="text-[0.6rem] leading-none tracking-tight">{p}</p>
                  </div>
                ))}
                <p className="text-sm leading-none tracking-tight">e muito mais, por apenas:</p>
              </div>
              <div className="my-2 flex w-full items-end justify-center gap-1">
                <h1 className="text-center text-4xl font-black leading-none text-green-600">
                  {formatToMoney(signUpHolder.quantidadeUsuarios * PRICE_BY_USER_QTY)}
                </h1>
                <p className="text-sm leading-none tracking-tight">mensais</p>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2">
            <button
              onClick={() => handleGoToNextStage()}
              className="h-12 w-full self-center rounded bg-black px-2 py-3 text-center text-xs font-bold text-white duration-500 ease-in-out hover:bg-gray-800"
            >
              ADQUIRIR A SOLAR SALES
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThirdStage
