import connectToAmpereDatabase from '@/services/mongodb/ampere-db-connection'
import connectToDatabase from '@/services/mongodb/main-db-connection'
import { apiHandler } from '@/utils/api'
import { TFunnelReference } from '@/utils/schemas/funnel-reference.schema'
import { TOpportunity } from '@/utils/schemas/opportunity.schema'
import { Collection, ObjectId, WithId } from 'mongodb'
import { NextApiHandler } from 'next'
import { z } from 'zod'

const typeEquivalents = {
  'SISTEMA FOTOVOLTAICO': {
    tipo: {
      id: '6615785ddcb7a6e66ede9785',
      titulo: 'SISTEMA FOTOVOLTAICO',
    },
    categoriaVenda: 'KIT',
  },
  'OPERAÇÃO E MANUTENÇÃO': {
    tipo: {
      id: '661586b9774ffe3a569a9f5c',
      titulo: 'OPERAÇÃO E MANUTENÇÃO',
    },
    categoriaVenda: 'PLANO',
  },
  'MONTAGEM E DESMONTAGEM': {
    tipo: {
      id: '6615879a07e7ffc27a40f2d5',
      titulo: 'SERVIÇOS AVULSOS',
    },
    categoriaVenda: 'SERVIÇOS',
  },
  MONITORAMENTO: {
    tipo: {
      id: '6615879a07e7ffc27a40f2d5',
      titulo: 'SERVIÇOS AVULSOS',
    },
    categoriaVenda: 'SERVIÇOS',
  },
}

const ownerTypeEquivalents = {
  'PESSOA FISICA': 'PESSOA FÍSICA',
  'PESSOA JURIDICA': 'PESSOA JURÍDICA',
}
const installationTypeEquivalents = {
  URBANO: 'RESIDENCIAL',
  RURAL: 'RURAL',
}
const migrate: NextApiHandler<any> = async (req, res) => {
  const ampereDb = await connectToAmpereDatabase(process.env.MONGODB_CRM, 'main')
  const ampereProjectsCollection = ampereDb.collection('projects')
  const ampereUsersCollection: Collection<TAmpereUser> = ampereDb.collection('users')
  const ampereProjects = (await ampereProjectsCollection.find({}).toArray()) as WithId<TAmpereProject>[]
  const ampereUsers = await ampereUsersCollection.find({}).toArray()
  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const opportunitiesCollection = db.collection('opportunities')
  const funnelReferencesCollection = db.collection('funnel-references')
  const opportunities = ampereProjects.map((project) => {
    const responsibles: TOpportunity['responsaveis'] = []

    const sellerUser = ampereUsers.find((au) => au._id.toString() == project.responsavel.id)
    const seller: TOpportunity['responsaveis'][number] = {
      id: project.responsavel.id,
      nome: project.responsavel.nome,
      papel: 'VENDEDOR',
      avatar_url: project.responsavel.avatar_url || sellerUser?.avatar_url,
      telefone: sellerUser?.telefone || '',
    }
    responsibles.push(seller)
    // In case there was an SDR
    if (project.representante.id != project.responsavel.id) {
      const sdrUser = ampereUsers.find((au) => au._id.toString() == project.representante.id)
      const sdr: TOpportunity['responsaveis'][number] = {
        id: project.representante.id,
        nome: project.representante.nome,
        papel: 'SDR',
        avatar_url: project.representante.avatar_url || sdrUser?.avatar_url,
        telefone: sdrUser?.telefone || '',
      }
      responsibles.push(sdr)
    }
    return {
      _id: project._id,
      nome: project.nome,
      idParceiro: '65454ba15cf3e3ecf534b308',
      tipo: typeEquivalents[project.tipoProjeto as keyof typeof typeEquivalents]?.tipo || {
        id: '6615785ddcb7a6e66ede9785',
        titulo: 'SISTEMA FOTOVOLTAICO',
      },
      categoriaVenda: typeEquivalents[project.tipoProjeto as keyof typeof typeEquivalents]?.categoriaVenda || 'KIT',
      descricao: project.descricao || '',
      identificador: project.identificador,
      responsaveis: responsibles,
      idCliente: project.clienteId,
      idMarketing: project.idOportunidade,
      idPropostaAtiva: project.contrato?.idProposta || project.propostaAtiva,
      localizacao: {
        cep: project.localizacao.cep,
        uf: project.localizacao.uf,
        cidade: project.localizacao.cidade,
        bairro: project.localizacao.bairro,
        endereco: project.localizacao.endereco,
        numeroOuIdentificador: project.localizacao.numeroOuIdentificador,
        complemento: project.localizacao.complemento,
        // distancia: z.number().optional().nullable(),
      },
      perda: {
        idMotivo: undefined,
        descricaoMotivo: project.motivoPerda,
        data: project.dataPerda,
      },
      ganho: {
        idProposta: project.contrato?.idProposta || project.solicitacaoContrato?.idProposta,
        idProjeto: project.contrato?.id || '',
        data: project.contrato?.dataAssinatura,
        idSolicitacao: project.solicitacaoContrato?.id,
        dataSolicitacao: project.solicitacaoContrato?.dataSolicitacao,
      },
      instalacao: {
        concessionaria: null,
        numero: project.numeroInstalacaoConcessionaria,
        grupo: project.tipoInstalacao ? installationTypeEquivalents[project.tipoInstalacao] : undefined,
        tipoLigacao: project.tipoLigacao,
        tipoTitular: project.tipoTitular ? ownerTypeEquivalents[project.tipoTitular] : undefined,
        nomeTitular: project.titularInstalacao,
      },
      autor: {
        id: project.responsavel.id,
        nome: project.responsavel.nome,
        avatar_url: project.responsavel.avatar_url,
      },
      dataInsercao: project.dataInsercao || new Date().toISOString(),
      // adicionar contrato e solicitação de contrato futuramente
    } as WithId<TOpportunity>
  })
  const funnelReferences = ampereProjects.map((opportunity) => {
    const references: TFunnelReference[] = []
    const salesFunnel = opportunity.funis.find((f) => f.id == 1)
    if (salesFunnel) {
      const salesReference = {
        idParceiro: '65454ba15cf3e3ecf534b308',
        idOportunidade: opportunity._id.toString(),
        idFunil: '661eaeb6c387dfeddd9a23c9',
        idEstagioFunil: salesFunnel?.etapaId.toString() || '1',
        dataInsercao: opportunity.dataInsercao || new Date().toISOString(),
      }
      references.push(salesReference)
    }

    const sdrFunnel = opportunity.funis.find((f) => f.id == 2)
    if (sdrFunnel) {
      const sdrReference = {
        idParceiro: '65454ba15cf3e3ecf534b308',
        idOportunidade: opportunity._id.toString(),
        idFunil: '661eb0996dd818643c5334f5',
        idEstagioFunil: sdrFunnel?.etapaId.toString() || '1',
        dataInsercao: opportunity.dataInsercao || new Date().toISOString(),
      }
      references.push(sdrReference)
    }
    return {
      referencias: references,
    }
  })
  const flatFunnelReferences = funnelReferences.flatMap((f) => f.referencias)

  const insertManyResponseOpportunity = await opportunitiesCollection.insertMany(opportunities)
  const insertManyResponseFunnelResponsible = await funnelReferencesCollection.insertMany(flatFunnelReferences)
  return res.status(200).json({
    insertOpportunities: insertManyResponseOpportunity,
    insertFunnelReferences: insertManyResponseFunnelResponsible,
  })
}

