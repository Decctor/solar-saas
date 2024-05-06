import React, { useState } from 'react'
import Link from 'next/link'
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'

import { VscDiffAdded } from 'react-icons/vsc'
import { BsCheckSquare, BsCode, BsFileEarmarkText, BsFillMegaphoneFill, BsPatchCheck, BsPeopleFill, BsTicketPerforated } from 'react-icons/bs'
import { AiOutlineCloseCircle, AiOutlineTeam } from 'react-icons/ai'
import { GiBugleCall } from 'react-icons/gi'
import { MdOutlineAttachMoney, MdSell } from 'react-icons/md'

import { Sidebar } from '@/components/Sidebar'
import DateInput from '@/components/Inputs/DateInput'
import DropdownSelect from '@/components/Inputs/DropdownSelect'
import LoadingPage from '@/components/utils/LoadingPage'

import Avatar from '@/components/utils/Avatar'

import { formatDate, formatLongString, formatToMoney, getFirstDayOfMonth, getLastDayOfMonth, useResponsibles } from '@/utils/methods'
import { useStats } from '@/utils/queries/stats'

import PendingActivityCard from '@/components/ProjectEvents/PendingActivityCard'

import { useOpportunityCreators } from '@/utils/queries/users'
import { usePartnersSimplified } from '@/utils/queries/partners'
import PendingWinsBlock from '@/components/Stats/MainDashboard/PendingWinsBlock'
import WinsBlock from '@/components/Stats/MainDashboard/WinsBlock'
import PPSOpenCallsBlock from '@/components/Stats/MainDashboard/PPSOpenCallsBlock'
import OpenActivitiesBlock from '@/components/Stats/MainDashboard/OpenActivitiesBlock'

const currentDate = new Date()
const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()).toISOString()
const lastDayOfMonth = getLastDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()).toISOString()

