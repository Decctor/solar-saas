import z from 'zod'
import { InverterSchema, ModuleSchema, ProductItemSchema, ServiceItemSchema } from './kits.schema'
import { AuthorSchema } from './user.schema'

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
  dataLiberacao: z.string().datetime().optional().nullable(),
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

const ProjectObservationSchema = z.object({
  assunto: z.enum(['SERVIÇOS', 'PRODUTOS', 'NEGOCIAÇÃO', 'EXECUÇÃO']),
  descricao: z.string({ required_error: 'Descrição de observação não informada.', invalid_type_error: 'Tipo não válido para a descrição da observação.' }),
  data: z
    .string({ required_error: 'Data de inserção da observação não informada.', invalid_type_error: 'Tipo não válido para a data de inserção da observação.' })
    .datetime({ message: 'Formato inválido para a data de inserção da observação.' }),
  autor: AuthorSchema,
})
const ProjectAccessCredentials = z.object({
  identificador: z.string({
    required_error: 'Identificador da plataforma de acesso não informado.',
    invalid_type_error: 'Tipo não válido para o identificador da plataforma de acesso.',
  }),
  login: z.string({ required_error: 'Login do acesso não informado.', invalid_type_error: 'Tipo não válido para o login de acesso.' }),
  senha: z.string({ required_error: 'Senha do acesso não informada.', invalid_type_error: 'Tipo não válido para a senha de acesso.' }),
  dataInsercao: z.string({
    required_error: 'Data de adição das credenciais de acesso não informada.',
    invalid_type_error: 'Tipo não válido para data de adição das credenciais.',
  }),
  autor: AuthorSchema,
})

const GeneralProjectSchema = z.object({
  indexador: z.number({}),
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
  idHomologacao: z.string({ invalid_type_error: 'Tipo inválido para o ID de referência da homologação ativa.' }).optional().nullable(),
  idAnaliseTecnica: z.string({ invalid_type_error: 'Tipo inválido para o ID de referência da análise técnica ativa.' }).optional().nullable(),
  observacoes: z.array(ProjectObservationSchema),
  contatos: z.object({
    nomePrimario: z.string(),
    telefonePrimario: z.string(),
    nomeSecundario: z.string(),
    telefoneSecundario: z.string().optional().nullable(),
    email: z.string(),
    observacoes: z.string(),
  }),
  acessos: z.array(ProjectAccessCredentials),
  localizacao: z.object({
    cep: z.string(),
    uf: z.string(),
    cidade: z.string(),
    bairro: z.string(),
    endereco: z.string(),
    numeroOuIdentificador: z.string(),
    distancia: z.number().optional().nullable(),
    complemento: z.string().optional().nullable(),
    latitude: z.string().optional().nullable(),
    longitude: z.string().optional().nullable(),
  }),
  segmento: z.union([z.literal('RESIDENCIAL'), z.literal('RURAL'), z.literal('COMERCIAL'), z.literal('INDUSTRIAL')]),
  contrato: z.object({
    status: z.union([z.literal('SOLICITADO'), z.literal('AGUARDANDO ASSINATURA'), z.literal('ASSINADO'), z.literal('RESCISÃO')]),
    dataSolicitacao: z.string(),
    dataLiberacao: z.string().optional().nullable(),
    dataAssinatura: z.string().optional().nullable(),
    formaAssinatura: z.union([z.literal('FÍSICA'), z.literal('DIGITAL')]),
  }),
  pagamento: z.object({
    pagador: z.object({
      nome: z.string(),
      telefone: z.string(),
      email: z.string(),
      cpfCnpj: z.string(),
    }),
    metodo: z.object({
      nome: z.string({
        required_error: 'Nome do método de pagamento não informado.',
        invalid_type_error: 'Tipo não válido para o nome do método de pagamento.',
      }),
      fracionamento: z.array(
        z.object(
          {
            metodo: z.string({
              required_error: 'Método do item de fracionamento não informado.',
              invalid_type_error: 'Tipo não válido para o método do item de fracionamento.',
            }),
            parcelas: z
              .number({
                required_error: 'Número de parcelas do item de fracionamento não informado.',
                invalid_type_error: 'Tipo não válido para o número de parcelas do item de fracionamento.',
              })
              .optional()
              .nullable(),
            porcentagem: z.number({
              required_error: 'Porcentagem do item de fracionamento não informada.',
              invalid_type_error: 'Tipo não válido para porcentagem do item de fracionamento.',
            }),
          },
          {
            required_error: 'Fracionamento do método de pagamento não informado.',
            invalid_type_error: 'Tipo não válido para o fracionamento do método de pagamento.',
          }
        )
      ),
    }),
    credito: z.object({
      credor: z.string({ required_error: 'Nome do credor não informado.', invalid_type_error: 'Tipo não válido para o nome do credor.' }).optional().nullable(),
      nomeResponsavel: z
        .string({
          required_error: 'Nome do gerente/responsável pelo crédito.',
          invalid_type_error: 'Tipo não válido para o nome do gerente/responsável pelo crédito.',
        })
        .optional()
        .nullable(),
      telefoneResponsavel: z
        .string({
          required_error: 'Nome do gerente/responsável pelo crédito.',
          invalid_type_error: 'Tipo não válido para o nome do gerente/responsável pelo crédito.',
        })
        .optional()
        .nullable(),
      observacoes: z.string({ invalid_type_error: 'Tipo não válido para as observações de aquisição de crédito.' }).optional().nullable(),
    }),
    observacoes: z.string({ invalid_type_error: 'Tipo não válido para as observações do pagamento.' }).optional().nullable(),
  }),
  faturamento: z.object({
    observacoes: z.string({
      required_error: 'Observações sobre o faturamento não fornecidas.',
      invalid_type_error: 'Tipo não válido para as observações de faturamento.',
    }),
    dataEfetivacao: z
      .string({ invalid_type_error: 'Tipo não válido para a data de efetivação das pendências de faturamento.' })
      .datetime({ message: 'Formato inválido para a data de efetivação das pendências de faturamento.' })
      .optional()
      .nullable(),
  }),
  liberacoes: z.object({
    comercial: z.string().datetime().optional().nullable(),
    suprimentos: z.string().datetime().optional().nullable(),
    projetos: z.string().datetime().optional().nullable(),
    execucao: z.string().datetime().optional().nullable(),
    financeiro: z.string().datetime().optional().nullable(),
  }),
  finalizacoes: z.object({
    comercial: z.string().datetime().optional().nullable(),
    suprimentos: z.string().datetime().optional().nullable(),
    projetos: z.string().datetime().optional().nullable(),
    execucao: z.string().datetime().optional().nullable(),
    financeiro: z.string().datetime().optional().nullable(),
  }),
  produtos: z.array(ProductItemSchema),
  servicos: z.array(ServiceItemSchema),
  potenciaPico: z.number(),
  nps: z.number().optional().nullable(),
  autor: AuthorSchema,
  dataInsercao: z.string({ required_error: 'Data de inserção não informada.', invalid_type_error: 'Tipo não válido para data de inserção.' }).datetime(),
})
export type TProject = z.infer<typeof GeneralProjectSchema>
