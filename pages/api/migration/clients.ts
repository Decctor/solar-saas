import connectToAmpereDatabase from '@/services/mongodb/ampere-db-connection'
import connectToDatabase from '@/services/mongodb/main-db-connection'
import { apiHandler } from '@/utils/api'
import { TClient } from '@/utils/schemas/client.schema'
import { TOpportunity } from '@/utils/schemas/opportunity.schema'
import { Collection, ObjectId, WithId } from 'mongodb'
import { NextApiHandler } from 'next'
import { z } from 'zod'

const aquisitionChannelsEquivalents = {
  NETWORK: 'NETWORKING',
  'INSIDE SALES': '(OUTBOUND) SDR',
  'INDICAÇÃO DE AMIGO': 'INDICAÇÃO',
  SITE: 'SITE',
  'CALCULADORA SOLAR': 'CALCULADORA SOLAR',
  'GOOGLE ADS': 'GOOGLE ADS',
  'FACEBOOK ADS': 'FACEBOOK ADS',
  'INSTAGRAM ADS': 'INSTAGRAM ADS',
  SMBOT: 'SMBOT',
  BLOG: 'BLOG',
  YOUTUBE: 'YOUTUBE',
  RÁDIO: 'RÁDIO',
  EVENTO: 'EVENTO',
  PASSIVO: 'PASSIVO',
  'PORTA A PORTA': 'PORTA A PORTA',
  'PROSPECÇÃO ATIVA': 'PROSPECÇÃO ATIVA',
  'MARKETING (GERAL)': 'MARKETING (GERAL)',
}

const migrate: NextApiHandler<any> = async (req, res) => {
  const ampereDb = await connectToAmpereDatabase(process.env.MONGODB_CRM, 'main')
  const ampereClientsCollection: Collection<TAmpereClient> = ampereDb.collection('clients')
  const ampereUsersCollection: Collection<TAmpereUser> = ampereDb.collection('users')
  const ampereClients = await ampereClientsCollection.find({}).toArray()
  const ampereUsers = await ampereUsersCollection.find({}).toArray()
  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const clientsCollection = db.collection('clients')

  const clients = ampereClients.map((client) => {
    const equivalentAuthor = ampereUsers.find((u) => u._id.toString() == client.representante.id)
    const authorAvatarUrl = equivalentAuthor?.avatar_url || null
    return {
      _id: client._id,
      nome: client.nome,
      idParceiro: '65454ba15cf3e3ecf534b308',
      cpfCnpj: client.cpfCnpj,
      telefonePrimario: client.telefonePrimario,
      telefoneSecundario: client.telefoneSecundario,
      email: client.email,
      cep: client.cep,
      uf: client.uf,
      cidade: client.cidade,
      bairro: client.bairro,
      endereco: client.endereco,
      numeroOuIdentificador: client.numeroOuIdentificador,
      complemento: client.complemento,
      dataNascimento: client.dataNascimento,
      profissao: client.profissao,
      canalAquisicao: aquisitionChannelsEquivalents[client.canalVenda as keyof typeof aquisitionChannelsEquivalents] || 'PASSIVO',
      idMarketing: client.idOportunidade,
      indicador: {
        contato: null,
        nome: null,
      },
      autor: {
        id: client.representante.id,
        nome: client.representante.nome,
        avatar_url: authorAvatarUrl,
      },
      dataInsercao: client.dataInsercao || new Date().toISOString(),
    } as WithId<TClient>
  })

  const insertManyResponse = await clientsCollection.insertMany(clients)
  return res.status(200).json(insertManyResponse)
}

export default apiHandler({ GET: migrate })

const GeneralClientSchema = z.object({
  representante: z.object({
    id: z.string(),
    nome: z.string(),
  }),
  nome: z.string(),
  idParceiro: z.string(),
  idIndicacao: z.string().optional().nullable(),
  idOportunidade: z.string().optional().nullable(),
  cpfCnpj: z.string().optional().nullable(),
  telefonePrimario: z.string(),
  telefoneSecundario: z.string().optional().nullable(),
  email: z.string(),
  cep: z.string(),
  bairro: z.string(),
  endereco: z.string(),
  numeroOuIdentificador: z.string(),
  complemento: z.string(),
  uf: z.string(),
  cidade: z.string(),
  dataNascimento: z.string().optional().nullable(),
  rg: z.string().optional().nullable(),
  estadoCivil: z.string().optional().nullable(),
  profissao: z.string().optional().nullable(),
  ondeTrabalha: z.string().optional().nullable(),
  canalVenda: z.string().optional().nullable(),
  indicador: z.string().optional().nullable(),
  dataInsercao: z.string().datetime(),
})
type TAmpereClient = z.infer<typeof GeneralClientSchema>

