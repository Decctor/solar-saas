import { NextApiHandler } from 'next'
import { z } from 'zod'

type GetResponse = {
  data: { insertedId: string }
  message: string
}

const CreatingSimulationSchema = z.object({
  partnerId: z.string({
    required_error: 'ID de referência do parceiro não informado.',
    invalid_type_error: 'Tipo não válido para o ID de referência do parceiro.',
  }),
  simulation: z.object({
    nome: z.string({ required_error: 'Nome não informado.', invalid_type_error: 'Nome não informado ou inválido..' }),
    email: z.string({ required_error: 'Email não informado.', invalid_type_error: 'Email não informado ou inválido..' }),
    telefone: z.string({ required_error: 'Telefone não informado.', invalid_type_error: 'Telefone não informado ou inválido..' }),
    estado: z.string({ required_error: 'Estado não informado.', invalid_type_error: 'Estado não informado ou inválido..' }),
    cidade: z.string({ required_error: 'Cidade não informado.', invalid_type_error: 'Cidade não informado ou inválido..' }),
  }),
})

const createSimulation: NextApiHandler<GetResponse> = async (req, res) => {
  const { partnerId, simulation } = CreatingSimulationSchema.parse(req.body)
}
