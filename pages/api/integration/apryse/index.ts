// import axios from 'axios'
// import { NextApiHandler } from 'next'
// // import { PDFNet } from '@pdftron/pdfnet-node'
// import fs from 'fs'
// import { apiHandler } from '@/utils/api'
// type PostResponse = {
//   data: any
// }
// const getFilledPDF: NextApiHandler<PostResponse> = async (req, res) => {
//   try {
//     await PDFNet.runWithCleanup(async () => {
//       const info = req.body
//       const TEMPLATE_URL =
//         'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/template%2Fproposta-comercial-completa.docx?alt=media&token=26dfdf65-b71c-4a06-bcf5-44348818aae5&_gl=1*14dakh1*_ga*MTk1MDMwNjI0Ny4xNjcwMzYwMTQx*_ga_CW55HF8NVT*MTY5ODI1NTE0OC41OC4xLjE2OTgyNTUxOTEuMTcuMC4w'
//       const firebaseTemplateResponse = await axios.get(TEMPLATE_URL, {
//         responseType: 'arraybuffer',
//       })
//       const firebaseTemplateBuffer = firebaseTemplateResponse.data
//       fs.writeFileSync('temporary_template.docx', firebaseTemplateBuffer)
//       PDFNet.addResourceSearchPath('../Resources')

//       const options = new PDFNet.Convert.OfficeToPDFOptions()
//       const templateDoc = await PDFNet.Convert.createOfficeTemplateWithPath('temporary_template.docx', options)
//       const pdfdoc = await templateDoc.fillTemplateJson(JSON.stringify(info))
//       // Converting the generated PDF to a buffer
//       const pdfBuffer = await pdfdoc.saveMemoryBuffer(PDFNet.SDFDoc.SaveOptions.e_linearized)
//       res.setHeader('Content-Type', 'application/pdf')
//       res.setHeader('Content-Disposition', `attachment; filename="PROPOSTA-COMERCIAL"`)
//       res.end(pdfBuffer)
//     }, process.env.APRYSE_KEY)
//   } catch (error) {
//     throw error
//   } finally {
//     fs.unlinkSync('temporary_template.docx')
//   }
// }
// export default apiHandler({
//   POST: getFilledPDF,
// })
// export const config = {
//   api: {
//     responseLimit: false,
//   },
// }
