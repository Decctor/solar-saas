import { TComissionScenarioConditionType } from '../schemas/user.schema'
import { OpportunityResponsibilityRoles } from '../select-options'
import { TComissionConditionData, TComissionVariableData } from './methods'

type TComissionVariablesAlias = { label: string; value: keyof TComissionVariableData }

export const comissionVariablesAlias: TComissionVariablesAlias[] = [
  { label: 'VALOR DA PROPOSTA', value: 'valorProposta' },
  { label: 'POTÊNCIA DA PROPOSTA', value: 'potenciaPico' },
]

type TConditionsAlias = {
  label: string
  value: keyof TComissionConditionData
  types: TComissionScenarioConditionType[]
}
export const comissionConditionsAlias: TConditionsAlias[] = [
  { label: 'VALOR DA PROPOSTA', value: 'valorProposta', types: ['IGUAL_NÚMERICO', 'MAIOR_QUE_NÚMERICO', 'MENOR_QUE_NÚMERICO', 'INTERVALO_NÚMERICO'] },
  { label: 'POTÊNCIA DA PROPOSTA', value: 'potenciaPico', types: ['IGUAL_NÚMERICO', 'MAIOR_QUE_NÚMERICO', 'MENOR_QUE_NÚMERICO', 'INTERVALO_NÚMERICO'] },
  { label: 'CORRESPONSÁVEIS', value: 'corresponsaveis', types: ['INCLUI_LISTA'] },
]
export function formatComissionFormulaItem(value: string) {
  if (value.includes('[') && value.includes(']')) {
    const variable = comissionVariablesAlias.find((c) => c.value == value.replace('[', '').replace(']', ''))
    if (!variable) return 'NÃO DEFINIDO'
    return variable.label
  }
  return value
}

export function formatCondition(value: string) {
  const condition = comissionConditionsAlias.find((c) => c.value == value)
  if (!condition) return 'NÃO DEFINIDO'
  return condition.label
}
type GetConditionOptions = {
  variable: keyof TComissionConditionData
}
export function getComissionScenarioConditionOptions({ variable }: GetConditionOptions) {
  if (variable == 'corresponsaveis') return OpportunityResponsibilityRoles
  return []
}
