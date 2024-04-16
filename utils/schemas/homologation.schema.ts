import { GiJumpAcross } from 'react-icons/gi'
import { z } from 'zod'
import { ElectricalInstallationGroupsSchema } from './opportunity.schema'
import { ObjectId } from 'mongodb'
import { AuthorSchema } from './user.schema'

const HolderSchema = z.object({
  nome: z
    .string({ required_error: 'Nome do titular não informado.', invalid_type_error: 'Tipo não válido para o nome do titular.' })
    .min(3, 'Nome do titular deve possuir ao menos 3 caractéres.'),
  identificador: z
    .string({
      required_error: 'CPF ou CNPJ do titular não informado.',
      invalid_type_error: 'Tipo não válido para o CPF ou CNPJ do titular.',
    })
    .min(11, 'CPF/CNPJ do titular deve possuir ao menos 11 caractéres.'),
  contato: z
    .string({ required_error: 'Contato do titular não informado.', invalid_type_error: 'Tipo não válido para o contato do titular.' })
    .min(12, 'O contato do titular deve possuir ao menos 12 caractéres.'),
})
const HomologationOpportunitySchema = z.object({
  id: z.string({
    required_error: 'ID de referência da oportunidade não fornecido.',
    invalid_type_error: 'Tipo não válido para ID de referência da oportunidade.',
  }),
  nome: z.string({
    required_error: 'Nome da oportunidade de referência não informado.',
    invalid_type_error: 'Tipo não válido para o nome da oportunidade de referência.',
  }),
})
const HomologationEquipmentSchema = z.object({
  categoria: z.union([z.literal('MÓDULO'), z.literal('INVERSOR')]),
  fabricante: z.string({
    required_error: 'Fabricante do equipamento não informado.',
    invalid_type_error: 'Tipo não válido para o fabricante do equipamento.',
  }),
  modelo: z.string({ required_error: 'Modelo do equipamento não informado.', invalid_type_error: 'Tipo não válido para o modelo do equipamento.' }),
  qtde: z.number({
    required_error: 'Quantidade do equipamento não informada.',
    invalid_type_error: 'Tipo não válido para a quantidade do equipamento.',
  }),
  potencia: z.number({
    required_error: 'Potência do equipamento não informada.',
    invalid_type_error: 'Tipo não válido para a potência do equipamento.',
  }),
})
export type THomologationEquipment = z.infer<typeof HomologationEquipmentSchema>
const HomologationLocationSchema = z.object({
  cep: z
    .string({
      required_error: 'CEP da localização de homologação não informado.',
      invalid_type_error: 'Tipo não válido para o CEP da localização de homologação.',
    })
    .optional()
    .nullable(),
  uf: z.string({
    required_error: 'UF de localização de homologação não informada.',
    invalid_type_error: 'Tipo não válido para a UF de localização de homologação.',
  }),
  cidade: z.string({
    required_error: 'Cidade de localização de homologação não informada.',
    invalid_type_error: 'Tipo não válido para a cidade de localização de homologação.',
  }),
  bairro: z
    .string({
      required_error: 'Bairro da localização de homologação não informado.',
      invalid_type_error: 'Tipo não válido para o bairro da localização de homologação.',
    })
    .optional()
    .nullable(),
  endereco: z
    .string({
      required_error: 'Endereço da localização de homologação não informado.',
      invalid_type_error: 'Tipo não válido para o endereço da localização de homologação.',
    })
    .optional()
    .nullable(),
  numeroOuIdentificador: z
    .string({
      required_error: 'Número ou identificador da localização de homologação não informado.',
      invalid_type_error: 'Tipo não válido para o número ou identificador da localização de homologação.',
    })
    .optional()
    .nullable(),
  complemento: z.string().optional().nullable(),
  // distancia: z.number().optional().nullable(),
})
const HomologationInstalationSchema = z.object({
  numeroInstalacao: z.string({
    required_error: 'Número da instalação elétrica não informado.',
    invalid_type_error: 'Tipo não válido para o número da instalação elétrica.',
  }),
  numeroCliente: z.string({
    required_error: 'Número do cliente (junto a concessionária) não informado.',
    invalid_type_error: 'Tipo não válido para o número do cliente (junto a concessionária).',
  }),
  grupo: ElectricalInstallationGroupsSchema,
})
const HomologationDocumentationSchema = z.object({
  formaAssinatura: z.union([z.literal('FÍSICA'), z.literal('DIGITAL')], {
    required_error: 'Forma de assinatura da documentação não informada.',
    invalid_type_error: 'Tipo não válido para a forma de assinatura da documentação.',
  }),
  dataLiberacao: z
    .string({ invalid_type_error: 'Tipo não válido para a data de liberação da documentação.' })
    .datetime({ message: 'Formato inválido para a data de liberação da documentação.' })
    .optional()
    .nullable(),
  dataAssinatura: z
    .string({ invalid_type_error: 'Tipo não válido para a data de assinatura da documentação.' })
    .datetime({ message: 'Formato inválido para a data de assinatura da documentação.' })
    .optional()
    .nullable(),
})
const HomologationAccessControlSchema = z.object({
  codigo: z.string({
    required_error: 'Código da solicitação (NS) não informado.',
    invalid_type_error: 'Tipo não válido para o código da solicitação (NS).',
  }),
  dataSolicitacao: z
    .string({ invalid_type_error: 'Tipo não válido para a data de solicitação de acesso.' })
    .datetime({ message: 'Formato inválido para a data de solicitação de acesso.' })
    .optional()
    .nullable(),
  dataResposta: z
    .string({ invalid_type_error: 'Tipo não válido para a data de resposta da solicitação de acesso.' })
    .datetime({ message: 'Formato inválido para a data de resposta da solicitação de acesso.' })
    .optional()
    .nullable(),
})
const HomologationUpdatesSchema = z.object({
  data: z
    .string({ required_error: 'Data da atualização não informada.', invalid_type_error: 'Tipo inválido para a data de atualização.' })
    .datetime({ message: 'Formato inválido para a data da atualização.' }),
  descricao: z.string({
    required_error: 'Descrição da atualização não informada.',
    invalid_type_error: 'Tipo não válido para a descrição da atualização.',
  }),
  autor: AuthorSchema,
})
const HomologationStatusSchema = z.union(
  [
    z.literal('PENDENTE'),
    z.literal('ELABORANDO DOCUMENTAÇÕES'),
    z.literal('AGUARDANDO ASSINATURA'),
    z.literal('AGUARDANDO FATURAMENTO'),
    z.literal('AGUARDANDO PENDÊNCIAS'),
    z.literal('APROVADO COM OBRAS'),
    z.literal('APROVADO COM RESTRIÇÕES'),
    z.literal('APROVADO'),
    z.literal('REPROVADO'),
  ],
  { required_error: 'Status da homologação não informado.', invalid_type_error: 'Tipo não válido para o status da homologação.' }
)
const HomologationVistorySchema = z.object({
  dataSolicitacao: z
    .string({ invalid_type_error: 'Tipo não válido para a data de solicitação da vistoria.' })
    .datetime({ message: 'Formato inválido para a data de solicitação da vistoria.' })
    .optional()
    .nullable(),
  dataEfetivacao: z
    .string({ invalid_type_error: 'Tipo não válido para a data de execução da vistoria.' })
    .datetime({ message: 'Formato inválido para a data de execução da vistoria.' })
    .optional()
    .nullable(),
})

