import { FaSolarPanel } from 'react-icons/fa'
import {
  MdEast,
  MdElectricMeter,
  MdNorth,
  MdNorthEast,
  MdNorthWest,
  MdOutlineSettingsInputComponent,
  MdSouth,
  MdSouthEast,
  MdSouthWest,
  MdWest,
} from 'react-icons/md'
import { BsCart, BsFillHouseFill } from 'react-icons/bs'
import { TbTopologyFull } from 'react-icons/tb'
import { TUserDTO } from './schemas/user.schema'
import { TProposalPremisses } from './schemas/proposal.schema'
import { TSaleCategory } from './schemas/opportunity.schema'
import { TSignaturePlanDTO } from './schemas/signature-plans.schema'

type TPremissesFieldOptions = { id: number; value: keyof TProposalPremisses; label: string }
export const PremissesFieldOptions: TPremissesFieldOptions[] = [
  { id: 1, value: 'uf', label: 'ESTADO' },
  { id: 2, value: 'cidade', label: 'CIDADE' },
  { id: 3, value: 'topologia', label: 'TOPOLOGIA' },
  { id: 4, value: 'tipoEstrutura', label: 'TIPO DE ESTRUTURA' },
  { id: 5, value: 'numModulos', label: 'Nº DE MÓDULOS' },
  { id: 6, value: 'numInversores', label: 'Nº DE INVERSORES' },
  { id: 7, value: 'potenciaPico', label: 'POTÊNCIA PICO' },
  { id: 8, value: 'distancia', label: 'DISTÂNCIA' },
  { id: 9, value: 'consumoEnergiaMensal', label: 'CONSUMO DE ENERGIA' },
  { id: 10, value: 'fatorSimultaneidade', label: 'FATOR DE SIMULTANEIDADE' },
  { id: 11, value: 'tarifaEnergia', label: 'TARIFA DE ENERGIA' },
  { id: 12, value: 'tarifaFioB', label: 'TARIFA DE FIO B' },
  { id: 13, value: 'orientacao', label: 'ORIENTAÇÃO' },
]

type TAutomaticPremissesBySaleCategory = {
  KIT: string[]
  PLANO: string[]
  PRODUTOS: string[]
  SERVIÇOS: string[]
}

export const AutomaticPremissesBySaleCategory: TAutomaticPremissesBySaleCategory = {
  KIT: ['uf', 'cidade', 'topologia', 'numModulos', 'numInversores', 'potenciaPico'],
  PLANO: ['uf', 'cidade'],
  PRODUTOS: ['uf', 'cidade', 'numModulos', 'numInversores', 'potenciaPico'],
  SERVIÇOS: ['uf', 'cidade'],
}
export const SignaturePlans = [
  { id: 1, label: 'CRM', value: 'CRM', modulos: { crm: true, projetos: false, financas: false, rh: false } },
  { id: 2, label: 'CRM+ERP', value: 'CRM+ERP', modulos: { crm: true, projetos: true, financas: false, rh: false } },
  { id: 3, label: 'COMPLETO', value: 'COMPLETO', modulos: { crm: true, projetos: true, financas: true, rh: true } },
]
export const PaymentMethods = [
  { id: 1, label: 'À VISTA (GERAL)', value: 'À VISTA (GERAL)', apportionment: false, modality: null },
  { id: 2, label: 'À VISTA (DINHEIRO)', value: 'À VISTA (DINHEIRO)', apportionment: false, modality: null },
  { id: 3, label: 'À VISTA (PIX)', value: 'À VISTA (PIX)', apportionment: false, modality: null },
  { id: 4, label: 'À VISTA (DÉBITO)', value: 'À VISTA (DÉBITO)', apportionment: false, modality: null },
  { id: 5, label: 'BOLETO', value: 'BOLETO', apportionment: true, modality: 'SIMPLES' },
  { id: 6, label: 'PARCELADO (CRÉDITO)', value: 'PARCELADO (CRÉDITO)', apportionment: true, modality: 'SIMPLES' },
  { id: 7, label: 'FINANCIAMENTO', value: 'FINANCIAMENTO', apportionment: true, modality: 'COMPOSTOS' },
]

