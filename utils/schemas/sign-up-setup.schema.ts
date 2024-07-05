import { z } from 'zod'

const GeneralSignUpSetupSchema = z.object({
  usuario: z.object({
    nome: z.string({
      required_error: 'Nome do usuário não informado.',
      invalid_type_error: 'Tipo não válido para nome do usuário.',
    }),
    email: z.string({
      required_error: 'Email do usuário não informado.',
      invalid_type_error: 'Tipo não válido para email do usuário.',
    }),
    telefone: z.string({
      required_error: 'Telefone do usuário não informado.',
      invalid_type_error: 'Tipo não válido para telefone do usuário.',
    }),
  }),
  parceiro: z.object({
    id: z
      .string({
        required_error: 'ID do parceiro não informado.',
        invalid_type_error: 'Tipo não válido para ID do parceiro.',
      })
      .nullable()
      .optional(),
    nome: z.string({
      required_error: 'Nome do parceiro não informado.',
      invalid_type_error: 'Tipo não válido para nome do parceiro.',
    }),
    telefone: z.string({
      required_error: 'Telefone do parceiro não informado.',
      invalid_type_error: 'Tipo não válido para telefone do parceiro.',
    }),
    email: z.string({
      required_error: 'Email do parceiro não informado.',
      invalid_type_error: 'Tipo não válido para email do parceiro.',
    }),
    cpfCnpj: z.string({
      required_error: 'CPF/CNPJ do parceiro não informado.',
      invalid_type_error: 'Tipo não válido para CPF/CNPJ do parceiro.',
    }),
    cep: z
      .string({
        required_error: 'CEP do parceiro não informado.',
        invalid_type_error: 'Tipo não válido para CEP do parceiro.',
      })
      .nullable()
      .optional(),
    uf: z
      .string({
        required_error: 'UF do parceiro não informado.',
        invalid_type_error: 'Tipo não válido para UF do parceiro.',
      })
      .nullable()
      .optional(),
    cidade: z
      .string({
        required_error: 'Cidade do parceiro não informado.',
        invalid_type_error: 'Tipo não válido para cidade do parceiro.',
      })
      .nullable()
      .optional(),
  }),
  quantidadeUsuarios: z.number({
    required_error: 'Quantidade de usuários não informada.',
    invalid_type_error: 'Tipo não válido para quantidade de usuários.',
  }),
  estagiosCadastro: z.object({
    inicio: z
      .string({
        required_error: 'Estágio de início do cadastro não informado.',
        invalid_type_error: 'Tipo não válido para estágio de início do cadastro.',
      })
      .nullable()
      .optional(),
    detalhesParceiro: z
      .string({
        required_error: 'Estágio de detalhes do parceiro não informado.',
        invalid_type_error: 'Tipo não válido para estágio de detalhes do parceiro.',
      })
      .nullable()
      .optional(),
    usuarios: z
      .string({
        required_error: 'Estágio de usuários não informado.',
        invalid_type_error: 'Tipo não válido para estágio de usuários.',
      })
      .nullable()
      .optional(),
  }),
})

export const InsertSignUpSetupSchema = z.object({
  usuario: z.object({
    nome: z.string({
      required_error: 'Nome do usuário não informado.',
      invalid_type_error: 'Tipo não válido para nome do usuário.',
    }),
    email: z.string({
      required_error: 'Email do usuário não informado.',
      invalid_type_error: 'Tipo não válido para email do usuário.',
    }),
    telefone: z.string({
      required_error: 'Telefone do usuário não informado.',
      invalid_type_error: 'Tipo não válido para telefone do usuário.',
    }),
  }),
  parceiro: z.object({
    id: z
      .string({
        required_error: 'ID do parceiro não informado.',
        invalid_type_error: 'Tipo não válido para ID do parceiro.',
      })
      .nullable()
      .optional(),
    nome: z.string({
      required_error: 'Nome do parceiro não informado.',
      invalid_type_error: 'Tipo não válido para nome do parceiro.',
    }),
    telefone: z.string({
      required_error: 'Telefone do parceiro não informado.',
      invalid_type_error: 'Tipo não válido para telefone do parceiro.',
    }),
    email: z.string({
      required_error: 'Email do parceiro não informado.',
      invalid_type_error: 'Tipo não válido para email do parceiro.',
    }),
    cpfCnpj: z.string({
      required_error: 'CPF/CNPJ do parceiro não informado.',
      invalid_type_error: 'Tipo não válido para CPF/CNPJ do parceiro.',
    }),
    cep: z
      .string({
        required_error: 'CEP do parceiro não informado.',
        invalid_type_error: 'Tipo não válido para CEP do parceiro.',
      })
      .nullable()
      .optional(),
    uf: z
      .string({
        required_error: 'UF do parceiro não informado.',
        invalid_type_error: 'Tipo não válido para UF do parceiro.',
      })
      .nullable()
      .optional(),
    cidade: z
      .string({
        required_error: 'Cidade do parceiro não informado.',
        invalid_type_error: 'Tipo não válido para cidade do parceiro.',
      })
      .nullable()
      .optional(),
  }),
  quantidadeUsuarios: z.number({
    required_error: 'Quantidade de usuários não informada.',
    invalid_type_error: 'Tipo não válido para quantidade de usuários.',
  }),
  estagiosCadastro: z.object({
    inicio: z
      .string({
        required_error: 'Estágio de início do cadastro não informado.',
        invalid_type_error: 'Tipo não válido para estágio de início do cadastro.',
      })
      .nullable()
      .optional(),
    detalhesParceiro: z
      .string({
        required_error: 'Estágio de detalhes do parceiro não informado.',
        invalid_type_error: 'Tipo não válido para estágio de detalhes do parceiro.',
      })
      .nullable()
      .optional(),
    usuarios: z
      .string({
        required_error: 'Estágio de usuários não informado.',
        invalid_type_error: 'Tipo não válido para estágio de usuários.',
      })
      .nullable()
      .optional(),
  }),
})
export type TSignUpSetup = z.infer<typeof GeneralSignUpSetupSchema>
export type TSignUpSetupWithHolder = TSignUpSetup & { setupId?: string }
