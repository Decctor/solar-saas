import connectToAmpereDatabase from '@/services/mongodb/ampere-db-connection'
import connectToDatabase from '@/services/mongodb/crm-db-connection'
import { apiHandler } from '@/utils/api'
import { TClient } from '@/utils/schemas/client.schema'
import { TOpportunity } from '@/utils/schemas/opportunity.schema'
import { TUser } from '@/utils/schemas/user.schema'
import { UserGroups } from '@/utils/select-options'
import { Collection, ObjectId, WithId } from 'mongodb'
import { NextApiHandler } from 'next'
import { z } from 'zod'

const migrate: NextApiHandler<any> = async (req, res) => {
  const ampereDb = await connectToAmpereDatabase(process.env.MONGODB_CRM, 'main')

  const ampereUsersCollection: Collection<TAmpereUser> = ampereDb.collection('users')
  const ampereUsers = await ampereUsersCollection.find({}).toArray()

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const usersCollection = db.collection('users')

  const users = ampereUsers.map((user) => {
    const userPermissions = UserGroups.find((g) => g.id == user.grupo.id.toString())?.permissoes || UserGroups[2].permissoes
    return {
      _id: user._id,
      nome: user.nome,
      administrador: false,
      telefone: user.telefone,
      email: user.email,
      senha: user.senha,
      avatar_url: user.avatar_url,
      idParceiro: '65454ba15cf3e3ecf534b308',
      idGrupo: user.grupo.id.toString(),
      permissoes: userPermissions,
      comissoes: {
        comSDR: user.comissao.comRepresentante,
        semSDR: user.comissao.semRepresentante,
      },
      ativo: user.ativo,
      dataInsercao: user.dataInsercao || new Date().toISOString(),
    } as WithId<TUser>
  })

  const insertManyResponse = await usersCollection.insertMany(users)
  return res.status(200).json(insertManyResponse)
}

export default apiHandler({ GET: migrate })

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
