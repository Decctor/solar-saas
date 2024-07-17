import { getSignUpSetup } from '@/repositories/sign-up-setup/queries'
import connectToDatabase from '@/services/mongodb/crm-db-connection'
import { apiHandler } from '@/utils/api'
import { TPartner } from '@/utils/schemas/partner.schema'
import { TSignUpSetup } from '@/utils/schemas/sign-up-setup.schema'
import { TUser } from '@/utils/schemas/user.schema'
import createHttpError from 'http-errors'
import { Collection, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'
import Stripe from 'stripe'

const handleSetUpSubscription: NextApiHandler<any> = async (req, res) => {
  const { setupId } = req.query

  console.log('SIGN UP SUBSCRIPTION CALLED', setupId)
  if (!setupId || typeof setupId != 'string' || !ObjectId.isValid(setupId)) throw new createHttpError.BadRequest('ID inválido.')

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const signUpSetupcollection: Collection<TSignUpSetup> = db.collection('sign-up-setup')
  const partnersCollection: Collection<TPartner> = db.collection('partners')
  const usersCollection: Collection<TUser> = db.collection('users')

  const setup = await getSignUpSetup({ collection: signUpSetupcollection, id: setupId })
  if (!setup) throw new createHttpError.InternalServerError('Oops, um erro interno ocorreu ao finalizar cadastro.')

  const newPartner: TPartner = {
    nome: setup.parceiro.nome,
    cpfCnpj: setup.parceiro.cpfCnpj,
    contatos: {
      telefonePrimario: setup.parceiro.telefone,
      telefoneSecundario: null,
      email: setup.parceiro.email,
    },
    slogan: '',
    midias: {
      instagram: '',
      website: '',
      facebook: '',
    },
    localizacao: {
      cep: setup.parceiro.cep,
      uf: setup.parceiro.uf || '',
      cidade: setup.parceiro.cidade || '',
      bairro: undefined,
      endereco: undefined,
      numeroOuIdentificador: undefined,
      complemento: undefined,
      // distancia: z.number().optional().nullable(),
    },
    logo_url: null,
    descricao: '',
    ativo: false,
    onboarding: {},
    dataInsercao: new Date().toISOString(),
  }
  const insertPartnerResponse = await partnersCollection.insertOne(newPartner)
  if (!insertPartnerResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, um erro interno ocorreu ao finalizar cadastro.')

  const insertedPartnerId = insertPartnerResponse.insertedId.toString()

  const stripe = new Stripe('sk_test_51Jd29hGCjFDtApCWA0OS5XOn6kpG2I2SsuwfKGaoiOrAEcebKRtnUXcjF7wH97FML5B7Su3RNqYToDseYbHhKEbU00YeY59eni')
  const stripePartnerCustomer = await stripe.customers.create({
    email: newPartner.contatos.email,
    name: newPartner.nome,
    metadata: {
      cpfCnpj: newPartner.cpfCnpj,
      logo_url: newPartner.logo_url || null,
    },
  })
  const stripePartnerCustomerId = stripePartnerCustomer.id
  await partnersCollection.updateOne({ _id: new ObjectId(insertedPartnerId) }, { $set: { idCustomerStripe: stripePartnerCustomerId } })

  const priceId = process.env.STRIPE_PRICE_ID_SOLAR_SALES_SUBSCRIPTION // Price created for our subscription product

  const stripeCheckoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer: stripePartnerCustomerId,
    line_items: [
      {
        price: priceId,
        quantity: setup.quantidadeUsuarios,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.STRIPE_CHECKOUT_SUCCESS_URL}?setupId=${setupId}&checkoutSession=`,
    cancel_url: 'https://yourapp.com/cancel',
  })
  console.log(stripeCheckoutSession.id)
  if (!stripeCheckoutSession.url) throw new createHttpError.InternalServerError('Oops, um erro interno ocorreu ao finalizar cadastro.')

  return res.redirect(stripeCheckoutSession.url)
}

export default apiHandler({ GET: handleSetUpSubscription })
