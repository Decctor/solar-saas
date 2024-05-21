import connectToAmpereDatabase from '@/services/mongodb/ampere-db-connection'
import connectToDatabase from '@/services/mongodb/crm-db-connection'
import { apiHandler } from '@/utils/api'
import { TClient } from '@/utils/schemas/client.schema'
import { TKit, TProductItem, TServiceItem } from '@/utils/schemas/kits.schema'
import { TOpportunity } from '@/utils/schemas/opportunity.schema'
import { TProduct } from '@/utils/schemas/products.schema'
import { TSaleGoal } from '@/utils/schemas/sale-goal.schema'
import { AuthorSchema } from '@/utils/schemas/user.schema'
import { Collection, ObjectId, WithId } from 'mongodb'
import { NextApiHandler } from 'next'
import { z } from 'zod'

const migrate: NextApiHandler<any> = async (req, res) => {
  const ampereDb = await connectToAmpereDatabase(process.env.MONGODB_CRM, 'main')
  const ampereSaleGoalsCollection: Collection<TAmpereSaleGoal> = ampereDb.collection('saleGoals')

  const ampereSaleGoals = await ampereSaleGoalsCollection.find({}).toArray()

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const saleGoalsCollection: Collection<TSaleGoal> = db.collection('sale-goals')

  const saleGoals = ampereSaleGoals.map((goal) => {
    return {
      _id: goal._id,
      periodo: goal.periodo,
      idParceiro: '65454ba15cf3e3ecf534b308',
      usuario: {
        id: goal.vendedor.id,
        nome: goal.vendedor.nome,
      },
      autor: {
        id: '65453222e345279bdfcac0dc',
        nome: 'Lucas Fernandes',
        avatar_url: 'https://avatars.githubusercontent.com/u/60222823?s=400&u=d82dbc3d1d666b315b793f1888fd65c92d8ca0a9&v=4',
      },
      metas: {
        projetosCriados: goal.metas.projetosCriados,
        potenciaVendida: goal.metas.potenciaPico,
        valorVendido: goal.metas.valorVendido,
        projetosVendidos: goal.metas.projetosVendidos,
        projetosEnviados: goal.metas.projetosEnviados,
        conversao: goal.metas.conversao,
      },
      dataInsercao: new Date().toISOString(),
    } as WithId<TSaleGoal>
  })
  const insertManyResponse = await saleGoalsCollection.insertMany(saleGoals)
  return res.status(200).json(insertManyResponse)
}

export default apiHandler({ GET: migrate })

interface TAmpereSaleGoal {
  periodo: string
  vendedor: {
    id: string
    nome: string
  }
  metas: {
    potenciaPico?: number | null
    valorVendido?: number | null
    projetosVendidos?: number | null
    projetosEnviados?: number | null
    conversao?: number | null
    projetosCriados?: number | null
  }
}
