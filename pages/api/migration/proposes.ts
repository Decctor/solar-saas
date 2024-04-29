import { NextApiHandler } from 'next'
import { apiHandler } from '@/utils/api'

import connectToDatabase from '@/services/mongodb/main-db-connection'

import { Collection, ObjectId, WithId } from 'mongodb'
import { TSolarSystemPropose } from '@/ampere-migration/proposes-schemas/solar-system.schema'
import { THomologationPropose } from '@/ampere-migration/proposes-schemas/homologation.schema'
import { TOeMPropose } from '@/ampere-migration/proposes-schemas/oem.schema'
import { TMonitoringPropose } from '@/ampere-migration/proposes-schemas/monitoring.schema'
import { TPricingItem, TProposal } from '@/utils/schemas/proposal.schema'
import { TProductItem } from '@/utils/schemas/kits.schema'
import connectToAmpereDatabase from '@/services/mongodb/ampere-db-connection'
import { z } from 'zod'
type PostResponse = any

const AmpereProposeTemplates = [
  {
    active: true,
    label: 'TEMPLATE SIMPLES 2024',
    value: 'TEMPLATE SIMPLES 2024',
    templateId: 'jNegIQ837v9VvQ5XBkOF',
    applicableProjectTypes: ['SISTEMA FOTOVOLTAICO'],
  },
  {
    active: false,
    label: 'TEMPLATE SIMPLES',
    value: 'TEMPLATE SIMPLES',
    templateId: 'LPHl6ETXfSmY3QsHJqAW',
    applicableProjectTypes: ['SISTEMA FOTOVOLTAICO'],
  },
  {
    active: false,
    label: 'TEMPLATE COMERCIAL 2023',
    value: 'TEMPLATE COMERCIAL 2023',
    templateId: 'atY9ZFVb7eVbAKuXVJuS',
    applicableProjectTypes: ['SISTEMA FOTOVOLTAICO'],
  },
  {
    active: true,
    label: 'TEMPLATE COMPLEXO 2024',
    value: 'TEMPLATE COMPLEXO 2024',
    templateId: '7q9aUSkD67g9q3jqQjq0',
    applicableProjectTypes: ['SISTEMA FOTOVOLTAICO'],
  },
  {
    active: true,
    label: 'TEMPLATE PARCEIRA BYD',
    value: 'TEMPLATE PARCEIRA BYD',
    templateId: 'QMIYo5Aw51DGlb1n8dUp',
    applicableProjectTypes: ['SISTEMA FOTOVOLTAICO'],
  },
  {
    active: true,
    label: 'TEMPLATE O&M',
    value: 'TEMPLATE O&M',
    templateId: 'Cf2vPPIkSi7XEpuXV8Xv',
    applicableProjectTypes: ['OPERAÇÃO E MANUTENÇÃO'],
  },
  {
    active: false,
    label: 'TEMPLATE MONTAGEM E DESMONTAGEM',
    value: 'TEMPLATE MONTAGEM E DESMONTAGEM',
    templateId: 'lVJehmCJyvzqYSAbQwBe',
    applicableProjectTypes: ['MONTAGEM E DESMONTAGEM'],
  },
  {
    active: true,
    label: 'TEMPLATE MONTAGEM E DESMONTAGEM 2024',
    value: 'TEMPLATE MONTAGEM E DESMONTAGEM 2024',
    templateId: 'QiAjovgEpAt2RCJx5Am7',
    applicableProjectTypes: ['MONTAGEM E DESMONTAGEM'],
  },
]

