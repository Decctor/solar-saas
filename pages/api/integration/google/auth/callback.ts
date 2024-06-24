import { getGoogleAuthClient, setGoogleAuthCredentials } from '@/services/google/auth-client'
import connectToDatabase from '@/services/mongodb/crm-db-connection'
import { apiHandler } from '@/utils/api'
import { createGoogleAuthIntegration } from '@/utils/integrations/google'
import { google } from 'googleapis'
import createHttpError from 'http-errors'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: string
  message: string
}
const handleOAuthCallback: NextApiHandler<GetResponse> = async (req, res) => {
  const { code, state } = req.query
  const authClient = getGoogleAuthClient()

  if (!state) throw new createHttpError.BadRequest('Parâmetros de estado inválido ou não informado.')
  const queryParams = new URLSearchParams(state as string)
  const userId = queryParams.get('userId')
  if (!userId) throw new createHttpError.BadRequest('Parâmetros de estado inválido ou não informado.')
  const { tokens } = await authClient.getToken(code as string)
  setGoogleAuthCredentials({ authClient, tokens })
  const { access_token, refresh_token, expiry_date } = tokens
  console.log('DATA DE EXPIRAÇÃO', new Date(expiry_date as number).toLocaleString('pt-br'))
  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const integrationInsertResponse = await createGoogleAuthIntegration({ userId, tokens, authorizationCode: code as string, database: db })
  if (!integrationInsertResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido ao criar integração.')

  return res.redirect('/configuracoes?initialMode=integrations')
  // if (state) {
  //   const queryParams = new URLSearchParams(state as string)
  //   const userId = queryParams.get('userId')
  //   // Agora você pode usar userId para associar o token de acesso ao usuário no banco de dados
  //   const { tokens } = await authClient.getToken(code as string)
  //   authClient.setCredentials(tokens)

  //   const { access_token, refresh_token, expiry_date } = tokens

  //   console.log('DATA DE EXPIRAÇÃO', new Date(expiry_date).toLocaleString('pt-br'))

  //   const data = await google.calendar('v3').events.list({ calendarId: 'primary', oauth_token: access_token })
  //   res.status(200).json(data)
  // } else {
  //   res.status(400).json({ error: 'State parameter is missing' })
  // }
}

export default apiHandler({ GET: handleOAuthCallback })
