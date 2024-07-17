import connectToDatabase from '@/services/mongodb/crm-db-connection'
import { apiHandler } from '@/utils/api'
import { TInvoice } from '@/utils/schemas/invoices.schema'
import { TPartner } from '@/utils/schemas/partner.schema'
import { TSubscription } from '@/utils/schemas/subscription.schema'
import createHttpError from 'http-errors'
import { Collection, Db, ObjectId } from 'mongodb'
import { NextApiHandler, NextApiResponse } from 'next'
import { buffer } from 'node:stream/consumers'
import getRawBody from 'raw-body'

import Stripe from 'stripe'

const endpointSecret = 'whsec_04b6616b4ebc739fc1c90edbfb5549a2f10f9ec9cecb6fb0d8a4621455acb423'

const stripe = new Stripe('sk_test_51Jd29hGCjFDtApCWA0OS5XOn6kpG2I2SsuwfKGaoiOrAEcebKRtnUXcjF7wH97FML5B7Su3RNqYToDseYbHhKEbU00YeY59eni')
const handleStripeWebhooks: NextApiHandler<any> = async (req, res) => {
  const buf = await buffer(req)
  console.log('HEADERS', req.headers)
  const stripeSignature = req.headers['stripe-signature']
  if (!stripeSignature || typeof stripeSignature != 'string') throw new createHttpError.BadRequest('Parâmetros inválidos.')

  try {
    const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
    const event = await stripe.webhooks.constructEventAsync(buf.toString(), stripeSignature!, endpointSecret)
    switch (event.type) {
      case 'customer.subscription.created':
        return handleSubscriptionEvent(event, 'created', db, res)
      case 'customer.subscription.updated':
        return handleSubscriptionEvent(event, 'updated', db, res)
      case 'customer.subscription.deleted':
        return handleSubscriptionEvent(event, 'deleted', db, res)
      case 'invoice.payment_succeeded':
        return handleInvoiceEvent(event, 'succeeded', db, res)
      case 'invoice.payment_failed':
        return handleInvoiceEvent(event, 'failed', db, res)
      case 'checkout.session.completed':
        return handleCheckoutSessionCompleted(event, db, res)
      default:
        return res.status(400).json({
          status: 400,
          error: 'Unhandled event type',
        })
    }
  } catch (error) {
    console.log(error)
    throw new createHttpError.InternalServerError('Ooops, um erro desconhecido ocorreu.')
  }
}
export default apiHandler({ POST: handleStripeWebhooks })
async function getCustomerEmail(customerId: string): Promise<string | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId)
    return (customer as Stripe.Customer).email
  } catch (error) {
    console.error('Error fetching customer:', error)
    return null
  }
}

async function handleSubscriptionEvent(event: Stripe.Event, type: 'created' | 'updated' | 'deleted', database: Db, response: NextApiResponse) {
  const subscription = event.data.object as Stripe.Subscription
  const customerEmail = await getCustomerEmail(subscription.customer as string)

  if (!customerEmail) throw new createHttpError.InternalServerError('Email do cliente não pode ser encontrado.')
  console.log('ASSINATURA', subscription)
  const subscriptionData: TSubscription = {
    status: subscription.status,
    idAssinaturaStripe: subscription.id,
    precoUnitarioAssinatura: (subscription.items.data[0]?.price.unit_amount || 0) / 100,
    qtdeAssinatura: subscription.items.data[0]?.quantity || 0,
    periodo: {
      inicio: new Date(subscription.current_period_start * 1000).toISOString(),
      fim: new Date(subscription.current_period_end * 1000).toISOString(),
    },
    idClienteStripe: subscription.customer as string,
    emailClienteStripe: customerEmail,
    idPlanoStripe: subscription.items.data[0]?.price.id,
    idParceiro: subscription.metadata?.idParceiro || '',
    dataInicio: new Date(subscription.created * 1000).toISOString(),
  }

  let data, error
  if (type == 'deleted') {
    // Firsting, updating the subscription status
    const subscriptionsCollection = database.collection('subscriptions')

    await subscriptionsCollection.updateOne({ idAssinaturaStripe: subscription.id }, { $set: { status: 'cancelled' } })

    // Second, updating partner subscription reference
    const partnersCollection: Collection<TPartner> = database.collection('partners')

    await partnersCollection.updateOne({ 'contatos.email': customerEmail }, { $set: { idAssinaturaStripe: null } })
  } else {
    const subscriptionsCollection = database.collection('subscriptions')
    if (type == 'created') await subscriptionsCollection.insertOne({ ...subscriptionData })
    if (type == 'updated') await subscriptionsCollection.updateOne({ idAssinaturaStripe: subscription.id }, { $set: { ...subscriptionData } })
  }

  return response.status(200).send(`Assinatura atualizada/criada/excluída com sucesso!`)
}

async function handleInvoiceEvent(event: Stripe.Event, status: 'succeeded' | 'failed', database: Db, response: NextApiResponse) {
  const invoice = event.data.object as Stripe.Invoice
  const customerEmail = await getCustomerEmail(invoice.customer as string)

  if (!customerEmail) throw new createHttpError.InternalServerError('Email do cliente não pode ser encontrado.')
  console.log('INVOICE', invoice)
  const invoiceData: TInvoice = {
    status,
    idFaturaStripe: invoice.id,
    idAssinaturaStripe: invoice.subscription as string,
    idClienteStripe: invoice.customer as string,
    emailClienteStripe: customerEmail,
    valorPago: status === 'succeeded' ? invoice.amount_paid / 100 : undefined,
    valorDevido: status === 'failed' ? invoice.amount_due / 100 : undefined,
    moeda: invoice.currency,
    idParceiro: invoice.metadata?.idParceiro || '',
    periodo: {
      inicio: new Date(invoice.period_start * 1000).toISOString(),
      fim: new Date(invoice.period_end * 1000).toISOString(),
    },
    dataCriacao: new Date(invoice.created * 1000).toISOString(),
    dataPagamento: invoice.status_transitions.paid_at ? new Date(invoice.status_transitions.paid_at * 1000).toISOString() : null,
  }

  const invoicesCollection: Collection<TInvoice> = database.collection('invoices')
  try {
    await invoicesCollection.insertOne({ ...invoiceData })
  } catch (error) {
    throw new createHttpError.InternalServerError('Oops, houve um erro no recebimento da fatura.')
  }

  return response.status(200).send(`Fatura recebida com sucesso!`)
}

async function handleCheckoutSessionCompleted(event: Stripe.Event, database: Db, response: NextApiResponse) {
  const session = event.data.object as Stripe.Checkout.Session
  console.log(session)
  const metadata: any = session?.metadata

  const subscriptionId = session.subscription
  const partnerId = metadata?.idParceiro
  try {
    await stripe.subscriptions.update(subscriptionId as string, { metadata })

    const invoicesCollection: Collection<TInvoice> = database.collection('invoices')

    await invoicesCollection.updateMany({ emailClienteStripe: metadata?.email }, { $set: { idParceiro: metadata?.idParceiro } })

    const partnersCollection: Collection<TPartner> = database.collection('partners')

    if (!!partnerId) await partnersCollection.updateOne({ _id: new ObjectId(partnerId) }, { $set: { idAssinaturaStripe: session.subscription as string } })

    return response.status(200).send(`Checkout completado com sucesso!`)
  } catch (error) {
    throw error
  }
}
export const config = {
  api: {
    bodyParser: false,
  },
}