const migrate: NextApiHandler<any> = async (req, res) => {
  const { id } = req.query

  const ampereDb = await connectToAmpereDatabase(process.env.MONGODB_CRM, 'main')
  const ampereProposalsCollection = ampereDb.collection('proposes')
  const ampereProjectsCollection: Collection<TAmpereProject> = ampereDb.collection('projects')

  const ampereProposals = (await ampereProposalsCollection.find({}).toArray()) as WithId<
    TSolarSystemPropose | THomologationPropose | TOeMPropose | TMonitoringPropose
  >[]
  const ampereProjects = await ampereProjectsCollection.find({}, { projection: { clienteId: 1 } }).toArray()
  const db = await connectToDatabase(process.env.MONGODB_URI, 'crm')
  const proposalsCollection = db.collection('proposals')
  const proposals = ampereProposals
    .map((proposal) => {
      const equivalentProject = ampereProjects.find((p) => p._id.toString() == proposal.projeto.id)
      const clientId = equivalentProject?.clienteId || ''

      // Getting information about the template
      const usedTemplate = AmpereProposeTemplates.find((ampTemplate) => ampTemplate.value == proposal.template)
      const usedTemplateId = usedTemplate?.templateId || null

      // Defining proposal objects based on the proposal type
      if ((proposal as WithId<TOeMPropose>).precificacao.manutencaoSimples) {
        const info = proposal as WithId<TOeMPropose>
        // Generating a proposal in case of O&M
        return {
          _id: new ObjectId(info._id),
          nome: info.nome,
          idParceiro: '65454ba15cf3e3ecf534b308',
          idMetodologiaPrecificacao: '',
          idModeloAnvil: usedTemplateId,
          idCliente: clientId,
          valor: info.valorProposta || 0,
          premissas: {
            consumoEnergiaMensal: info.premissas.consumoEnergiaMensal,
            tarifaEnergia: info.premissas.tarifaEnergia,
            distancia: info.premissas.distancia,
            numModulos: info.premissas.qtdeModulos,
          },
          oportunidade: {
            id: info.projeto.id,
            nome: info.projeto.nome,
          },
          kits: [],
          planos: [
            {
              id: '',
              nome: 'MANUTENÇÃO SIMPLES',
              valor: info.precificacao.manutencaoSimples.vendaFinal,
              descricao: 'Serviço de manutenção simples.',
              intervalo: {
                tipo: 'ANUAL',
                espacamento: 1,
              },
              descritivo: plans[0].descritivo,
            },
            {
              id: '',
              nome: 'PLANO SOL',
              valor: info.precificacao.planoSol.vendaFinal,
              descricao: 'Nosso plano de operação e manutenção básico.',
              intervalo: {
                tipo: 'ANUAL',
                espacamento: 1,
              },
              descritivo: plans[1].descritivo,
            },
            {
              id: '',
              nome: 'PLANO SOL PLUS',
              valor: info.precificacao.planoSolPlus.vendaFinal,
              descricao: 'Nosso plano de operação e manutenção premium.',
              intervalo: {
                tipo: 'ANUAL',
                espacamento: 1,
              },
              descritivo: plans[2].descritivo,
            },
          ],
          produtos: [],
          servicos: [],
          precificacao: [],
          pagamento: {
            metodos: [],
          },
          potenciaPico: (info.premissas.qtdeModulos || 0) * (info.premissas.potModulos || 0),
          urlArquivo: info.linkArquivo || null,
          autor: {
            id: info.autor.id,
            nome: info.autor.nome,
            avatar_url: info.autor.avatar_url,
          },
          dataInsercao: proposal.dataInsercao || new Date().toISOString(),
        } as TProposal
      }
      if ((proposal as WithId<TMonitoringPropose>).precificacao.mensal) {
        // Generating a proposal in case of Monitoring
        const info = proposal as WithId<TMonitoringPropose>
        return {
          // @ts-ignore
          _id: new ObjectId(info._id),
          nome: info.nome,
          idParceiro: '65454ba15cf3e3ecf534b308',
          idCliente: clientId,
          idMetodologiaPrecificacao: '',
          idModeloAnvil: usedTemplateId,
          valor: info.valorProposta || 0,
          premissas: {
            tarifaEnergia: info.premissas.tarifaEnergia,
            distancia: info.premissas.distancia,
            numModulos: info.premissas.qtdeModulos,
          },
          oportunidade: {
            id: info.projeto.id,
            nome: info.projeto.nome,
          },
          kits: [],
          planos: [
            {
              id: '',
              nome: 'MONITORAMENTO MENSAL',
              valor: info.precificacao.mensal.vendaFinal,
              descricao: 'Serviço de operação de usinas mensal.',
              intervalo: {
                tipo: 'MENSAL',
                espacamento: 1,
              },
              descritivo: [],
            },
            {
              id: '',
              nome: 'MONITORAMENTO SEMESTRAL',
              valor: info.precificacao.semestral.vendaFinal,
              descricao: 'Serviço de operação de usinas semestral.',
              intervalo: {
                tipo: 'SEMESTRAL',
                espacamento: 1,
              },
              descritivo: [],
            },
            {
              id: '',
              nome: 'MONITORAMENTO ANUAL',
              valor: info.precificacao.anual.vendaFinal,
              descricao: 'Serviço de operação de usinas anual.',
              intervalo: {
                tipo: 'ANUAL',
                espacamento: 1,
              },
              descritivo: [],
            },
          ],
          produtos: [],
          servicos: [
            {
              descricao: 'OPERAÇÃO DE USINA FOTOVOLTAICA',
              observacoes: '',
              garantia: 0,
            },
          ],
          precificacao: [],
          pagamento: {
            metodos: [],
          },
          potenciaPico: (info.premissas.qtdeModulos || 0) * (info.premissas.potModulos || 0),
          urlArquivo: null,
          autor: {
            id: info.autor.id,
            nome: info.autor.nome,
            avatar_url: info.autor.avatar_url,
          },
          dataInsercao: proposal.dataInsercao || new Date().toISOString(),
        } as TProposal
      }

      if (!!(proposal as WithId<TSolarSystemPropose>).precificacao.kit) {
        // Generating a proposal in case of UFV
        const info = proposal as WithId<TSolarSystemPropose>

        const moduleProducts: TProductItem[] = info.kit.modulos.map((pannel) => ({
          categoria: 'MÓDULO',
          fabricante: pannel.fabricante,
          modelo: pannel.modelo,
          qtde: pannel.qtde,
          potencia: pannel.potencia || 0,
          garantia: pannel.garantia,
        }))
        const inverterProducts: TProductItem[] = info.kit.inversores.map((inverter) => ({
          categoria: 'INVERSOR',
          fabricante: inverter.fabricante,
          modelo: inverter.modelo,
          qtde: inverter.qtde,
          potencia: inverter.potenciaNominal || 0,
          garantia: inverter.garantia,
        }))
        const products = [...moduleProducts, ...inverterProducts]

        const pricing: TPricingItem[] = Object.entries(info.precificacao).map(([key, value]) => {
          return {
            descricao: priceDescription[key as keyof typeof priceDescription],
            custoCalculado: value.custo,
            custoFinal: value.custo,
            faturavel: key == 'kit' ? false : true,
            margemLucro: value.margemLucro * 100,
            valorCalculado: value.vendaProposto,
            valorFinal: value.vendaFinal,
          }
        })
        return {
          // @ts-ignore
          _id: new ObjectId(info._id),
          nome: info.nome,
          idParceiro: '65454ba15cf3e3ecf534b308',
          idCliente: clientId,
          idMetodologiaPrecificacao: '',
          idModeloAnvil: usedTemplateId,
          valor: info.valorProposta || 0,
          premissas: {
            consumoEnergiaMensal: info.premissas.consumoEnergiaMensal,
            fatorSimultaneidade: info.premissas.fatorSimultaneidade,
            tipoEstrutura: info.premissas.tipoEstrutura,
            tarifaEnergia: info.premissas.tarifaEnergia,
            tarifaFioB: info.premissas.tarifaTUSD,
            orientacao: info.premissas.orientacao,
            distancia: info.premissas.distancia,
            potenciaPico: info.potenciaPico || 0,
            topologia: info.kit.topologia,
          },
          oportunidade: {
            id: info.projeto.id,
            nome: info.projeto.nome,
          },
          kits: [{ id: typeof info.kit.kitId == 'object' ? info.kit.kitId[0] : info.kit.kitId, nome: info.kit.nome, valor: info.kit.preco }],
          planos: [],
          produtos: products,
          servicos: [
            {
              descricao: 'PROJETO',
              observacoes: '',
              garantia: 1,
            },
            {
              descricao: 'HOMOLOGAÇÃO',
              observacoes: '',
              garantia: 1,
            },
            {
              descricao: 'MONTAGEM/EXECUÇÃO',
              observacoes: '',
              garantia: 1,
            },
            {
              descricao: 'COMISSIONAMENTO',
              observacoes: '',
              garantia: 1,
            },
          ],
          precificacao: pricing,
          pagamento: {
            metodos: [],
          },
          potenciaPico: info.potenciaPico || 0,
          urlArquivo: info.linkArquivo || null,
          autor: {
            id: info.autor.id,
            nome: info.autor.nome,
            avatar_url: info.autor.avatar_url,
          },
          dataInsercao: proposal.dataInsercao || new Date().toISOString(),
        } as TProposal
      }

      return null
    })
    .filter((p) => !!p)
  const insertManyResponse = await proposalsCollection.insertMany(proposals as TProposal[])
  return res.json(insertManyResponse)
}
export default apiHandler({
  GET: migrate,
})

