import connectToDatabase from '@/services/mongodb/main-db-connection'
import { apiHandler, validateAuthorization } from '@/utils/api'
import { formatUpdateSetObject } from '@/utils/methods'
import { ProjectActivity } from '@/utils/models'
import dayjs from 'dayjs'
import createHttpError from 'http-errors'
import { Collection, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'
import { z } from 'zod'

function formatActivitiesWithStatus(activities: ProjectActivity[]) {
  const formatted = activities.map((activity) => {
    const diff = dayjs(activity.dataVencimento).diff(dayjs(), 'days')
    if (diff > 5) {
      return {
        ...activity,
        status: 'VERDE',
      }
    }
    if (diff < 5 && diff >= -1) {
      return {
        ...activity,
        status: 'LARANJA',
      }
    }

    if (diff < -1) {
      return {
        ...activity,
        status: 'VERMELHO',
      }
    } else {
      return {
        ...activity,
        status: 'VERDE',
      }
    }
  })

  return formatted
}

type PostResponse = {
  data: string
  message: string
}

const projectSchema = z.object({
  nome: z
    .string({
      required_error: 'Por favor, preencha o nome para identificação do projeto.',
    })
    .min(5, { message: 'Por favor, preencha um nome com ao menos 5 letras.' }),
  tipoProjeto: z.union([z.literal('SISTEMA FOTOVOLTAICO'), z.literal('OPERAÇÃO E MANUTENÇÃO'), z.literal('MONTAGEM E DESMONTAGEM')], {
    required_error: 'Por favor, preencha o tipo do projeto.',
    invalid_type_error: 'Por favor, preencha um tipo válido de projeto.',
  }),
  responsavel: z.object(
    {
      nome: z.string(),
      id: z.string(),
    },
    { required_error: 'Por favor, especifique o responsável.' }
  ),
  representante: z.object(
    {
      nome: z.string(),
      id: z.string(),
    },
    { required_error: 'Por favor, especifique o representante.' }
  ),
  clienteId: z.string({
    required_error: 'Por favor, especifique o ID do cliente.',
  }),
  descricao: z.string().optional(),
  funis: z.array(z.object({ id: z.number(), etapaId: z.number() }), {
    required_error: 'Por favor, vincule um funil a esse projeto.',
  }),
  idOportunidade: z.string().optional(),
})

const createProject: NextApiHandler<PostResponse> = async (req, res) => {
  await validateAuthorization(req, res, 'projetos', 'serResponsavel', true)

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const collection = db.collection('projects')

  const project = projectSchema.parse(req.body)
  if (project.idOportunidade) {
    const correspondingOpportunityInDb = await collection.findOne({
      idOportunidade: project.idOportunidade,
    })
    if (!!correspondingOpportunityInDb) throw new createHttpError.BadRequest('Projeto existente com a mesma oportunidade. Use um outro ID.')
  }

  const lastInsertedIdentificator = await collection
    .aggregate([
      {
        $project: {
          identificador: 1,
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $limit: 1,
      },
    ])
    .toArray()
  const lastIdentifierNumber = lastInsertedIdentificator[0] ? Number(lastInsertedIdentificator[0].identificador.split('-')[1]) : 0
  const newIdentifierNumber = lastIdentifierNumber + 1
  const identifier = `CRM-${newIdentifierNumber}`

  let dbRes = await collection.insertOne({
    ...project,
    identificador: identifier,
    dataInsercao: new Date().toISOString(),
  })
  res.status(201).json({
    data: dbRes.insertedId,
    message: 'Projeto criado com sucesso.',
  })
}

type GetResponse = {
  data: any
}
const modes = {
  GERAL: {},
  ATIVO: {
    $expr: {
      $eq: ['$responsavel.id', '$representante.id'],
    },
  },
  LEAD: {
    $expr: {
      $ne: ['$responsavel.id', '$representante.id'],
    },
  },
}

const getProjects: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthorization(req, res, 'projetos', 'serResponsavel', true)
  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const collection: Collection = db.collection('projects')
  const eventsCollection = db.collection('projectsEvents')
  const { id, responsible, funnel, after, before, mode, status } = req.query

  if (id && typeof id === 'string') {
    const project = await collection
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $addFields: {
            clientObjectId: { $toObjectId: '$clienteId' },
            propostaAtivaObjectId: { $toObjectId: '$propostaAtiva' },
          },
        },
        {
          $lookup: {
            from: 'clients',
            localField: 'clientObjectId',
            foreignField: '_id',
            as: 'cliente',
          },
        },
        {
          $lookup: {
            from: 'proposals',
            localField: 'propostaAtivaObjectId',
            foreignField: '_id',
            as: 'proposta',
          },
        },
        {
          $project: {
            'proposta.template': 0,
            'proposta.projeto': 0,
            'proposta.premissas': 0,
            'proposta.kit': 0,
            'proposta.precificacao': 0,
            'proposta.linkArquivo': 0,
            'proposta.potenciaPico': 0,
            'proposta.autor': 0,
          },
        },
      ])
      .toArray()
    if (project.length == 0) throw new createHttpError.BadRequest('ID de projeto inválido.')
    const formattedObj = { ...project[0], cliente: project[0].cliente[0] }
    res.status(200).json({ data: formattedObj })
  } else {
    var queryParam = {}
    if (typeof responsible != 'string') throw 'ID de responsável inválido.'
    var additionalQuery = modes[mode as keyof typeof modes]
    if (!additionalQuery) throw createHttpError.BadRequest('Modo inválido.')

    if (funnel != 'null' && responsible != 'null') {
      queryParam = {
        'responsavel.id': responsible,
        'funis.id': Number(funnel),
        dataPerda: null,
      }
    }
    if (funnel != 'null' && responsible == 'null') {
      queryParam = {
        'funis.id': Number(funnel),
        dataPerda: null,
      }
    }
    if (funnel == 'null' && responsible != 'null') {
      queryParam = {
        'representante.id': responsible,
        dataPerda: null,
      }
    }
    if (after != 'undefined' && before != 'undefined') {
      queryParam = {
        ...queryParam,
        $and: [
          {
            dataInsercao: {
              $gte: after,
            },
          },
          { dataInsercao: { $lte: before } },
        ],
      }
    }
    if (status == 'PERDIDOS') {
      queryParam = {
        ...queryParam,
        dataPerda: { $ne: null },
      }
    }
    if (status == 'GANHOS') {
      queryParam = {
        ...queryParam,
        'contrato.id': { $ne: null },
      }
    }
    queryParam = { ...queryParam, ...additionalQuery }
    console.log(queryParam)
    const projects = await collection
      .aggregate([
        {
          $match: { ...queryParam },
        },
        {
          $addFields: {
            clientObjectId: { $toObjectId: '$clienteId' },
            propostaAtivaObjectId: { $toObjectId: '$propostaAtiva' },
          },
        },
        {
          $lookup: {
            from: 'clients',
            localField: 'clientObjectId',
            foreignField: '_id',
            as: 'cliente',
          },
        },
        {
          $lookup: {
            from: 'proposals',
            localField: 'propostaAtivaObjectId',
            foreignField: '_id',
            as: 'proposta',
          },
        },
        {
          $project: {
            'proposta.template': 0,
            'proposta.projeto': 0,
            'proposta.premissas': 0,
            'proposta.kit': 0,
            'proposta.precificacao': 0,
            'proposta.linkArquivo': 0,
            'proposta.autor': 0,
          },
        },
      ])
      .toArray()

    // Getting activities
    var activitiesQueryResponsibleParam
    if (session.user.visibilidade == 'GERAL') {
      activitiesQueryResponsibleParam = {
        $ne: null,
      }
    } else {
      activitiesQueryResponsibleParam = session.user.id
    }
    const openActivities = await eventsCollection
      .find({
        'responsavel.id': activitiesQueryResponsibleParam,
        categoria: 'ATIVIDADE',
        dataConclusao: null,
      })
      .toArray()

    const formatted = projects.map((project: any) => {
      const correpondentActivities = openActivities.filter((act: any) => act.projeto.id == project._id)
      return {
        ...project,
        atividades: formatActivitiesWithStatus(correpondentActivities),
      }
    })
    res.status(200).json({ data: formatted })
  }
}

