import { TIntegrationGoogleAuth } from '@/utils/schemas/integration.schema'
import { Collection, Db, Filter } from 'mongodb'
import { Session } from 'next-auth'
import { getGoogleAuthAccess } from '.'
import { google, tasks_v1 } from 'googleapis'

type CreateGoogleTaskParams = {
  session: Session
  database: Db
  task: {
    title: string
    notes: string
    due?: string
  }
}
export async function createGoogleTask({ session, database, task }: CreateGoogleTaskParams) {
  try {
    const userId = session.user.id
    const partnerId = session.user.idParceiro
    const partnerQuery: Filter<TIntegrationGoogleAuth> = { idParceiro: partnerId }
    const integrationsCollection: Collection<TIntegrationGoogleAuth> = database.collection('integrations')
    const authAccess = await getGoogleAuthAccess({ userId: userId, collection: integrationsCollection, query: partnerQuery })

    const tasks = google.tasks({ version: 'v1', auth: process.env.GOOGLE_API_KEY })
    const tasksResponse = await tasks.tasks.insert({
      tasklist: '@default',
      requestBody: task,
      auth: authAccess,
    })
    const insertedTaskId = tasksResponse.data.id as string
    return insertedTaskId
  } catch (error) {
    throw error
  }
}
type ConcludeGoogleTaskParams = {
  session: Session
  database: Db
  taskId: string
  conclusionDate: string
}
export async function concludeGoogleTask({ session, database, taskId, conclusionDate }: ConcludeGoogleTaskParams) {
  try {
    const userId = session.user.id
    const partnerId = session.user.idParceiro
    const partnerQuery: Filter<TIntegrationGoogleAuth> = { idParceiro: partnerId }
    const integrationsCollection: Collection<TIntegrationGoogleAuth> = database.collection('integrations')
    const authAccess = await getGoogleAuthAccess({ userId: userId, collection: integrationsCollection, query: partnerQuery })

    const tasks = google.tasks({ version: 'v1', auth: process.env.GOOGLE_API_KEY })
    const tasksResponse = await tasks.tasks.patch({
      tasklist: '@default',
      task: taskId,
      requestBody: {
        completed: conclusionDate,
        status: 'completed',
      },
      auth: authAccess,
    })
    const insertedTaskId = tasksResponse.data.id as string
    return insertedTaskId
  } catch (error) {
    throw error
  }
}