export const OpportunityTypes = [
  { id: 1, label: 'SISTEMA FOTOVOLTAICO', value: 'SISTEMA FOTOVOLTAICO' },
  // { id:2, label: 'OPERAÇÃO E MANUTENÇÃO', value: 'OPERAÇÃO E MANUTENÇÃO' },
  // { id:3,label: 'MONTAGEM E DESMONTAGEM', value: 'MONTAGEM E DESMONTAGEM' },
]

export const ElectricalInstallationGroups = [
  { id: 1, label: 'RESIDENCIAL', value: 'RESIDENCIAL' },
  { id: 2, label: 'COMERCIAL', value: 'COMERCIAL' },
  { id: 3, label: 'INDUSTRIAL', value: 'INDUSTRIAL' },
  { id: 4, label: 'RURAL', value: 'RURAL' },
]

type TUserGroup = {
  id: string
  grupo: string
  permissoes: TUserDTO['permissoes']
}
export const UserGroups: TUserGroup[] = [
  {
    id: '1',
    grupo: 'ADMINISTRADORES',
    permissoes: {
      usuarios: {
        visualizar: true,
        criar: true,
        editar: true,
      },
      comissoes: {
        visualizar: true,
        editar: true,
      },
      kits: {
        visualizar: true,
        editar: true,
        criar: true,
      },
      produtos: {
        visualizar: true,
        editar: true,
        criar: true,
      },
      servicos: {
        visualizar: true,
        editar: true,
        criar: true,
      },
      planos: {
        visualizar: false,
        editar: false,
        criar: false,
      },
      propostas: {
        escopo: null, // refere-se ao escopo de atuação, com IDs dos usuários a quem ele tem acesso
        visualizar: true,
        editar: true,
        criar: true,
      },
      oportunidades: {
        escopo: null, // refere-se ao escopo de atuação, com IDs dos usuários a quem ele tem acesso
        visualizar: true,
        editar: true,
        criar: true,
      },
      analisesTecnicas: {
        escopo: null, // refere-se ao escopo de atuação, com IDs dos usuários a quem ele tem acesso
        visualizar: true,
        editar: true,
        criar: true,
      },
      clientes: {
        escopo: null,
        visualizar: true,
        editar: true,
        criar: true,
      },
      precos: {
        visualizar: true,
        editar: true,
      },
      resultados: {
        escopo: null,
        visualizarComercial: true,
        visualizarOperacional: true,
      },
      configuracoes: {
        parceiro: true,
        precificacao: true,
        funis: true,
        metodosPagamento: true,
        tiposProjeto: true,
      },
    },
  },
  {
    id: '2',
    grupo: 'GESTORES',
    permissoes: {
      usuarios: {
        visualizar: true,
        criar: false,
        editar: false,
      },
      comissoes: {
        visualizar: true,
        editar: true,
      },
      kits: {
        visualizar: true,
        editar: true,
        criar: true,
      },
      produtos: {
        visualizar: true,
        editar: true,
        criar: true,
      },
      servicos: {
        visualizar: true,
        editar: true,
        criar: true,
      },
      planos: {
        visualizar: false,
        editar: false,
        criar: false,
      },
      propostas: {
        escopo: null, // refere-se ao escopo de atuação, com IDs dos usuários a quem ele tem acesso
        visualizar: true,
        editar: true,
        criar: true,
      },
      oportunidades: {
        escopo: null, // refere-se ao escopo de atuação, com IDs dos usuários a quem ele tem acesso
        visualizar: true,
        editar: true,
        criar: true,
      },
      analisesTecnicas: {
        escopo: null, // refere-se ao escopo de atuação, com IDs dos usuários a quem ele tem acesso
        visualizar: true,
        editar: true,
        criar: true,
      },
      clientes: {
        escopo: null,
        visualizar: true,
        editar: true,
        criar: true,
      },
      precos: {
        visualizar: true,
        editar: true,
      },
      resultados: {
        escopo: null,
        visualizarComercial: true,
        visualizarOperacional: true,
      },
      configuracoes: {
        parceiro: false,
        precificacao: false,
        funis: false,
        metodosPagamento: true,
        tiposProjeto: false,
      },
    },
  },
  {
    id: '3',
    grupo: 'TIME DE VENDAS',
    permissoes: {
      usuarios: {
        visualizar: false,
        criar: false,
        editar: false,
      },
      comissoes: {
        visualizar: false,
        editar: false,
      },
      kits: {
        visualizar: false,
        editar: false,
        criar: false,
      },
      produtos: {
        visualizar: true,
        editar: false,
        criar: false,
      },
      servicos: {
        visualizar: true,
        editar: false,
        criar: false,
      },
      planos: {
        visualizar: false,
        editar: false,
        criar: false,
      },
      propostas: {
        visualizar: true,
        editar: true,
        criar: true,
      },
      oportunidades: {
        escopo: null, // refere-se ao escopo de atuação, com IDs dos usuários a quem ele tem acesso
        visualizar: true,
        editar: true,
        criar: true,
      },
      analisesTecnicas: {
        escopo: null, // refere-se ao escopo de atuação, com IDs dos usuários a quem ele tem acesso
        visualizar: true,
        editar: true,
        criar: true,
      },
      clientes: {
        escopo: null,
        visualizar: true,
        editar: true,
        criar: true,
      },
      precos: {
        visualizar: false,
        editar: false,
      },
      resultados: {
        escopo: null,
        visualizarComercial: false,
        visualizarOperacional: true,
      },
      configuracoes: {
        parceiro: false,
        precificacao: false,
        funis: false,
        metodosPagamento: false,
        tiposProjeto: false,
      },
    },
  },
  {
    id: '4',
    grupo: 'TIME DE SDR',
    permissoes: {
      usuarios: {
        visualizar: false,
        criar: false,
        editar: false,
      },
      comissoes: {
        visualizar: false,
        editar: false,
      },
      kits: {
        visualizar: false,
        editar: false,
        criar: false,
      },
      produtos: {
        visualizar: true,
        editar: false,
        criar: false,
      },
      servicos: {
        visualizar: true,
        editar: false,
        criar: false,
      },
      planos: {
        visualizar: false,
        editar: false,
        criar: false,
      },
      propostas: {
        visualizar: true,
        editar: true,
        criar: true,
      },
      oportunidades: {
        escopo: null, // refere-se ao escopo de atuação, com IDs dos usuários a quem ele tem acesso
        visualizar: true,
        editar: true,
        criar: true,
      },
      analisesTecnicas: {
        escopo: null, // refere-se ao escopo de atuação, com IDs dos usuários a quem ele tem acesso
        visualizar: true,
        editar: true,
        criar: true,
      },
      clientes: {
        escopo: null,
        visualizar: true,
        editar: true,
        criar: true,
      },
      precos: {
        visualizar: false,
        editar: false,
      },
      resultados: {
        escopo: null,
        visualizarComercial: false,
        visualizarOperacional: true,
      },
      configuracoes: {
        parceiro: false,
        precificacao: false,
        funis: false,
        metodosPagamento: false,
        tiposProjeto: false,
      },
    },
  },
]

