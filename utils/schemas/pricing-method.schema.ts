import z from 'zod'

const PricingMethodItemResultItem = z.object({
  condicao: z.object({
    aplicavel: z.boolean({
      required_error: 'Aplicabilidade de condição no resultado não informada.',
      invalid_type_error: 'Tipo não válido para aplicabilidade de condição no resultado.',
    }),
    variavel: z
      .string({
        required_error: 'Variável de condição no resultado não informada.',
        invalid_type_error: 'Tipo não válido para variável de condição no resultado.',
      })
      .optional()
      .nullable(),
    igual: z
      .string({
        required_error: 'Valor de comparação de igualdade da condição não informado.',
        invalid_type_error: 'Tipo não válido para o valor de comparação de igualdade da condição.',
      })
      .optional()
      .nullable(),
  }),
  faturavel: z.boolean({ required_error: 'Tag de faturável não informada.', invalid_type_error: 'Tipo não válido para tag de faturável.' }),
  margemLucro: z.number({ required_error: 'Margem de lucro do item não informada.', invalid_type_error: 'Margem de lucro do item não informada.' }),
  formulaArr: z.array(z.string({ required_error: 'Item da fórmula não informada.', invalid_type_error: 'Tipo não válido para item da fórmula.' })),
})
export type TPricingMethodItemResultItem = z.infer<typeof PricingMethodItemResultItem>
const PricingMethodItem = z.object({
  nome: z.string({ required_error: 'Nome do item de precificação não informado.', invalid_type_error: 'Tipo não válido para o nome do item de precificação.' }),
  resultados: z.array(PricingMethodItemResultItem),
})

const GeneralPricingMethodSchema = z.object({
  nome: z.string(),
  idParceiro: z.string(),
  itens: z.array(PricingMethodItem),
  autor: z.object({
    id: z.string(),
    nome: z.string(),
    avatar_url: z.string().optional().nullable(),
  }),
  dataInsercao: z.string().datetime(),
})

export const InsertPricingMethodSchema = z.object({
  nome: z
    .string({
      required_error: 'Nome da metodologia de precificação não informado.',
      invalid_type_error: 'Tipo não válido para o nome da metodologia de precificação.',
    })
    .min(2, 'Por favor, preencha um nome de ao menos 2 letras para o metodologia.'),
  idParceiro: z.string({
    required_error: 'Referência a parceiro não informado.',
    invalid_type_error: 'Tipo não válido para a referência de parceiro.',
  }),
  itens: z.array(PricingMethodItem).min(1, 'Defina ao menos um item de unidade de preço.'),
  autor: z.object({
    id: z.string({
      required_error: 'ID do criador da oportunidade não informado.',
      invalid_type_error: 'Tipo não válido para id do criador da oportunidade.',
    }),
    nome: z.string({
      required_error: 'Nome do criador da oportunidade não informado.',
      invalid_type_error: 'Tipo não válido para nome do criador da oportunidade.',
    }),
    avatar_url: z.string().optional().nullable(),
  }),
  dataInsercao: z.string().datetime(),
})

export type TPricingMethod = z.infer<typeof GeneralPricingMethodSchema>

export type TPricingMethodDTO = TPricingMethod & { _id: string }

export const PricingMethodologyReferenceSchema = z.string({
  required_error: 'ID de referência de metodologia de precificação não informado.',
  invalid_type_error: 'Tipo não válido para o ID de referência de metodologia.',
  description: 'Referência de metódo de precificação.',
})

export const OnlyKitPricingMethodReference = process.env.ONLY_KIT_PRICING_METHOD
