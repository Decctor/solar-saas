const ConditionTypes = ['IGUAL_TEXTO', 'MAIOR_QUE_NÚMERICO', 'MENOR_QUE_NÚMERICO', 'IGUAL_NÚMERICO', 'INTERVALO_NÚMERICO']

const Condition = {
  tipo: 'INTERVALO_NÚMERICO',
  aplicavel: true,
  variavel: 'numModulos',
  entre: {
    minimo: 1,
    maximo: 2,
  },
}
const PricingMethodology = {
  _id: {
    $oid: '660ff9c31285da49d6dc201d',
  },
  nome: 'PRECIFICAÇÃO PLANO SOL PLUS',
  idParceiro: '65454ba15cf3e3ecf534b308',
  itens: [
    {
      nome: 'VALOR DO PLANO',
      resultados: [
        {
          condicao: { tipo: 'INTERVALO_NÚMERICO', aplicavel: true, variavel: 'numModulos', entre: { minimo: 0, maximo: 12 } },
          faturavel: false,
          margemLucro: 0,
          formulaArr: ['[plan]', '+', '(', '[numModulos]', '*', '19.9', ')', '*', '1.5'],
        },
        {
          condicao: { tipo: 'INTERVALO_NÚMERICO', aplicavel: true, variavel: 'numModulos', entre: { minimo: 13, maximo: 19 } },
          faturavel: false,
          margemLucro: 0,
          formulaArr: ['[plan]', '+', '(', '[numModulos]', '*', '18.91', ')', '*', '1.5'],
        },
        {
          condicao: { tipo: 'INTERVALO_NÚMERICO', aplicavel: true, variavel: 'numModulos', entre: { minimo: 20, maximo: 29 } },
          faturavel: false,
          margemLucro: 0,
          formulaArr: ['[plan]', '+', '(', '[numModulos]', '*', '17.96', ')', '*', '1.5'],
        },
        {
          condicao: { tipo: 'INTERVALO_NÚMERICO', aplicavel: true, variavel: 'numModulos', entre: { minimo: 30, maximo: 49 } },
          faturavel: false,
          margemLucro: 0,
          formulaArr: ['[plan]', '+', '(', '[numModulos]', '*', '17.06', ')', '*', '1.5'],
        },
        {
          condicao: { tipo: 'INTERVALO_NÚMERICO', aplicavel: true, variavel: 'numModulos', entre: { minimo: 50, maximo: 79 } },
          faturavel: false,
          margemLucro: 0,
          formulaArr: ['[plan]', '+', '(', '[numModulos]', '*', '16.21', ')', '*', '1.5'],
        },
        {
          condicao: { tipo: 'INTERVALO_NÚMERICO', aplicavel: true, variavel: 'numModulos', entre: { minimo: 80, maximo: 109 } },
          faturavel: false,
          margemLucro: 0,
          formulaArr: ['[plan]', '+', '(', '[numModulos]', '*', '15.4', ')', '*', '1.5'],
        },
        {
          condicao: { tipo: 'INTERVALO_NÚMERICO', aplicavel: true, variavel: 'numModulos', entre: { minimo: 110, maximo: 149 } },
          faturavel: false,
          margemLucro: 0,
          formulaArr: ['[plan]', '+', '(', '[numModulos]', '*', '13.86', ')', '*', '1.5'],
        },
        {
          condicao: { tipo: 'INTERVALO_NÚMERICO', aplicavel: true, variavel: 'numModulos', entre: { minimo: 150, maximo: 199 } },
          faturavel: false,
          margemLucro: 0,
          formulaArr: ['[plan]', '+', '(', '[numModulos]', '*', '12.47', ')', '*', '1.5'],
        },
        {
          condicao: { tipo: 'INTERVALO_NÚMERICO', aplicavel: true, variavel: 'numModulos', entre: { minimo: 200, maximo: 299 } },
          faturavel: false,
          margemLucro: 0,
          formulaArr: ['[plan]', '+', '(', '[numModulos]', '*', '11.23', ')', '*', '1.5'],
        },
        {
          condicao: { tipo: 'INTERVALO_NÚMERICO', aplicavel: true, variavel: 'numModulos', entre: { minimo: 300, maximo: 499 } },
          faturavel: false,
          margemLucro: 0,
          formulaArr: ['[plan]', '+', '(', '[numModulos]', '*', '10.1', ')', '*', '1.5'],
        },
        {
          condicao: { tipo: 'INTERVALO_NÚMERICO', aplicavel: true, variavel: 'numModulos', entre: { minimo: 500, maximo: 2000 } },
          faturavel: false,
          margemLucro: 0,
          formulaArr: ['[plan]', '+', '(', '[numModulos]', '*', '9.09', ')', '*', '1.5'],
        },
        {
          condicao: {
            tipo: null,
            aplicavel: false,
            variavel: null,
            igual: null,
          },
          faturavel: false,
          margemLucro: 0,
          formulaArr: ['[plan]', '+', '(', '[numModulos]', '*', '19.5', ')', '*', '1.5'],
        },
      ],
    },
    {
      nome: 'DESLOCAMENTO',
      resultados: [
        {
          condicao: {
            aplicavel: false,
            variavel: null,
            igual: null,
          },
          faturavel: false,
          margemLucro: 0,
          formulaArr: ['(', '10', '+', '[distancia]', ')', '*', '(', '[numModulos]', '/', '12', ')', '*', '3.2'],
        },
      ],
    },
  ],
  autor: {
    id: '65453222e345279bdfcac0dc',
    nome: 'Lucas Fernandes',
    avatar_url: 'https://avatars.githubusercontent.com/u/60222823?s=400&u=d82dbc3d1d666b315b793f1888fd65c92d8ca0a9&v=4',
  },
  dataInsercao: '2024-04-05T13:16:51.711Z',
}

