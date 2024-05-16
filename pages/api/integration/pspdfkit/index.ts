// import { NextApiHandler } from 'next'

// import axios from 'axios'
// import { apiHandler } from '@/utils/api'
// import fs from 'fs'
// import path from 'path'
// type GetResponse = any

// async function fetchDocxFile() {
//   // Ensure that you correctly resolve the path to where your 'public' directory resides in your file system
//   const filePath = path.resolve('./public/test-file.docx')
//   return new Promise((resolve, reject) => {
//     fs.readFile(filePath, (err, data) => {
//       if (err) reject(err)
//       else resolve(data.toString('binary')) // Convert buffer to binary string if necessary
//     })
//   })
// }

// const testing: NextApiHandler<GetResponse> = async (req, res) => {
//   const fileStr = await fetchDocxFile()
//   const header = { Authorization: `Token token=${process.env.PSPDFKIT_DOCUMENT_ENGINE_API_KEY}`, 'content-type': 'multipart/form-data' }
//   const pspdfresponse = await axios.post(
//     'http://localhost:5000/api/process_office_template',
//     {
//       model: {
//         config: { delimiter: { start: '{{', end: '}}' } },
//         model: {
//           name: 'TESTE',
//           greeting: 'TESTANDO GREETING',
//         },
//       },
//       document: fileStr,
//     },
//     { headers: header }
//   )
//   console.log('RESPOSTA', pspdfresponse)

//   return res.status(200).json(pspdfresponse)
// }

// export default apiHandler({ GET: testing })

import { NextApiHandler } from 'next'
import axios from 'axios'
import { apiHandler } from '@/utils/api'
import fs from 'fs'
import path from 'path'
import FormData from 'form-data'
import { ref, uploadBytes } from 'firebase/storage'
import { storage } from '@/services/firebase/storage-config'

type GetResponse = any

async function fetchDocxFile() {
  const filePath = path.resolve('./public/test-file.docx')
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

const testing: NextApiHandler<GetResponse> = async (req, res) => {
  const fileBuffer = await fetchDocxFile()

  // Construct form data
  const formData = new FormData()
  formData.append('document', fileBuffer, 'test-file.docx')
  formData.append(
    'model',
    JSON.stringify({
      config: { delimiter: { start: '{{', end: '}}' } },
      model: {
        name: 'TESTE',
        greeting: 'TESTANDO GREETING',
      },
    })
  )

  const response = await axios.post('http://localhost:5000/api/process_office_template', formData, {
    headers: {
      ...formData.getHeaders(),
      Authorization: `Token token=${process.env.PSPDFKIT_DOCUMENT_ENGINE_API_KEY}`,
      responseType: 'arraybuffer', // Ensure response is in binary format
    },
  })
  console.log(response.status)
  fs.writeFileSync('output.pdf', response.data)
  const binaryData = Buffer.from(response.data)

  // Upload to Firebase Storage
  const storageRef = ref(storage, 'testing-pspdfkit/uploaded-test2')
  const uploadResponse = await uploadBytes(storageRef, binaryData)
  return res.status(200).json({ message: 'File uploaded successfully' })
  console.log('Response:', response.data)
  return res.status(200).json(response.data)
}

export default apiHandler({ GET: testing })
