import { NextApiHandler } from 'next'
import axios from 'axios'
import { apiHandler } from '@/utils/api'
import fs from 'fs'
import FormData from 'form-data'
type GetResponse = any

const API_AUTH_TOKEN =
  '3I_LrcSD1GFyymmKixXPtYvHIc2s0VprkqRW5q3wv1XOIkoXB9P37nKQ8IAuoBUKHbl8-RWeNPL69vCwkV6vBFUw9cg_8ntQD-zUgFV7h3qfbQ3oh97znr5AvFzbC5JZ1hWjFj6NpdDkU4PT40eSGaCHUOFPzYhaVyhVLXxhKAVeXKS73cAjXoFdTdsS4chOR_SB0C2o1cdaR821-D7wWay_QEdyUYSqAnXbx4cwgMSAasH_CG8xslclMoK3E43t0ZqsxHQaLxH4J3Hwq6quoQD-ijRFLKdNgUdNUVF1og'

const testing: NextApiHandler<GetResponse> = async (req, res) => {
  // Initialize form data
  const form = new FormData()

  // Append the file
  form.append('document', fs.createReadStream('./public/simple-template.docx'))

  // Append the model as a JSON string
  const modelData = JSON.stringify({
    model: {
      client_name: 'Lucas Fernandes',
      client_identifier: '999.999.999-99',
      client_city: 'ITUIUTABA',
      client_uf: 'MG',
      client_address: 'Rua dos Ângicos, Bairro Alvorada',
      proposal_peak_power: 15,
      opportunity_identifier: 'CRM-500',
      seller_name: 'João das Neves',
      seller_phone: '(34) 99999-9999',
      monthly_energy_generation: '650 kWh',
      monthly_economy: 'R$ 500,00',
      new_energy_bill: 'R$ 70,00',
      ten_years_economy: 'R$ 54.000,00',
      modules_qty: 16,
      modules_description: 'DAH 550W',
      modules_warranty: '25 ANOS',
      inverters_qty: 4,
      inverters_description: 'HOYMILES 2000W',
      inverters_warranty: '12 ANOS',
      first_payment_method: '(À VISTA) 80% NA ASSINATURA E 20% NA CONCLUSÃO DA MONTAGEM',
      second_payment_method: '(À VISTA) 100% POR FINANCIAMENTO BANCÁRIO',
      proposal_value: 'R$ 25.000,00',
    },
  })
  form.append('model', modelData)

  // Set up the headers
  const headers = {
    Authorization: `Bearer ${API_AUTH_TOKEN}`,
    ...form.getHeaders(),
  }

  try {
    // Make the POST request
    const response = await axios.post('http://localhost:3000/api/process_office_template', form, {
      headers,
      responseType: 'stream', // Ensure response is handled as a stream
    })

    // Pipe the response stream to the res object
    response.data.pipe(res)

    // Handle errors in streaming
    response.data.on('error', (err) => {
      console.error('Error in streaming response:', err)
      res.status(500).send('Error in streaming response')
    })

    // Set the correct headers from the response
    res.setHeader('Content-Disposition', response.headers['content-disposition'] || 'attachment')
    res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream')
  } catch (error) {
    console.error('Error in making POST request:', error)
    res.status(500).send('Error in making POST request')
  }
}

export default apiHandler({ GET: testing })