const conditionData = {
  uf: 'MG',
  cidade: 'ITUIUTABA',
  topologia: 'INVERSOR',
  tipoEstrutura: 'Fibrocimento',
  grupoInstalacao: 'RESIDENCIAL',
  faseamentoEletrico: 'MONOFÁSICO',
  idParceiro: '',
  numModulos: 210,
}
const variableData = {
  kit: 0,
  numModulos: 210,
  product: 0,
  service: 0,
  potenciaPico: 50,
  distancia: 0,
  plan: 0,
  numInversores: 1,
  valorReferencia: 0,
  consumoEnergiaMensal: 0,
  tarifaEnergia: 0,
  custosInstalacao: 0,
  custosPadraoEnergia: 0,
  custosEstruturaInstalacao: 0,
  custosOutros: 0,
}
function getCalculatedFinalValue({ value, margin }) {
  return value / (1 - margin)
}
function handleConditionValidation({ type, variable, equals, between, conditionData }) {
  if (type == 'IGUAL_TEXTO' || type == 'IGUAL_NÚMERICO') {
    // If there's a condition, extracting the conditionns comparators and the condition data to compare
    const conditionVariable = variable
    const conditionValue = equals
    const condition = conditionData[conditionVariable]
    // If condition is matched, then returning true
    if (condition == conditionValue) return true
    // If not, false
    return false
  }
  if (type == 'INTERVALO_NÚMERICO') {
    const conditionVariable = variable
    const conditionValues = between

    const condition = conditionData[conditionVariable]
    if (Number(condition) >= conditionValues.minimo && Number(condition) <= conditionValues.maximo) return true

    return false
  }

  return false
}

