import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import dayjs from 'dayjs'

import { formatDate, formatToMoney, getFirstDayOfMonth, getLastDayOfMonth } from '@/utils/methods'
import { useSaleStats } from '@/utils/queries/stats'
import { useSalePromoters } from '@/utils/queries/users'
import { useFunnels } from '@/utils/queries/funnels'

import { Sidebar } from '@/components/Sidebar'
import Avatar from '@/components/utils/Avatar'
import LoadingComponent from '@/components/utils/LoadingComponent'
import LoadingPage from '@/components/utils/LoadingPage'

import { GrConfigure, GrSend } from 'react-icons/gr'
import { BsFileEarmarkText, BsFillBookmarkFill, BsFillGearFill, BsFunnelFill, BsPatchCheck, BsTicketPerforated } from 'react-icons/bs'
import { IUsuario } from '@/utils/models'
import EditPromoter from '@/components/Modals/EditPromoter'

import { ImPower } from 'react-icons/im'
import { AiOutlineCloseCircle, AiOutlineThunderbolt } from 'react-icons/ai'
import { MdAttachMoney, MdCreate, MdSell } from 'react-icons/md'
import { VscDiffAdded } from 'react-icons/vsc'
import { FaPercentage } from 'react-icons/fa'

import DateInput from '@/components/Inputs/DateInput'
import MultipleSelectInput from '@/components/Inputs/MultipleSelectInput'
import StatCard from '@/components/Stats/sale-team/StatCard'
import ConversionStatCard from '@/components/Stats/sale-team/ConversionStatCard'
import SdrStatCard from '@/components/Stats/sdr-team/SdrStatCard'
import SdrSentCard from '@/components/Stats/sdr-team/SdrSentCard'
import SdrConversionStatCard from '@/components/Stats/sdr-team/SdrConversionStatCard'
import LossesByReason from '@/components/Stats/general/LossesByReason'

import { TUserDTOWithSaleGoals } from '@/utils/schemas/user.schema'
import { TSalesStats } from '@/pages/api/stats/sales'
const currentDate = new Date()
const periodStr = dayjs(currentDate).format('MM/YYYY')
const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()).toISOString()
const lastDayOfMonth = getLastDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()).toISOString()

function getSaleGoals(promoter: TUserDTOWithSaleGoals) {
  const saleGoals = promoter.metas
  if (!saleGoals || saleGoals.length == 0) return undefined

  const currentPeriodSaleGoals = saleGoals.find((saleGoal) => saleGoal.periodo == periodStr)
  if (!currentPeriodSaleGoals) return undefined

  return currentPeriodSaleGoals.metas
}