function EstatisticaPrincipal() {
  const { data: session, status } = useSession({ required: true })
  const [period, setPeriod] = useState({
    after: firstDayOfMonth,
    before: lastDayOfMonth,
  })
  const [responsible, setResponsible] = useState<string | null>(session?.user.permissoes.oportunidades.escopo ? session.user.id : null)
  const [partner, setPartner] = useState<string | null>(session?.user.idParceiro || null)
  const { data: opportunityCreators } = useOpportunityCreators()
  const { data: partners } = usePartnersSimplified()
  const { data, isLoading, isSuccess, isError, error } = useStats(true, period.after, period.before, responsible, partner)

  console.log('SESSION', session)
  if (status != 'authenticated') return <LoadingPage />
  return (
    <div className="flex h-full flex-col md:flex-row">
      <Sidebar session={session} />
      <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa] p-6">
        <div className="flex w-full flex-col items-center justify-between border-b border-black pb-2 lg:flex-row">
          <h1 className="font-Raleway text-2xl font-black text-black">DASHBOARD</h1>
          {session?.user.permissoes.resultados?.visualizarComercial ? (
            <Link href="/comercial/gestao/resultados">
              <div className="flex items-center gap-1 font-bold tracking-tight text-gray-500 duration-300 ease-in-out hover:text-cyan-500">
                <p className="text-sm">ACOMPANHAMENTO DE RESULTADOS</p>
                <AiOutlineTeam />
              </div>
            </Link>
          ) : null}
        </div>
        <div className="flex grow flex-col py-2">
          <div className="flex w-full flex-col items-end justify-end gap-2 lg:flex-row">
            {session?.user.permissoes.resultados?.visualizarComercial ? (
              <>
                <div className="w-full lg:w-[300px]">
                  <DropdownSelect
                    categoryName="Usuários"
                    selectedItemLabel="Todos"
                    height="49px"
                    value={responsible}
                    options={opportunityCreators?.map((resp) => ({ id: resp._id || '', label: resp.nome || '', value: resp._id || '' })) || null}
                    onChange={(selected) => {
                      setResponsible(selected.value)
                    }}
                    onReset={() => {
                      if (session?.user.permissoes.resultados.visualizarComercial) {
                        setResponsible(null)
                      } else {
                        setResponsible(session.user.id)
                      }
                    }}
                    width="100%"
                  />
                </div>
                <div className="w-full lg:w-[300px]">
                  <DropdownSelect
                    categoryName="Parceiros"
                    selectedItemLabel="Todos"
                    height="49px"
                    value={partner}
                    options={partners?.map((resp) => ({ id: resp._id || '', label: resp.nome || '', value: resp._id || '' })) || null}
                    onChange={(selected) => {
                      setPartner(selected.value)
                    }}
                    onReset={() => {
                      if (session?.user.permissoes.resultados.visualizarComercial) {
                        setPartner(null)
                      } else {
                        setPartner(session.user.id)
                      }
                    }}
                    width="100%"
                  />
                </div>
              </>
            ) : null}

            <div className="flex w-full flex-col lg:w-fit">
              <h1 className="text-end text-sm font-medium uppercase tracking-tight">PERÍODO</h1>
              <div className="flex flex-col items-center gap-2 lg:flex-row">
                <div className="w-full lg:w-[150px]">
                  <DateInput
                    showLabel={false}
                    label="PERÍODO"
                    value={formatDate(period.after)}
                    handleChange={(value) =>
                      setPeriod((prev) => ({
                        ...prev,
                        after: value ? value : firstDayOfMonth,
                      }))
                    }
                    width="100%"
                  />
                </div>
                <div className="w-full lg:w-[150px]">
                  <DateInput
                    showLabel={false}
                    label="PERÍODO"
                    value={formatDate(period.before)}
                    handleChange={(value) =>
                      setPeriod((prev) => ({
                        ...prev,
                        before: value ? value : firstDayOfMonth,
                      }))
                    }
                    width="100%"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 flex w-full flex-col items-center justify-around gap-2 lg:flex-row">
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-6 shadow-sm lg:w-1/5">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">Projetos Criados</h1>
                <VscDiffAdded />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{data?.simplificado.ATUAL.projetosCriados || 0}</div>
                <p className="text-xs text-gray-500">{data?.simplificado.ANTERIOR.projetosCriados || 0} no último período</p>
              </div>
            </div>
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-6 shadow-sm lg:w-1/5">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">Projetos Ganhos</h1>
                <BsPatchCheck />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{data?.simplificado.ATUAL.projetosGanhos || 0}</div>
                <p className="text-xs text-gray-500">{data?.simplificado.ANTERIOR.projetosGanhos || 0} no último período</p>
              </div>
            </div>
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-6 shadow-sm lg:w-1/5">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">Projetos Perdidos</h1>
                <AiOutlineCloseCircle size={'20px'} />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{data?.simplificado.ATUAL.projetosPerdidos || 0}</div>
                <p className="text-xs text-gray-500">{data?.simplificado.ANTERIOR.projetosPerdidos || 0} no último período</p>
              </div>
            </div>
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-6 shadow-sm lg:w-1/5">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">Total Vendido</h1>
                <BsFileEarmarkText />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">
                  {data?.simplificado.ATUAL.totalVendido ? formatToMoney(data.simplificado.ATUAL.totalVendido) : 0}
                </div>
                <p className="text-xs text-gray-500">
                  {data?.simplificado.ANTERIOR.totalVendido ? formatToMoney(data.simplificado.ANTERIOR.totalVendido) : 0} no último período
                </p>
              </div>
            </div>
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-6 shadow-sm lg:w-1/5">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">Ticket Médio</h1>
                <BsTicketPerforated />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">
                  {data?.simplificado.ATUAL.totalVendido ? formatToMoney(data.simplificado.ATUAL.totalVendido / data.simplificado.ATUAL.projetosGanhos) : 0}
                </div>
                <p className="text-xs text-gray-500">
                  {data?.simplificado.ANTERIOR.totalVendido
                    ? formatToMoney(data.simplificado.ANTERIOR.totalVendido / data.simplificado.ANTERIOR.projetosGanhos)
                    : 0}{' '}
                  no último período
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex w-full flex-col items-center justify-around gap-2 lg:flex-row">
            <div className="w-full lg:w-[40%]">
              <PendingWinsBlock data={data?.ganhosPendentes || []} session={session} />
            </div>
            <div className="w-full lg:w-[60%]">
              <WinsBlock data={data?.ganhos || []} session={session} />
            </div>
          </div>
          <div className="mt-4 flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-[50%]">
              <PPSOpenCallsBlock session={session} />
            </div>
            <div className="w-full lg:w-[50%]">
              <OpenActivitiesBlock session={session} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EstatisticaPrincipal
