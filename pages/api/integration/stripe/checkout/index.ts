import { apiHandler } from '@/utils/api'
import createHttpError from 'http-errors'
import { NextApiHandler } from 'next'
import Stripe from 'stripe'

// THIS API ROUTE SHOULD BE RESPONSIBLE FOR CREATING A CHECKOUT SESSION FOR NEW CUSTOMERS SIGNATURE
const createCheckout: NextApiHandler<any> = async (req, res) => {
  // Based on our price ID (defined for the subscription product), creating a checkout session for the user to effectively pay

  // FLOW
  // 1 - extract partnerId from request query
  // 2 - validate ID for being of type string and a valid MongoDB ObjectId
  // 3 - connecting to the database and defining partners and users collections
  // 4 - finding the partner based on the partnerId from query (handle errors, such as notfound and so on)
  // 5 - finding all active users for the given partner
  // 6 - creating a checkout session using the priceId, the customerId(which is the partnerId) and the items qty(which is
  // the amount of the active users)

  const partnerId = 'cus_QOEWrEtqVycDr4' // Should come from the partnerId created in the onboarding process

  const priceId = process.env.STRIPE_PRICE_ID_SOLAR_SALES_SUBSCRIPTION // Price created for our subscription product

  const usersQty = 15 // Should come from the defined users quantity in the onboarding process

  const session = await new Stripe(
    'sk_test_51Jd29hGCjFDtApCWA0OS5XOn6kpG2I2SsuwfKGaoiOrAEcebKRtnUXcjF7wH97FML5B7Su3RNqYToDseYbHhKEbU00YeY59eni'
  ).checkout.sessions.create({
    payment_method_types: ['card'],
    customer: partnerId,
    line_items: [
      {
        price: priceId,
        quantity: usersQty,
      },
    ],
    mode: 'subscription',
    success_url: 'http://localhost:3000/teste',
    cancel_url: 'http://localhost:3000/teste',
  })
  if (!session.url) throw new createHttpError.BadRequest('Oops, houve um erro desconhecido.')
  res.status(200).json({ data: session.url })
}

export default apiHandler({ GET: createCheckout })
