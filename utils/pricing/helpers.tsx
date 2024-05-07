import { TPricingConditionData, TPricingVariableData } from './methods'

type TVariablesAlias = { label: string; value: keyof TPricingVariableData; type: 'general' | 'technical-analysis' | 'cumulative' }
export const variablesAlias: TVariablesAlias[] = [
  { label: 'VALOR DO KIT', value: 'kit', type: 'general' },
  { label: 'VALOR DO PLANO', value: 'plan', type: 'general' }, // DISABLED WHILE PLANS FUNCTIONALITY IS NOT WORKING YET
  { label: 'VALOR DO PRODUTO', value: 'product', type: 'general' },
  { label: 'VALOR DO SERVIÇO', value: 'service', type: 'general' },
  { label: 'Nº DE MÓDULOS', value: 'numModulos', type: 'general' },
  { label: 'Nº DE INVERSORES', value: 'numInversores', type: 'general' },
  { label: 'POTÊNCIA PICO', value: 'potenciaPico', type: 'general' },
  { label: 'DISTÂNCIA', value: 'distancia', type: 'general' },
  { label: 'VALOR DE REFERÊNCIA', value: 'valorReferencia', type: 'general' },
  { label: 'CUSTOS DE INSTALAÇÃO', value: 'custosInstalacao', type: 'technical-analysis' },
  { label: 'CUSTOS DE PADRÃO', value: 'custosPadraoEnergia', type: 'technical-analysis' },
  { label: 'CUSTOS DE ESTRUTURA', value: 'custosEstruturaInstalacao', type: 'technical-analysis' },
  { label: 'OUTROS CUSTOS', value: 'custosOutros', type: 'technical-analysis' },
  { label: 'TOTAL FINAL', value: 'total', type: 'cumulative' },
  { label: 'TOTAL FATURÁVEL FINAL', value: 'totalFaturavelFinal', type: 'cumulative' },
  { label: 'TOTAL NÃO FATURÁVEL FINAL', value: 'totalNaoFaturavelFinal', type: 'cumulative' },
  { label: 'TOTAL DE CUSTOS FATURÁVEIS', value: 'totalFaturavelCustos', type: 'cumulative' },
  { label: 'TOTAL DE CUSTOS NÃO FATURÁVEIS', value: 'totalNaoFaturavelCustos', type: 'cumulative' },
]
export const cumulativeVariablesValues = variablesAlias.filter((v) => v.type == 'cumulative').map((v) => v.value) as string[]
type TConditionsAlias = { label: string; value: keyof TPricingConditionData }
export const conditionsAlias: TConditionsAlias[] = [
  { label: 'ESTADO', value: 'uf' },
  { label: 'CIDADE', value: 'cidade' },
  { label: 'TOPOLOGIA', value: 'topologia' },
  { label: 'TIPO DE ESTRUTURA', value: 'tipoEstrutura' },
  { label: 'GRUPO DA INSTALAÇÃO', value: 'grupoInstalacao' },
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
