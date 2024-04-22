const equipments = [
  {
    modelo: '(JINKO) PAINEL SOLAR 525/(JINKO) PAINEL SOLAR 325',
    qtde: '15/24',
    potencia: '525/325',
  },
  {
    modelo: '(TRINA SOLAR) VERTEX TSM-DE21 660/(TRINA SOLAR) VERTEX TSM-DE21 660',
    potencia: '660/660',
    qtde: '12/8',
  },
  {
    modelo: '(PROMO) PAINEL FOTOVOLTAICO MONOCRISTALINO/(PROMO) PAINEL FOTOVOLTAICO MONOCRISTALINO',
    potencia: '660/660',
    qtde: '8/12',
  },
  {
    modelo: '(TRINA SOLAR) VERTEX TSM-DE21 660/(TRINA SOLAR) VERTEX TSM-DE21 660',
    potencia: '660/660',
    qtde: '8/8',
  },
  {
    modelo: '(BYD) MLK-36-535/(BYD) MLK-36-535',
    potencia: '535/535',
    qtde: '296/296',
  },
  {
    modelo: '(HOYMILES) HMS-1800-4T/(HOYMILES) HMS-1800-4T',
    potencia: '1800/1800',
    qtde: '1/1',
  },
  {
    modelo: '(BYD) MLK-36-540/(CANADIAN SOLAR) HIKU CS3W-455MS (35MM)',
    potencia: '540/455',
    qtde: '38/20',
  },
  {
    modelo: '(PROMO) TRINA/(PROMO) TRINA',
    qtde: '12/8',
    potencia: '565/565',
  },
]

const regex = /\(([^)]+)\)\s*(.*)/

function getEquipmentInformation(s) {
  if (s.qtde.includes('/')) {
    const qtys = s.qtde.split('/')
    for (let i = 0; i < qtys.length; i++) {
      const equivalentModelStr = s.modelo.split('/')[i]
      const matches = equivalentModelStr.match(regex)
      const matchedProducer = matches ? matches[1] : ''
      const matchedModel = matches ? matches[2] : equivalentModelStr || ''
      const equivalentPower = s.potencia.split('/')[i] ? Number(s.potencia.split('/')[i]) : 0
      const equivalentQty = Number(qtys[i])
      console.log({
        fabricante: matchedProducer,
        modelo: matchedModel,
        qtde: equivalentQty,
        potencia: equivalentPower,
      })
    }
  } else {
    const matches = s.modelo.match(regex)
    const matchedProducer = matches ? matches[1] : ''
    const matchedModel = matches ? matches[2] : s.modelo || ''
    const equivalentPower = s.potencia.split('/')[i] ? Number(s.potencia.split('/')[i]) : 0
    const equivalentQty = Number(s.qtde)
    console.log({
      fabricante: matchedProducer,
      modelo: matchedModel,
      qtde: equivalentQty,
      potencia: equivalentPower,
    })
  }
}
equipments.forEach((s) => {
  getEquipmentInformation(s)
})