function handlePricingCalculation({ methodology, kit, variableData, conditionData }) {
  var variables = {
    ...variableData,
    total: 0,
    totalFaturavelFinal: 0,
    totalNaoFaturavelFinal: 0,
    totalFaturavelCustos: 0,
    totalNaoFaturavelCustos: 0,
  }
  let pricingItems = []
  let iteration = 0
  while (iteration < 100) {
    const individualCosts = methodology.itens
    pricingItems = individualCosts.map((cost) => {
      const costName = cost.nome
      // Ordering possible results so that general result formulas are find last
      const orderedPossibleResults = cost.resultados.sort((a, b) => (a.condicao.aplicavel === b.condicao.aplicavel ? 0 : a.condicao.aplicavel ? -1 : 1))
      const activeResult = orderedPossibleResults.find((r) => {
        const conditional = r.condicao.aplicavel
        // If there's no condition, then it is a general formula, so returning true
        if (!conditional) return true

        const conditionResult = handleConditionValidation({
          type: r.condicao.tipo,
          variable: r.condicao.variavel,
          equals: r.condicao.igual,
          between: r.condicao.entre,
          conditionData,
        })
        if (conditionResult) console.log('CONDIÇÃO ACEITA', r)
        return conditionResult
        // If there's a condition, extracting the conditionns comparators and the condition data to compare
        const conditionVariable = r.condicao.variavel
        const conditionValue = r.condicao.igual
        const condition = conditionData[conditionVariable]
        // If condition is matched, then returning true
        if (condition == conditionValue) return true
        // If not, false
        return false
      })
      // Theorically impossible
      if (!activeResult)
        return {
          descricao: '',
          custoCalculado: 0,
          custoFinal: 0,
          faturavel: false,
          margemLucro: 0,
          formulaArr: null,
          valorCalculado: 0,
          valorFinal: 0,
        }
      try {
        // Now, getting the pricing item based on the specified result
        const faturable = activeResult.faturavel
        const profitMargin = activeResult.margemLucro
        // Using the formulaArr and the variableData to populate the result's formula
        const formulaArr = activeResult.formulaArr
        const populatedFormula = formulaArr
          .map((i) => {
            // Extracting the variable, which is determined by outer brackets
            const isVariable = i.includes('[') && i.includes(']')
            // If there is not variable, then returning the original value
            if (!isVariable) return i
            // Else, exchanging the variable key by the variable value itself and returning it
            const strToReplace = i.replace('[', '').replace(']', '')
            const variableValue = variables[strToReplace] || 0
            // const fixedValue = strToReplace.replace(strToReplace, variableValue.toString())
            return variableValue
          })
          .join('')
        // Evaluating the formula as a string now
        const evaluatedCostValue = eval(populatedFormula)
        // Creating and returning the pricing item

        const pricingItem = {
          descricao: costName,
          custoCalculado: evaluatedCostValue,
          custoFinal: evaluatedCostValue,
          faturavel: faturable,
          margemLucro: profitMargin,
          formulaArr: formulaArr,
          valorCalculado: getCalculatedFinalValue({ value: evaluatedCostValue, margin: profitMargin / 100 }),
          valorFinal: getCalculatedFinalValue({ value: evaluatedCostValue, margin: profitMargin / 100 }),
        }
        return pricingItem
      } catch (error) {
        console.log('ERROR', error)
        return {
          descricao: '',
          custoCalculado: 0,
          custoFinal: 0,
          faturavel: false,
          formulaArr: null,
          margemLucro: 0,
          valorCalculado: 0,
          valorFinal: 0,
        }
      }
    })
    const newTotal = pricingItems.reduce((acc, current) => acc + current.valorFinal, 0)
    const newFaturableFinalTotal = pricingItems.filter((c) => !!c.faturavel).reduce((acc, current) => acc + current.valorFinal, 0)
    const newNonFaturableFinalTotal = pricingItems.filter((c) => !c.faturavel).reduce((acc, current) => acc + current.valorFinal, 0)
    const newFaturableCostTotal = pricingItems.filter((c) => !!c.faturavel).reduce((acc, current) => acc + current.custoFinal, 0)
    const newNonFaturableCostTotal = pricingItems.filter((c) => !c.faturavel).reduce((acc, current) => acc + current.custoFinal, 0)
    if (Math.abs(newTotal - variables.total) < 0.001) {
      // Convergence reached, updating cumulative variables and exiting the loop
      variables.totalFaturavelCustos = newFaturableCostTotal
      variables.totalNaoFaturavelCustos = newNonFaturableCostTotal
      variables.totalFaturavelFinal = newFaturableFinalTotal
      variables.totalNaoFaturavelFinal = newNonFaturableFinalTotal
      variables.total = newTotal
      break
    }
    // Updating cumulative variables and exiting the loop
    variables.totalFaturavelCustos = newFaturableCostTotal
    variables.totalNaoFaturavelCustos = newNonFaturableCostTotal
    variables.totalFaturavelFinal = newFaturableFinalTotal
    variables.totalNaoFaturavelFinal = newNonFaturableFinalTotal
    variables.total = newTotal
    iteration++
  }
  // Using iteration method while calculating pricing items to allow for cumulative values, such as totals
  return pricingItems
}

const pricingItems = handlePricingCalculation({ methodology: PricingMethodology, variableData: variableData, conditionData: conditionData })
console.log(pricingItems)