export default apiHandler({ GET: migrate })
const GeneralProjectSchema = z.object({
  nome: z.string(),
  tipoProjeto: z.string(),
  identificador: z.string(),
  idOportunidade: z.string().optional().nullable(),
  idParceiro: z.string(),
  idIndicacao: z.string({ invalid_type_error: 'Tipo não válido para o ID de referência da indicação.' }).optional().nullable(),
  responsavel: z.object({
    id: z.string(),
    nome: z.string(),
    avatar_url: z.string().optional().nullable(),
  }),
  representante: z.object({
    id: z.string(),
    nome: z.string(),
    avatar_url: z.string().optional().nullable(),
  }),
  localizacao: z.object({
    cep: z.string().optional().nullable(),
    uf: z.string(),
    cidade: z.string(),
    bairro: z.string().optional().nullable(),
    endereco: z.string().optional().nullable(),
    numeroOuIdentificador: z.string().optional().nullable(),
    complemento: z.string().optional().nullable(),
    // distancia: z.number().optional().nullable(),
  }),
  clienteId: z.string(),
  propostaAtiva: z.string().optional().nullable(),
  titularInstalacao: z.string().optional().nullable(),
  numeroInstalacaoConcessionaria: z.string().optional().nullable(),
  tipoTitular: z
    .union([z.literal('PESSOA FISICA'), z.literal('PESSOA JURIDICA')])
    .optional()
    .nullable(),
  tipoLigacao: z
    .union([z.literal('EXISTENTE'), z.literal('NOVA')])
    .optional()
    .nullable(),
  tipoInstalacao: z
    .union([z.literal('URBANO'), z.literal('RURAL')])
    .optional()
    .nullable(),
  credor: z.string().optional().nullable(),
  anexos: z
    .object({
      documentoComFoto: z.string().optional().nullable(),
      iptu: z.string().optional().nullable(),
      contaDeEnergia: z.string().optional().nullable(),
      laudo: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  descricao: z.string().optional().nullable(),
  funis: z.array(z.object({ id: z.union([z.string(), z.number()]), etapaId: z.union([z.string(), z.number()]) })),
  dataPerda: z.string().optional().nullable(),
  motivoPerda: z.string().optional().nullable(),
  contrato: z
    .object({
      id: z.string().optional().nullable(),
      idProposta: z.string().nullable(),
      dataAssinatura: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  solicitacaoContrato: z
    .object({
      id: z.string().optional().nullable(),
      idProposta: z.string().nullable(),
      dataSolicitacao: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  dataInsercao: z.string().datetime(),
})

export type TAmpereProject = z.infer<typeof GeneralProjectSchema>
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
