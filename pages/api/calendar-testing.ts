import { apiHandler } from '@/utils/api'
import { google } from 'googleapis'
import { NextApiHandler } from 'next'

type GetResponse = any

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']

const oauth2Client = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET_KEY,
  redirectUri: 'http://localhost:3000',
})

const handleTest: NextApiHandler<GetResponse> = async (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  })

  return res.status(200).json(url)
}

export default apiHandler({ GET: handleTest })
