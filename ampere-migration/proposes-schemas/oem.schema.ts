import { AuthorSchema } from '@/utils/schemas/user.schema'
import { z } from 'zod'

const GeneralOeMProposeSchema = z.object({
  nome: z.string(),
  idParceiro: z.string(),
  template: z.string(),
  projeto: z.object({
    id: z.string(),
    nome: z.string(),
  }),
  autor: AuthorSchema,
  premissas: z.object({
    consumoEnergiaMensal: z.number(),
    tarifaEnergia: z.number(),
    distancia: z.number(),
    qtdeModulos: z.number(),
    potModulos: z.number(),
    eficienciaAtual: z.number(),
  }),
  precificacao: z.object({
    manutencaoSimples: z.object({
      vendaProposto: z.number(),
      vendaFinal: z.number(),
    }),
    planoSol: z.object({
      vendaProposto: z.number(),
      vendaFinal: z.number(),
    }),
    planoSolPlus: z.object({
      vendaProposto: z.number(),
      vendaFinal: z.number(),
    }),
  }),
  potenciaPico: z.number().optional().nullable(),
  valorProposta: z.number().optional().nullable(),
  linkArquivo: z.string().optional().nullable(),
  idPlanoEscolhido: z.number().optional().nullable(),
  dataInsercao: z.string(),
})

export type TOeMPropose = z.infer<typeof GeneralOeMProposeSchema>
