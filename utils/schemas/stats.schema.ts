import { z } from 'zod'

export const ResponsiblesBodySchema = z.object({
  responsibles: z.array(z.string({ required_error: 'Responsáveis não informados ou inválidos.', invalid_type_error: 'Responsáveis inválidos.' })).nullable(),
})
