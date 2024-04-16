import { z } from 'zod'
import { AuthorSchema } from './user.schema'

const GeneralRevenueSchema = z.object({
  descricao: z.string(),
  tipo: z.string(),
  projeto: z.object({
    id: z.string(),
    nome: z.string(),
    identificador: z.string(),
  }),
  itens: z
    .array(
      z.object({
        descricao: z.string(),
        preco: z.number(),
        qtde: z.number(),
      })
    )
    .optional()
    .nullable(),
  total: z.number(),
  efetivacao: z.object({
    efetivado: z.boolean(),
    data: z.string().datetime().optional().nullable(),
  }),
  criterioReferencia: z.boolean(),
  criterioCompetencia: z.boolean(),
  autor: AuthorSchema,
  dataInsercao: z.string().datetime().optional().nullable(),
})
