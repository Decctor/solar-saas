import { z } from 'zod'

const GeneralUserGroupSchema = z.object({
  titulo: z.string({ required_error: 'Título do grupo de usuários não informado.', invalid_type_error: 'Tipo não válido' }),
})
