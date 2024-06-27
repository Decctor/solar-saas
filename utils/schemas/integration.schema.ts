import { z } from 'zod'
import { AuthorSchema } from './user.schema'

const IntegrationRecord = z.record(z.string(), z.string())

const GeneralIntegrationSchema = z.object({
  identificador: z.string(),
  idParceiro: z.string(),
  autor: AuthorSchema,
  dataInsercao: z.string(),
})

export type TIntegration = z.infer<typeof GeneralIntegrationSchema>

export type TIntegrationRDStation = TIntegration & {
  identificador: 'RD_STATION'
  client_id: string
  client_secret: string
  access_token?: string
  refresh_token?: string
  dataValidacaoToken?: string
}

export type TIntegrationGoogleAuth = TIntegration & {
  identificador: 'GOOGLE_AUTH'
  idUsuario: string
  authorization_code: string
  access_token?: string
  refresh_token?: string
  dataValidacaoToken?: string
  dataExpiracaoToken?: string
}
