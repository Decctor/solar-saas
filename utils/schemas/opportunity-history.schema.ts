import { ObjectId } from 'mongodb'
import z from 'zod'

const GeneralOpportunityAnnotation = z.object({
  oportunidade: z.object({
    id: z.string({ required_error: 'ID da oportunidade não vinculado.', invalid_type_error: 'Tipo não válido para o ID da oportunidade.' }),
    nome: z.string({ required_error: 'Nome da oportunidade não vinculado.', invalid_type_error: 'Tipo não válido para o nome da oportunidade.' }),
    identificador: z.string({
      required_error: 'Identificador da oportunidade não vinculado.',
      invalid_type_error: 'Tipo não válido para o identificador da oportunidade.',
    }),
  }),
  idParceiro: z.string({
    required_error: 'Referência a parceiro não informado.',
    invalid_type_error: 'Tipo não válido para a referência de parceiro.',
  }),
  categoria: z.literal('ANOTAÇÃO', {
    required_error: 'Categoria da anotação não vinculado.',
    invalid_type_error: 'Tipo não válido para o categoria da anotação.',
  }),
  conteudo: z.string({
    required_error: 'Conteúdo não informada.',
    invalid_type_error: 'Tipo não válido para o conteúdo.',
  }),
  autor: z.object({
    id: z.string({
      required_error: 'ID do criador da anotação não informado.',
      invalid_type_error: 'Tipo não válido para id do criador da anotação.',
    }),
    nome: z.string({
      required_error: 'Nome do criador da anotação não informado.',
      invalid_type_error: 'Tipo não válido para nome do criador da anotação.',
    }),
    avatar_url: z.string().optional().nullable(),
  }),
  dataInsercao: z
    .string({
      required_error: 'Data de inserção não informado.',
      invalid_type_error: 'Tipo não válido para a data de inserção.',
    })
    .datetime({ message: 'Tipo não válido para a data de inserção.' }),
})

export type TOpportunityAnnotation = z.infer<typeof GeneralOpportunityAnnotation>

const GeneralOpportunityHistorySchema = GeneralOpportunityAnnotation //z.union([GeneralOpportunityActivity, GeneralOpportunityAnnotation])

export const InsertOpportunityHistorySchema = GeneralOpportunityAnnotation // z.union([GeneralOpportunityActivity, GeneralOpportunityAnnotation])
export const UpdateOpportunityHistorySchema = GeneralOpportunityAnnotation.partial() // z.union([GeneralOpportunityActivity.partial(), GeneralOpportunityAnnotation.partial()])

export type TOpportunityHistory = z.infer<typeof GeneralOpportunityHistorySchema>

export type TOpportunityHistoryEntity = TOpportunityHistory & { _id: ObjectId }

export type TOpportunityHistoryDTO = TOpportunityHistory & { _id: string }