const plans = [
  {
    kitId: 1,
    _id: {
      $oid: '661d828de3446bbfeff1bcf4',
    },
    ativo: true,
    nome: 'MANUTENÇÃO SIMPLES',
    idParceiro: '65454ba15cf3e3ecf534b308',
    idMetodologiaPrecificacao: '660ff9c31285da49d6dc201d',
    descricao: 'Nosso plano de operação e manutenção premium.',
    intervalo: {
      tipo: 'ANUAL',
      espacamento: 1,
    },
    descritivo: [
      {
        descricao: 'LIMPEZA DOS MÓDULOS FOTOVOLTAICOS',
      },
      {
        descricao: 'MANUTENÇÃO ELÉTRICA DOS INVERSORES E QUADROS ELÉTRICOS',
      },
      {
        descricao: 'REAPERTO DAS CONEXÕES ELÉTRICAS',
      },
    ],
    produtos: [],
    servicos: [
      {
        descricao: 'LIMPEZA DOS MÓDULOS FOTOVOLTAICOS',
        observacoes: '',
        garantia: 1,
      },
      {
        descricao: 'MANUTENÇÃO DOS INVERSORES E QUADROS ELÉTRICOS',
        observacoes: '',
        garantia: 1,
      },
      {
        descricao: 'REAPERTO DAS CONEXÕES ELÉTRICAS',
        observacoes: '',
        garantia: 1,
      },
    ],
    preco: 0,
    autor: {
      id: '65453222e345279bdfcac0dc',
      nome: 'Lucas Fernandes',
      avatar_url: 'https://avatars.githubusercontent.com/u/60222823?s=400&u=d82dbc3d1d666b315b793f1888fd65c92d8ca0a9&v=4',
    },
    dataInsercao: '2024-04-05T13:17:42.516Z',
  },
  {
    kitId: 2,
    _id: {
      $oid: '660efd7cb535065ae08d459f',
    },
    ativo: true,
    nome: 'PLANO SOL',
    idParceiro: '65454ba15cf3e3ecf534b308',
    idMetodologiaPrecificacao: '660ff9551285da49d6dc201c',
    descricao: 'Plano básico de operação e manutenção.',
    intervalo: {
      tipo: 'ANUAL',
      espacamento: 1,
    },
    descritivo: [
      {
        descricao: 'LIMPEZA DOS MÓDULOS FOTOVOLTAICOS',
      },
      {
        descricao: 'MANUTENÇÃO ELÉTRICA DOS INVERSORES E QUADROS ELÉTRICOS',
      },
      {
        descricao: 'REAPERTO DAS CONEXÕES ELÉTRICAS',
      },
      {
        descricao: 'DISTRIBUIÇÃO DE CRÉDITOS (2x)',
      },
    ],
    produtos: [],
    servicos: [
      {
        descricao: 'LIMPEZA DOS MÓDULOS FOTOVOLTAICOS',
        observacoes: '',
        garantia: 1,
      },
      {
        descricao: 'MANUTENÇÃO ELÉTRICA DOS INVERSORES E QUADROS ELÉTRICOS',
        observacoes: '',
        garantia: 1,
      },
      {
        descricao: 'REAPERTO DAS CONEXÕES ELÉTRICAS',
        observacoes: '',
        garantia: 1,
      },
      {
        descricao: 'DISTRIBUIÇÃO DE CRÉDITOS (2x)',
        observacoes: '',
        garantia: 1,
      },
    ],
    preco: 500,
    autor: {
      id: '65453222e345279bdfcac0dc',
      nome: 'Lucas Fernandes',
      avatar_url: 'https://avatars.githubusercontent.com/u/60222823?s=400&u=d82dbc3d1d666b315b793f1888fd65c92d8ca0a9&v=4',
    },
    dataInsercao: '2024-04-04T19:20:28.291Z',
  },
  {
    kitId: 3,
    _id: {
      $oid: '660ff9f61285da49d6dc201e',
    },
    ativo: true,
    nome: 'PLANO SOL PLUS',
    idParceiro: '65454ba15cf3e3ecf534b308',
    idMetodologiaPrecificacao: '660ff9c31285da49d6dc201d',
    descricao: 'Nosso plano de operação e manutenção premium.',
    intervalo: {
      tipo: 'ANUAL',
      espacamento: 1,
    },
    descritivo: [
      {
        descricao: 'LIMPEZA DOS MÓDULOS FOTOVOLTAICOS (2x)',
      },
      {
        descricao: 'MANUTENÇÃO ELÉTRICA DOS INVERSORES E QUADROS ELÉTRICOS (2x)',
      },
      {
        descricao: 'REAPERTO DAS CONEXÕES ELÉTRICAS',
      },
      {
        descricao: 'DISTRIBUIÇÃO DE CRÉDITOS (4x)',
      },
    ],
    produtos: [],
    servicos: [
      {
        descricao: 'LIMPEZA DOS MÓDULOS FOTOVOLTAICOS (2x)',
        observacoes: '',
        garantia: 1,
      },
      {
        descricao: 'MANUTENÇÃO DOS INVERSORES E QUADROS ELÉTRICOS (2x)',
        observacoes: '',
        garantia: 1,
      },
      {
        descricao: 'REAPERTO DAS CONEXÕES ELÉTRICAS',
        observacoes: '',
        garantia: 1,
      },
      {
        descricao: 'DISTRIBUIÇÃO DE CRÉDITOS (4x)',
        observacoes: '',
        garantia: 1,
      },
    ],
    preco: 0,
    autor: {
      id: '65453222e345279bdfcac0dc',
      nome: 'Lucas Fernandes',
      avatar_url: 'https://avatars.githubusercontent.com/u/60222823?s=400&u=d82dbc3d1d666b315b793f1888fd65c92d8ca0a9&v=4',
    },
    dataInsercao: '2024-04-05T13:17:42.516Z',
  },
]

