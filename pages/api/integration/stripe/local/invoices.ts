import connectToDatabase from '@/services/mongodb/crm-db-connection'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TInvoice } from '@/utils/schemas/invoices.schema'
import { TSubscription } from '@/utils/schemas/subscription.schema'
import createHttpError from 'http-errors'
import { Collection, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: TInvoice[]
}
const getSubscriptionInvoicesRoute: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const userPartnerId = session.user.idParceiro
  const userIsAdmin = session.user.administrador

  const { subscriptionId } = req.query
  if (!subscriptionId || typeof subscriptionId != 'string') throw new createHttpError.BadRequest('ID de assinatura inválido.')

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const subscriptionsCollection: Collection<TSubscription> = db.collection('subscriptions')
  const invoicesCollection: Collection<TInvoice> = db.collection('invoices')

  const subscription = await subscriptionsCollection.findOne({ _id: new ObjectId(subscriptionId) })
  if (!subscription) throw new createHttpError.NotFound('Assinatura não encontrada.')

  // In case user partner id is different from the partnerId of the requested subscription
  // Checking if user is admin, if not, throwing unauthorized
  if (userPartnerId != subscription.idParceiro && !userIsAdmin) throw new createHttpError.Unauthorized('Acesso não autorizado.')

  const stripeSubscriptionId = subscription.idAssinaturaStripe

  const invoices = await invoicesCollection.find({ idAssinaturaStripe: stripeSubscriptionId }).toArray()

  return res.status(200).json({ data: invoices })
}

export default apiHandler({ GET: getSubscriptionInvoicesRoute })
