// const Equipments = require('./main.equipments.json')
const fs = require('fs/promises')

fs.writeFile('./conditions-simple-maintaince.json', conditionsSimpleMaintainceJSON, 'utf8', function (err) {
  if (err) {
    return console.log(err)
  }

  console.log('The file was saved!')
})
