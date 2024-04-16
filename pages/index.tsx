import React, { useState } from 'react'
import Link from 'next/link'
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'

import { VscDiffAdded } from 'react-icons/vsc'
import { BsCheckSquare, BsFileEarmarkText, BsPatchCheck, BsPeopleFill, BsTicketPerforated } from 'react-icons/bs'
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

function renderIcon(icon: React.ComponentType) {
  const IconComponent = icon
  return <IconComponent />
}

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
  const { data: opportunityCreators } = useOpportunityCreators()
  const { data, isLoading, isSuccess, isError, error } = useStats(true, period.after, period.before, responsible)
  // const { data: openCalls, isLoading: callsLoading } = useOpenCalls(status == 'authenticated', responsible)
  // const { data: technicalAnalysis } = useUserTechnicalAnalysis({
  //   enabled: !!session,
  //   userId: responsible,
  //   status: null,
  // })

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
            <div className="flex h-[450px]  w-full flex-col  items-center justify-center rounded-xl border border-gray-200 bg-[#fff] p-6 shadow-sm lg:w-[40%]">
              <div className="flex min-h-[45px] w-full flex-col">
                <div className="flex items-center justify-between">
                  <h1 className="text-sm font-medium uppercase tracking-tight">ATIVIDADES PENDENTES</h1>
                  <BsCheckSquare />
                </div>
              </div>
              {/* <p className="text-sm text-gray-500">{data?.propostasAssinadas.length} no período de escolha</p> */}
              <div className="flex w-full grow flex-col justify-start gap-2 overflow-y-auto overscroll-y-auto py-2 pr-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                {data?.atividades ? (
                  data?.atividades.length > 0 ? (
                    data?.atividades.map((activity, index: number) => (
                      <PendingActivityCard activity={activity} visibility={session.user.permissoes.oportunidades.escopo} key={index} />
                    ))
                  ) : (
                    <div className="flex grow items-center justify-center">
                      <p className="text-center text-sm italic text-gray-500">Sem tarefas pendentes...</p>
                    </div>
                  )
                ) : null}
              </div>
            </div>
            {/* <PendingSignaturesBlock data={data} session={session} /> */}
            <div className="flex h-[650px] w-full flex-col rounded-xl  border border-gray-200 bg-[#fff] p-6 shadow-sm lg:h-[450px] lg:w-[60%]">
              <div className="flex min-h-[42px] w-full flex-col">
                <div className="flex items-center justify-between">
                  <h1 className="text-sm font-medium uppercase tracking-tight">Projetos ganhos</h1>
                  <MdSell />
                </div>
                <p className="text-sm text-gray-500">{data?.propostasAssinadas.length || 0} no período de escolha</p>
              </div>
              <div className="flex grow flex-col justify-start gap-2 overflow-y-auto overscroll-y-auto py-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                {data?.propostasAssinadas.map((proposal, index: number) => (
                  <div key={index} className="flex w-full flex-col items-center justify-between border-b  border-gray-200 p-2 md:flex-row md:border-b-0">
                    <div className="flex w-full items-start gap-4 md:grow">
                      <div className="flex h-[30px] min-h-[30px] w-[30px] min-w-[30px] items-center justify-center rounded-full border border-black">
                        <MdOutlineAttachMoney />
                      </div>
                      <div className="flex grow flex-col items-start">
                        <h1 className="w-full text-start text-sm font-medium leading-none tracking-tight">
                          {formatLongString(proposal?.nome.toUpperCase() || '', 30)}
                        </h1>
                        <div className="mt-1 flex w-full items-center justify-start gap-2">
                          {proposal.responsaveis.map((resp) => (
                            <div className="flex items-center gap-2">
                              <Avatar fallback={'R'} url={resp?.avatar_url || undefined} height={20} width={20} />

                              <p className="text-xs text-gray-500">{resp.nome}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex min-w-[100px] items-center gap-1">
                      <p className="font-medium">{proposal?.valor ? formatToMoney(proposal.valor) : 'N/A'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EstatisticaPrincipal
