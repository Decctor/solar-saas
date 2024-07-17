// const Equipments = require('./main.equipments.json')
const fs = require('fs/promises')

fs.writeFile('./conditions-simple-maintaince.json', conditionsSimpleMaintainceJSON, 'utf8', function (err) {
  if (err) {
    return console.log(err)
  }

  console.log('The file was saved!')
})

const firebaseConfig = {
  apiKey: 'AIzaSyCRUin69Y6ahcMmEe7tXFk9i515Ds2oJdc',
  authDomain: 'appsolarsaas.firebaseapp.com',
  projectId: 'appsolarsaas',
  storageBucket: 'appsolarsaas.appspot.com',
  messagingSenderId: '587164174938',
  appId: '1:587164174938:web:9439bfc8a7bba05335e663',
  measurementId: 'G-KRQV6DGT2K',
}
