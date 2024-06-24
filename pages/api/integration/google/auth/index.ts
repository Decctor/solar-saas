import { getGoogleAuthClient } from '@/services/google/auth-client'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { google } from 'googleapis'
import { NextApiHandler } from 'next'

const handleGoogleOAuthConfiguration: NextApiHandler<any> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/tasks']
  const authClient = getGoogleAuthClient()
  const url = authClient.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    state: `userId=${session.user.id}`,
  })

  return res.redirect(url)
}

export default apiHandler({ GET: handleGoogleOAuthConfiguration })
