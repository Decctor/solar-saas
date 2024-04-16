import z from 'zod'
import { InverterSchema, ModuleSchema, ProductItemSchema, ServiceItemSchema } from './kits.schema'

const PurchaseItemsSchema = z.object({
  descricao: z.string(),
  precoUnitario: z.number(),
  qtde: z.number(),
  grandeza: z.string(),
})
const SupplySchema = z.object({
  descricao: z.string(),
  status: z.union([z.literal('PENDENTE'), z.literal('EM AGUARDO'), z.literal('COMPRA REALIZADA'), z.literal('CONCLUÍDO')]),
  itens: z.array(PurchaseItemsSchema),
  fornecedor: z.string(),
  dataPedido: z.string().datetime().optional().nullable(),
  dataPagamento: z.string().datetime().optional().nullable(),
  dataFaturamento: z.string().datetime().optional().nullable(),
  dataPrevisaoEntrega: z.string().datetime().optional().nullable(),
  dataEntrega: z.string().datetime().optional().nullable(),
  rastreio: z.string(),
  anotacoes: z.string(),
  localEntrega: z.string(),
  valorTotal: z.number(),
})
const GeneralProjectSchema = z.object({
  nome: z.string(),
  idParceiro: z.string(),
  identificador: z.string(),
  responsaveis: z.array(
    z.object({
      id: z.string(),
      nome: z.string(),
      papel: z.string(),
      avatar_url: z.string().optional().nullable(),
    })
  ),
  oportunidade: z.object({
    id: z.string(),
    nome: z.string(),
  }),
  proposta: z.object({
    id: z.string(),
    nome: z.string(),
  }),
  cliente: z.object({
    id: z.string(),
    nome: z.string(),
  }),
  contatos: z.object({
    telefonePrimario: z.string(),
    telefoneSecundario: z.string().optional().nullable(),
    email: z.string(),
  }),
  localizacao: z.object({
    cep: z.string().optional().nullable(),
    uf: z.string().optional().nullable(),
    cidade: z.string().optional().nullable(),
    bairro: z.string(),
    endereco: z.string(),
    numeroOuIdentificador: z.string(),
    distancia: z.number().optional().nullable(),
    complemento: z.string().optional().nullable(),
  }),
  segmento: z.union([z.literal('RESIDENCIAL'), z.literal('RURAL'), z.literal('COMERCIAL'), z.literal('INDUSTRIAL')]),
  contrato: z.object({
    status: z.union([z.literal('SOLICITADO'), z.literal('AGUARDANDO ASSINATURA'), z.literal('ASSINADO'), z.literal('RESCISÃO')]),
    dataSolicitacao: z.string(),
    dataLiberacao: z.string().optional().nullable(),
    dataAssinatura: z.string().optional().nullable(),
    formaAssinatura: z.union([z.literal('FÍSICA'), z.literal('DIGITAL')]),
  }),
  unidadeConsumidora: z.object({
    concessionaria: z.string(),
    numero: z.string(),
    grupo: z.union([z.literal('URBANO'), z.literal('RURAL')]),
    tipoLigacao: z.union([z.literal('EXISTENTE'), z.literal('NOVA')]),
    tipoTitular: z.union([z.literal('PESSOA FÍSICA'), z.literal('PESSOA JURÍDICA')]),
    nomeTitular: z.string(),
  }),
  estruturaInstalacao: z.object({
    alteracao: z.boolean(),
    tipo: z.string(),
    material: z.union([z.literal('MADEIRA'), z.literal('FERRO')]), // Define list
    observacoes: z.string(),
  }),
  padraoEnergia: z.object({
    alteracao: z.boolean(),
    tipo: z.union([z.literal('CONTRA À REDE'), z.literal('À FAVOR DA REDE')]), //
    tipoEntrada: z.union([z.literal('AÉREO'), z.literal('SUBTERRÂNEO')]), //
    tipoSaida: z.union([z.literal('AÉREO'), z.literal('SUBTERRÂNEO')]), //
    amperagem: z.string(), //
    ligacao: z.union([z.literal('MONOFÁSICO'), z.literal('BIFÁSICO'), z.literal('TRIFÁSICO')]), //
    novaAmperagem: z
      .union([z.literal('MONOFÁSICO'), z.literal('BIFÁSICO'), z.literal('TRIFÁSICO')])
      .optional()
      .nullable(), // x
    novaLigacao: z.string().optional().nullable(), // x
    codigoMedidor: z.string(),
    modeloCaixaMedidor: z.string().optional().nullable(),
    observacoes: z.string(),
  }),
  liberacoes: z.object({
    comercial: z.string().datetime().optional().nullable(),
    suprimentos: z.string().datetime().optional().nullable(),
    projetos: z.string().datetime().optional().nullable(),
    execucao: z.string().datetime().optional().nullable(),
    financeiro: z.string().datetime().optional().nullable(),
  }),
  parecerAcesso: z.object({
    status: z
      .union([
        z.literal('AGUARDANDO ASSINATURA'),
        z.literal('AGUARDANDO ART'),
        z.literal('AGUARDANDO CONCESSIONÁRIA'),
        z.literal('SUSPENSO'),
        z.literal('APROVADO'),
        z.literal('APROVADO (NOTURNO)'),
        z.literal('APROVADO (COM OBRAS)'),
      ])
      .optional()
      .nullable(),
    dataLiberacaoDocumentacao: z.string().datetime().optional().nullable(),
    dataAssinaturaDocumentacao: z.string().datetime().optional().nullable(),
    formaAssinaturaDocumentacao: z
      .union([z.literal('FÍSICA'), z.literal('DIGITAL')])
      .optional()
      .nullable(),
    dataSolicitacao: z.string().datetime().optional().nullable(),
    dataAprovacao: z.string().datetime().optional().nullable(),
    dataReprova: z.string().datetime().optional().nullable(),
  }),
  execucao: z.object({
    status: z
      .union([z.literal('AGENDADA'), z.literal('EM ANDAMENTO'), z.literal('CONCLUÍDA')])
      .optional()
      .nullable(),

    inicio: z.string().datetime().optional().nullable(),
    fim: z.string().datetime().optional().nullable(),
    observacoes: z.string(),
  }),
  vistoriaTecnica: z.object({
    status: z
      .union([z.literal('AGUARDANDO CONCESSIONÁRIA'), z.literal('REPROVADA'), z.literal('APROVADA')])
      .optional()
      .nullable(),
    dataPedido: z.string().datetime().optional().nullable(),
    dataAprovacao: z.string().datetime().optional().nullable(),
    dataReprova: z.string().datetime().optional().nullable(),
  }),
  equipamentos: z.array(ProductItemSchema),
  servicos: z.array(ServiceItemSchema),
  potenciaPico: z.number(),
  nps: z.number().optional().nullable(),
})
export type TProject = z.infer<typeof GeneralProjectSchema>
