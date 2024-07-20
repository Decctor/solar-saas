import dayjs from 'dayjs'
import { TPartnerDTOWithSubscriptionAndUsers } from '../schemas/partner.schema'

export function validateSubscriptionAccess(partner: TPartnerDTOWithSubscriptionAndUsers) {
  // In case partner has an active subscription, returning true access
  if (partner.assinatura?.status == 'active') return true

  // Validating free trial

  // In case there is not free trial defined, returning false access
  if (!partner.testeGratis.inicio && !partner.testeGratis.fim) return false

  // In case there is a defined trial period, validating its extension
  const trialEnd = partner.testeGratis.fim

  const isTrialOver = dayjs(new Date()).isAfter(trialEnd)

  if (isTrialOver) return false

  return true
}
