import axios from 'axios'
import { IContractRequest } from '../models'
import { updateOpportunity } from './rd-opportunities'
type HandleContractRequestParams = {
  requestInfo: IContractRequest
  projectId: string
  proposalId: string
  projectResponsibleId: string
  kitCost: number | null
  opportunityId?: string | null
  clientEmail?: string
}
export async function handleContractRequest({
  requestInfo,
  projectId,
  proposalId,
  projectResponsibleId,
  kitCost,
  opportunityId,
  clientEmail,
}: HandleContractRequestParams) {
  try {
    // Dealing with contract request it self
    const { data } = await axios.post(`/api/integration/app-ampere/contractRequest`, {
      ...requestInfo,
      previsaoValorDoKit: kitCost,
      idProjetoCRM: projectId,
      idPropostaCRM: proposalId,
    })

    // Dealing with project updates
    const projectPipelineUpdate = [
      {
        $set: {
          'funis.$[elem].etapaId': 8,
          solicitacaoContrato: {
            id: data.data,
            idProposta: proposalId,
            dataSolicitacao: new Date().toISOString(),
          },
          propostaAtiva: proposalId,
        },
      },
      {
        arrayFilters: [{ 'elem.id': 1 }],
      },
    ]
    const { data: projectUpdate } = await axios.put(`/api/projects/personalizedUpdate?id=${projectId}&responsible=${projectResponsibleId}`, {
      pipeline: projectPipelineUpdate,
    })

    // const isOpportunity = !!opportunityId
    // if (isOpportunity) {
    //   const contractValue = requestInfo.valorContrato
    //   await updateOpportunity({ operation: 'SALE', email: clientEmail || '', value: contractValue || 0 })
    // }
    return 'Contrato solicitado com sucesso !'
  } catch (error) {
    throw error
  }
}
