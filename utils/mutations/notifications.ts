import axios from 'axios'
import { TNotification, TNotificationDTO } from '../schemas/notification.schema'

// type NotifyOnResponsibleChangeParams = {
//   previousResponsible: {
//     id: string
//     nome: string
//   }
//   newResponsible: {
//     id: string
//     nome: string
//     email: string
//   }
//   referenceProject: {
//     id: string
//     nome: string
//     identificador: string
//   }
// }
// export async function notifyOnResponsibleChange({ previousResponsible, newResponsible, referenceProject }: NotifyOnResponsibleChangeParams) {
//   const notificationObject = {
//     remetente: 'SISTEMA',
//     destinatario: newResponsible,
//     projetoReferencia: referenceProject,
//     mensagem: `O projeto em questão acaba de ser transferido a voce por ${previousResponsible.nome}.`,
//     dataInsercao: new Date().toISOString(),
//   }
//   try {
//     await axios.post('/api/notifications', notificationObject)
//     return 'Notificação criada com sucesso !'
//   } catch (error) {
//     throw error
//   }
// }

export async function createNotification({ info }: { info: TNotification }) {
  try {
    const { data } = await axios.post('/api/notifications', info)
    if (typeof data.message != 'string') return 'Notificação criada com sucesso !'
    return data.message as string
  } catch (error) {
    throw error
  }
}

export async function editNotification({ id, changes }: { id: string; changes: Partial<TNotificationDTO> }) {
  try {
    const { data } = await axios.put(`/api/notifications?id=${id}`, changes)
    if (typeof data.message != 'string') return 'Notificação atualizada com sucesso !'
    return data.message as string
  } catch (error) {
    throw error
  }
}
