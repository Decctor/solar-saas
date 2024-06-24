import { Session } from 'next-auth'
import Image from 'next/image'
import React from 'react'
import GoogleLogo from '@/utils/images/google-logo.svg'
import { useGoogleIntegrationConfig } from '@/utils/queries/integrations'
import LoadingComponent from '../utils/LoadingComponent'
import ErrorComponent from '../utils/ErrorComponent'
import axios from 'axios'
import { BsCalendarCheck } from 'react-icons/bs'
import { formatDateAsLocale } from '@/lib/methods/formatting'
import { useRouter } from 'next/router'
type GoogleIntegrationBlockProps = {
  session: Session
}
function GoogleIntegrationBlock({ session }: GoogleIntegrationBlockProps) {
  const router = useRouter()
  const { data: integration, isLoading, isError, isSuccess } = useGoogleIntegrationConfig()
  const hasConfig = !!integration

  async function handleConfiguration() {
    return router.push('/api/integration/google/auth')
  }
  return (
    <div className="flex w-full flex-col rounded-md border border-gray-200 p-2">
      <div className="flex w-full items-center gap-1">
        <div style={{ width: 35, height: 35 }} className="relative flex items-center justify-center">
          <Image src={GoogleLogo} alt="Logo da Google" fill={true} style={{ borderRadius: '100%' }} />
        </div>
        <p className="font-black leading-none tracking-tight">GOOGLE</p>
      </div>
      {isLoading ? <LoadingComponent /> : null}
      {isError ? <ErrorComponent /> : null}
      {isSuccess ? (
        <div className="flex w-full flex-col">
          {hasConfig ? (
            <>
              <h1 className="mt-1 w-full text-center text-sm font-medium text-gray-500">
                A integração com sua conta <strong className="text-[#4CAF50]">Google</strong> está ativa.
              </h1>
              <h2 className="w-full text-center text-sm font-medium text-gray-500">
                Usufrua da sincronização de suas <strong className="text-[#4285F4]">tarefas</strong> e <strong className="text-[#039BE5]">eventos</strong>,
                envie emails, entre outros.
              </h2>
              <div className="flex w-full items-center justify-end">
                <div className={`flex items-center gap-2`}>
                  <BsCalendarCheck />
                  <p className="text-xs font-medium text-gray-500">Ultima atualização em: {formatDateAsLocale(integration.dataValidacaoToken, true)}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className="mt-1 w-full text-center text-sm font-medium text-gray-500">Tem uma conta Google ? Usufrua da nossa integração.</h1>
              <h2 className="w-full text-center text-xs font-medium text-gray-500">Sincronize suas tarefas, envie emails, entre outros.</h2>
              <div className="mt-2 flex w-full items-center justify-end">
                <button
                  className="rounded bg-black p-1 px-4 text-sm font-medium text-white duration-300 ease-in-out hover:bg-gray-700"
                  onClick={() => handleConfiguration()}
                >
                  REALIZAR CONFIGURAÇÃO
                </button>
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  )
}

export default GoogleIntegrationBlock
