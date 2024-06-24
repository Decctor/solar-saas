import { getUserById } from '@/repositories/users/queries'
import { getGoogleAuthClient } from '@/services/google/auth-client'
import { TIntegrationGoogleAuth } from '@/utils/schemas/integration.schema'
import { TUser } from '@/utils/schemas/user.schema'
import { Credentials, OAuth2Client } from 'google-auth-library'
import createHttpError from 'http-errors'
import { Collection, Db, Filter } from 'mongodb'
type CreateGoogleAuthTokensParams = {
  userId: string
  tokens: Credentials
  authorizationCode: string
  database: Db
}
export async function createGoogleAuthIntegration({ userId, tokens, authorizationCode, database }: CreateGoogleAuthTokensParams) {
  try {
    const usersCollection: Collection<TUser> = database.collection('users')
    const user = await getUserById({ collection: usersCollection, id: userId, query: {} })
    if (!user) throw new createHttpError.NotFound('Usuário não encontrado.')
    const integration: TIntegrationGoogleAuth = {
      identificador: 'GOOGLE_AUTH',
      idParceiro: user.idParceiro,
      autor: {
        id: user._id.toString(),
        nome: user.nome,
        avatar_url: user.avatar_url,
      },
      userId: userId,
      authorization_code: authorizationCode,
      access_token: tokens.access_token || undefined,
      refresh_token: tokens.refresh_token || undefined,
      dataExpiracaoToken: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : undefined,
      dataValidacaoToken: new Date().toISOString(),
      dataInsercao: new Date().toISOString(),
    }
    const integrationsCollection: Collection<TIntegrationGoogleAuth> = database.collection('integrations')
    const insertResponse = await integrationsCollection.insertOne(integration)
    return insertResponse
  } catch (error) {
    throw error
  }
}

type GetGoogleAuthTokenParams = {
  userId: string
  collection: Collection<TIntegrationGoogleAuth>
  query: Filter<TIntegrationGoogleAuth>
}
export async function getGoogleAuthAccess({ userId, collection, query }: GetGoogleAuthTokenParams) {
  try {
    const authClient = getGoogleAuthClient()
    const currentDate = new Date()
    const integration = await collection.findOne({ identificador: 'GOOGLE_AUTH', userId: userId, ...query })
    const access_token = integration?.access_token
    const refresh_token = integration?.refresh_token
    const expirationDate = integration?.dataExpiracaoToken ? new Date(integration?.dataExpiracaoToken) : null
    const expiry_date = expirationDate?.getTime() || 0
    if (!access_token || !refresh_token || !expirationDate) throw new createHttpError.InternalServerError('Oops, ocorreu um erro desconhecido.')
    authClient.setCredentials({ access_token, refresh_token, expiry_date })
    console.log(expirationDate)
    if (currentDate >= expirationDate) {
      console.log('PASSEI POR AQUI', expirationDate)
      const tokenResponse = await authClient.refreshAccessToken()
      const newTokens = tokenResponse.credentials
      await collection.updateOne(
        { identificador: 'GOOGLE_AUTH', userId: userId, ...query },
        {
          $set: {
            access_token: newTokens.access_token || undefined,
            refresh_token: newTokens.refresh_token || undefined,
            dataValidacaoToken: new Date().toISOString(),
          },
        }
      )
      authClient.setCredentials(newTokens)
    }
    return authClient
  } catch (error) {
    throw error
  }
}
