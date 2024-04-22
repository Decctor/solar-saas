import connectToAmpereDatabase from '@/services/mongodb/ampere/resquests-db-connection'
import connectToDatabase from '@/services/mongodb/main-db-connection'
import { apiHandler } from '@/utils/api'
import { calculateStringSimilarity } from '@/utils/methods'
import { TTechnicalAnalysis } from '@/utils/schemas/technical-analysis.schema'
import { TUser } from '@/utils/schemas/user.schema'
import {
  InverterFixationOptions,
  RoofTiles,
  StructureTypes,
  TechnicalAnalysisPendencyCategories,
  TechnicalAnalysisSolicitationTypes,
  Units,
} from '@/utils/select-options'
import { Collection } from 'mongodb'
import { NextApiHandler } from 'next'
import { z } from 'zod'

const equipmentRegex = /\(([^)]+)\)\s*(.*)/

function getEquipmentInformation(s: TAmpereTechnicalAnalysis['equipamentos']['modulos'], categoria: 'MÓDULO' | 'INVERSOR') {
  const equipments: TTechnicalAnalysis['equipamentos'] = []
  console.log(s)
  if (s.qtde?.toString().includes('/')) {
    const qtys = s.qtde.split('/')
    for (let i = 0; i < qtys.length; i++) {
      const equivalentModelStr = s.modelo?.split('/')[i]
      const matches = equivalentModelStr?.match(equipmentRegex)
      const matchedProducer = matches ? matches[1] : ''
      const matchedModel = matches ? matches[2] : equivalentModelStr || ''
      const equivalentPower = s.potencia?.split('/')[i] ? Number(s.potencia.split('/')[i]) : 0
      const equivalentQty = Number(qtys[i])
      const info: TTechnicalAnalysis['equipamentos'][number] = {
        categoria: categoria,
        fabricante: matchedProducer,
        modelo: matchedModel,
        potencia: equivalentPower,
        qtde: equivalentQty,
      }
      equipments.push(info)
      // console.log({
      //   fabricante: matchedProducer,
      //   modelo: matchedModel,
      //   qtde: equivalentQty,
      //   potencia: equivalentPower,
      // })
    }
  } else {
    const matches = s.modelo?.match(equipmentRegex)
    const matchedProducer = matches ? matches[1] : ''
    const matchedModel = matches ? matches[2] : s.modelo || ''
    const equivalentPower = s.potencia ? Number(s.potencia) : 0
    const equivalentQty = Number(s.qtde)
    const info: TTechnicalAnalysis['equipamentos'][number] = {
      categoria: categoria,
      fabricante: matchedProducer,
      modelo: matchedModel,
      potencia: equivalentPower,
      qtde: equivalentQty,
    }
    equipments.push(info)
    // console.log({
    //   fabricante: matchedProducer,
    //   modelo: matchedModel,
    //   qtde: equivalentQty,
    //   potencia: equivalentPower,
    // })
  }
  return equipments
}
const migrate: NextApiHandler<any> = async (req, res) => {
  const ampereDb = await connectToAmpereDatabase(process.env.OPERATIONAL_MONGODB_URI)
  const ampereAnalysisCollection: Collection<TAmpereTechnicalAnalysis> = ampereDb.collection('analisesTecnicas')

  const ampereAnalysis = await ampereAnalysisCollection.find({}).toArray()

  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const analysisCollection: Collection<TTechnicalAnalysis> = db.collection('technical-analysis')
  const usersCollection: Collection<TUser> = db.collection('users')
  const users = await usersCollection.find({}).toArray()

  const analysis = ampereAnalysis.map((analysis) => {
    const requesterUser = users.find((u) => calculateStringSimilarity(u.nome.toUpperCase(), analysis.requerente.nomeCRM?.toUpperCase() || '') > 90)
    const pendencies: TTechnicalAnalysis['pendencias'] =
      analysis.pendencias?.map((p) => {
        const responsibleUser = users.find((u) => calculateStringSimilarity(u.nome.toUpperCase(), p.responsavel?.toUpperCase() || '') > 90)
        return {
          categoria: p.categoria,
          descricao: p.descricao,
          dataFinalizacao: p.dataFinalizacao,
          finalizado: p.finalizado,
          responsavel: {
            id: responsibleUser?._id.toString() || '',
            nome: p.responsavel || '',
            avatar_url: responsibleUser?.avatar_url,
          },
          dataInsercao: analysis.dataInsercao,
        }
      }) || []

    const modulesEquipment = getEquipmentInformation(analysis.equipamentos.modulos, 'MÓDULO')
    const invertersEquipment = getEquipmentInformation(analysis.equipamentos.inversor, 'INVERSOR')
    const equipments = [...modulesEquipment, ...invertersEquipment]
    return {
      idParceiro: '65454ba15cf3e3ecf534b308',
      nome: analysis.nome,
      status: analysis.status, // create a list of options
      complexidade: analysis.complexidade,
      arquivosAuxiliares: analysis.arquivosAuxiliares, // link de fotos do drone, por exemplo
      pendencias: pendencies,
      anotacoes: analysis.anotacoes, // anotações gerais para auxilio ao analista
      tipoSolicitacao: analysis.tipoSolicitacao || 'ANÁLISE TÉCNICA REMOTA',
      analista: analysis.analista,
      requerente: {
        id: requesterUser?._id.toString() || '',
        nome: requesterUser?.nome || '',
        apelido: requesterUser?.nome || '',
        avatar_url: requesterUser?.avatar_url,
        contato: requesterUser?.telefone || '', // telefone
      },
      oportunidade: {
        id: analysis.projeto.id,
        nome: analysis.projeto.nome,
        identificador: analysis.projeto.identificador,
      },
      localizacao: {
        cep: analysis.localizacao?.cep || '',
        uf: analysis.localizacao?.uf,
        cidade: analysis.localizacao?.cidade,
        bairro: analysis.localizacao?.bairro || '',
        endereco: analysis.localizacao?.endereco || '',
        numeroOuIdentificador: analysis.localizacao?.numeroOuIdentificador || '',
      },
      equipamentos: equipments,
      padrao: analysis.padrao,
      transformador: {
        acopladoPadrao: analysis.transformador.acopladoPadrao,
        codigo: analysis.transformador.codigo,
        potencia: analysis.transformador.potencia,
      },
      execucao: {
        observacoes: analysis.execucao.observacoes,
        memorial: analysis.execucao.memorial,
        espacoQGBT: analysis.execucao.espacoQGBT,
      },
      descritivo: analysis.descritivo,
      servicosAdicionais: {
        alambrado: analysis.servicosAdicionais.alambrado,
        britagem: analysis.servicosAdicionais.britagem,
        casaDeMaquinas: analysis.servicosAdicionais.casaDeMaquinas,
        barracao: analysis.servicosAdicionais.barracao,
        roteador: analysis.servicosAdicionais.roteador,
        limpezaLocal: analysis.servicosAdicionais.limpezaLocal,
        redeReligacao: analysis.servicosAdicionais.redeReligacao,
        terraplanagem: analysis.servicosAdicionais.terraplanagem,
        realimentar: analysis.servicosAdicionais.realimentar,
      },
      detalhes: {
        concessionaria: analysis.detalhes.concessionaria,
        topologia: analysis.detalhes.topologia,
        materialEstrutura: analysis.detalhes.materialEstrutura,
        tipoEstrutura: analysis.detalhes.tipoEstrutura,
        tipoTelha: analysis.detalhes.tipoTelha,
        fixacaoInversores: analysis.detalhes.fixacaoInversores,
        imagensDrone: analysis.detalhes.imagensDrone,
        imagensFachada: analysis.detalhes.imagensFachada,
        imagensSatelite: analysis.detalhes.imagensSatelite,
        medicoes: analysis.detalhes.medicoes,
        orientacao: analysis.detalhes.orientacao,
        telhasReservas: analysis.detalhes.telhasReservas,
      },
      distancias: {
        conexaoInternet: analysis.distancias.conexaoInternet,
        cabeamentoCA: analysis.distancias.cabeamentoCA, // inversor ao padrão
        cabeamentoCC: analysis.distancias.cabeamentoCC, // modulos ao inversor
      },
      locais: {
        aterramento: analysis.locais.aterramento,
        inversor: analysis.locais.inversor, // instalação do inversor, varannda, garagem, etc
        modulos: analysis.locais.modulos, // instalação dos módulos, telhado, solo em x, solo em y, etc
      },
      custos: analysis.custos,
      alocacaoModulos: {
        leste: analysis.alocacaoModulos.leste,
        nordeste: analysis.alocacaoModulos.nordeste,
        noroeste: analysis.alocacaoModulos.noroeste,
        norte: analysis.alocacaoModulos.norte,
        oeste: analysis.alocacaoModulos.oeste,
        sudeste: analysis.alocacaoModulos.sudeste,
        sudoeste: analysis.alocacaoModulos.sudoeste,
        sul: analysis.alocacaoModulos.sul,
      },
      desenho: {
        observacoes: analysis.desenho.observacoes,
        tipo: analysis.desenho.tipo, //
        url: analysis.desenho.url,
      },
      suprimentos: {
        observacoes: analysis.suprimentos?.observacoes,
        itens: analysis.suprimentos?.itens || [],
      },
      conclusao: {
        // UTILIZADO PELOS VENDEDORES
        observacoes: analysis.conclusao.observacoes,
        espaco: analysis.conclusao.espaco, // possui espaço pra execução
        inclinacao: analysis.conclusao.inclinacao, // necessitará estrutura de inclinação
        sombreamento: analysis.conclusao.sombreamento, // possui sombra
        padrao: analysis.conclusao.padrao,
        estrutura: analysis.conclusao.estrutura,
      },
      dataInsercao: analysis.dataInsercao,
    } as TTechnicalAnalysis
  })

  const insertManyResponse = await analysisCollection.insertMany(analysis)
  return res.status(200).json(insertManyResponse)
}