type GetFunnelStageData = {
  funnelName: string
  stageName: string
  stats?: TSalesStats['funis']
}
function getFunnelStageData({ funnelName, stageName, stats }: GetFunnelStageData): { projetos: number; valor: number } {
  const baseReturn = { projetos: 0, valor: 0 }
  if (!stats) return baseReturn
  const funnelStats = stats[funnelName]
  if (!funnelStats) return baseReturn
  const stageStats = funnelStats[stageName]
  const projects = stageStats.projetos ? Number(Number(stageStats.projetos).toFixed(2)) : 0
  const value = stageStats.valor ? Number(Number(stageStats.valor).toFixed(2)) : 0
  return {
    projetos: projects,
    valor: value,
  }
}
function ManagementResultsPage() {
  const { data: session, status } = useSession({ required: true })
  const [period, setPeriod] = useState({
    after: firstDayOfMonth,
    before: lastDayOfMonth,
  })
  const [users, setUsers] = useState<string[] | null>(null)
  const [editModal, setEditModal] = useState<{ isOpen: boolean; promoter: TUserDTOWithSaleGoals | null }>({
    isOpen: false,
    promoter: null,
  })
  const [newGroupModalIsOpen, setNewGroupModalIsOpen] = useState(false)
  const { data: promoters, isLoading: promotersLoading, isSuccess: promotersSuccess } = useSalePromoters()
  const { data: funnels } = useFunnels()
  const { data: stats, isLoading: statsLoading } = useSaleStats(period.after, period.before, users)
  if (status != 'authenticated') return <LoadingPage />
  return (
    <div className="flex h-full flex-col md:flex-row">
      <Sidebar session={session} />
      <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa] p-6">
        <div className="flex w-full flex-col items-center justify-between gap-4 border-b border-black pb-2 lg:flex-row lg:items-end">
          <h1 className="text-center font-Raleway text-xl font-black text-black lg:text-start lg:text-2xl">ACOMPANHAMENTO DE RESULTADOS</h1>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-4 lg:flex-row">
              <h1 className="text-end text-sm font-medium uppercase tracking-tight">PERÍODO</h1>
              <div className="flex w-full flex-col items-center gap-2 md:flex-row lg:w-fit">
                <div className="w-full md:w-[150px]">
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
                <div className="w-full md:w-[150px]">
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
            <div className="w-full md:w-[250px]">
              <MultipleSelectInput
                label="USUÁRIOS"
                showLabel={false}
                options={promoters?.map((promoter) => ({ id: promoter._id || '', label: promoter.nome, value: promoter._id })) || null}
                selected={users}
                handleChange={(value) => setUsers(value as string[])}
                selectedItemLabel="TODOS"
                onReset={() => setUsers(null)}
                width="100%"
              />
            </div>
          </div>
        </div>
        <h1 className="mt-4 rounded-md bg-[#15599a] text-center text-xl font-black text-white">GERAL</h1>
        <div className="mt-2 flex w-full flex-col items-center justify-around gap-2 lg:flex-row">
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-6 shadow-sm lg:w-1/5">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">Projetos Criados</h1>
              <VscDiffAdded />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{stats?.geral.ATUAL.projetosCriados?.total || 0}</div>
              <p className="text-xs font-medium text-gray-800">{stats?.geral.ATUAL.projetosCriados.inbound || 0} INBOUND</p>
              <p className="text-xs font-medium text-gray-800">{stats?.geral.ATUAL.projetosCriados.outboundVendedor} OUTBOUND (VENDEDOR)</p>
              <p className="text-xs font-medium text-gray-800">{stats?.geral.ATUAL.projetosCriados.outboundSdr} OUTBOUND (SDR)</p>
              <p className="text-xs text-gray-500">{stats?.geral.ANTERIOR.projetosCriados || 0} no último período</p>
            </div>
          </div>
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-6 shadow-sm lg:w-1/5">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">Projetos Ganhos</h1>
              <BsPatchCheck />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{stats?.geral.ATUAL.projetosGanhos?.total || 0}</div>
              <p className="text-xs font-medium text-gray-800">{stats?.geral.ATUAL.projetosGanhos.inbound} INBOUND</p>
              <p className="text-xs font-medium text-gray-800">{stats?.geral.ATUAL.projetosGanhos.outboundVendedor} OUTBOUND (VENDEDOR)</p>
              <p className="text-xs font-medium text-gray-800">{stats?.geral.ATUAL.projetosGanhos.outboundSdr} OUTBOUND (SDR)</p>
              <p className="text-xs text-gray-500">{stats?.geral.ANTERIOR.projetosGanhos || 0} no último período</p>
            </div>
          </div>
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-6 shadow-sm lg:w-1/5">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">Projetos Perdidos</h1>
              <AiOutlineCloseCircle size={'20px'} />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{stats?.geral.ATUAL.projetosPerdidos?.total || 0}</div>
              <p className="text-xs font-medium text-gray-800">{stats?.geral.ATUAL.projetosPerdidos.inbound} INBOUND</p>
              <p className="text-xs font-medium text-gray-800">{stats?.geral.ATUAL.projetosPerdidos.outboundVendedor} OUTBOUND (VENDEDOR)</p>
              <p className="text-xs font-medium text-gray-800">{stats?.geral.ATUAL.projetosPerdidos.outboundSdr} OUTBOUND (SDR)</p>
              <p className="text-xs text-gray-500">{stats?.geral.ANTERIOR.projetosPerdidos || 0} no último período</p>
            </div>
          </div>
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-6 shadow-sm lg:w-1/5">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">Total Vendido</h1>
              <BsFileEarmarkText />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">
                {stats?.geral.ATUAL.totalVendido ? formatToMoney(stats?.geral.ATUAL.totalVendido.total) : 0}
              </div>
              <p className="text-xs font-medium text-gray-800">
                {stats?.geral.ATUAL.totalVendido.inbound ? formatToMoney(stats?.geral.ATUAL.totalVendido.inbound) : 0} INBOUND
              </p>
              <p className="text-xs font-medium text-gray-800">
                {stats?.geral.ATUAL.totalVendido.outboundVendedor ? formatToMoney(stats?.geral.ATUAL.totalVendido.outboundVendedor) : 0} OUTBOUND (VENDEDOR)
              </p>
              <p className="text-xs font-medium text-gray-800">
                {stats?.geral.ATUAL.totalVendido.outboundSdr ? formatToMoney(stats?.geral.ATUAL.totalVendido.outboundSdr) : 0} OUTBOUND (SDR)
              </p>
              <p className="text-xs text-gray-500">
                {stats?.geral.ANTERIOR.totalVendido ? formatToMoney(stats?.geral.ANTERIOR.totalVendido) : 0} no último período
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
                {stats?.geral.ATUAL.totalVendido
                  ? formatToMoney((stats?.geral.ATUAL.totalVendido.total || 0) / (stats?.geral.ATUAL.projetosGanhos.total || 0))
                  : 0}
              </div>
              <p className="text-xs font-medium text-gray-800">
                {stats?.geral.ATUAL.totalVendido.inbound && stats?.geral.ATUAL.projetosGanhos.inbound
                  ? formatToMoney(stats?.geral.ATUAL.totalVendido.inbound / stats?.geral.ATUAL.projetosGanhos.inbound)
                  : 0}{' '}
                INBOUND
              </p>
              <p className="text-xs font-medium text-gray-800">
                {stats?.geral.ATUAL.totalVendido.outboundVendedor
                  ? formatToMoney(stats?.geral.ATUAL.totalVendido.outboundVendedor / stats?.geral.ATUAL.projetosGanhos.outboundVendedor)
                  : 0}{' '}
                OUTBOUND (VENDEDOR)
              </p>
              <p className="text-xs font-medium text-gray-800">
                {stats?.geral.ATUAL.totalVendido.outboundSdr
                  ? formatToMoney(stats?.geral.ATUAL.totalVendido.outboundSdr / stats?.geral.ATUAL.projetosGanhos.outboundSdr)
                  : 0}{' '}
                OUTBOUND (SDR)
              </p>
              <p className="text-xs text-gray-500">
                {stats?.geral.ANTERIOR.totalVendido ? formatToMoney(stats?.geral.ANTERIOR.totalVendido / stats?.geral.ANTERIOR.projetosGanhos) : 0} no último
                período
              </p>{' '}
            </div>
          </div>
        </div>
        <LossesByReason stats={stats?.geral} />
        <h1 className="mt-4 rounded-md bg-[#15599a] text-center text-xl font-black text-white">EM ANDAMENTO</h1>
        <div className="mt-2 flex w-full flex-col items-start gap-6">
          {funnels?.map((funnel, funnelIndex) => (
            <div key={funnelIndex} className="flex w-full flex-col ">
              <div className="mb-4 flex w-full items-center justify-center gap-2 rounded-sm bg-[#fead41] text-white">
                <h1 className="text-lg font-medium uppercase tracking-tight">{funnel.nome}</h1>
                <BsFunnelFill />
              </div>
              <div className="flex w-full flex-wrap items-start justify-around gap-4">
                {funnel.etapas.map((stage, stageIndex) => (
                  <div
                    key={stageIndex}
                    className={`flex w-[350px] min-w-[350px] max-w-[350px] grow flex-col rounded-xl border border-gray-200 bg-[#fff] p-6 shadow-sm`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <h1 className="text-sm font-medium uppercase tracking-tight">{stage.nome}</h1>
                      <BsFillBookmarkFill />
                    </div>
                    <h1 className="text-center text-2xl font-bold text-[#15599a]">
                      {getFunnelStageData({ funnelName: funnel.nome, stageName: stage.nome, stats: stats?.funis }).projetos}
                    </h1>
                    <h1 className="text-center text-2xl font-bold text-green-800">
                      {formatToMoney(getFunnelStageData({ funnelName: funnel.nome, stageName: stage.nome, stats: stats?.funis }).valor)}
                    </h1>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <h1 className="mt-4 rounded-md bg-[#15599a] text-center text-xl font-black text-white">TIME DE VENDAS</h1>
        <div className="mt-2 flex w-full flex-col items-start gap-2 lg:flex-row">
          <StatCard
            icon={<AiOutlineThunderbolt />}
            label="Potência Vendida"
            promoters={promoters || []}
            statKey="potenciaPico"
            stats={stats?.vendas}
            statsLoading={statsLoading}
          />
          <StatCard
            icon={<MdAttachMoney />}
            label="Valor Vendido"
            promoters={promoters || []}
            statKey="valorVendido"
            stats={stats?.vendas}
            statsLoading={statsLoading}
          />
        </div>
        <div className="mt-2 flex w-full flex-col items-start gap-2 lg:flex-row">
          <StatCard
            icon={<MdSell />}
            label="Projetos Vendidos"
            promoters={promoters || []}
            statKey="projetosVendidos"
            stats={stats?.vendas}
            statsLoading={statsLoading}
          />
          <StatCard
            icon={<MdCreate />}
            label="Projetos Criados"
            promoters={promoters || []}
            statKey="projetosCriados"
            stats={stats?.vendas}
            statsLoading={statsLoading}
          />
        </div>
        <div className="mt-2 flex w-full flex-col items-start gap-2 lg:flex-row">
          <ConversionStatCard
            numeratorStatKey="projetosVendidos"
            denominatorStatKey="projetosCriados"
            promoters={promoters || []}
            stats={stats?.vendas}
            statsLoading={statsLoading}
          />
        </div>
        <h1 className="mt-4 rounded-md bg-[#15599a] text-center text-xl font-black text-white">TIME DE SDR</h1>
        <div className="mt-2 flex w-full flex-col items-start gap-2 lg:flex-row">
          <SdrStatCard
            icon={<AiOutlineThunderbolt />}
            label="Potência Vendida"
            promoters={promoters || []}
            statKey="potenciaPico"
            stats={stats?.sdr}
            statsLoading={statsLoading}
          />
          <SdrStatCard
            icon={<MdAttachMoney />}
            label="Valor Vendido"
            promoters={promoters || []}
            statKey="valorVendido"
            stats={stats?.sdr}
            statsLoading={statsLoading}
          />
        </div>
        <div className="mt-2 flex w-full flex-col items-start gap-2 lg:flex-row">
          <SdrStatCard
            icon={<MdSell />}
            label="Projetos vendidos"
            promoters={promoters || []}
            statKey="projetosVendidos"
            stats={stats?.sdr}
            statsLoading={statsLoading}
          />
          <SdrStatCard
            icon={<MdAttachMoney />}
            label="Projetos criados"
            promoters={promoters || []}
            statKey="projetosCriados"
            stats={stats?.sdr}
            statsLoading={statsLoading}
          />
        </div>
        <div className="mt-2 flex w-full flex-col items-start gap-2 lg:flex-row">
          <SdrSentCard stats={stats?.sdr} promoters={promoters || []} />
          <SdrConversionStatCard stats={stats?.sdr} statsLoading={statsLoading} promoters={promoters || []} />
        </div>
        <h1 className="mt-4 font-Raleway text-xl font-black text-black">CONTROLE DE EQUIPE</h1>
        <div className="flex grow flex-col flex-wrap justify-around gap-2 py-2 lg:flex-row">
          {promotersSuccess ? (
            promoters?.map((responsible, index) => (
              <div
                key={index}
                className="relative flex min-h-[100px] w-full flex-col items-center gap-4 rounded-sm border border-gray-300 bg-[#fff] p-6 shadow-md lg:w-[650px]"
              >
                <div
                  onClick={() => setEditModal({ isOpen: true, promoter: responsible })}
                  className="absolute right-5 top-4 flex cursor-pointer items-center justify-center rounded-full border border-black p-2 duration-300 ease-in-out hover:bg-black hover:text-white"
                >
                  <BsFillGearFill />
                </div>
                <div className="flex w-full items-center justify-center gap-2">
                  <Avatar fallback="U" height={45} width={45} url={responsible.avatar_url || undefined} />
                  <div className="flex flex-col gap-1">
                    <h1 className="font-bold leading-none tracking-tight">{responsible.nome}</h1>
                    <p className="leading-none tracking-tight text-gray-500">{responsible.telefone}</p>
                  </div>
                </div>
                <h1 className="font-bold leading-none tracking-tight">METAS</h1>
                <div className="flex w-full flex-col gap-1">
                  <div className="mt-2 flex w-full items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <ImPower />
                        <p className="text-xs leading-none tracking-tight text-gray-500">POTÊNCIA PICO</p>
                      </div>

                      <p className="text-xs font-bold">{getSaleGoals(responsible)?.potenciaVendida || '-'}W</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <MdSell />
                        <p className="text-xs leading-none tracking-tight text-gray-500">PROJETOS VENDIDOS</p>
                      </div>
                      <p className="text-xs font-bold">{getSaleGoals(responsible)?.projetosVendidos || '-'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <MdAttachMoney />
                        <p className="text-xs leading-none tracking-tight text-gray-500">VALOR VENDIDO</p>
                      </div>
                      <p className="text-xs font-bold">{getSaleGoals(responsible)?.valorVendido || '-'}</p>
                    </div>
                  </div>
                  <div className="mt-1 flex w-full items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <FaPercentage />
                        <p className="text-xs leading-none tracking-tight text-gray-500">CONVERSÃO</p>
                      </div>
                      <p className="text-xs font-bold">{getSaleGoals(responsible)?.conversao || '-'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <MdCreate />
                        <p className="text-xs leading-none tracking-tight text-gray-500">PROJETOS CRIADOS</p>
                      </div>
                      <p className="text-xs font-bold">{getSaleGoals(responsible)?.projetosCriados || '-'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <GrSend />
                        <p className="text-xs leading-none tracking-tight text-gray-500">PROJETOS ENVIADOS</p>
                      </div>
                      <p className="text-xs font-bold">{getSaleGoals(responsible)?.projetosEnviados || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <LoadingComponent />
          )}
        </div>
      </div>
      {editModal.isOpen && editModal.promoter ? (
        <EditPromoter session={session} promoter={editModal.promoter} closeModal={() => setEditModal({ isOpen: false, promoter: null })} />
      ) : null}
    </div>
  )
}

export default ManagementResultsPage
