const previousData = {
  _id: {
    $oid: '64adafb01dee468edba9255d',
  },
  nome: 'CONSTRUREI',
  idParceiro: '65454ba15cf3e3ecf534b308',
  tipo: {
    id: '6615785ddcb7a6e66ede9785',
    titulo: 'SISTEMA FOTOVOLTAICO',
  },
  categoriaVenda: 'KIT',
  descricao: '',
  identificador: 'CRM-2',
  responsaveis: [
    {
      nome: 'JULIANO SILVA',
      id: '649c80b49538973589a33cb8',
      papel: 'VENDEDOR',
      avatar_url:
        'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar_juliano.jpg?alt=media&token=3893b2ea-9f9a-48ca-8f1c-cc85aa04ecbd',
    },
  ],
  testes: [{ titulo: 'TESTE', valor: 1 }],
  segmento: null,
  idCliente: '64adafb01dee468edba9255c',
  idMarketing: null,
  idPropostaAtiva: '664ba1669e70562417537707',
  localizacao: {
    cep: '38320-000',
    uf: 'MG',
    cidade: 'SANTA VITÓRIA',
    bairro: 'CENTRO',
    endereco: 'AV CANAL',
    numeroOuIdentificador: '340',
    complemento: '',
  },
  perda: {
    idMotivo: null,
    descricaoMotivo: null,
    data: null,
  },
  ganho: {
    idProposta: null,
    idProjeto: '',
    data: null,
    idSolicitacao: null,
    dataSolicitacao: null,
  },
  instalacao: {
    concessionaria: null,
    numero: null,
    grupo: null,
    tipoLigacao: null,
    tipoTitular: null,
    nomeTitular: null,
  },
  autor: {
    id: '6463ccaa8c5e3e227af54d89',
    nome: 'Lucas Fernandes',
    avatar_url: null,
  },
  dataInsercao: '2023-07-11T19:38:24.962Z',
}
const newData = {
  _id: {
    $oid: '64adafb01dee468edba9255d',
  },
  nome: 'CONSTRUREI 2',
  idParceiro: '65454ba15cf3e3ecf534b308',
  tipo: {
    id: '6615785ddcb7a6e66ede9785',
    titulo: 'SISTEMA FOTOVOLTAICO',
  },
  categoriaVenda: 'KIT',
  descricao: '',
  identificador: 'CRM-2',
  responsaveis: [
    {
      nome: 'LUCAS FERNANDES',
      id: '649c80b49538973589521312',
      papel: 'VENDEDOR',
      avatar_url: null,
    },
    {
      nome: 'DEVISSON LIMA',
      id: '649c80b4953897358942131',
      papel: 'VENDEDOR',
      avatar_url: null,
    },
  ],
  testes: [{ titulo: 'TESTE', valor: null }, { titulo: 'TESTE 3' }],
  segmento: 'TESTE',
  idCliente: '64adafb01dee468edba9255c',
  idMarketing: null,
  idPropostaAtiva: '664ba1669e70562417537707',
  localizacao: {
    cep: '38320-000',
    uf: 'MG',
    cidade: 'SANTA VITÓRIA',
    bairro: 'CENTRO',
    endereco: 'AV CANAL',
    numeroOuIdentificador: '340',
    complemento: '',
  },
  perda: {
    idMotivo: null,
    descricaoMotivo: null,
    data: null,
  },
  ganho: {
    idProposta: null,
    idProjeto: '',
    data: null,
    idSolicitacao: null,
    dataSolicitacao: null,
  },
  instalacao: {
    concessionaria: 'CEMIG',
    numero: null,
    grupo: null,
    tipoLigacao: null,
    tipoTitular: null,
    nomeTitular: null,
  },
  autor: {
    id: '6463ccaa8c5e3e227af54d89',
    nome: 'Lucas Fernandes',
    avatar_url: null,
  },
  dataInsercao: '2023-07-11T19:38:24.962Z',
}

function decomposeObject(obj, parentKey = '', delimiter = '.') {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const newKey = parentKey ? `${parentKey}${delimiter}${key}` : key

    if (Array.isArray(value)) {
      acc[newKey] = value
    } else if (value && typeof value === 'object' && value !== null) {
      // Recursively decompose nested objects
      Object.assign(acc, decomposeObject(value, newKey, delimiter))
    } else {
      // Assign the value to the new key
      acc[newKey] = value
    }

    return acc
  }, {})
}

function deepEqual(obj1, obj2) {
  console.log('OBJ 1', obj1)
  console.log('OBJ 2', obj2)
  if (obj1 === obj2) return true

  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    console.log('PASSEI AQUI', obj1, obj2)
    return false
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)
  console.log('KEYS1', keys1)
  console.log('KEYS2', keys2)
  if (keys1.length !== keys2.length) return false

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false
    }
  }

  return true
}

function identifyChanges({ previousData, newData }) {
  const previousFlat = decomposeObject(previousData)
  console.log(previousFlat)
  const newFlat = decomposeObject(newData)

  const changes = Object.entries(newFlat).reduce((acc, [key, newValue]) => {
    const oldValue = previousFlat[key]

    if (Array.isArray(newValue)) {
      // Handling arrays
      const oldArray = oldValue || []
      const newArray = newValue

      const add = []
      const remove = []
      const modify = []

      const oldItemsMap = new Map(oldArray.map((item, index) => [item.id || index + 1, item]))
      const newItemsMap = new Map(newArray.map((item, index) => [item.id || index + 1, item]))

      newItemsMap.forEach((newItem, id) => {
        // Verifying if old items map has the any equal id as the iterating one.
        // If not, then this item is an addition
        if (!oldItemsMap.has(id)) {
          add.push(newItem)
          //
        } else if (!deepEqual(oldItemsMap.get(id), newItem)) {
          modify.push({
            id,
            old_value: oldItemsMap.get(id),
            new_value: newItem,
          })
        }
      })

      oldItemsMap.forEach((oldItem, id) => {
        if (!newItemsMap.has(id)) {
          remove.push(oldItem)
        }
      })

      if (add.length || remove.length || modify.length) {
        acc[key] = {}
        if (add.length) acc[key].add = add
        if (remove.length) acc[key].remove = remove
        if (modify.length) acc[key].modify = modify
      }
    } else {
      if (oldValue === undefined) {
        // New information
        acc[key] = { oldValue: null, newValue }
      } else if (oldValue !== newValue) {
        // Changed information
        acc[key] = { oldValue, newValue }
      }
    }

    return acc
  }, {})

  return changes
}

console.log(JSON.stringify(identifyChanges({ previousData, newData }), null, 2))
