import { AxiosError } from 'axios'
import createHttpError from 'http-errors'
import { ZodError } from 'zod'

export function getErrorMessage(error: any) {
  console.log('ERRO', error)
  if (createHttpError.isHttpError(error) && error.expose) return error.message as string
  if (error instanceof AxiosError) {
    const personalizedHttpError = error?.response?.data.error
    if (personalizedHttpError) return personalizedHttpError.message as string
    else return error.message
  }
  if (error instanceof ZodError) return error.errors[0].message
  return 'Houve um erro desconhecido, por favor, comunique o setor de tecnologia.'
}
