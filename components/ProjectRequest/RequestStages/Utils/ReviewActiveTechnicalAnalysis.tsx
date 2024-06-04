import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingComponent from '@/components/utils/LoadingComponent'
import { useTechnicalAnalysisById } from '@/utils/queries/technical-analysis'
import React from 'react'
import ActiveTechnicalAnalysis from './ActiveTechnicalAnalysis'

type ReviewActiveTechnicalAnalysisProps = {
  analysisId: string
  userHasPricingViewPermission: boolean
}
function ReviewActiveTechnicalAnalysis({ analysisId, userHasPricingViewPermission }: ReviewActiveTechnicalAnalysisProps) {
  const { data: analysis, isLoading, isError, isSuccess } = useTechnicalAnalysisById({ id: analysisId })
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="w-full rounded bg-gray-800 p-1 text-center font-bold text-white">INFORMAÇÕES DA ANÁLISE TÉCNICA</h1>
      <div className="flex w-full flex-col gap-2">
        {isLoading ? <LoadingComponent /> : null}
        {isError ? <ErrorComponent msg="Oops, houve um erro ao buscar informações da análise técnica escolhida." /> : null}
        {isSuccess ? (
          <div className="mb-6 flex w-full flex-col items-center justify-center rounded border border-green-500">
            <h1 className="w-full rounded-md rounded-tl rounded-tr bg-green-500 p-1 text-center text-sm font-bold text-white">ANÁLISE TÉCNICA ATIVA</h1>
            <div className="flex w-full items-center justify-center p-2">
              <ActiveTechnicalAnalysis analysis={analysis} userHasPricingViewPermission={userHasPricingViewPermission} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ReviewActiveTechnicalAnalysis
