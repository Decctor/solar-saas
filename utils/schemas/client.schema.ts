import { z } from 'zod'

const GeneralClientSchema = z.object({
  nome: z.string(),
  idParceiro: z.string(),
  cpfCnpj: z.string().optional().nullable(),
  rg: z.string().optional().nullable(),
  telefonePrimario: z.string(),
  telefoneSecundario: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  cep: z.string().optional().nullable(),
  uf: z.string(),
  cidade: z.string(),
  bairro: z.string().optional().nullable(),
  endereco: z.string().optional().nullable(),
  numeroOuIdentificador: z.string().optional().nullable(),
  complemento: z.string().optional().nullable(),
  dataNascimento: z.string().datetime().optional().nullable(),
  profissao: z.string().optional().nullable(),
  ondeTrabalha: z.string().optional().nullable(),
  estadoCivil: z.string().optional().nullable(),
  deficiencia: z.string().optional().nullable(),
  canalAquisicao: z.string(),
  dataInsercao: z.string(),
  idMarketing: z.string().optional().nullable(),
  indicador: z.object({
    nome: z.string().optional().nullable(),
    contato: z.string().optional().nullable(),
  }),
  autor: z.object({
    id: z.string(),
    nome: z.string(),
    avatar_url: z.string().optional().nullable(),
  }),
})

