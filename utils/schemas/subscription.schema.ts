import { z } from 'zod'

const GeneralSubscriptionSchema = z.object({
  status: z.enum(['incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused']),
  idAssinaturaStripe: z.string(),
  precoUnitarioAssinatura: z.number(),
  qtdeAssinatura: z.number(),
  periodo: z.object({
    inicio: z.string(),
    fim: z.string(),
  }),
  idClienteStripe: z.string(),
  emailClienteStripe: z.string(),
  idPlanoStripe: z.string(),
  idParceiro: z.string(),
  dataInicio: z.string(),
})

export type TSubscription = z.infer<typeof GeneralSubscriptionSchema>
export type TSubscriptionDTO = TSubscription & { _id: string }
