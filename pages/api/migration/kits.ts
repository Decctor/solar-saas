import connectToAmpereDatabase from '@/services/mongodb/ampere-db-connection'
import connectToDatabase from '@/services/mongodb/crm-db-connection'
import { apiHandler } from '@/utils/api'
import { TClient } from '@/utils/schemas/client.schema'
import { TKit, TProductItem, TServiceItem } from '@/utils/schemas/kits.schema'
import { TOpportunity } from '@/utils/schemas/opportunity.schema'
import { TProduct } from '@/utils/schemas/products.schema'
import { AuthorSchema } from '@/utils/schemas/user.schema'
import { Collection, ObjectId, WithId } from 'mongodb'
import { NextApiHandler } from 'next'
import { z } from 'zod'

const migrate: NextApiHandler<any> = async (req, res) => {
  const ampereDb = await connectToAmpereDatabase(process.env.MONGODB_CRM, 'main')
  const ampereKitsCollection: Collection<TAmpereKit> = ampereDb.collection('kits')

  const ampereKits = await ampereKitsCollection.find({}).toArray()

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const kitsCollection: Collection<TKit> = db.collection('kits')

  const kits = ampereKits.map((kit) => {
    const modulesProducts: TProductItem[] = kit.modulos.map((mod) => ({
      categoria: 'MÓDULO',
      fabricante: mod.fabricante,
      modelo: mod.modelo,
      qtde: mod.qtde,
      garantia: mod.garantia,
      potencia: mod.potencia,
    }))
    const invertersProducts: TProductItem[] = kit.inversores.map((mod) => ({
      categoria: 'INVERSOR',
      fabricante: mod.fabricante,
      modelo: mod.modelo,
      qtde: mod.qtde,
      garantia: mod.garantia,
      potencia: mod.potenciaNominal,
    }))
    const products = [...modulesProducts, ...invertersProducts]
    const services: TServiceItem[] = [
      {
        descricao: 'PROJETO',
        observacoes: '',
        garantia: 1,
      },
      {
        descricao: 'HOMOLOGAÇÃO',
        observacoes: '',
        garantia: 1,
      },
      {
        descricao: 'MONTAGEM',
        observacoes: '',
        garantia: 1,
      },
      {
        descricao: 'COMISSIONAMENTO',
        observacoes: '',
        garantia: 1,
      },
    ]
    return {
      _id: kit._id,
      nome: kit.nome,
      idParceiro: '65454ba15cf3e3ecf534b308',
      idMetodologiaPrecificacao: '65eb1ad575f76eecf97a5041',
      ativo: kit.ativo,
      topologia: kit.topologia,
      potenciaPico: kit.potPico,
      preco: kit.preco,
      estruturasCompativeis: kit.estruturasCompativeis,
      produtos: products,
      servicos: services,
      autor: {
        id: kit.autor.id,
        nome: kit.autor.nome,
        avatar_url: kit.autor.avatar_url,
      },
      dataInsercao: kit.dataInsercao || new Date().toISOString(),
    } as WithId<TKit>
  })

  const insertManyResponse = await kitsCollection.insertMany(kits)
  return res.status(200).json(insertManyResponse)
}

export default apiHandler({ GET: migrate })

const InverterSchema = z.object({
  id: z.union([z.string(), z.number()]),
  fabricante: z.string(),
  modelo: z.string(),
  qtde: z.number(),
  garantia: z.number(),
  potenciaNominal: z.number(),
})
const ModuleSchema = z.object({
  id: z.union([z.string(), z.number()]),
  fabricante: z.string(),
  modelo: z.string(),
  qtde: z.number(),
  garantia: z.number(),
  potencia: z.number(),
})

const GeneralKitSchema = z.object({
  nome: z.string(),
  ativo: z.boolean(),
  categoria: z.union([z.literal('ON-GRID'), z.literal('OFF-GRID'), z.literal('BOMBA SOLAR')]),
  tipo: z.union([z.literal('TRADICIONAL'), z.literal('PROMOCIONAL')]),
  topologia: z.union([z.literal('INVERSOR'), z.literal('MICRO-INVERSOR')]),
  potPico: z.number(),
  preco: z.number(),
  fornecedor: z.string(),
  estruturasCompativeis: z.array(z.string()),
  incluiEstrutura: z.boolean(),
  incluiTransformador: z.boolean(),
  inversores: z.array(InverterSchema),
  modulos: z.array(ModuleSchema),
  autor: AuthorSchema,
  dataAlteracao: z.string().datetime().optional().nullable(),
  dataValidade: z.string().datetime().optional().nullable(),
  dataInsercao: z.string().datetime(),
})

type TAmpereKit = z.infer<typeof GeneralKitSchema>
