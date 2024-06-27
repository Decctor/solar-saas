import FirstStage from '@/components/PublicSimulations/SolarCalculator/FirstStage'
import SecondStage from '@/components/PublicSimulations/SolarCalculator/SecondStage'
import ThirdStage from '@/components/PublicSimulations/SolarCalculator/ThirdStage'
import ErrorComponent from '@/components/utils/ErrorComponent'
import { formatLocation } from '@/lib/methods/formatting'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import connectToDatabase from '@/services/mongodb/crm-db-connection'
import { TIntegrationRDStation } from '@/utils/schemas/integration.schema'
import { TPartner, TPartnerDTO } from '@/utils/schemas/partner.schema'
import { Collection, ObjectId } from 'mongodb'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import React, { useState } from 'react'
import { BsCheck } from 'react-icons/bs'
import { FaInstagram, FaPhone } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import { MdEmail } from 'react-icons/md'
import { TbWorld } from 'react-icons/tb'

type SolarCalculatorPageProps = {
  partnerJSON: string
  error: string | null | undefined
}

export type TSolarCalculatorSimulation = {
  nome: string
  telefone: string
  email: string
  estado: string
  cidade: string
  valorFaturaEnergia: number | null
}
function SolarCalculatorPage({ partnerJSON, error }: SolarCalculatorPageProps) {
  if (!!error) return <ErrorComponent msg={error} />
  const partner: TPartnerDTO = JSON.parse(partnerJSON)
  const [stage, setStage] = useState<number>(1)
  const [simulation, setSimulation] = useState<TSolarCalculatorSimulation>({
    nome: '',
    telefone: '',
    email: '',
    estado: '',
    cidade: '',
    valorFaturaEnergia: null,
  })
  return (
    <div className="flex h-full grow flex-col">
      <div className="flex min-h-[100px] w-full items-center justify-center bg-black p-4">
        {partner.logo_url ? (
          <div className="relative h-[100px] w-[100px]">
            <Image src={partner.logo_url} fill={true} alt={`Logo de ${partner.nome}`} style={{ borderRadius: '100%' }} />
          </div>
        ) : null}
      </div>
      <div className="flex w-full grow items-center justify-center bg-gray-200 p-4">
        <div className="flex h-full w-full grow flex-col rounded-lg bg-[#fff] p-6">
          <div className="flex w-full flex-col items-center justify-center gap-1 lg:flex-row">
            <h1 className="text-center text-xl font-black lg:text-2xl">CALCULADORA DE ENERGIA SOLAR</h1>
            <h1 className="text-center text-xl font-black lg:text-2xl">{partner.nome.toUpperCase()}</h1>
          </div>
          <h3 className="w-full text-center text-sm tracking-tight text-gray-500 lg:text-base">
            Simule aqui a economia que você terá com um sistema solar e o investimento necessário.
          </h3>
          <div className="mt-4 flex w-full flex-col self-center lg:w-[40%]">
            <div className="flex w-full items-center justify-between gap-1">
              <div
                data-stage-active-or-completed={stage >= 1 ? 'true' : 'false'}
                className="flex h-[35px] min-h-[35px] w-[35px] min-w-[35px] items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-600 data-[stage-active-or-completed=true]:bg-blue-600 data-[stage-active-or-completed=true]:text-white"
              >
                {stage > 1 ? <BsCheck size={25} /> : <p> 1</p>}
              </div>
              <hr
                data-bar-active={stage > 1 ? 'true' : 'false'}
                className="h-[2px] grow bg-gray-600 duration-1000 ease-in-out data-[bar-active=true]:h-[2.5px] data-[bar-active=true]:bg-blue-600"
              />
              <div
                data-stage-active-or-completed={stage >= 2 ? 'true' : 'false'}
                className="flex h-[35px] min-h-[35px] w-[35px] min-w-[35px] items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-600 data-[stage-active-or-completed=true]:bg-blue-600 data-[stage-active-or-completed=true]:text-white"
              >
                {stage > 2 ? <BsCheck size={25} /> : <p> 2</p>}
              </div>
              <hr
                data-bar-active={stage > 2 ? 'true' : 'false'}
                className="h-[2px] grow bg-gray-600 duration-1000 ease-in-out data-[bar-active=true]:h-[2.5px] data-[bar-active=true]:bg-blue-600"
              />
              <div
                data-stage-active-or-completed={stage >= 3 ? 'true' : 'false'}
                className="flex h-[35px] min-h-[35px] w-[35px] min-w-[35px] items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-600 data-[stage-active-or-completed=true]:bg-blue-600 data-[stage-active-or-completed=true]:text-white"
              >
                {stage > 3 ? <BsCheck size={25} /> : <p> 3</p>}
              </div>
            </div>
            {stage == 1 ? <FirstStage simulation={simulation} setSimulation={setSimulation} goToNextStage={() => setStage(2)} /> : null}
            {stage == 2 ? <SecondStage simulation={simulation} setSimulation={setSimulation} goToNextStage={() => setStage(3)} /> : null}
            {stage == 3 ? <ThirdStage simulation={simulation} setSimulation={setSimulation} goToNextStage={() => setStage(4)} /> : null}
          </div>
          {/* <div>
            <ul className="relative flex flex-row gap-x-2">
              <li
                className="active group flex flex-1 shrink basis-0 items-center gap-x-2"
                data-hs-stepper-nav-item='{
      "index": 1
    }'
              >
                <span className="min-w-7 min-h-7 group inline-flex items-center align-middle text-xs focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                  <span className="size-7 hs-stepper-active:bg-blue-600 hs-stepper-active:text-white hs-stepper-success:bg-blue-600 hs-stepper-success:text-white hs-stepper-completed:bg-teal-500 hs-stepper-completed:group-focus:bg-teal-600 dark:hs-stepper-active:bg-blue-500 dark:hs-stepper-success:bg-blue-500 dark:hs-stepper-completed:bg-teal-500 dark:hs-stepper-completed:group-focus:bg-teal-600 flex flex-shrink-0 items-center justify-center rounded-full bg-gray-100 font-medium text-gray-800 group-focus:bg-gray-200 dark:bg-neutral-700 dark:text-white dark:group-focus:bg-gray-600">
                    <span className="hs-stepper-success:hidden hs-stepper-completed:hidden">1</span>
                    <svg
                      className="size-3 hs-stepper-success:block hidden flex-shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span className="ms-2 text-sm font-medium text-gray-800 group-focus:text-gray-500 dark:text-white dark:group-focus:text-gray-400">Step</span>
                </span>
                <div className="hs-stepper-success:bg-blue-600 hs-stepper-completed:bg-teal-600 dark:hs-stepper-success:bg-blue-500 dark:hs-stepper-completed:bg-teal-500 h-px w-full flex-1 bg-gray-200 group-last:hidden dark:bg-neutral-700"></div>
              </li>

              <li
                className="group flex flex-1 shrink basis-0 items-center gap-x-2"
                data-hs-stepper-nav-item='{
      "index": 2
    }'
              >
                <span className="min-w-7 min-h-7 group inline-flex items-center align-middle text-xs focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                  <span className="size-7 hs-stepper-active:bg-blue-600 hs-stepper-active:text-white hs-stepper-success:bg-blue-600 hs-stepper-success:text-white hs-stepper-completed:bg-teal-500 hs-stepper-completed:group-focus:bg-teal-600 dark:hs-stepper-active:bg-blue-500 dark:hs-stepper-success:bg-blue-500 dark:hs-stepper-completed:bg-teal-500 dark:hs-stepper-completed:group-focus:bg-teal-600 flex flex-shrink-0 items-center justify-center rounded-full bg-gray-100 font-medium text-gray-800 group-focus:bg-gray-200 dark:bg-neutral-700 dark:text-white dark:group-focus:bg-gray-600">
                    <span className="hs-stepper-success:hidden hs-stepper-completed:hidden">2</span>
                    <svg
                      className="size-3 hs-stepper-success:block hidden flex-shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span className="ms-2 text-sm font-medium text-gray-800 group-focus:text-gray-500 dark:text-white dark:group-focus:text-gray-400">Step</span>
                </span>
                <div className="hs-stepper-success:bg-blue-600 hs-stepper-completed:bg-teal-600 dark:hs-stepper-success:bg-blue-500 dark:hs-stepper-completed:bg-teal-500 h-px w-full flex-1 bg-gray-200 group-last:hidden dark:bg-neutral-700"></div>
              </li>

              <li
                className="group flex flex-1 shrink basis-0 items-center gap-x-2"
                data-hs-stepper-nav-item='{
      "index": 3
    }'
              >
                <span className="min-w-7 min-h-7 group inline-flex items-center align-middle text-xs focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                  <span className="size-7 hs-stepper-active:bg-blue-600 hs-stepper-active:text-white hs-stepper-success:bg-blue-600 hs-stepper-success:text-white hs-stepper-completed:bg-teal-500 hs-stepper-completed:group-focus:bg-teal-600 dark:hs-stepper-active:bg-blue-500 dark:hs-stepper-success:bg-blue-500 dark:hs-stepper-completed:bg-teal-500 dark:hs-stepper-completed:group-focus:bg-teal-600 flex flex-shrink-0 items-center justify-center rounded-full bg-gray-100 font-medium text-gray-800 group-focus:bg-gray-200 dark:bg-neutral-700 dark:text-white dark:group-focus:bg-gray-600">
                    <span className="hs-stepper-success:hidden hs-stepper-completed:hidden">3</span>
                    <svg
                      className="size-3 hs-stepper-success:block hidden flex-shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span className="ms-2 text-sm font-medium text-gray-800 group-focus:text-gray-500 dark:text-white dark:group-focus:text-gray-400">Step</span>
                </span>
                <div className="hs-stepper-success:bg-blue-600 hs-stepper-completed:bg-teal-600 dark:hs-stepper-success:bg-blue-500 dark:hs-stepper-completed:bg-teal-500 h-px w-full flex-1 bg-gray-200 group-last:hidden dark:bg-neutral-700"></div>
              </li>
            </ul>
          </div> */}
        </div>
      </div>
      <div className="flex min-h-[100px] w-full flex-col gap-4 bg-black p-4">
        <div className="flex w-full flex-col items-center justify-center gap-2 lg:flex-row">
          <div className="flex items-center gap-1 text-white">
            <FaLocationDot size={20} />
            <p className="text-xs tracking-tight">
              {partner.localizacao.cidade}/{partner.localizacao.uf}, {formatLocation({ location: partner.localizacao })}
            </p>
          </div>
          <div className="flex items-center gap-1 text-white">
            <MdEmail size={20} />
            <p className="text-xs tracking-tight">{partner.contatos.email}</p>
          </div>
        </div>
        <div className="flex w-full flex-wrap items-center justify-around gap-6">
          {partner.midias.website ? (
            <div className="flex items-center gap-1 text-white">
              <TbWorld size={20} />
              <p className="text-xs tracking-tight">{partner.midias.website}</p>
            </div>
          ) : null}

          {partner.midias.instagram ? (
            <div className="flex items-center gap-1 text-white">
              <FaInstagram size={20} />
              <p className="text-xs tracking-tight">{partner.midias.instagram}</p>
            </div>
          ) : null}

          <div className="flex items-center gap-1 text-white">
            <FaPhone size={20} />
            <p className="text-xs tracking-tight">{partner.contatos.telefonePrimario}</p>
          </div>
        </div>
        {partner.slogan ? <h1 className="w-full text-center text-sm font-black text-white lg:text-base">{partner.slogan}</h1> : null}
      </div>
    </div>
  )
}

export default SolarCalculatorPage

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query

  if (!id || typeof id != 'string' || !ObjectId.isValid(id)) {
    return {
      props: {
        error: 'Oops, houve um erro desconhecido.',
      },
    }
  }
  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const partnersCollection: Collection<TPartner> = db.collection('partners')
  //   const integrationsCollection: Collection<TIntegrationRDStation> = db.collection('integrations')

  const partner = await partnersCollection.findOne({ _id: new ObjectId(id) })
  if (!partner) {
    return {
      props: {
        error: 'Oops, houve um erro desconhecido.',
      },
    }
  }
  //   const rdIntegration = await integrationsCollection.findOne({ identificador: 'RD_STATION', idParceiro: id })

  return {
    props: {
      partnerJSON: JSON.stringify(partner),
    },
  }
}
