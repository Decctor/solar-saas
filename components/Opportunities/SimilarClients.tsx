import { IClient, IResponsible } from '@/utils/models'
import { isError } from 'lodash'
import React from 'react'
import ErrorComponent from '../utils/ErrorComponent'
import LoadingComponent from '../utils/LoadingComponent'
import SimilarClient from '../Cards/SimilarClient'
import { TSimilarClientSimplifiedDTO } from '@/utils/schemas/client.schema'

type SimilarClientsProps = {
  clients: TSimilarClientSimplifiedDTO[]
  selectedClientId: string | null
  isSuccess: boolean
  isLoading: boolean
  isError: boolean
  handleSelectSimilarClient: (client: TSimilarClientSimplifiedDTO) => void
}
function SimilarClients({ clients, selectedClientId, isSuccess, isLoading, isError, handleSelectSimilarClient }: SimilarClientsProps) {
  return (
    <div className="flex w-full grow flex-col items-center">
      <h1 className="w-full text-center font-sans text-xl font-bold text-[#353432]">CLIENTES SIMILARES</h1>
      <div className="flex w-full grow flex-col gap-2 overflow-y-auto overscroll-y-auto p-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
        {isError ? <ErrorComponent msg="Erro ao buscar clientes similares..." /> : null}
        {isLoading ? <LoadingComponent /> : null}
        {isSuccess ? (
          clients && clients.length > 0 ? (
            clients.map((client) => <SimilarClient client={client} selectedClientId={selectedClientId} handleSelectSimilarClient={handleSelectSimilarClient} />)
          ) : (
            <p className="flex w-full grow items-center justify-center py-2 text-center font-medium italic tracking-tight text-gray-500">
              Nenhum cliente similar encontrado.
            </p>
          )
        ) : null}
      </div>
    </div>
  )
}

export default SimilarClients
