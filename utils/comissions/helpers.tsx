import { getAllValueCombinations } from '@/lib/methods/array-manipulation'
import { TComissionScenarioConditionType, TUserComission } from '../schemas/user.schema'
import { OpportunityResponsibilityRoles, OpportunityResponsibilityRolesCombinations } from '../select-options'
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
  { label: 'COMBINAÇÃO DE RESPONSÁVEIS', value: 'combinacaoResponsaveis', types: ['IGUAL_TEXTO'] },
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

type FormatComissionSccenarioConditionValueParams = {
  conditionVariable: keyof TComissionConditionData
  conditionValue: string
}
export function formatComissionSccenarioConditionValue({ conditionValue, conditionVariable }: FormatComissionSccenarioConditionValueParams) {
  if (conditionVariable == 'combinacaoResponsaveis') {
    return OpportunityResponsibilityRolesCombinations.find((c) => c == conditionValue) || 'NÃO DEFINIDO'
  }
  if (conditionVariable == 'potenciaPico') return conditionValue.toString()
  if (conditionVariable == 'valorProposta') return conditionValue.toString()
}

type GetConditionOptions = {
  variable: keyof TComissionConditionData
}
export function getComissionScenarioConditionOptions({ variable }: GetConditionOptions) {
  if (variable == 'combinacaoResponsaveis') return OpportunityResponsibilityRolesCombinations.map((c, index) => ({ id: index + 1, label: c, value: c }))
  return []
}

type RenderComissionScenarioConditionPhraseParams = {
  condition: TUserComission['resultados'][number]['condicao']
}
export function renderComissionScenarioConditionPhrase({ condition }: RenderComissionScenarioConditionPhraseParams) {
  const isConditionAplicable = condition.aplicavel
  const conditionType = condition.tipo
  const conditionAlias = formatCondition(condition.variavel || '')
  if (!isConditionAplicable) return <h1 className="text-start text-sm font-bold leading-none tracking-tight text-cyan-500">FÓRMULA GERAL:</h1>
  if (!conditionType || conditionType == 'IGUAL_TEXTO' || conditionType == 'IGUAL_NÚMERICO')
    return (
      <h1 className="text-start text-sm font-bold leading-none tracking-tight text-cyan-500">
        SE <strong className="text-[#fead41]">{formatCondition(condition.variavel || '')}</strong> FOR IGUAL A{' '}
        <strong className="text-[#fead41]">
          {formatComissionSccenarioConditionValue({
            conditionVariable: condition.variavel as keyof TComissionConditionData,
            conditionValue: condition.igual || '',
          })}
        </strong>
        :
      </h1>
    )
  if (conditionType == 'MAIOR_QUE_NÚMERICO')
    return (
      <h1 className="text-start text-sm font-bold leading-none tracking-tight text-cyan-500">
        {`SE ${formatCondition(condition.variavel || '')} FOR MAIOR QUE ${condition.maiorQue || 0}:`}
      </h1>
    )
  if (conditionType == 'MENOR_QUE_NÚMERICO')
    return (
      <h1 className="text-start text-sm font-bold leading-none tracking-tight text-cyan-500">
        {`SE ${formatCondition(condition.variavel || '')} FOR MENOR QUE ${condition.menorQue || 0}:`}
      </h1>
    )
  if (conditionType == 'INTERVALO_NÚMERICO')
    return (
      <h1 className="text-start text-sm font-bold leading-none tracking-tight text-cyan-500">
        {`SE ${formatCondition(condition.variavel || '')} ESTIVER ENTRE ${condition.entre?.minimo || 0} E ${condition.entre?.maximo || 0}:`}
      </h1>
    )
  const conditionValues = condition.inclui ? condition.inclui.join(', ') : ''
  if (conditionType == 'INCLUI_LISTA')
    return (
      <h1 className="text-start text-sm font-bold leading-none tracking-tight text-cyan-500">
        {`SE ${formatCondition(condition.variavel || '')} FOR UMA DAS OPÇÕES A SEGUIR ${conditionValues}:`}
      </h1>
    )
}