export const InsertClientSchema = z.object({
  nome: z
    .string({ required_error: 'Nome do cliente não informado.', invalid_type_error: 'Tipo não válido para nome do cliente.' })
    .min(3, 'É necessário um nome de ao menos 3 letras para o cliente.'),
  idParceiro: z.string({
    required_error: 'Referência a parceiro não informado.',
    invalid_type_error: 'Tipo não válido para a referência de parceiro.',
  }),
  cpfCnpj: z.string({ invalid_type_error: 'Tipo não válido para CPF/CNPJ do cliente.' }).optional().nullable(),
  rg: z.string({ invalid_type_error: 'Tipo não válido para RG do cliente.' }).optional().nullable(),
  telefonePrimario: z
    .string({
      required_error: 'Telefone primário do cliente não informado.',
      invalid_type_error: 'Tipo não válido para nome do cliente.',
    })
    .min(14, 'Formato inválido para telefone primáiro. O mínimo de caracteres é 14.'),
  telefoneSecundario: z.string().optional().nullable(),
  email: z.string({ invalid_type_error: 'Tipo não válido para email do cliente.' }).optional().nullable(),
  cep: z.string({ invalid_type_error: 'Tipo não válido para CEP do cliente.' }).optional().nullable(),
  uf: z.string({ required_error: 'UF do cliente não informada.', invalid_type_error: 'Tipo não válido para UF do cliente.' }),
  cidade: z.string({ required_error: 'Cidade não informada.', invalid_type_error: 'Tipo não válido para cidade do cliente.' }),
  bairro: z.string({ invalid_type_error: 'Tipo não válido para bairro do cliente.' }).optional().nullable(),
  endereco: z.string({ invalid_type_error: 'Tipo não válido para endereço do cliente.' }).optional().nullable(),
  numeroOuIdentificador: z.string({ invalid_type_error: 'Tipo não válido para número/identificador.' }).optional().nullable(),
  complemento: z.string({ invalid_type_error: 'Tipo não válido para complemento de endereço.' }).optional().nullable(),
  dataNascimento: z
    .string({ invalid_type_error: 'Tipo não válido para data de nascimento do cliente.' })
    .datetime({ message: 'Formato inválido para data de nascimento.' })
    .optional()
    .nullable(),
  profissao: z.string({ invalid_type_error: 'Tipo não válido para profissão do cliente.' }).optional().nullable(),
  ondeTrabalha: z.string({ invalid_type_error: 'Tipo não válido para o lugar de trabalho do cliente.' }).optional().nullable(),
  estadoCivil: z.string({ invalid_type_error: 'Tipo não válido para estado civil do cliente.' }).optional().nullable(),
  deficiencia: z.string({ invalid_type_error: 'Tipo inválido para deficiência.' }).optional().nullable(),
  canalAquisicao: z.string({ required_error: 'Canal de aquisição não informado.', invalid_type_error: 'Tipo não válido para canal de aquisição.' }),
  dataInsercao: z
    .string({ required_error: 'Data de inserção não informada.', invalid_type_error: 'Tipo não válido para data de inserção.' })
    .datetime({ message: 'Formato inválido para data de inserção.' }),
  idMarketing: z.string().optional().nullable(),
  indicador: z.object({
    nome: z.string().optional().nullable(),
    contato: z.string().optional().nullable(),
  }),
  autor: z.object({
    id: z.string(),
    nome: z.string(),
    avatar_url: z.string().optional().nullable(),
  }),
})
export const UpdateClientSchema = z.object({
  _id: z.string({
    required_error: 'ID de referência do cliente não informado.',
    invalid_type_error: 'Tipo não válido para o ID de referência do cliente.',
  }),
  nome: z
    .string({ required_error: 'Nome do cliente não informado.', invalid_type_error: 'Tipo não válido para nome do cliente.' })
    .min(3, 'É necessário um nome de ao menos 3 letras para o cliente.'),
  idParceiro: z.string({
    required_error: 'Referência a parceiro não informado.',
    invalid_type_error: 'Tipo não válido para a referência de parceiro.',
  }),
  cpfCnpj: z.string({ invalid_type_error: 'Tipo não válido para CPF/CNPJ do cliente.' }).optional().nullable(),
  rg: z.string({ invalid_type_error: 'Tipo não válido para RG do cliente.' }).optional().nullable(),
  telefonePrimario: z
    .string({
      required_error: 'Telefone primário do cliente não informado.',
      invalid_type_error: 'Tipo não válido para nome do cliente.',
    })
    .min(14, 'Formato inválido para telefone primáiro. O mínimo de caracteres é 14.'),
  telefoneSecundario: z.string().optional().nullable(),
  email: z.string({ invalid_type_error: 'Tipo não válido para email do cliente.' }).optional().nullable(),
  cep: z.string({ invalid_type_error: 'Tipo não válido para CEP do cliente.' }).optional().nullable(),
  uf: z.string({ required_error: 'UF do cliente não informada.', invalid_type_error: 'Tipo não válido para UF do cliente.' }),
  cidade: z.string({ required_error: 'Cidade não informada.', invalid_type_error: 'Tipo não válido para cidade do cliente.' }),
  bairro: z.string({ invalid_type_error: 'Tipo não válido para bairro do cliente.' }).optional().nullable(),
  endereco: z.string({ invalid_type_error: 'Tipo não válido para endereço do cliente.' }).optional().nullable(),
  numeroOuIdentificador: z.string({ invalid_type_error: 'Tipo não válido para número/identificador.' }).optional().nullable(),
  complemento: z.string({ invalid_type_error: 'Tipo não válido para complemento de endereço.' }).optional().nullable(),
  dataNascimento: z
    .string({ invalid_type_error: 'Tipo não válido para data de nascimento do cliente.' })
    .datetime({ message: 'Formato inválido para data de nascimento.' })
    .optional()
    .nullable(),
  profissao: z.string({ invalid_type_error: 'Tipo não válido para profissão do cliente.' }).optional().nullable(),
  ondeTrabalha: z.string({ invalid_type_error: 'Tipo não válido para o lugar de trabalho do cliente.' }).optional().nullable(),
  estadoCivil: z.string({ invalid_type_error: 'Tipo não válido para estado civil do cliente.' }).optional().nullable(),
  deficiencia: z.string({ invalid_type_error: 'Tipo inválido para deficiência.' }).optional().nullable(),
  canalAquisicao: z.string({ required_error: 'Canal de aquisição não informado.', invalid_type_error: 'Tipo não válido para canal de aquisição.' }),
  dataInsercao: z
    .string({ required_error: 'Data de inserção não informada.', invalid_type_error: 'Tipo não válido para data de inserção.' })
    .datetime({ message: 'Formato inválido para data de inserção.' }),
  idMarketing: z.string().optional().nullable(),
  indicador: z.object({
    nome: z.string().optional().nullable(),
    contato: z.string().optional().nullable(),
  }),
  autor: z.object({
    id: z.string(),
    nome: z.string(),
    avatar_url: z.string().optional().nullable(),
  }),
})
export const ClientDTOSchema = z.object({
  _id: z.string({
    required_error: 'ID de referência do cliente não informado.',
    invalid_type_error: 'Tipo não válido para o ID de referência do cliente.',
  }),
  nome: z
    .string({ required_error: 'Nome do cliente não informado.', invalid_type_error: 'Tipo não válido para nome do cliente.' })
    .min(3, 'É necessário um nome de ao menos 3 letras para o cliente.'),
  idParceiro: z.string({
    required_error: 'Referência a parceiro não informado.',
    invalid_type_error: 'Tipo não válido para a referência de parceiro.',
  }),
  cpfCnpj: z.string({ invalid_type_error: 'Tipo não válido para CPF/CNPJ do cliente.' }).optional().nullable(),
  rg: z.string({ invalid_type_error: 'Tipo não válido para RG do cliente.' }).optional().nullable(),
  telefonePrimario: z
    .string({
      required_error: 'Telefone primário do cliente não informado.',
      invalid_type_error: 'Tipo não válido para nome do cliente.',
    })
    .min(14, 'Formato inválido para telefone primáiro. O mínimo de caracteres é 14.'),
  telefoneSecundario: z.string().optional().nullable(),
  email: z.string({ invalid_type_error: 'Tipo não válido para email do cliente.' }).optional().nullable(),
  cep: z.string({ invalid_type_error: 'Tipo não válido para CEP do cliente.' }).optional().nullable(),
  uf: z.string({ required_error: 'UF do cliente não informada.', invalid_type_error: 'Tipo não válido para UF do cliente.' }),
  cidade: z.string({ required_error: 'Cidade não informada.', invalid_type_error: 'Tipo não válido para cidade do cliente.' }),
  bairro: z.string({ invalid_type_error: 'Tipo não válido para bairro do cliente.' }).optional().nullable(),
  endereco: z.string({ invalid_type_error: 'Tipo não válido para endereço do cliente.' }).optional().nullable(),
  numeroOuIdentificador: z.string({ invalid_type_error: 'Tipo não válido para número/identificador.' }).optional().nullable(),
  complemento: z.string({ invalid_type_error: 'Tipo não válido para complemento de endereço.' }).optional().nullable(),
  dataNascimento: z
    .string({ invalid_type_error: 'Tipo não válido para data de nascimento do cliente.' })
    .datetime({ message: 'Formato inválido para data de nascimento.' })
    .optional()
    .nullable(),
  profissao: z.string({ invalid_type_error: 'Tipo não válido para profissão do cliente.' }).optional().nullable(),
  ondeTrabalha: z.string({ invalid_type_error: 'Tipo não válido para o lugar de trabalho do cliente.' }).optional().nullable(),
  estadoCivil: z.string({ invalid_type_error: 'Tipo não válido para estado civil do cliente.' }).optional().nullable(),
  deficiencia: z.string({ invalid_type_error: 'Tipo inválido para deficiência.' }).optional().nullable(),
  canalAquisicao: z.string({ required_error: 'Canal de aquisição não informado.', invalid_type_error: 'Tipo não válido para canal de aquisição.' }),
  dataInsercao: z
    .string({ required_error: 'Data de inserção não informada.', invalid_type_error: 'Tipo não válido para data de inserção.' })
    .datetime({ message: 'Formato inválido para data de inserção.' }),
  idMarketing: z.string().optional().nullable(),
  indicador: z.object({
    nome: z.string().optional().nullable(),
    contato: z.string().optional().nullable(),
  }),
  autor: z.object({
    id: z.string(),
    nome: z.string(),
    avatar_url: z.string().optional().nullable(),
  }),
})
export type TClient = z.infer<typeof GeneralClientSchema>

// export type TClientEntity = TClient & { _id: ObjectId }

export type TClientDTO = TClient & { _id: string }

export type TSimilarClientSimplifiedDTO = Pick<
  TClientDTO,
  | '_id'
  | 'nome'
  | 'autor'
  | 'telefonePrimario'
  | 'email'
  | 'cpfCnpj'
  | 'cep'
  | 'uf'
  | 'cidade'
  | 'bairro'
  | 'endereco'
  | 'numeroOuIdentificador'
  | 'complemento'
  | 'dataInsercao'
>
export type TSimilarClientSimplified = Pick<
  TClient,
  'nome' | 'autor' | 'telefonePrimario' | 'email' | 'cpfCnpj' | 'cep' | 'uf' | 'cidade' | 'bairro' | 'endereco' | 'numeroOuIdentificador' | 'complemento'
>

export const SimilarClientsSimplifiedProjection = {
  _id: 1,
  nome: 1,
  telefonePrimario: 1,
  email: 1,
  cpfCnpj: 1,
  autor: 1,
  cep: 1,
  uf: 1,
  cidade: 1,
  bairro: 1,
  endereco: 1,
  numeroOuIdentificador: 1,
  complemento: 1,
  dataInsercao: 1,
}
