import { AuthorSchema } from '@/utils/schemas/user.schema'
import { z } from 'zod'

const GeneralHomologationProposeSchema = z.object({
  nome: z.string(),
  idParceiro: z.string(),
  template: z.string().optional().nullable(),
  projeto: z.object({
    id: z.string(),
    nome: z.string(),
    tipo: z.string(),
  }),
  idHomologacao: z.string(),
  premissas: z.object({
    distribuidora: z.string(),
  }),
  precificacao: z.object({
    homologacao: z.object({
      margemLucro: z.number(),
      faturavel: z.boolean().optional().nullable(),
      imposto: z.number(),
      custo: z.number(),
      vendaProposto: z.number(),
      vendaFinal: z.number(),
    }),
  }),
  autor: AuthorSchema,
  potenciaPico: z.number(),
  valorProposta: z.number(),
  dataInsercao: z.string().datetime(),
})

export type THomologationPropose = z.infer<typeof GeneralHomologationProposeSchema>

export type THomologationProposeDTO = THomologationPropose & { _id: string }
