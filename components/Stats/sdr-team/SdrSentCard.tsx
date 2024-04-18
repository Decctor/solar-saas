import React from 'react'
import GoalTrackingBar from '../GoalTrackingBar'
import { formatNameAsInitials } from '@/lib/methods/formatting'
import { getUserAvatarUrl } from '@/lib/methods/extracting'
import { IUsuario } from '@/utils/models'
import Avatar from '@/components/utils/Avatar'
import { GrSend } from 'react-icons/gr'
import { TSDRTeamResults } from '@/pages/api/stats/comercial-results/sales-sdr'
import { TUserDTOWithSaleGoals } from '@/utils/schemas/user.schema'
type SdrSentCardProps = {
  stats?: TSDRTeamResults
  promoters: TUserDTOWithSaleGoals[]
}

function getSDRSendInfoOrdenated({ stats }: { stats?: TSDRTeamResults }) {
  if (!stats) return []
  const statsAsList = Object.entries(stats).map(([key, value]) => {
    const sdrName = key

    const goal = value.projetosEnviados.objetivo
    const hit = value.projetosEnviados.atingido
    var percentage = 0

    if (goal != 0) {
      if (hit != 0) percentage = hit / goal
      else percentage = 0
    } else {
      if (hit != 0) percentage = 1
      else percentage = 0
    }
    percentage = percentage * 100
    const byPromoter = Object.entries(value['POR VENDEDOR']).map(([key, value]) => ({ vendedor: key, recebido: value }))
    return {
      nome: sdrName,
      objetivo: goal,
      atingido: hit,
      percentual: percentage,
      porVendedor: byPromoter,
    }
  })
  const orderedStatsList = statsAsList.sort((a, b) => {
    return b.atingido - a.atingido
  })
  return orderedStatsList
}
function SdrSentCard({ stats, promoters }: SdrSentCardProps) {
  return (
    <div className="flex h-[400px] max-h-[600px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-6 shadow-sm lg:h-[600px] lg:w-[50%]">
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-medium uppercase tracking-tight">Projetos Enviados</h1>
        <GrSend />
      </div>
      <div className="overscroll-y mt-2 flex w-full grow flex-col overflow-y-auto px-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
        {getSDRSendInfoOrdenated({ stats: stats })?.map((promoter, index) => (
          <div className="flex w-full flex-col gap-1">
            <div key={index} className="flex w-full items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex md:hidden">
                  <Avatar
                    url={getUserAvatarUrl({ userName: promoter.nome, users: promoters })}
                    height={20}
                    width={20}
                    fallback={formatNameAsInitials(promoter.nome)}
                  />
                </div>
                <p className="hidden min-w-[150px] max-w-[150px] font-medium uppercase tracking-tight text-gray-500 md:flex lg:text-sm">{promoter.nome}</p>
              </div>
              <div className="grow">
                <GoalTrackingBar
                  barBgColor="black"
                  goalText={`${promoter.objetivo} kWp`}
                  barHeigth="25px"
                  valueGoal={promoter.objetivo}
                  valueHit={promoter.atingido}
                />
              </div>
            </div>
            {promoter.porVendedor.map((seller) => (
              <div className="flex w-full justify-between">
                <p className="pl-4 text-xxs font-medium uppercase tracking-tight text-gray-500 lg:text-xs">{seller.vendedor}</p>
                <h1 className="text-xs font-medium uppercase tracking-tight">{seller.recebido as number}</h1>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SdrSentCard