const GeneralHomologationSchema = z.object({
  status: HomologationStatusSchema,
  idParceiro: z.string({
    required_error: 'ID de referência do parceiro não informado.',
    invalid_type_error: 'Tipo não válido para ID de referência do parceiro.',
  }),
  oportunidade: HomologationOpportunitySchema,
  titular: HolderSchema,
  equipamentos: z.array(HomologationEquipmentSchema, {
    required_error: 'Lista de equipamentos não informada.',
    invalid_type_error: 'Tipo não válido para a lista de equipamentos.',
  }),
  localizacao: HomologationLocationSchema,
  instalacao: HomologationInstalationSchema,
  documentacao: HomologationDocumentationSchema,
  acesso: HomologationAccessControlSchema,
  atualizacoes: z.array(HomologationUpdatesSchema),
  vistoria: HomologationVistorySchema,
  dataEfetivacao: z.string().optional().nullable(),
  autor: AuthorSchema,
  dataInsercao: z.string().datetime(),
})

export const InsertHomologationSchema = z.object({
  status: HomologationStatusSchema,
  idParceiro: z.string({
    required_error: 'ID de referência do parceiro não informado.',
    invalid_type_error: 'Tipo não válido para ID de referência do parceiro.',
  }),
  oportunidade: HomologationOpportunitySchema,
  titular: HolderSchema,
  equipamentos: z.array(HomologationEquipmentSchema, {
    required_error: 'Lista de equipamentos não informada.',
    invalid_type_error: 'Tipo não válido para a lista de equipamentos.',
  }),
  localizacao: HomologationLocationSchema,
  instalacao: HomologationInstalationSchema,
  documentacao: HomologationDocumentationSchema,
  acesso: HomologationAccessControlSchema,
  atualizacoes: z.array(HomologationUpdatesSchema),
  vistoria: HomologationVistorySchema,
  dataEfetivacao: z
    .string({
      required_error: 'Data de conclusão da homologação não informada.',
      invalid_type_error: 'Tipo não válido para a data da conclusão da homologação.',
    })
    .datetime({ message: 'Formato inválido para a data de conclusão da homologação.' })
    .optional()
    .nullable(),
  autor: AuthorSchema,
  dataInsercao: z
    .string({ required_error: 'Data de inserção não fornecida.', invalid_type_error: 'Tipo não válido para a data de inserção.' })
    .datetime({ message: 'Formato inválido para a data de inserção.' }),
})

export type THomologation = z.infer<typeof GeneralHomologationSchema>

export type THomologationDTO = THomologation & { _id: string }

export type THomologationEntity = THomologation & { _id: ObjectId }
