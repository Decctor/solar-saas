import { z } from 'zod'
import { SaleCategorySchema } from './opportunity.schema'
import { AuthorSchema } from './user.schema'

const GeneralProjectTypeSchema = z.object({
  idParceiro: z.string({
    required_error: 'ID de referência do parceiro não informado.',
    invalid_type_error: 'Tipo não válido para o ID de referência do parceiro.',
  }),
  nome: z.string({ required_error: 'Nome do tipo de projeto não informado.', invalid_type_error: 'Tipo não válido para o nome do tipo de projeto.' }),
  categoriaVenda: SaleCategorySchema,
  dimensionamento: z.array(
    z.object({
      titulo: z.string({
        required_error: 'Título da seção de dimensionamento não informada.',
        invalid_type_error: 'Tipo não válido para o título da seção de dimensionamento.',
      }),
      campos: z.array(
        z.string({
          required_error: 'Item da lista de dimensionamento não informado.',
          invalid_type_error: 'Tipo não válido para o item de campo de dimensionamento.',
        }),
        {
          required_error: 'Lista dos campos de dimensionamento não informado.',
          invalid_type_error: 'Tipo não válido para a lista dos campos de dimensionamento.',
        }
      ),
    })
  ),
  modelosProposta: z.array(
    z.object({
      titulo: z.string({ required_error: 'Título do modelo de proposta não informado.' }),
      idAnvil: z.string({ required_error: 'ID de referência da integração do modelo não fornecido.' }),
    })
  ),
  autor: AuthorSchema,
  dataInsercao: z
    .string({ required_error: 'Data de inserção não informada.', invalid_type_error: 'Tipo não válido para a data de inserção.' })
    .datetime({ message: 'Tipo inválido para data de inserção.' }),
})

export const InsertProjectTypeSchema = z.object({
  idParceiro: z.string({
    required_error: 'ID de referência do parceiro não informado.',
    invalid_type_error: 'Tipo não válido para o ID de referência do parceiro.',
  }),
  nome: z.string({ required_error: 'Nome do tipo de projeto não informado.', invalid_type_error: 'Tipo não válido para o nome do tipo de projeto.' }),
  categoriaVenda: SaleCategorySchema,
  dimensionamento: z.array(
    z.object({
      titulo: z.string({
        required_error: 'Título da seção de dimensionamento não informada.',
        invalid_type_error: 'Tipo não válido para o título da seção de dimensionamento.',
      }),
      campos: z.array(
        z.string({
          required_error: 'Item da lista de dimensionamento não informado.',
          invalid_type_error: 'Tipo não válido para o item de campo de dimensionamento.',
        }),
        {
          required_error: 'Lista dos campos de dimensionamento não informado.',
          invalid_type_error: 'Tipo não válido para a lista dos campos de dimensionamento.',
        }
      ),
    })
  ),
  modelosProposta: z.array(
    z.object({
      titulo: z.string({ required_error: 'Título do modelo de proposta não informado.' }),
      idAnvil: z.string({ required_error: 'ID de referência da integração do modelo não fornecido.' }),
    })
  ),
  autor: AuthorSchema,
  dataInsercao: z
    .string({ required_error: 'Data de inserção não informada.', invalid_type_error: 'Tipo não válido para a data de inserção.' })
    .datetime({ message: 'Tipo inválido para data de inserção.' }),
})

export type TProjectType = z.infer<typeof GeneralProjectTypeSchema>
export type TProjectTypeDTO = TProjectType & { _id: string }
