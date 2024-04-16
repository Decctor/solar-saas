import { z } from 'zod'

export const ModuleSchema = z.object({
  id: z.union([z.string(), z.number()]),
  fabricante: z.string(),
  modelo: z.string(),
  qtde: z.number(),
  potencia: z.number(),
  garantia: z.number(),
})
export type TModule = z.infer<typeof ModuleSchema>
export const InverterSchema = z.object({
  id: z.union([z.string(), z.number()]),
  fabricante: z.string(),
  modelo: z.string(),
  qtde: z.number(),
  potenciaNominal: z.number(),
  garantia: z.number(),
})
export type TInverter = z.infer<typeof InverterSchema>

const PricingItemSchema = z.object({
  margemLucro: z.number(),
  faturavel: z.boolean().optional().nullable(),
  imposto: z.number(),
  custo: z.number(),
  vendaProposto: z.number(),
  vendaFinal: z.number(),
})
export type TPricingItem = z.infer<typeof PricingItemSchema>

export const GeneralSolarSystemProposeSchema = z.object({
  nome: z.string(),
  idParceiro: z.string(),
  idHomologacao: z.string().optional().nullable(),
  template: z.string(),
  projeto: z.object({
    nome: z.string(),
    id: z.string(),
    tipo: z.string(),
  }),
  premissas: z.object({
    consumoEnergiaMensal: z.number(),
    fatorSimultaneidade: z.number(),
    distribuidora: z.string(),
    subgrupo: z.enum(['RESIDENCIAL', 'COMERCIAL', 'RURAL']).optional().nullable(),
    tarifaEnergia: z.number(),
    tarifaTUSD: z.number(),
    tensaoRede: z.string(),
    fase: z.string(),
    tipoEstrutura: z.string(),
    orientacao: z.union(
      [
        z.literal('LESTE'),
        z.literal('NORDESTE'),
        z.literal('NORTE'),
        z.literal('NOROESTE'),
        z.literal('OESTE'),
        z.literal('SUDOESTE'),
        z.literal('SUL'),
        z.literal('SUDESTE'),
      ],
      { invalid_type_error: 'Tipo inválido para orientação.' }
    ),
    distancia: z.number(),
  }),
  kit: z.object({
    kitId: z.array(z.string()),
    tipo: z.union([z.literal('TRADICIONAL'), z.literal('PROMOCIONAL')]),
    nome: z.string(),
    topologia: z.string(),
    modulos: z.array(ModuleSchema),
    inversores: z.array(InverterSchema),
    fornecedor: z.string(),
    preco: z.number(),
  }),
  precificacao: z.record(PricingItemSchema),
  linkArquivo: z.string().optional().nullable(),
  potenciaPico: z.number().optional().nullable(),
  valorProposta: z.number().optional().nullable(),
  autor: z.object({
    id: z.string(),
    nome: z.string(),
    avatar_url: z.string().optional().nullable(),
  }),
  dataInsercao: z.string().datetime(),
})

export type TSolarSystemPropose = z.infer<typeof GeneralSolarSystemProposeSchema>

export type TSolarSystemProposeDTO = TSolarSystemPropose & { _id: string }
