import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import axios from 'axios'
import dayjs from 'dayjs'

import { Sidebar } from '@/components/Sidebar'
import Avatar from '@/components/utils/Avatar'
import LoadingComponent from '@/components/utils/LoadingComponent'
import LoadingPage from '@/components/utils/LoadingPage'

import { GrSend } from 'react-icons/gr'
import { BsDownload, BsFillGearFill } from 'react-icons/bs'

import { ImPower } from 'react-icons/im'
import { MdAttachMoney, MdCreate, MdSell } from 'react-icons/md'
import { FaPercentage } from 'react-icons/fa'

import OverallResults from '@/components/Stats/Results/Overall'
import InProgressResults from '@/components/Stats/Results/InProgress'
import SalesTeamResults from '@/components/Stats/Results/SalesTeam'
import SDRTeamResults from '@/components/Stats/Results/SDRTeam'
import EditPromoter from '@/components/Modals/EditPromoter'
import DateInput from '@/components/Inputs/DateInput'
import MultipleSelectInput from '@/components/Inputs/MultipleSelectInput'

import { getExcelFromJSON } from '@/lib/methods/excel-utils'
import { getErrorMessage } from '@/lib/methods/errors'
import { formatDateInputChange } from '@/lib/methods/formatting'

import { formatDate, getFirstDayOfMonth, getLastDayOfMonth } from '@/utils/methods'
import { useSalePromoters } from '@/utils/queries/users'
import { TUserDTOWithSaleGoals } from '@/utils/schemas/user.schema'
import { fetchResultsExports } from '@/utils/queries/stats/exports'
import { usePartnersSimplified } from '@/utils/queries/partners'

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

function ComercialResults() {
  const { data: session, status } = useSession({ required: true })

  const [period, setPeriod] = useState({ after: firstDayOfMonth, before: lastDayOfMonth })
  const [users, setUsers] = useState<string[] | null>(null)
  const [partners, setPartners] = useState<string[] | null>(null)

  const [editModal, setEditModal] = useState<{ isOpen: boolean; promoter: TUserDTOWithSaleGoals | null }>({
    isOpen: false,
    promoter: null,
  })

  const { data: promoters, isLoading: promotersLoading, isSuccess: promotersSuccess } = useSalePromoters()
  const { data: partnersSimplified } = usePartnersSimplified()
  async function handleDataExport() {
    const loadingToastId = toast.loading('Carregando...')
    try {
      const results = await fetchResultsExports({ after: period.after, before: period.before, responsibles: users, partners: partners })
      getExcelFromJSON(results, 'RELATORIO_VENDAS')
      toast.dismiss(loadingToastId)
      return toast.success('Exportação feita com sucesso !')
    } catch (error) {
      console.log(error)
      toast.dismiss(loadingToastId)
      const msg = getErrorMessage(error)
      return toast.error(msg)
    }
  }

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
              <button
                onClick={() => handleDataExport()}
                className="flex h-[46.6px] items-center justify-center gap-2 rounded-md border bg-[#2c6e49] p-2 px-3 text-sm font-medium text-white shadow-sm duration-300 ease-in-out hover:scale-105"
              >
                <BsDownload style={{ fontSize: '18px' }} />
              </button>
              <div className="flex w-full flex-col items-center gap-2 md:flex-row lg:w-fit">
                <div className="w-full md:w-[150px]">
                  <DateInput
                    showLabel={false}
                    label="PERÍODO"
                    value={formatDate(period.after)}
                    handleChange={(value) =>
                      setPeriod((prev) => ({
                        ...prev,
                        after: formatDateInputChange(value) || firstDayOfMonth,
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
                        before: formatDateInputChange(value) || lastDayOfMonth,
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
            <div className="w-full md:w-[250px]">
              <MultipleSelectInput
                label="PARCEIROS"
                showLabel={false}
                options={partnersSimplified?.map((promoter) => ({ id: promoter._id || '', label: promoter.nome, value: promoter._id })) || null}
                selected={partners}
                handleChange={(value) => setPartners(value as string[])}
                selectedItemLabel="TODOS"
                onReset={() => setPartners(null)}
                width="100%"
              />
            </div>
          </div>
        </div>
        <OverallResults after={period.after} before={period.before} responsibles={users} partners={partners} />
        <InProgressResults after={period.after} before={period.before} responsibles={users} partners={partners} />
        <SalesTeamResults after={period.after} before={period.before} responsibles={users} promoters={promoters} partners={partners} />
        <SDRTeamResults after={period.after} before={period.before} responsibles={users} promoters={promoters} partners={partners} />
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

export default ComercialResults
