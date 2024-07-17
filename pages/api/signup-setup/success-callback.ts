import { apiHandler } from '@/utils/api'
import { NextApiHandler } from 'next'

const getSuccessCheckoutRoute: NextApiHandler<any> = async (req, res) => {
  const query = req.query
  const body = req.body
  console.log('query', query)
  console.log('body', body)

  return res.json('OK')
}

export default apiHandler({ GET: getSuccessCheckoutRoute })
