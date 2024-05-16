import { stateCities } from '../estados_cidades'
import { TPartnerSimplifiedDTO } from '../schemas/partner.schema'
import { ElectricalInstallationGroups, StructureTypes } from '../select-options'
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
  { label: 'PARCEIRO', value: 'idParceiro' },
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

type FormatConditionValueParams = {
  conditionVariable: keyof TPricingConditionData
  conditionValue: string
  additional: {
    partners: TPartnerSimplifiedDTO[]
  }
}
export function formatConditionValue({ conditionVariable, conditionValue, additional }: FormatConditionValueParams) {
  if (conditionVariable == 'uf') {
    const ufLabel = Object.keys(stateCities)
      .map((k, index) => ({ id: index + 1, label: k, value: k }))
      .find((k) => k.value == conditionValue)?.label
    return ufLabel || 'NÃO DEFINIDO'
  }
  if (conditionVariable == 'cidade') {
    const cityLabel = Object.entries(stateCities)
      .map(([uf, cities]) => cities)
      .flat(1)
      .map((c, index) => ({ id: index + 1, label: c, value: c }))
      .find((c) => c.value == conditionValue)?.label
    return cityLabel || 'NÃO DEFINIDO'
  }

  if (conditionVariable == 'topologia') {
    const topologyLabel = ['INVERSOR', 'MICRO-INVERSOR']
      .map((t, index) => ({ id: index + 1, label: t, value: t }))
      .find((t) => t.value == conditionValue)?.label
    return topologyLabel || 'NÃO DEFINIDO'
  }
  if (conditionVariable == 'tipoEstrutura') {
    const structureTypeLabel = StructureTypes.find((s) => s.value == conditionValue)?.label
    return structureTypeLabel || 'NÃO DEFINIDO'
  }
  if (conditionVariable == 'grupoInstalacao') {
    const installationGroupLabel = ElectricalInstallationGroups.find((g) => g.value == conditionValue)?.label
    return installationGroupLabel || 'NÃO DEFINIDO'
  }
  if (conditionVariable == 'idParceiro') {
    const partnerLabel = additional.partners.map((p) => ({ id: p._id, label: p.nome, value: p._id })).find((p) => p.value == conditionValue)?.label
    return partnerLabel
  }
}
type GetConditionOptions = {
  variable: keyof TPricingConditionData
  additional: {
    partners: TPartnerSimplifiedDTO[]
  }
}
export function getConditionOptions({ variable, additional }: GetConditionOptions) {
  if (variable == 'uf') return Object.keys(stateCities).map((k, index) => ({ id: index + 1, label: k, value: k }))
  if (variable == 'cidade')
    return Object.entries(stateCities)
      .map(([uf, cities]) => cities)
      .flat(1)
      .map((c, index) => ({ id: index + 1, label: c, value: c }))

  if (variable == 'topologia') return ['INVERSOR', 'MICRO-INVERSOR'].map((t, index) => ({ id: index + 1, label: t, value: t }))
  if (variable == 'tipoEstrutura') return StructureTypes
  if (variable == 'grupoInstalacao') return ElectricalInstallationGroups
  if (variable == 'idParceiro') return additional.partners.map((p) => ({ id: p._id, label: p.nome, value: p._id }))
  return []
}

export const operators = ['(', ')', '/', '*', '+', '-']