export default apiHandler({ GET: migrate })

const GeneralTechnicalAnalysisSchema = z.object({
  _id: z.string().optional(),
  nome: z.string(),
  status: z.string(), // create a list of options
  complexidade: z.union([z.literal('SIMPLES'), z.literal('INTERMEDIÁRIO'), z.literal('COMPLEXO')]),
  arquivosAuxiliares: z.string().optional().nullable(), // link de fotos do drone, por exemplo
  pendencias: z
    .array(
      z.object({
        categoria: z.enum(TechnicalAnalysisPendencyCategories.map((t) => t.value)),
        descricao: z.string(),
        responsavel: z.string().optional().nullable(),
        dataFinalizacao: z.string().optional().nullable(),
        finalizado: z.boolean(),
      })
    )
    .optional()
    .nullable(),
  anotacoes: z.string(), // anotações gerais para auxilio ao analista
  tipoSolicitacao: z
    .enum(TechnicalAnalysisSolicitationTypes.map((t) => t.value))
    .nullable()
    .optional(),
  comentarios: z.string().optional().nullable(),
  analista: z
    .object({
      id: z.number().optional(),
      nome: z.string(),
      apelido: z.string(),
      avatar_url: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  requerente: z.object({
    idCRM: z.string().optional().nullable(),
    nomeCRM: z.string().optional().nullable(),
    apelido: z.string(),
    avatar_url: z.string().optional().nullable(),
    contato: z.string().optional().nullable(), // telefone
  }),
  projeto: z.object({
    id: z.string().optional().nullable(),
    nome: z.string(),
    identificador: z.string().optional().nullable(),
  }),
  aumento: z
    .object({
      id: z.string().optional().nullable(),
      nome: z.string(),
      equipamentos: z
        .object({
          modulos: z.object({
            modelo: z.string().optional().nullable(),
            qtde: z.string().optional().nullable(),
            potencia: z.string().optional().nullable(),
          }),
          inversor: z.object({
            modelo: z.string().optional().nullable(),
            qtde: z.string().optional().nullable(),
            potencia: z.string().optional().nullable(),
          }),
        })
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
  localizacao: z.object({
    cep: z.string().optional().nullable(),
    uf: z.string().optional().nullable(),
    cidade: z.string().optional().nullable(),
    bairro: z.string(),
    endereco: z.string(),
    numeroOuIdentificador: z.string(),
    distancia: z.number().optional().nullable(),
  }),
  equipamentos: z.object({
    modulos: z.object({
      modelo: z.string().nullable(),
      qtde: z.string().nullable(),
      potencia: z.string().nullable(),
    }),
    inversor: z.object({
      modelo: z.string().nullable(),
      qtde: z.string().nullable(),
      potencia: z.string().nullable(),
    }),
  }),
  padrao: z.array(
    z.object({
      alteracao: z.boolean(),
      tipo: z.union([z.literal('CONTRA À REDE'), z.literal('À FAVOR DA REDE')]), //
      tipoEntrada: z.union([z.literal('AÉREO'), z.literal('SUBTERRÂNEO')]), //
      tipoSaida: z.union([z.literal('AÉREO'), z.literal('SUBTERRÂNEO')]), //
      amperagem: z.string(), //
      ligacao: z.string(), //
      novaAmperagem: z.string().optional().nullable(), // x
      novaLigacao: z.string().optional().nullable(), // x
      codigoMedidor: z.string(),
      modeloCaixaMedidor: z.string().optional().nullable(),
      codigoPosteDerivacao: z.string().optional().nullable(), // GO only
    })
  ),
  transformador: z.object({
    acopladoPadrao: z.boolean(),
    codigo: z.string(),
    potencia: z.number(),
  }),
  execucao: z.object({
    observacoes: z.string().optional().nullable(),
    memorial: z
      .array(
        z.object({
          topico: z.string(), // avaliar telhado, adaptar qgbt, etc
          descricao: z.string(),
        })
      )
      .optional()
      .nullable(),
    espacoQGBT: z.boolean(),
  }),
  descritivo: z.array(z.object({ topico: z.string(), descricao: z.string() })),
  servicosAdicionais: z.object({
    alambrado: z
      .union([z.literal('NÃO'), z.literal('SIM - RESPONSABILIDADE CLIENTE'), z.literal('SIM - RESPONSABILIDADE AMPÈRE')])
      .optional()
      .nullable(),
    britagem: z
      .union([z.literal('NÃO'), z.literal('SIM - RESPONSABILIDADE CLIENTE'), z.literal('SIM - RESPONSABILIDADE AMPÈRE')])
      .optional()
      .nullable(),
    casaDeMaquinas: z
      .union([z.literal('NÃO'), z.literal('SIM - RESPONSABILIDADE CLIENTE'), z.literal('SIM - RESPONSABILIDADE AMPÈRE')])
      .optional()
      .nullable(),
    barracao: z
      .union([z.literal('NÃO'), z.literal('SIM - RESPONSABILIDADE CLIENTE'), z.literal('SIM - RESPONSABILIDADE AMPÈRE')])
      .optional()
      .nullable(),
    roteador: z
      .union([z.literal('NÃO'), z.literal('SIM - RESPONSABILIDADE CLIENTE'), z.literal('SIM - RESPONSABILIDADE AMPÈRE')])
      .optional()
      .nullable(),
    limpezaLocal: z
      .union([z.literal('NÃO'), z.literal('SIM - RESPONSABILIDADE CLIENTE'), z.literal('SIM - RESPONSABILIDADE AMPÈRE')])
      .optional()
      .nullable(),
    redeReligacao: z
      .union([z.literal('NÃO'), z.literal('SIM - RESPONSABILIDADE CLIENTE'), z.literal('SIM - RESPONSABILIDADE AMPÈRE')])
      .optional()
      .nullable(),
    terraplanagem: z
      .union([z.literal('NÃO'), z.literal('SIM - RESPONSABILIDADE CLIENTE'), z.literal('SIM - RESPONSABILIDADE AMPÈRE')])
      .optional()
      .nullable(),
    realimentar: z.boolean(),
  }),
  detalhes: z.object({
    concessionaria: z.string(),
    topologia: z
      .union([z.literal('MICRO-INVERSOR'), z.literal('INVERSOR')])
      .optional()
      .nullable(),
    materialEstrutura: z
      .union([z.literal('MADEIRA'), z.literal('FERRO')])
      .optional()
      .nullable(),
    tipoEstrutura: z
      .enum(StructureTypes.map((t) => t.value))
      .optional()
      .nullable(),
    tipoTelha: z
      .enum(RoofTiles.map((t) => t.value))
      .optional()
      .nullable(),
    fixacaoInversores: z
      .enum(InverterFixationOptions.map((x) => x.value))
      .optional()
      .nullable(),
    imagensDrone: z.boolean(),
    imagensFachada: z.boolean(),
    imagensSatelite: z.boolean(),
    medicoes: z.boolean(),
    orientacao: z.string(),
    telhasReservas: z
      .union([z.literal('NÃO'), z.literal('SIM')])
      .optional()
      .nullable(),
  }),
  distancias: z.object({
    conexaoInternet: z.string(),
    cabeamentoCA: z.string(), // inversor ao padrão
    cabeamentoCC: z.string(), // modulos ao inversor
  }),
  locais: z.object({
    aterramento: z.string().optional().nullable(),
    inversor: z.string(), // instalação do inversor, varannda, garagem, etc
    modulos: z.string(), // instalação dos módulos, telhado, solo em x, solo em y, etc
  }),
  custos: z.array(
    z.object({
      categoria: z
        .union([z.literal('INSTALAÇÃO'), z.literal('PADRÃO'), z.literal('ESTRUTURA'), z.literal('OUTROS')])
        .optional()
        .nullable(),
      descricao: z.string(),
      qtde: z.number(),
      grandeza: z.enum(Units.map((u) => u.value)),
      custoUnitario: z.number().optional().nullable(),
      total: z.number().optional().nullable(),
    })
  ),
  arquivos: z.array(
    z.object({
      descricao: z.string(),
      url: z.string(),
      formato: z.string(),
    })
  ),
  alocacaoModulos: z.object({
    leste: z.number().optional().nullable(),
    nordeste: z.number().optional().nullable(),
    noroeste: z.number().optional().nullable(),
    norte: z.number().optional().nullable(),
    oeste: z.number().optional().nullable(),
    sudeste: z.number().optional().nullable(),
    sudoeste: z.number().optional().nullable(),
    sul: z.number().optional().nullable(),
  }),
  desenho: z.object({
    observacoes: z.string(),
    tipo: z.string().optional().nullable(), //
    url: z.string().optional().nullable(),
  }),
  suprimentos: z
    .object({
      observacoes: z.string(),
      itens: z.array(
        z.object({
          descricao: z.string(),
          tipo: z.string(),
          qtde: z.number(),
          grandeza: z.enum(Units.map((u) => u.value)),
        })
      ),
    })
    .optional()
    .nullable(),
  conclusao: z.object({
    // UTILIZADO PELOS VENDEDORES
    observacoes: z.string(),
    espaco: z.boolean(), // possui espaço pra execução
    inclinacao: z.boolean(), // necessitará estrutura de inclinação
    sombreamento: z.boolean(), // possui sombra
    padrao: z
      .union([z.literal('APTO'), z.literal('REFORMAR'), z.literal('TROCAR')])
      .optional()
      .nullable(),
    estrutura: z
      .union([z.literal('APTO'), z.literal('CONDENADO'), z.literal('REFORÇAR'), z.literal('AVALIAR NA EXECUÇÃO')])
      .optional()
      .nullable(),
  }),
  dataInsercao: z.string().datetime(),
  dataEfetivacao: z.string().datetime().optional().nullable(),
})
export type TAmpereTechnicalAnalysis = z.infer<typeof GeneralTechnicalAnalysisSchema>
