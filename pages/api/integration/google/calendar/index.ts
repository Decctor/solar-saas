import { getGoogleAuthClient } from '@/services/google/auth-client'
import connectToDatabase from '@/services/mongodb/crm-db-connection'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { getGoogleAuthAccess } from '@/utils/integrations/google'
import { TIntegrationGoogleAuth } from '@/utils/schemas/integration.schema'
import dayjs from 'dayjs'
import { calendar_v3, google } from 'googleapis'
import { Collection, Filter } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: any
}

const getCalendars: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const userId = session.user.id
  const partnerId = session.user.idParceiro
  const partnerQuery: Filter<TIntegrationGoogleAuth> = { idParceiro: partnerId }
  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const integrationsCollection: Collection<TIntegrationGoogleAuth> = db.collection('integrations')
  const authAccess = await getGoogleAuthAccess({ userId: userId, collection: integrationsCollection, query: partnerQuery })
  console.log(authAccess.credentials)
  const calendar = google.calendar({ version: 'v3', auth: process.env.GOOGLE_API_KEY })
  const event: calendar_v3.Schema$Event = {
    summary: 'Evento Teste.',
    location: 'Minas Gerais, Brazil',
    description: 'Evento teste criado por API.',

    start: {
      dateTime: '2024-06-26T09:00:00-03:00', // Start time in ISO format with timezone offset for Brasilia
      timeZone: 'America/Sao_Paulo', // Timezone for Brasilia
    },

    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 }, // 24 hours before the event
        { method: 'popup', minutes: 10 }, // 10 minutes before the event
      ],
    },
  }
  const calendarResponse = await calendar.events.insert({ calendarId: 'primary', requestBody: event, auth: authAccess })

  return res.status(200).json(calendarResponse)
}

export default apiHandler({ GET: getCalendars })