export const ProductItemCategories = [
  { id: 1, label: 'MÓDULO', value: 'MÓDULO', icon: FaSolarPanel as React.ComponentType },
  { id: 2, label: 'INVERSOR', value: 'INVERSOR', icon: TbTopologyFull as React.ComponentType },
  { id: 3, label: 'INSUMO', value: 'INSUMO', icon: MdOutlineSettingsInputComponent as React.ComponentType },
  { id: 4, label: 'ESTRUTURA', value: 'ESTRUTURA', icon: BsFillHouseFill as React.ComponentType },
  { id: 5, label: 'PADRÃO', value: 'PADRÃO', icon: MdElectricMeter as React.ComponentType },
  { id: 6, label: 'OUTROS', value: 'OUTROS', icon: BsCart as React.ComponentType },
]

export const OpportunityResponsibilityRoles = [
  {
    id: 1,
    label: 'VENDEDOR',
    value: 'VENDEDOR',
  },
  {
    id: 2,
    label: 'SDR',
    value: 'SDR',
  },
]
export const MaritalStatus = [
  {
    id: 1,
    label: 'CASADO(A)',
    value: 'CASADO(A)',
  },
  {
    id: 2,
    label: 'SOLTEIRO(A)',
    value: 'SOLTEIRO(A)',
  },
  {
    id: 3,
    label: 'UNIÃO ESTÁVEL',
    value: 'UNIÃO ESTÁVEL',
  },
  {
    id: 4,
    label: 'DIVORCIADO(A)',
    value: 'DIVORCIADO(A)',
  },
  {
    id: 5,
    label: 'VIUVO(A)',
    value: 'VIUVO(A)',
  },
  {
    id: 6,
    label: 'NÃO DEFINIDO',
    value: 'NÃO DEFINIDO',
  },
]

