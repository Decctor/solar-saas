import { z } from 'zod'

const GeneralInvoiceSchema = z.object({
  status: z.enum(['succeeded', 'failed']),
  idFaturaStripe: z.string(),
  idAssinaturaStripe: z.string(),
  idClienteStripe: z.string(),
  emailClienteStripe: z.string(),
  valorPago: z.number().optional().nullable(),
  valorDevido: z.number().optional().nullable(),
  moeda: z.string(),
  idParceiro: z.string(),
  periodo: z.object({
    inicio: z.string(),
    fim: z.string(),
  }),
  dataCriacao: z.string(),
  dataPagamento: z.string().optional().nullable(),
})

export type TInvoice = z.infer<typeof GeneralInvoiceSchema>
export type TInvoiceDTO = TInvoice & { _id: string }
