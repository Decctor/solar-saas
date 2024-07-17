import Image from 'next/image'
import React from 'react'
import WelcomeSVG from '@/utils/svgs/welcome.svg'
import Link from 'next/link'
function ThankYouPage() {
  return (
    <div className="flex h-full w-full grow flex-col items-center justify-center gap-2 p-6">
      <div className="relative h-[225px] w-[300px] lg:h-[450px] lg:w-[600px]">
        <Image src={WelcomeSVG} fill={true} alt="Seja bem vindo !" />
      </div>
      <h1 className="w-full text-center text-4xl font-black tracking-tight">Seja bem vindo à Solar SAAS !</h1>
      <div className="mt-4 flex flex-col gap-2">
        <p className="w-full self-center text-center text-sm text-gray-600 lg:w-[600px]">
          Obrigado por escolher a nossa plataforma. Estamos muito felizes em tê-lo como parte da nossa comunidade e agradecemos pela sua confiança em nosso
          serviço.
        </p>
        <p className="w-full text-center text-sm text-gray-600">Estamos animados para que você explore todas as funcionalidades que oferecemos.</p>
        <p className="w-full text-center text-sm text-gray-600">Clique abaixo e começe já:</p>
      </div>
      <div className="flex w-full items-center justify-center">
        <Link href={'/'}>
          <h1 className="rounded-lg bg-black px-6 py-2 font-bold text-white">VAMOS LÁ !</h1>
        </Link>
      </div>
    </div>
  )
}

export default ThankYouPage
