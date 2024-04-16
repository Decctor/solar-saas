import axios from 'axios'
import dayjs from 'dayjs'
import { ProjectActivity } from '../models'
import { QueryClient, useMutation } from '@tanstack/react-query'
import { getErrorMessage } from '@/lib/methods/errors'
import toast from 'react-hot-toast'

type CreateActivityOnResponsibleChangeParams = {
  referenceProject: {
    id: string
    nome: string
    codigo: string
  }
  author: {
    id: string
    nome: string
    avatar_url: string | null
  }
  responsible: {
    id: string
    nome: string
    avatar_url: string | null
  }
}
export async function createActivityOnResponsibleChange({ referenceProject, author, responsible }: CreateActivityOnResponsibleChangeParams) {
  const activityObject: ProjectActivity = {
    projeto: referenceProject,
    titulo: 'PRIMEIROS CONTATOS',
    categoria: 'ATIVIDADE',
    tipo: 'LIGAÇÃO',
    observacoes: 'Apresentação do novo responsável.',
    dataVencimento: dayjs().add(2, 'days').toISOString(),
    dataInsercao: new Date().toISOString(),
    autor: author,
    responsavel: responsible,
  }
  try {
    const { data } = await axios.post('/api/projects/events', activityObject)
    return data.message
  } catch (error) {
    throw error
  }
}
export async function createActivity(info: ProjectActivity) {
  try {
    const { data } = await axios.post('/api/projects/events', info)
    return data.message as string
  } catch (error) {
    throw error
  }
}
type UseCreateActivityParams = {
  queryClient: QueryClient
  invalidateKey: string[]
}
export function useCreateActivity({ queryClient, invalidateKey }: UseCreateActivityParams) {
  return useMutation({
    mutationKey: ['create-activity'],
    mutationFn: createActivity,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: invalidateKey })
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: invalidateKey })
    },
    onError: (error) => {
      throw error
    },
  })
}
