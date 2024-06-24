import connectToDatabase from '@/services/mongodb/crm-db-connection'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { getGoogleAuthAccess } from '@/utils/integrations/google'
import { TIntegrationGoogleAuth } from '@/utils/schemas/integration.schema'
import dayjs from 'dayjs'
import { google, tasks_v1 } from 'googleapis'
import { Collection, Filter } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: any
}

const getTasks: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const userId = session.user.id
  const partnerId = session.user.idParceiro
  const partnerQuery: Filter<TIntegrationGoogleAuth> = { idParceiro: partnerId }
  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const integrationsCollection: Collection<TIntegrationGoogleAuth> = db.collection('integrations')
  const authAccess = await getGoogleAuthAccess({ userId: userId, collection: integrationsCollection, query: partnerQuery })
  console.log(authAccess.credentials)
  const tasks = google.tasks({ version: 'v1', auth: process.env.GOOGLE_API_KEY })
  const task: tasks_v1.Schema$Task = {
    title: 'NOVA TAREFA',
    notes: 'Criação de tarefa via API.',
    due: dayjs().add(1, 'day').toISOString(),
  }
  const calendarResponse = await tasks.tasks.insert({
    tasklist: '@default',
    requestBody: task,
    auth: authAccess,
  })

  return res.status(200).json(calendarResponse)
}

export default apiHandler({ GET: getTasks })
