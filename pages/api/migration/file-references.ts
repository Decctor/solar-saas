import connectToAmpereDatabase from '@/services/mongodb/ampere-db-connection'
import connectToDatabase from '@/services/mongodb/main-db-connection'
import { apiHandler } from '@/utils/api'
import { TClient } from '@/utils/schemas/client.schema'
import { TFileReference } from '@/utils/schemas/file-reference.schema'
import { TOpportunity } from '@/utils/schemas/opportunity.schema'
import { Collection, ObjectId, WithId } from 'mongodb'
import { NextApiHandler } from 'next'
import { z } from 'zod'

const migrate: NextApiHandler<any> = async (req, res) => {
  const ampereDb = await connectToAmpereDatabase(process.env.MONGODB_CRM, 'main')
  const ampereFileReferencesCollection: Collection<TAmpereFileReference> = ampereDb.collection('file-references')

  const ampereFileReferences = await ampereFileReferencesCollection.find({}).toArray()

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const fileReferencesCollection = db.collection('file-references')

  const fileReferences = ampereFileReferences.map((reference) => {
    return {
      _id: reference._id,
      titulo: reference.titulo,
      idParceiro: '65454ba15cf3e3ecf534b308',
      idCliente: reference.idCliente,
      idOportunidade: reference.idOportunidade,
      idHomologacao: reference.idHomologacao,
      formato: reference.formato,
      url: reference.url,
      autor: {
        id: reference.autor.id,
        nome: reference.autor.nome,
        avatar_url: reference.autor.avatar_url,
      },
      tamanho: reference.tamanho,
      dataInsercao: reference.dataInsercao || new Date().toISOString(),
    } as WithId<TFileReference>
  })

  const insertManyResponse = await fileReferencesCollection.insertMany(fileReferences)
  return res.status(200).json(insertManyResponse)
}

export default apiHandler({ GET: migrate })

const GeneralFileReferenceSchema = z.object({
  idOportunidade: z.string().optional().nullable(),
  idCliente: z.string().optional().nullable(),
  idHomologacao: z.string().optional().nullable(),
  titulo: z.string(),
  formato: z.string(),
  url: z.string(),
  tamanho: z.number().optional().nullable(),
  autor: z.object({
    id: z.string(),
    nome: z.string(),
    avatar_url: z.string().optional().nullable(),
  }),
  dataInsercao: z.string().datetime(),
})

type TAmpereFileReference = z.infer<typeof GeneralFileReferenceSchema>
