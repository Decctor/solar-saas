import connectToDatabase from '@/services/mongodb/main-db-connection'
import { apiHandler, validateAuthentication, validateAuthorization } from '@/utils/api'
import { ProjectActivity, ProjectNote } from '@/utils/models'
import createHttpError from 'http-errors'
import { ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'
import { z } from 'zod'

type PostResponse = {
  data: ProjectActivity | ProjectNote
  message: string
}

const eventSchema = z.union([
  z.object({
    projeto: z.object({
      id: z.string(),
      nome: z.string(),
      codigo: z.string(),
    }),
    responsavel: z.object({
      id: z.string(),
      nome: z.string(),
      avatar_url: z.string().nullable(),
    }),
    titulo: z
      .string({ required_error: 'Por favor, forneça o título da atividade.' })
      .min(5, 'Por favor, dê um título de ao menos 5 letras à atividade.'),
    categoria: z.literal('ATIVIDADE'),
    tipo: z.union([z.literal('LIGAÇÃO'), z.literal('REUNIÃO'), z.literal('VISITA TÉCNICA')], {
      required_error: 'Por favor, forneça o tipo da atividade.',
      invalid_type_error: 'Tipo de atividade não válido.',
    }),
    dataVencimento: z
      .string({
        required_error: 'Por favor, forneça a data de vencimento da atividade.',
      })
      .datetime({ message: 'Data de vencimento contém formato não válido.' }),
    observacoes: z.string(),
    autor: z.object({
      id: z.string(),
      nome: z.string(),
      avatar_url: z.string().nullable(),
    }),
  }),
  z.object({
    projeto: z.object({
      id: z.string(),
      nome: z.string(),
      codigo: z.string(),
    }),
    categoria: z.literal('ANOTAÇÃO'),
    anotacao: z.string({
      required_error: 'Por favor, preencha uma anotação ou atualização acerca do projeto.',
      invalid_type_error: 'Formato da anotação não válido.',
    }),
    autor: z.object({
      id: z.string(),
      nome: z.string(),
      avatar_url: z.string().nullable(),
    }),
  }),
])

const createEvent: NextApiHandler<PostResponse> = async (req, res) => {
  await validateAuthentication(req)

  const db = await connectToDatabase(process.env.MONGODB_URI, 'main')
  const collection = db.collection('projectsEvents')
  console.log(req.body)
  const event = eventSchema.parse(req.body)
  let dbRes = await collection.insertOne({
    ...event,
    dataInsercao: new Date().toISOString(),
  })
  const message = {
    ANOTAÇÃO: 'Anotação criada com sucesso.',
    ATIVIDADE: 'Atividade criada com sucesso.',
  }
  res.status(201).json({
    data: { ...event, dataInsercao: new Date().toISOString() },
    message: message[event.categoria],
  })
}

type GetResponse = {
  data: {
    open: ProjectActivity[]
    closed: (ProjectActivity | ProjectNote)[]
  }
}
const getEvents: NextApiHandler<GetResponse> = async (req, res) => {
  await validateAuthentication(req)
  const { id } = req.query
  if (!id || typeof id !== 'string') {
    throw 'ID de projeto inválido.'
  }
  const db = await connectToDatabase(process.env.MONGODB_URI, 'main')
  const collection = db.collection('projectsEvents')
  const events = await collection.find({ 'projeto.id': id }).sort({ dataInsercao: -1 }).toArray()
  const open = events.filter((event: any) => event.categoria == 'ATIVIDADE' && !event.dataConclusao)
  const closed = events.filter((event: any) => event.categoria == 'ANOTAÇÃO' || (event.categoria == 'ATIVIDADE' && !!event.dataConclusao))
  res.status(200).json({ data: { open: open, closed: closed } })
}

type PutResponse = {
  data: string
}
const eventEditSchema = z.union([
  z.object({
    projeto: z
      .object({
        id: z.string(),
        nome: z.string(),
        codigo: z.string(),
      })
      .optional(),
    titulo: z
      .string({ required_error: 'Por favor, forneça o título da atividade.' })
      .min(5, 'Por favor, dê um título de ao menos 5 letras à atividade.')
      .optional(),
    categoria: z.literal('ATIVIDADE').optional(),
    tipo: z
      .union([z.literal('LIGAÇÃO'), z.literal('REUNIÃO'), z.literal('VISITA TÉCNICA')], {
        required_error: 'Por favor, forneça o tipo da atividade.',
        invalid_type_error: 'Tipo de atividade não válido.',
      })
      .optional(),
    dataVencimento: z
      .string({
        required_error: 'Por favor, forneça a data de vencimento da atividade.',
      })
      .datetime({ message: 'Data de vencimento contém formato não válido.' })
      .optional(),
    observacoes: z.string().optional(),
    autor: z
      .object({
        id: z.string(),
        nome: z.string(),
        avatar_url: z.string(),
      })
      .optional(),
    dataConclusao: z.string().optional().nullable(),
  }),
  z.object({
    projeto: z
      .object({
        id: z.string(),
        nome: z.string(),
        codigo: z.string(),
      })
      .optional(),
    categoria: z.literal('ANOTAÇÃO').optional(),
    anotacao: z
      .string({
        required_error: 'Por favor, preencha uma anotação ou atualização acerca do projeto.',
        invalid_type_error: 'Formato da anotação não válido.',
      })
      .optional(),
    autor: z
      .object({
        id: z.string(),
        nome: z.string(),
        avatar_url: z.string(),
      })
      .optional(),
  }),
])
const updateEvent: NextApiHandler<PutResponse> = async (req, res) => {
  const session = await validateAuthorization(req, res, 'projetos', 'serResponsavel', true)

  const { id, responsible } = req.query
  console.log(req.body, req.query)
  const changes = eventEditSchema.parse(req.body)

  const db = await connectToDatabase(process.env.MONGODB_URI, 'main')
  const collection = db.collection('projectsEvents')
  if (!session.user.permissoes.projetos.editar && responsible != session.user.id) {
    throw new createHttpError.Unauthorized('Somente o responsável ou administradores podem alterar essa anotação/atividade.')
  }
  console.log(changes)
  if (typeof id === 'string') {
    const data = await collection.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      {
        $set: { ...changes },
      },
      {
        returnNewDocument: true,
      }
    )
    res.status(201).json({ data: 'Alteração realizada com sucesso!' })
  } else {
    throw 'Tipo de ID inválido.'
  }
}
export default apiHandler({
  POST: createEvent,
  GET: getEvents,
  PUT: updateEvent,
})
