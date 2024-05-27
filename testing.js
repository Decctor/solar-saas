const originalInfo = {
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
const newInfo = {
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
      nome: 'JULIANO SILVA',
      id: '649c80b49538973589a33cb8',
      papel: 'VENDEDOR',
      avatar_url:
        'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar_juliano.jpg?alt=media&token=3893b2ea-9f9a-48ca-8f1c-cc85aa04ecbd',
    },
    {
      nome: 'LUCAS FERNANDEs',
      id: '649c80b4953897358942131',
      papel: 'VENDEDOR',
      avatar_url: null,
    },
  ],
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
// function decomposeObject(info, fatherTag) {
//   const newObject = Object.entries(info).reduce((acc, current) => {
//     const [key, value] = current
//     console.log(key)
//     if (typeof value == 'object' && value != null) {
//       const object = decomposeObject(value, key)
//       acc = { ...acc, ...object }
//     } else {
//       const tag = fatherTag ? `${fatherTag}.${key}` : `${key}`
//       acc[tag] = value
//     }
//     return acc
//   }, {})
//   return newObject
// }

function decomposeObject(obj, parentKey = '', delimiter = '.') {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const newKey = parentKey ? `${parentKey}${delimiter}${key}` : key

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        Object.assign(acc, decomposeObject(item, `${newKey}[${index}]`, delimiter))
      })
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

// function identifyChanges({ previousData, newData }) {
//   const previousFlat = decomposeObject(previousData)
//   const newFlat = decomposeObject(newData)
//   const changes = Object.entries(newFlat).reduce((acc, current) => {
//     const [key, value] = current
//     const equivalentPreviousData = previousFlat[key]

//     if (equivalentPreviousData == null && value == null) return acc
//     // In case there is not a equivalent information in the previous info, then it is a new information
//     if (equivalentPreviousData == undefined) {
//       acc[key] = {
//         oldValue: null,
//         newValue: value,
//       }
//     }
//     // In case there is a equivalent information in the previous data and it is different than the new one
//     if (equivalentPreviousData != value) {
//       acc[key] = {
//         oldValue: equivalentPreviousData,
//         newValue: value,
//       }
//     }
//     // In case there is a equivalent information in the previous data and it is the same as the new one
//     if (equivalentPreviousData == value) return acc
//     return acc
//   })
//   return changes
// }
// function identifyChanges({ previousData, newData }) {
//   const previousFlat = decomposeObject(previousData)
//   const newFlat = decomposeObject(newData)

//   const changes = Object.entries(newFlat).reduce((acc, [key, newValue]) => {
//     const oldValue = previousFlat[key]

//     if (oldValue === undefined) {
//       // New information
//       acc[key] = { oldValue: null, newValue }
//     } else if (oldValue !== newValue) {
//       // Changed information
//       acc[key] = { oldValue, newValue }
//     }

//     // No need for else block as unchanged values are not added

//     return acc
//   }, {})

//   return changes
// }
function identifyChanges({ previousData, newData }) {
  const previousFlat = decomposeObject(previousData)
  const newFlat = decomposeObject(newData)

  const changes = Object.entries(newFlat).reduce((acc, [key, newValue]) => {
    const oldValue = previousFlat[key]

    if (Array.isArray(newValue)) {
      // Handling arrays
      const oldArray = oldValue || []
      const newArray = newValue

      const add = newArray.filter((item) => !oldArray.includes(item))
      const remove = oldArray.filter((item) => !newArray.includes(item))
      const modify = newArray.reduce((modAcc, item, index) => {
        if (oldArray[index] && oldArray[index] !== item) {
          modAcc.push({
            index,
            old_value: oldArray[index],
            new_value: item,
          })
        }
        return modAcc
      }, [])

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

console.log(identifyChanges({ previousData: originalInfo, newData: newInfo }))
