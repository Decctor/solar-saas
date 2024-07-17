import { formatLocation } from '@/lib/methods/formatting'
import connectToDatabase from '@/services/mongodb/crm-db-connection'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TPartner } from '@/utils/schemas/partner.schema'
import createHttpError from 'http-errors'
import { Collection, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'
import Stripe from 'stripe'
import { custom, z } from 'zod'

// FLOW
// 1 - extract partnerId from request query
// 2 - validate ID for being of type string and a valid MongoDB ObjectId
// 3 - connecting to the database and defining partners and users collections
// 4 - finding the partner based on the partnerId from query (handle errors, such as notfound and so on)
// 5 - finding all active users for the given partner
// 6 - creating a checkout session using the priceId, the customerId(which is the partnerId) and the items qty(which is
// the amount of the active users)

const NewCheckoutBodySchema = z.object({
  partnerId: z.string({ required_error: 'ID do parceiro não informado.', invalid_type_error: 'Tipo não válido para o ID do parceiro.' }),
  usersQty: z.number({ required_error: 'Número de usuários para inscrição não informado.', invalid_type_error: 'Tipo não válido para o número de usuários.' }),
})

// THIS API ROUTE SHOULD BE RESPONSIBLE FOR CREATING A CHECKOUT SESSION FOR NEW CUSTOMERS SIGNATURE
const createCheckout: NextApiHandler<any> = async (req, res) => {
  // Validating authentication
  const authSession = await validateAuthenticationWithSession(req, res)

  // Validating payload with Zod schema to assure the types of the requested partnerId and the user subscriptions qty
  const { partnerId, usersQty } = NewCheckoutBodySchema.parse(req.body)
  if (!ObjectId.isValid(partnerId)) throw new createHttpError.BadRequest('ID de parceiro inválido.')

  const authSessionPartnerId = authSession.user.idParceiro
  const userIsAdmin = authSession.user.administrador

  // In case the requests attempts to access a differente partner id the user session one
  // Checking if the session user is an admin, if not, throwing unauthorized error
  if (partnerId != authSessionPartnerId && !userIsAdmin) throw new createHttpError.Unauthorized('Ação não autorizada.')

  // If all validations passed, continuing the checkout session creation flow
  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const partnersCollection: Collection<TPartner> = db.collection('partners')

  const partner = await partnersCollection.findOne({ _id: new ObjectId(partnerId) })
  if (!partner) throw new createHttpError.NotFound('Parceiro não encontrado.')

  const stripe = new Stripe('sk_test_51Jd29hGCjFDtApCWA0OS5XOn6kpG2I2SsuwfKGaoiOrAEcebKRtnUXcjF7wH97FML5B7Su3RNqYToDseYbHhKEbU00YeY59eni')

  var customerId = partner.idClienteStripe || null // Should come from the partnerId created in the onboarding process

  if (!customerId) {
    const customer = await stripe.customers.create({
      name: partner.nome,
      email: partner.contatos.email,
      address: { city: partner.localizacao.cidade, country: 'BR', state: partner.localizacao.uf },
      phone: partner.contatos.telefonePrimario,
    })
    customerId = customer.id
    await partnersCollection.updateOne({ _id: new ObjectId(partnerId) }, { $set: { idClienteStripe: customerId } })
  }

  const priceId = process.env.STRIPE_PRICE_ID_SOLAR_SALES_SUBSCRIPTION // Price created for our subscription product

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: usersQty,
      },
    ],
    metadata: { idParceiro: partnerId, email: partner.contatos.email },
    mode: 'subscription',
    success_url: `${process.env.BASE_URL}/obrigado`,
    cancel_url: process.env.BASE_URL,
  })
  if (!session.url) throw new createHttpError.BadRequest('Oops, houve um erro desconhecido.')
  res.status(200).json({ data: session.url })
}

export default apiHandler({ POST: createCheckout })
