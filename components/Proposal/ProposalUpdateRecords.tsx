import { useProposalUpdateRecords } from '@/utils/queries/proposal-update-records'
import React from 'react'
import LoadingComponent from '../utils/LoadingComponent'
import ErrorComponent from '../utils/ErrorComponent'
import { BsCalendarPlus } from 'react-icons/bs'
import { formatDateAsLocale, formatToMoney } from '@/lib/methods/formatting'
import Avatar from '../utils/Avatar'
import { MdArrowCircleDown, MdArrowCircleUp } from 'react-icons/md'
import ProposalUpdateRecord from '../Cards/ProposalUpdateRecord'

type ProposalUpdateRecordsProps = {
  proposalId: string
}
function ProposalUpdateRecords({ proposalId }: ProposalUpdateRecordsProps) {
  const { data: records, isLoading, isError, isSuccess } = useProposalUpdateRecords({ proposalId })
  return (
    <div className="mt-2 flex w-full flex-col gap-1 rounded border border-gray-500 bg-[#fff] shadow-md">
      <h1 className="w-full bg-yellow-500 p-2 text-center font-bold">REGISTROS DE ALTERAÇÃO</h1>
      <div className="flex min-h-[50px] w-full flex-col gap-2 p-2">
        {isLoading ? <LoadingComponent /> : null} {isError ? <ErrorComponent msg="Erro ao buscar registros de alteração." /> : null}
        {isSuccess ? (
          records.length > 0 ? (
            records.map((record) => <ProposalUpdateRecord key={record._id} record={record} />)
          ) : (
            <p className="flex w-full grow items-center justify-center py-2 text-center font-medium italic tracking-tight text-gray-500">
              Sem registros de alteração.
            </p>
          )
        ) : null}
      </div>
    </div>
  )
}

export default ProposalUpdateRecords