const priceDescription = {
  kit: 'KIT FOTOVOLTAICO',
  instalacao: 'INSTALAÇÃO',
  maoDeObra: 'MÃO DE OBRA',
  projeto: 'CUSTOS DE PROJETO',
  venda: 'CUSTOS DE VENDA',
  padrao: 'ADEQUAÇÕES DE PADRÃO',
  estrutura: 'ADEQUAÇÕES DE ESTRUTURA',
  extra: 'OUTROS SERVIÇOS',
  homologacao: 'HOMOLOGAÇÃO',
  deslocamento: 'DESLOCAMENTO',
}

const GeneralProjectSchema = z.object({
  nome: z.string(),
  tipoProjeto: z.string(),
  identificador: z.string(),
  idOportunidade: z.string().optional().nullable(),
  idParceiro: z.string(),
  idIndicacao: z.string({ invalid_type_error: 'Tipo não válido para o ID de referência da indicação.' }).optional().nullable(),
  responsavel: z.object({
    id: z.string(),
    nome: z.string(),
    avatar_url: z.string().optional().nullable(),
  }),
  representante: z.object({
    id: z.string(),
    nome: z.string(),
    avatar_url: z.string().optional().nullable(),
  }),
  localizacao: z.object({
    cep: z.string().optional().nullable(),
    uf: z.string(),
    cidade: z.string(),
    bairro: z.string().optional().nullable(),
    endereco: z.string().optional().nullable(),
    numeroOuIdentificador: z.string().optional().nullable(),
    complemento: z.string().optional().nullable(),
    // distancia: z.number().optional().nullable(),
  }),
  clienteId: z.string(),
  propostaAtiva: z.string().optional().nullable(),
  titularInstalacao: z.string().optional().nullable(),
  numeroInstalacaoConcessionaria: z.string().optional().nullable(),
  tipoTitular: z
    .union([z.literal('PESSOA FISICA'), z.literal('PESSOA JURIDICA')])
    .optional()
    .nullable(),
  tipoLigacao: z
    .union([z.literal('EXISTENTE'), z.literal('NOVA')])
    .optional()
    .nullable(),
  tipoInstalacao: z
    .union([z.literal('URBANO'), z.literal('RURAL')])
    .optional()
    .nullable(),
  credor: z.string().optional().nullable(),
  anexos: z
    .object({
      documentoComFoto: z.string().optional().nullable(),
      iptu: z.string().optional().nullable(),
      contaDeEnergia: z.string().optional().nullable(),
      laudo: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  descricao: z.string().optional().nullable(),
  funis: z.array(z.object({ id: z.union([z.string(), z.number()]), etapaId: z.union([z.string(), z.number()]) })),
  dataPerda: z.string().optional().nullable(),
  motivoPerda: z.string().optional().nullable(),
  contrato: z
    .object({
      id: z.string().optional().nullable(),
      idProposta: z.string().nullable(),
      dataAssinatura: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  solicitacaoContrato: z
    .object({
      id: z.string().optional().nullable(),
      idProposta: z.string().nullable(),
      dataSolicitacao: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  dataInsercao: z.string().datetime(),
})

export type TAmpereProject = z.infer<typeof GeneralProjectSchema>
