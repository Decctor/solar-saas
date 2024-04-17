import connectToAmpereDatabase from '@/services/mongodb/ampere-db-connection'
import connectToDatabase from '@/services/mongodb/main-db-connection'
import { apiHandler } from '@/utils/api'
import { TActivity } from '@/utils/schemas/activities.schema'
import { TClient } from '@/utils/schemas/client.schema'
import { TOpportunityHistory } from '@/utils/schemas/opportunity-history.schema'
import { TOpportunity } from '@/utils/schemas/opportunity.schema'
import { Collection, ObjectId, WithId } from 'mongodb'
import { NextApiHandler } from 'next'
import { z } from 'zod'

const migrate: NextApiHandler<any> = async (req, res) => {
  const ampereDb = await connectToAmpereDatabase(process.env.MONGODB_CRM, 'main')
  const ampereProjectEventsCollection: Collection<TAmpereProjectActivity | TAmpereProjectNote> = ampereDb.collection('projectsEvents')

  const ampereProjectEvents = await ampereProjectEventsCollection.find({}).toArray()
  //   const ampereUsers = await ampereUsersCollection.find({}).toArray()
  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const activitiesCollection = db.collection('activities')
  const opportunityHistoryCollection = db.collection('opportunities-history')

  const activities = ampereProjectEvents
    .filter((e) => e.categoria == 'ATIVIDADE')
    .map((activity) => {
      const info = activity as WithId<TAmpereProjectActivity>
      const responsible: TActivity['responsaveis'][number] = { id: info.responsavel.id, nome: info.responsavel.nome, avatar_url: info.responsavel.avatar_url }
      return {
        _id: info._id,
        idParceiro: '65454ba15cf3e3ecf534b308',
        titulo: info.titulo, // resume of the activity
        descricao: info.observacoes, // description of what to be done
        responsaveis: [responsible],
        oportunidade: {
          id: info.projeto.id,
          nome: info.projeto.nome,
        },
        idHomologacao: undefined,
        idAnaliseTecnica: undefined,
        subatividades: [],
        dataVencimento: info.dataVencimento,
        dataConclusao: info.dataConclusao,
        autor: {
          id: info.autor.id,
          nome: info.autor.nome,
          avatar_url: info.autor.avatar_url,
        },
        dataInsercao: info.dataInsercao || new Date().toISOString(),
      } as WithId<TActivity>
    })
  const notes = ampereProjectEvents
    .filter((e) => e.categoria == 'ANOTAÇÃO')
    .map((note) => {
      const info = note as WithId<TAmpereProjectNote>

      return {
        _id: info._id,
        idParceiro: '65454ba15cf3e3ecf534b308',
        oportunidade: {
          id: info.projeto.id,
          nome: info.projeto.nome,
        },
        categoria: 'ANOTAÇÃO',
        conteudo: info.anotacao,
        autor: {
          id: info.autor.id,
          nome: info.autor.nome,
          avatar_url: info.autor.avatar_url,
        },
        dataInsercao: info.dataInsercao || new Date().toISOString(),
      } as WithId<TOpportunityHistory>
    })
  const insertManyResponseActivities = await activitiesCollection.insertMany(activities)
  const insertManyResponseHistory = await opportunityHistoryCollection.insertMany(notes)
  return res.status(200).json({
    insertActivities: insertManyResponseActivities,
    insertNotes: insertManyResponseHistory,
  })
}

export default apiHandler({ GET: migrate })
export type TAmpereProjectActivity = {
  projeto: {
    id: string
    nome: string
    codigo: string
  }
  idParceiro?: string | null
  titulo: string
  categoria: 'ATIVIDADE' | null
  tipo: 'LIGAÇÃO' | 'REUNIÃO' | 'VISITA TÉCNICA' | 'HOMOLOGAÇÃO'
  dataVencimento?: string
  observacoes: string
  dataInsercao?: string
  dataConclusao?: string | null
  responsavel: {
    id: string
    nome: string
    avatar_url: string | null
  }
  autor: {
    id: string
    nome: string
    avatar_url: string | null
  }
  status?: 'VERDE' | 'LARANJA' | 'VERMELHO'
}

export type TAmpereProjectNote = {
  projeto: {
    id: string
    nome: string
    codigo: string
  }
  idParceiro?: string | null
  categoria: 'ANOTAÇÃO' | null
  anotacao: string
  dataInsercao?: string
  autor: {
    id: string
    nome: string
    avatar_url: string | null
  }
}