type TSignaturePlanIntervalTypes = {
  id: number
  label: string
  value: TSignaturePlanDTO['intervalo']['tipo']
}
export const SignaturePlanIntervalTypes: TSignaturePlanIntervalTypes[] = [
  { id: 1, label: 'DIÁRIO', value: 'DIÁRIO' },
  { id: 2, label: 'SEMANAL', value: 'SEMANAL' },
  { id: 3, label: 'MENSAL', value: 'MENSAL' },
  { id: 4, label: 'SEMESTRAL', value: 'SEMESTRAL' },
  { id: 5, label: 'ANUAL', value: 'ANUAL' },
]
export const CustomersAcquisitionChannels = [
  { id: 1, label: 'NETWORKING', value: 'NETWORKING' },
  { id: 2, label: '(OUTBOUND) SDR', value: '(OUTBOUND) SDR' },
  { id: 3, label: 'INDICAÇÃO', value: 'INDICAÇÃO' },
  { id: 4, label: 'SITE', value: 'SITE' },
  { id: 5, label: 'CALCULADORA SOLAR', value: 'CALCULADORA SOLAR' },
  { id: 6, label: 'GOOGLE ADS', value: 'GOOGLE ADS' },
  { id: 7, label: 'FACEBOOK ADS', value: 'FACEBOOK ADS' },
  { id: 8, label: 'INSTAGRAM ADS', value: 'INSTAGRAM ADS' },
  { id: 9, label: 'BLOG', value: 'BLOG' },
  { id: 10, label: 'YOUTUBE', value: 'YOUTUBE' },
  { id: 11, label: 'RÁDIO', value: 'RÁDIO' },
  { id: 12, label: 'EVENTO', value: 'EVENTO' },
  { id: 13, label: 'PASSIVO', value: 'PASSIVO' },
  { id: 14, label: 'PORTA A PORTA', value: 'PORTA A PORTA' },
  { id: 15, label: 'PROSPECÇÃO ATIVA', value: 'PROSPECÇÃO ATIVA' },
  { id: 16, label: 'MARKETING (GERAL)', value: 'MARKETING (GERAL)' },
]
export const ConsumerUnitGroups = [
  { id: 1, label: 'URBANO', value: 'URBANO' },
  { id: 2, label: 'RURAL', value: 'RURAL' },
]
export const ConsumerUnitLigationType = [
  { id: 1, label: 'EXISTENTE', value: 'EXISTENTE' },
  { id: 2, label: 'NOVA', value: 'NOVA' },
]
export const ConsumerUnitHolderType = [
  { id: 1, label: 'PESSOA FÍSICA', value: 'PESSOA FÍSICA' },
  { id: 2, label: 'PESSOA JURÍDICA', value: 'PESSOA JURÍDICA' },
]
export const SigningForms = [
  { id: 1, label: 'FÍSICA', value: 'FÍSICA' },
  { id: 2, label: 'DIGITAL', value: 'DIGITAL' },
]
export const ComercialSegments = [
  { id: 1, label: 'RESIDENCIAL', value: 'RESIDENCIAL' },
  { id: 2, label: 'RURAL', value: 'RURAL' },
  { id: 3, label: 'COMERCIAL', value: 'COMERCIAL' },
]
export const TechnicalAnalysisStatus = [
  { id: 1, label: 'CONCLUIDO', value: 'CONCLUIDO' },
  { id: 2, label: 'EM ANÁLISE TÉCNICA', value: 'EM ANÁLISE TÉCNICA' },
  { id: 3, label: 'PENDÊNCIA COMERCIAL', value: 'PENDÊNCIA COMERCIAL' },
  { id: 4, label: 'PENDÊNCIA OPERACIONAL', value: 'PENDÊNCIA OPERACIONAL' },
  { id: 5, label: 'REJEITADA', value: 'REJEITADA' },
  { id: 6, label: 'PENDENTE', value: 'PENDENTE' },
]
export const TechnicalAnalysisComplexity = [
  { id: 1, label: 'SIMPLES', value: 'SIMPLES' },
  { id: 2, label: 'INTERMEDIÁRIO', value: 'INTERMEDIÁRIO' },
  { id: 3, label: 'COMPLEXO', value: 'COMPLEXO' },
]
export const TechnicalAnalysisSolicitationTypes = [
  {
    id: 1,
    label: 'ANÁLISE TÉCNICA REMOTA',
    value: 'ANÁLISE TÉCNICA REMOTA',
    descriptions: [
      'Requisite uma análise técnica ao seu time de analistas.',
      'Clicando aqui, você prosseguirá para um formulário para a coleta de informações e imagens relevantes à análise.',
      'A análise pode contemplar análise de geração, sombreamento, necessidades de adequação de estrutura ou padrão de energia, etc.',
    ],
  },
  {
    id: 2,
    label: 'ORÇAMENTAÇÃO',
    value: 'ORÇAMENTAÇÃO',
    descriptions: [
      'Requisite um orçamento de itens específicos ao seu time de analistas.',
      'Clicando aqui, você prosseguirá para a especificação os itens a serem orçados.',
    ],
  },
]
export const TechnicalAnalysisPendencyCategories = [
  { id: 1, label: 'PENDÊNCIA COMERCIAL', value: 'PENDÊNCIA COMERCIAL' },
  { id: 2, label: 'PENDÊNCIA TERCEIROS', value: 'PENDÊNCIA TERCEIROS' }, // COTAÇÕES, ETC
  { id: 3, label: 'PENDÊNCIA CONCESSIONÁRIA', value: 'PENDÊNCIA CONCESSIONÁRIA' },
]
export const EngineeringAnalysts = [
  {
    id: 1,
    nome: 'Andrew Borges Alexander',
    apelido: 'ANDREW',
    avatar_url:
      'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar-andrew_borges_alexander?alt=media&token=1d9787c0-7fd9-4343-9674-1ee69c03709b',
  },
  {
    id: 2,
    nome: 'Tulio Medeiros',
    apelido: 'TULIO',
    avatar_url:
      'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar-tulio_medeiros?alt=media&token=233e20b5-520d-473a-9e7e-f603a0b9493c',
  },
]
export const AdditionalCostsCategories = [
  {
    id: 1,
    label: 'INSTALAÇÃO',
    value: 'INSTALAÇÃO',
  },
  {
    id: 2,
    label: 'PADRÃO',
    value: 'PADRÃO',
  },
  {
    id: 3,
    label: 'ESTRUTURA',
    value: 'ESTRUTURA',
  },
  {
    id: 4,
    label: 'OUTROS',
    value: 'OUTROS',
  },
]
export const Units = [
  { id: 1, label: 'UNIDADE (UN)', value: 'UN' },
  { id: 2, label: 'PACOTE (PC)', value: 'PC' },
  { id: 3, label: 'QUILO (KG)', value: 'KG' },
  { id: 4, label: 'CX (CAIXA)', value: 'CX' },
  { id: 5, label: 'M (METRO)', value: 'M' },
  { id: 6, label: 'METRO QUADRADO (M²)', value: 'M²' },
  { id: 7, label: 'METRO CÚBICO (M³)', value: 'M³' },
  { id: 8, label: 'LITROS (L)', value: 'L' },
  { id: 9, label: 'MESA', value: 'MESA' },
]
export const InverterFixationOptions = [
  { id: 1, label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
  { id: 2, label: 'ALVENARIA', value: 'ALVENARIA' },
  { id: 3, label: 'LANCE DE MURO', value: 'LANCE DE MURO' },
  { id: 4, label: 'PILAR', value: 'PILAR' },
  { id: 5, label: 'OUTRO(DESCREVA EM OBSERVAÇÕES)', value: 'OUTRO(DESCREVA EM OBSERVAÇÕES)' },
]

export const RoofTiles = [
  { id: 1, label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
  { id: 2, label: 'PORTUGUESA', value: 'PORTUGUESA' },
  { id: 3, label: 'FRANCESA', value: 'FRANCESA' },
  { id: 4, label: 'ROMANA', value: 'ROMANA' },
  { id: 5, label: 'CIMENTO', value: 'CIMENTO' },
  { id: 6, label: 'ETHERNIT', value: 'ETHERNIT' },
  { id: 7, label: 'SANDUÍCHE', value: 'SANDUÍCHE' },
  { id: 8, label: 'AMERICANA', value: 'AMERICANA' },
  { id: 9, label: 'ZINCO', value: 'ZINCO' },
  { id: 10, label: 'CAPE E BICA', value: 'CAPE E BICA' },
  { id: 11, label: 'LAJE', value: 'LAJE' },
]

export const StructureTypes = [
  { id: 1, label: 'Carport', value: 'Carport' },
  { id: 2, label: 'Cerâmico', value: 'Cerâmico' },
  { id: 3, label: 'Fibrocimento', value: 'Fibrocimento' },
  { id: 4, label: 'Laje', value: 'Laje' },
  { id: 5, label: 'Metálico', value: 'Metálico' },
  { id: 6, label: 'Zipado', value: 'Zipado' },
  { id: 7, label: 'Solo', value: 'Solo' },
  { id: 8, label: 'Sem estrutura', value: 'Sem estrutura' },
]
export const SupplyOptions = {
  GRAMPO: {
    tipos: ['FINAL', 'INTERMEDIÁRIO'],
    grandeza: 'UNIDADE',
  },
  TRILHO: {
    tipos: ['1,85', '2,20', '2,36', '2,40', '2,50', '3,20', '3,30', '4,20', '4,70', '4,80'],
    grandeza: 'UNIDADE',
  },
  'PARAFUSO FIBROCIMENTO': {
    tipos: ['MADEIRA', 'FERRO'],
    grandeza: 'UNIDADE',
  },
  'PAR DE JUNÇÃO': {
    tipos: ['TRILHO'],
    grandeza: 'UNIDADE',
  },
  CABO: {
    tipos: ['SOLAR(VERMELHO)', 'SOLAR(PRETO)'],
    grandeza: 'METRO',
  },
  'CONECTOR MC4': {
    tipos: ['-'],
    grandeza: 'UNIDADE',
  },
  'ESTRUTURA SOLO': {
    tipos: ['MESA DUPLA'],
    grandeza: 'MESA',
  },
}
export const AdditionalServicesResponsibilityOptions = [
  { id: 1, label: 'NÃO', value: 'NÃO' },
  { id: 2, label: 'SIM - RESPONSABILIDADE CLIENTE', value: 'SIM - RESPONSABILIDADE CLIENTE' },
  { id: 3, label: 'SIM - RESPONSABILIDADE DA EMPRESA', value: 'SIM - RESPONSABILIDADE DA EMPRESA' },
]
export const AmperageOptions = [
  { id: 1, label: '40A', value: '40A' },
  { id: 2, label: '50A', value: '50A' },
  { id: 3, label: '60A', value: '60A' },
  { id: 4, label: '63A', value: '63A' },
  { id: 5, label: '70A', value: '70A' },
  { id: 6, label: '90A', value: '90A' },
  { id: 7, label: '100A', value: '100A' },
  { id: 8, label: '200A', value: '200A' },
]
export const EnergyPATypes = [
  { id: 1, label: 'CONTRA À REDE', value: 'CONTRA À REDE' },
  { id: 2, label: 'À FAVOR DA REDE', value: 'À FAVOR DA REDE' },
]
export const EnergyPAConnectionTypes = [
  { id: 1, label: 'AÉREO', value: 'AÉREO' },
  { id: 2, label: 'SUBTERRÂNEO', value: 'SUBTERRÂNEO' },
]
export const PhaseTypes = [
  { id: 1, label: 'MONOFÁSICO', value: 'MONOFÁSICO' },
  { id: 2, label: 'BIFÁSICO', value: 'BIFÁSICO' },
  { id: 3, label: 'TRIFÁSICO', value: 'TRIFÁSICO' },
]
export const EnergyMeterBoxModels = [
  { id: 1, label: 'CM-1', value: 'CM-1' },
  { id: 2, label: 'CM-2', value: 'CM-2' },
  { id: 3, label: 'CM-3', value: 'CM-3' },
  { id: 4, label: 'CM-4', value: 'CM-4' },
  { id: 5, label: 'CM-8', value: 'CM-8' },
  { id: 6, label: 'CM-9', value: 'CM-9' },
  { id: 7, label: 'CM-13', value: 'CM-13' },
  { id: 8, label: 'CM-14', value: 'CM-14' },
  { id: 9, label: 'CM-18', value: 'CM-18' },
]

export const OrientationIcons = {
  LESTE: MdEast,
  NORDESTE: MdNorthEast,
  NORTE: MdNorth,
  NOROESTE: MdNorthWest,
  OESTE: MdWest,
  SUDOESTE: MdSouthWest,
  SUL: MdSouth,
  SUDESTE: MdSouthEast,
}
