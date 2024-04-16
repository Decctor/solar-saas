import { TInverter, TModule, TProductItem, TServiceItem } from '@/utils/schemas/kits.schema'

export function combineUniqueModules(modules: TProductItem[]) {
  const combinedModules: { [key: string]: { qtde: number } } = {}

  for (const moduleItem of modules) {
    const key = `${moduleItem.modelo}==${moduleItem.potencia}==${moduleItem.id}==${moduleItem.fabricante}==${moduleItem.garantia}`
    if (combinedModules[key]) {
      combinedModules[key].qtde += moduleItem.qtde
    } else {
      combinedModules[key] = { qtde: moduleItem.qtde }
    }
  }

  return Object.entries(combinedModules).map(([key, value]) => {
    const [modelo, potencia, id, fabricante, garantia] = key.split('==')
    return {
      id: id,
      modelo,
      potencia: Number(potencia),
      qtde: value.qtde,
      fabricante: fabricante,
      garantia: Number(garantia),
    }
  })
}
export function combineUniqueInverters(inverters: TProductItem[]) {
  const combinedInverters: { [key: string]: { qtde: number; garantia: number } } = {}

  for (const inverterItem of inverters) {
    const key = `${inverterItem.modelo}==${inverterItem.potencia}==${inverterItem.id}==${inverterItem.fabricante}==${inverterItem.garantia}`
    if (combinedInverters[key]) {
      combinedInverters[key].qtde += inverterItem.qtde
    } else {
      combinedInverters[key] = { qtde: inverterItem.qtde, garantia: inverterItem.garantia }
    }
  }

  return Object.entries(combinedInverters).map(([key, value]) => {
    const [modelo, potencia, id, fabricante, garantia] = key.split('==')
    return {
      id: id,
      modelo,
      potencia: Number(potencia),
      qtde: value.qtde,
      fabricante: fabricante,
      garantia: Number(garantia),
    }
  })
}
export function combineUniqueProducts(products: TProductItem[]): TProductItem[] {
  const combinedProducts: { [key: string]: { qtde: number; garantia: number } } = {}

  for (const productItem of products) {
    const key = `${productItem.categoria}==${productItem.modelo}==${productItem.potencia}==${productItem.id}==${productItem.fabricante}==${productItem.garantia}`
    if (combinedProducts[key]) {
      combinedProducts[key].qtde += productItem.qtde
    } else {
      combinedProducts[key] = { qtde: productItem.qtde, garantia: productItem.garantia }
    }
  }

  return Object.entries(combinedProducts).map(([key, value]) => {
    const [categoria, modelo, potencia, id, fabricante, garantia] = key.split('==')
    return {
      id: id,
      categoria: categoria as 'MÓDULO' | 'INVERSOR' | 'INSUMO' | 'ESTRUTURA' | 'PADRÃO' | 'OUTROS',
      modelo,
      potencia: Number(potencia),
      qtde: value.qtde,
      fabricante: fabricante,
      garantia: Number(garantia),
    }
  })
}
export function combineUniqueServices(products: TServiceItem[]): TServiceItem[] {
  const combinedProducts: { [key: string]: { observacoes: string; garantia: number } } = {}

  for (const productItem of products) {
    const key = `${productItem.descricao}`
    if (combinedProducts[key]) {
      combinedProducts[key].observacoes = productItem.observacoes
      combinedProducts[key].garantia = productItem.garantia
    } else {
      combinedProducts[key] = { observacoes: productItem.observacoes, garantia: productItem.garantia }
    }
  }

  return Object.entries(combinedProducts).map(([key, value]) => {
    const descricao = key
    return {
      id: null,
      descricao: descricao,
      observacoes: value.observacoes,
      garantia: Number(value.garantia),
    }
  })
}
