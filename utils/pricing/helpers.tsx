import { TPricingConditionData, TPricingVariableData } from './methods'

type TVariablesAlias = { label: string; value: keyof TPricingVariableData }
export const variablesAlias: TVariablesAlias[] = [
  { label: 'VALOR DO KIT', value: 'kit' },
  { label: 'VALOR DO PLANO', value: 'plan' }, // DISABLED WHILE PLANS FUNCTIONALITY IS NOT WORKING YET
  { label: 'VALOR DO PRODUTO', value: 'product' },
  { label: 'VALOR DO SERVIÇO', value: 'service' },
  { label: 'Nº DE MÓDULOS', value: 'numModulos' },
  { label: 'Nº DE INVERSORES', value: 'numInversores' },
  { label: 'POTÊNCIA PICO', value: 'potenciaPico' },
  { label: 'DISTÂNCIA', value: 'distancia' },
  { label: 'TOTAL FINAL', value: 'total' },
  { label: 'TOTAL FATURÁVEL FINAL', value: 'totalFaturavelFinal' },
  { label: 'TOTAL NÃO FATURÁVEL FINAL', value: 'totalNaoFaturavelFinal' },
  { label: 'TOTAL DE CUSTOS FATURÁVEIS', value: 'totalFaturavelCustos' },
  { label: 'TOTAL DE CUSTOS NÃO FATURÁVEIS', value: 'totalNaoFaturavelCustos' },
]

type TConditionsAlias = { label: string; value: keyof TPricingConditionData }
export const conditionsAlias: TConditionsAlias[] = [
  { label: 'ESTADO', value: 'uf' },
  { label: 'CIDADE', value: 'cidade' },
  { label: 'TOPOLOGIA', value: 'topologia' },
  { label: 'TIPO DE ESTRUTURA', value: 'tipoEstrutura' },
]

export function formatFormulaItem(value: string) {
  if (value.includes('[') && value.includes(']')) {
    const variable = variablesAlias.find((c) => c.value == value.replace('[', '').replace(']', ''))
    if (!variable) return 'NÃO DEFINIDO'
    return variable.label
  }
  return value
}
export function formatCondition(value: string) {
  const condition = conditionsAlias.find((c) => c.value == value)
  if (!condition) return 'NÃO DEFINIDO'
  return condition.label
}