const PermissionsSchema = z.object({
  usuarios: z.object({
    visualizar: z.boolean({
      required_error: 'Permissão para visualização de usuários não informada.',
      invalid_type_error: 'Tipo não válido para a permissão de visualização de usuários.',
    }), //visualizar área de usuário em auth/users
    editar: z.boolean({
      required_error: 'Permissão para edição de usuários não informada.',
      invalid_type_error: 'Tipo não válido para a permissão de edição de usuários.',
    }), //criar usuários e editar informações de usuários em auth/users
  }),
  comissoes: z.object({
    visualizar: z.boolean({
      required_error: 'Permissão para visualização de comissões não informada.',
      invalid_type_error: 'Tipo não válido para a permissão de visualização de comissões.',
    }), //visualizar comissões de todos os usuários
    editar: z.boolean({
      required_error: 'Permissão para edição de comissões não informada.',
      invalid_type_error: 'Tipo não válido para a permissão de edição de comissões.',
    }), //editar comissões de todos os usuários
  }),
  kits: z.object({
    visualizar: z.boolean({
      required_error: 'Permissão para visualização de kits não informada.',
      invalid_type_error: 'Tipo não válido para a permissão de visualização de kits.',
    }), //visualizar área de kits e kits possíveis
    editar: z.boolean({
      required_error: 'Permissão para edição de kits não informada.',
      invalid_type_error: 'Tipo não válido para a permissão de edição de kits.',
    }), //editar e criar kits
  }),
  propostas: z.object({
    visualizar: z.boolean({
      required_error: 'Permissão para visualização de propostas não informada.',
      invalid_type_error: 'Tipo não válido para a permissão de visualização de propostas.',
    }), //visualizar área de controle de propostas
    editar: z.boolean({
      required_error: 'Permissão para edição de propostas não informada.',
      invalid_type_error: 'Tipo não válido para a permissão de edição de propostas.',
    }), //criar propostas em qualquer projeto e editar propostas de outros usuários
  }),
  projetos: z.object({
    serResponsavel: z.boolean({
      required_error: 'Permissão para criação de projetos não informada.',
      invalid_type_error: 'Tipo não válido para a permissão de criação de projetos.',
    }), //habilitado a ser responsável de projetos
    serRecebedor: z.boolean({
      required_error: 'Permissão para recebimento de projetos não informada.',
      invalid_type_error: 'Tipo não válido para a permissão de recebimento de projetos.',
    }), // recebedor de leads
    editar: z.boolean({
      required_error: 'Permissão para edição de projetos não informada.',
      invalid_type_error: 'Tipo não válido para a permissão de edição de projetos.',
    }), //editar informações de todos os projetos
  }),
  clientes: z.object({
    serRepresentante: z.boolean({
      required_error: 'Permissão para criação de clientes não informada.',
      invalid_type_error: 'Tipo não válido para a permissão de criação de clientes.',
    }), //habilitado a ser representante de clientes
    editar: z.boolean(), //editar informações de todos os clientes
  }),
  precos: z.object({
    visualizar: z.boolean({
      required_error: 'Permissão para visualização de preços não informada.',
      invalid_type_error: 'Tipo não válido para a permissão de visualização de preços.',
    }), //visualizar precificacao geral, com custos, impostos, lucro e afins de propostas e kits
    editar: z.boolean({
      required_error: 'Permissão para edição de preços não informada.',
      invalid_type_error: 'Tipo não válido para a permissão de edição de preços.',
    }), //editar precificacao de propostas
    margemAlteracao: z.number({ invalid_type_error: 'Tipo não válido para a margem máxima de alteração.' }).optional().nullable(),
  }),
  parceiros: z.object({
    visualizar: z.boolean({
      required_error: 'Autorização para visualização de parceiros não informada.',
      invalid_type_error: 'Tipo não válido para autorização de visualização de parceiros.',
    }),
    editar: z.boolean({
      required_error: 'Autorização para edição de parceiros não informada.',
      invalid_type_error: 'Tipo não válido para autorização de edição de parceiros.',
    }),
  }),
})
export type TPermissions = z.infer<typeof PermissionsSchema>
export const GeneralUserSchema = z.object({
  ativo: z.boolean(),
  nome: z.string(),
  idParceiro: z.string().optional().nullable(),
  email: z.string(),
  senha: z.string(),
  telefone: z.string(),
  avatar_url: z.string().optional().nullable(),
  visibilidade: z.union([z.literal('GERAL'), z.literal('PRÓPRIA'), z.array(z.string())]),
  funisVisiveis: z.union([z.literal('TODOS'), z.array(z.number())]),
  comissao: z.object({
    comRepresentante: z.number(),
    semRepresentante: z.number(),
  }),
  grupo: z.object({
    id: z.number(),
    nome: z.string(),
  }),
  permissoes: PermissionsSchema,
  dataAlteracao: z.string().datetime().optional().nullable(),
  dataInsercao: z.string().datetime(),
})
export type TAmpereUser = z.infer<typeof GeneralUserSchema>