type PutResponse = {
  data: any
  message: string
}
const editProjectSchema = z.object({
  nome: z
    .string({
      required_error: 'Por favor, preencha o nome para identificação do projeto.',
    })
    .min(5, { message: 'Por favor, preencha um nome com ao menos 5 letras.' })
    .optional(),
  tipoProjeto: z
    .union([z.literal('SISTEMA FOTOVOLTAICO'), z.literal('OPERAÇÃO E MANUTENÇÃO')], {
      required_error: 'Por favor, preencha o tipo do projeto.',
      invalid_type_error: 'Por favor, preencha um tipo válido de projeto.',
    })
    .optional(),
  responsavel: z
    .object(
      {
        nome: z.string(),
        id: z.string(),
      },
      { required_error: 'Por favor, especifique o responsável.' }
    )
    .optional(),
  representante: z
    .object(
      {
        nome: z.string(),
        id: z.string(),
      },
      { required_error: 'Por favor, especifique o representante.' }
    )
    .optional(),
  clienteId: z
    .string({
      required_error: 'Por favor, especifique o ID do cliente.',
    })
    .optional(),
  propostaAtiva: z.string().optional(),
  titularInstalacao: z
    .string({
      invalid_type_error: 'Tipo de dado inválido para titular da instalação.',
    })
    .optional(),
  numeroInstalacaoConcessionaria: z
    .string({
      invalid_type_error: 'Tipo de dado inválido para número de instalação da concessionária.',
    })
    .optional(),
  tipoTitular: z.union([z.literal('PESSOA FISICA'), z.literal('PESSOA JURIDICA')]).optional(),
  tipoLigacao: z.union([z.literal('EXISTENTE'), z.literal('NOVA')]).optional(),
  tipoInstalacao: z.union([z.literal('URBANO'), z.literal('RURAL')]).optional(),
  credor: z.string().optional(),
  servicosAdicionais: z
    .object({
      padrao: z.number().optional().nullable(),
      estrutura: z.number().optional().nullable(),
      outros: z.number().optional().nullable(),
    })
    .optional(),
  anexos: z
    .object({
      documentoComFoto: z.string().optional().nullable(),
      iptu: z.string().optional().nullable(),
      contaDeEnergia: z.string().optional().nullable(),
      laudo: z.string().optional().nullable(),
    })
    .optional(),
  descricao: z.string().optional(),
  funis: z
    .array(z.object({ id: z.number(), etapaId: z.number() }), {
      required_error: 'Por favor, vincule um funil a esse projeto.',
    })
    .optional(),
  dataPerda: z.string().optional().nullable(),
  motivoPerda: z.string().optional().nullable(),
  contratoSolicitado: z.boolean().optional(),
  dataSolicitacaoContrato: z.string().optional(),
  idSolicitacaoContrato: z.string().optional(),
})
const editProjects: NextApiHandler<PutResponse> = async (req, res) => {
  const session = await validateAuthorization(req, res, 'projetos', 'serResponsavel', true)

  const { id, responsavel } = req.query
  const userId = session.user.id
  const userHasEditPermission = session.user.permissoes.projetos.editar

  if (!id || typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID do objeto de alteração não especificado.')
  if (!req.body.changes) throw new createHttpError.BadRequest('Mudanças não especificadas na requisição.')
  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const collection = db.collection('projects')
  if (!userHasEditPermission) await validateEditAuthorization({ collection, userId, projectId: id })

  const changes = editProjectSchema.parse(req.body.changes)
  const setObj = formatUpdateSetObject(changes)
  console.log('SET OBJECT', setObj)
  if (typeof id === 'string') {
    const data = await collection.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      {
        $set: { ...setObj },
      },
      {
        returnDocument: 'after',
      }
    )
    res.status(201).json({ data: data.value as any, message: 'Projeto alterado com sucesso.' })
  }
}
export default apiHandler({
  POST: createProject,
  GET: getProjects,
  PUT: editProjects,
})

type ValidateEditAuthorizationParams = {
  collection: Collection
  projectId: string
  userId: string
}
async function validateEditAuthorization({ collection, projectId, userId }: ValidateEditAuthorizationParams) {
  try {
    const projectSimplified = await collection.findOne({ _id: new ObjectId(projectId) }, { projection: { responsavel: 1, representante: 1 } })
    if (!projectSimplified) throw new createHttpError.NotFound('Projeto não econtrado.')
    const isAuthorized = userId == projectSimplified.responsavel.id || userId == projectSimplified.representante.id

    if (!isAuthorized) throw new createHttpError.Unauthorized('Somente o responsável/representante ou administradores podem alterar esse projeto.')
  } catch (error) {
    throw error
  }
}
