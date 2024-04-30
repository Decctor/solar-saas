import { z } from 'zod'

export const ResponsiblesBodySchema = z.object({
  responsibles: z.array(z.string({ required_error: 'Responsáveis não informados ou inválidos.', invalid_type_error: 'Responsáveis inválidos.' })).nullable(),
  partners: z.array(z.string({ required_error: 'Parceiros não informados ou inválidos.', invalid_type_error: 'Parceiros inválidos.' })).nullable(),
})
