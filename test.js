const Equipments = require('./main.equipments.json')
const fs = require('fs/promises')
const materials = [
  {
    id: '65cfbf1a982b8a4b4ea297eb',
    nome: 'DPS ECOBOX G6+MONOPOLAR 275',
    preco: 25.02,
    grandeza: 'UN',
    qtdeRetirada: 3,
    qtdeDevolucao: 0,
  },
  {
    id: '63975cd0170b8934d7d7c455',
    nome: 'DISJUNTOR BIFÁSICO 32A',
    preco: 21.81,
    grandeza: 'UN',
    qtdeRetirada: 3,
    qtdeDevolucao: 0,
  },
  {
    id: '647f16cd4f8681e073879847',
    nome: 'CABO FLEX 35MM (AZUL)',
    preco: 29.59,
    grandeza: 'M',
    qtdeRetirada: 2.5,
    qtdeDevolucao: 0,
  },
  {
    id: '647f16964f8681e073879846',
    nome: 'CABO FLEX 35MM 750V (PRETO)',
    preco: 26.74,
    grandeza: 'M',
    qtdeRetirada: 2.8,
    qtdeDevolucao: 0,
  },
  {
    id: '63975cd0170b8934d7d7c470',
    nome: 'CABO SOLAR (PRETO)',
    preco: 3.18,
    grandeza: 'M',
    qtdeRetirada: 218,
    qtdeDevolucao: 0,
  },
  {
    id: '63975cd0170b8934d7d7c46f',
    nome: 'CABO SOLAR (VERMELHO)',
    preco: 3.49,
    grandeza: 'M',
    qtdeRetirada: 235,
    qtdeDevolucao: 0,
  },
  {
    id: '65bc05fc871c13005f3e9cec',
    nome: 'DISJUNTOR CAIXA MOLDADA TRIFASICO SOPRANO 100A',
    preco: 139.82,
    grandeza: 'UN',
    qtdeRetirada: 1,
    qtdeDevolucao: 0,
  },
  {
    id: '64b83a8903b83bc53e433161',
    nome: 'QUADRO ARMARIO 400X300X200MM',
    preco: 127,
    grandeza: 'UN',
    qtdeRetirada: 1,
    qtdeDevolucao: 0,
  },
  {
    id: '642ed441f18f21e456846d9f',
    nome: 'PERFILADO - MÃO FRANCESA SIMPLES 200MM',
    preco: 19.89,
    grandeza: 'UN',
    qtdeRetirada: 6,
    qtdeDevolucao: 0,
  },
  {
    id: '642ed33bd1c3266fb981bf63',
    nome: 'ELETROCALHA - CURVA VERTICAL INTERNA 90° 100X50',
    preco: 12.71,
    grandeza: 'UN',
    qtdeRetirada: 3,
    qtdeDevolucao: 0,
  },
  {
    id: '642ef18e8921f88d46447530',
    nome: 'ELETROCALHA - TAMPA CURVA VERTICAL INTERNA 90° 100X50',
    preco: 5.86,
    grandeza: 'UN',
    qtdeRetirada: 3,
    qtdeDevolucao: 0,
  },
  {
    id: '642b13a74f4d97296fa4bd3f',
    nome: 'BUCHA S10 NYLON',
    preco: 0.35,
    grandeza: 'UN',
    qtdeRetirada: 37,
    qtdeDevolucao: 0,
  },
  {
    id: '642b137e2bd5c179efbe3742',
    nome: 'PARAFUSO GALVANIZADO S10',
    preco: 0.9,
    grandeza: 'UN',
    qtdeRetirada: 37,
    qtdeDevolucao: 0,
  },
  {
    id: '64ba7a3f46a0f1990be62796',
    nome: 'PORCA GALVANIZADA 3/8',
    preco: 0.36,
    grandeza: 'UN',
    qtdeRetirada: 37,
    qtdeDevolucao: 0,
  },
  {
    id: '6605a3a5ee0c5fca8b0ddede',
    nome: 'TRILHO PERFURADO DIN 35MM POR 50 CM',
    preco: 0,
    grandeza: 'M',
    qtdeRetirada: 0.33,
    qtdeDevolucao: 0,
  },
  {
    id: '643550b4eb263e895b83bd07',
    nome: 'PORCA ZINCADA 1/4',
    preco: 0.099,
    grandeza: 'UN',
    qtdeRetirada: 131,
    qtdeDevolucao: 0,
  },
  {
    id: '642ed426c4890b105aacc3d9',
    nome: 'PARAFUSO LENTILHA 1/4',
    preco: 0.0229,
    grandeza: 'UN',
    qtdeRetirada: 134,
    qtdeDevolucao: 0,
  },
]
const formatted = Equipments.map((e) => {
  return { identificador: 'EQUIPMENT', ...e }
})
const equipmentsJSON = JSON.stringify(formatted)

fs.writeFile('./equipments.json', equipmentsJSON, 'utf8', function (err) {
  if (err) {
    return console.log(err)
  }

  console.log('The file was saved!')
})
