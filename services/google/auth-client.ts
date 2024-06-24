import { google } from 'googleapis'
import { OAuth2Client, Credentials } from 'google-auth-library'
export function getGoogleAuthClient() {
  return new OAuth2Client({
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET_KEY,
    redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
  })
}
export function setGoogleAuthCredentials({ authClient, tokens }: { authClient: OAuth2Client; tokens: Credentials }) {
  authClient.setCredentials(tokens)
  return
}
