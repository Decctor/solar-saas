import { FaSolarPanel } from 'react-icons/fa'
import {
  MdAssessment,
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
  { id: 0, value: 'valorReferencia', label: 'VALOR DE REFERÊNCIA' },
  { id: 10, value: 'consumoEnergiaMensal', label: 'CONSUMO DE ENERGIA' },
  { id: 11, value: 'fatorSimultaneidade', label: 'FATOR DE SIMULTANEIDADE' },
  { id: 12, value: 'tarifaEnergia', label: 'TARIFA DE ENERGIA' },
  { id: 13, value: 'tarifaFioB', label: 'TARIFA DE FIO B' },
  { id: 14, value: 'orientacao', label: 'ORIENTAÇÃO' },
  { id: 15, value: 'eficienciaGeracao', label: 'EFICIÊNCIA DE GERAÇÃO' },
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

export const EnergyDistributorsOptions = [
  { id: 1, label: 'AME', value: 'AME' },
  { id: 2, label: 'BOA VISTA', value: 'BOA VISTA' },
  { id: 3, label: 'CASTRO -DIS', value: 'CASTRO -DIS' },
  { id: 4, label: 'CEA', value: 'CEA' },
  { id: 5, label: 'CEBDIS', value: 'CEBDIS' },
  { id: 6, label: 'CEDRAP', value: 'CEDRAP' },
  { id: 7, label: 'CEDRI', value: 'CEDRI' },
  { id: 8, label: 'CEEE-D', value: 'CEEE-D' },
  { id: 9, label: 'CEGERO', value: 'CEGERO' },
  { id: 10, label: 'CEJAMA', value: 'CEJAMA' },
  { id: 11, label: 'CELESC-DIS', value: 'CELESC-DIS' },
  { id: 12, label: 'CELETRO', value: 'CELETRO' },
  { id: 13, label: 'CELPE', value: 'CELPE' },
  { id: 14, label: 'CEMIG D', value: 'CEMIG D' },
  { id: 15, label: 'CEMIRIM', value: 'CEMIRIM' },
  { id: 16, label: 'CEPRAG', value: 'CEPRAG' },
  { id: 17, label: 'CERA ÇÁ', value: 'CERA ÇÁ' },
  { id: 18, label: 'CERAL ANIT ÁPOLIS', value: 'CERAL ANIT ÁPOLIS' },
  { id: 19, label: 'CERAL ARAPOTI', value: 'CERAL ARAPOTI' },
  { id: 20, label: 'CERAL ARARUAMA', value: 'CERAL ARARUAMA' },
  { id: 21, label: 'CERBRANORTE', value: 'CERBRANORTE' },
  { id: 22, label: 'CERCI', value: 'CERCI' },
  { id: 23, label: 'CERCOS', value: 'CERCOS' },
  { id: 24, label: 'CEREJ', value: 'CEREJ' },
  { id: 25, label: 'CERES', value: 'CERES' },
  { id: 26, label: 'CERFOX', value: 'CERFOX' },
  { id: 27, label: 'CERGAL', value: 'CERGAL' },
  { id: 28, label: 'CERGAPA', value: 'CERGAPA' },
  { id: 29, label: 'CERGRAL', value: 'CERGRAL' },
  { id: 30, label: 'CERILUZ', value: 'CERILUZ' },
  { id: 31, label: 'CERIM', value: 'CERIM' },
  { id: 32, label: 'CERIPA', value: 'CERIPA' },
  { id: 33, label: 'CERIS', value: 'CERIS' },
  { id: 34, label: 'CERMC', value: 'CERMC' },
  { id: 35, label: 'CERMISS ÕES', value: 'CERMISS ÕES' },
  { id: 36, label: 'CERMOFUL', value: 'CERMOFUL' },
  { id: 37, label: 'CERNHE', value: 'CERNHE' },
  { id: 38, label: 'CERON', value: 'CERON' },
  { id: 39, label: 'CERPALO', value: 'CERPALO' },
  { id: 40, label: 'CERPRO', value: 'CERPRO' },
  { id: 41, label: 'CERR', value: 'CERR' },
  { id: 42, label: 'CERRP', value: 'CERRP' },
  { id: 43, label: 'CERSAD DISTRIBUIDORA', value: 'CERSAD DISTRIBUIDORA' },
  { id: 44, label: 'CERSUL', value: 'CERSUL' },
  { id: 45, label: 'CERTAJA', value: 'CERTAJA' },
  { id: 46, label: 'CERTEL ENERGIA', value: 'CERTEL ENERGIA' },
  { id: 47, label: 'CERTHIL', value: 'CERTHIL' },
  { id: 48, label: 'CERTREL', value: 'CERTREL' },
  { id: 49, label: 'CERVAM', value: 'CERVAM' },
  { id: 50, label: 'CETRIL', value: 'CETRIL' },
  { id: 51, label: 'CFLO', value: 'CFLO' },
  { id: 52, label: 'CHESP', value: 'CHESP' },
  { id: 53, label: 'CNEE', value: 'CNEE' },
  { id: 54, label: 'COCEL', value: 'COCEL' },
  { id: 55, label: 'CODESAM', value: 'CODESAM' },
  { id: 56, label: 'COELBA', value: 'COELBA' },
  { id: 57, label: 'COOPERA', value: 'COOPERA' },
  { id: 58, label: 'COOPERALIAN ÇA', value: 'COOPERALIAN ÇA' },
  { id: 59, label: 'COOPERCOCAL', value: 'COOPERCOCAL' },
  { id: 60, label: 'COOPERLUZ', value: 'COOPERLUZ' },
  { id: 61, label: 'COOPERMILA', value: 'COOPERMILA' },
  { id: 62, label: 'COOPERNORTE', value: 'COOPERNORTE' },
  { id: 63, label: 'COOPERSUL', value: 'COOPERSUL' },
  { id: 64, label: 'COOPERZEM', value: 'COOPERZEM' },
  { id: 65, label: 'COORSEL', value: 'COORSEL' },
  { id: 66, label: 'COPEL-DIS', value: 'COPEL-DIS' },
  { id: 67, label: 'COPREL', value: 'COPREL' },
  { id: 68, label: 'COSERN', value: 'COSERN' },
  { id: 69, label: 'CPFL JAGUARI', value: 'CPFL JAGUARI' },
  { id: 70, label: 'CPFL LESTE PAULISTA', value: 'CPFL LESTE PAULISTA' },
  { id: 71, label: 'CPFL MOCOCA', value: 'CPFL MOCOCA' },
  { id: 72, label: 'CPFL SANTA CRUZ', value: 'CPFL SANTA CRUZ' },
  { id: 73, label: 'CPFL SUL PAULISTA', value: 'CPFL SUL PAULISTA' },
  { id: 74, label: 'CPFL-PIRATININGA', value: 'CPFL-PIRATININGA' },
  { id: 75, label: 'CPFL-PAULISTA', value: 'CPFL-PAULISTA' },
  { id: 76, label: 'CRELUZ-D', value: 'CRELUZ-D' },
  { id: 77, label: 'CRERAL', value: 'CRERAL' },
  { id: 78, label: 'DCELT', value: 'DCELT' },
  { id: 79, label: 'DEMEI', value: 'DEMEI' },
  { id: 80, label: 'DMED', value: 'DMED' },
  { id: 81, label: 'EBO', value: 'EBO' },
  { id: 82, label: 'EDEVP', value: 'EDEVP' },
  { id: 83, label: 'EDP ES', value: 'EDP ES' },
  { id: 84, label: 'EDP SP', value: 'EDP SP' },
  { id: 85, label: 'EEB', value: 'EEB' },
  { id: 86, label: 'EFLJC', value: 'EFLJC' },
  { id: 87, label: 'EFLUL', value: 'EFLUL' },
  { id: 88, label: 'ELEKTRO', value: 'ELEKTRO' },
  { id: 89, label: 'ELETROACRE', value: 'ELETROACRE' },
  { id: 90, label: 'ELETROCAR', value: 'ELETROCAR' },
  { id: 91, label: 'ELETROPAULO', value: 'ELETROPAULO' },
  { id: 92, label: 'ELFSM', value: 'ELFSM' },
  { id: 93, label: 'EMR', value: 'EMR' },
  { id: 94, label: 'EMS', value: 'EMS' },
  { id: 95, label: 'EMT', value: 'EMT' },
  { id: 96, label: 'ENEL CE', value: 'ENEL CE' },
  { id: 97, label: 'ENEL RJ', value: 'ENEL RJ' },
  { id: 98, label: 'ENF', value: 'ENF' },
  { id: 99, label: 'EPB', value: 'EPB' },
  { id: 100, label: 'EQUATORIAL AL', value: 'EQUATORIAL AL' },
  { id: 101, label: 'EQUATORIAL GO', value: 'EQUATORIAL GO' },
  { id: 102, label: 'EQUATORIAL MA', value: 'EQUATORIAL MA' },
  { id: 103, label: 'EQUATORIAL PA', value: 'EQUATORIAL PA' },
  { id: 104, label: 'EQUATORIAL PI', value: 'EQUATORIAL PI' },
  { id: 105, label: 'ESE', value: 'ESE' },
  { id: 106, label: 'ESS', value: 'ESS' },
  { id: 107, label: 'ETO', value: 'ETO' },
  { id: 108, label: 'HIDROPAN', value: 'HIDROPAN' },
  { id: 109, label: 'LIGHT', value: 'LIGHT' },
  { id: 110, label: 'MUXENERGIA', value: 'MUXENERGIA' },
  { id: 111, label: 'PACTO ENERGIA PR', value: 'PACTO ENERGIA PR' },
  { id: 112, label: 'RGE', value: 'RGE' },
  { id: 113, label: 'RGE SUL', value: 'RGE SUL' },
  { id: 114, label: 'SULGIPE', value: 'SULGIPE' },
  { id: 115, label: 'UHENPAL', value: 'UHENPAL' },
] as const
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
  { id: 1, label: 'RESIDENCIAL', value: 'RESIDENCIAL' },
  { id: 2, label: 'COMERCIAL', value: 'COMERCIAL' },
  { id: 3, label: 'INDUSTRIAL', value: 'INDUSTRIAL' },
  { id: 4, label: 'RURAL', value: 'RURAL' },
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
  { id: 2, label: 'COMERCIAL', value: 'COMERCIAL' },
  { id: 3, label: 'INDUSTRIAL', value: 'INDUSTRIAL' },
  { id: 4, label: 'RURAL', value: 'RURAL' },
]
export const HomologationControlStatus = [
  { id: 1, label: 'PENDENTE', value: 'PENDENTE' },
  { id: 2, label: 'ELABORANDO DOCUMENTAÇÕES', value: 'ELABORANDO DOCUMENTAÇÕES' },
  { id: 3, label: 'AGUARDANDO ASSINATURA', value: 'AGUARDANDO ASSINATURA' },
  { id: 4, label: 'AGUARDANDO FATURAMENTO', value: 'AGUARDANDO FATURAMENTO' },
  { id: 5, label: 'AGUARDANDO PENDÊNCIAS', value: 'AGUARDANDO PENDÊNCIAS' },
  { id: 6, label: 'APROVADO COM OBRAS', value: 'APROVADO COM OBRAS' },
  { id: 7, label: 'APROVADO COM REDUÇÃO', value: 'APROVADO COM REDUÇÃO' },
  { id: 8, label: 'APROVADO', value: 'APROVADO' },
  { id: 9, label: 'REPROVADO', value: 'REPROVADO' },
  { id: 10, label: 'REPROVADO COM REDUÇÃO', value: 'REPROVADO COM REDUÇÃO' },
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
    label: 'ANÁLISE TÉCNICA REMOTA URBANA',
    value: 'ANÁLISE TÉCNICA REMOTA URBANA',
    descriptions: [
      'Requisite uma análise técnica de instalação urbana ao nosso time de analistas.',
      'Clicando aqui, você prosseguirá para um formulário para a coleta de informações e imagens relevantes à análise.',
      'A análise pode contemplar análise de geração, sombreamento, necessidades de adequação de estrutura ou padrão de energia, etc.',
      'O prazo de análise é de até 72 horas úteis.',
    ],
  },
  {
    id: 2,
    label: 'ANÁLISE TÉCNICA REMOTA RURAL',
    value: 'ANÁLISE TÉCNICA REMOTA RURAL',
    descriptions: [
      'Requisite uma análise técnica de instalação rural ao nosso time de analistas.',
      'Clicando aqui, você prosseguirá para um formulário para a coleta de informações e imagens relevantes à análise.',
      'A análise pode contemplar análise de geração, sombreamento, necessidades de adequação de estrutura ou padrão de energia, etc.',
      'O prazo de análise é de até 72 horas úteis.',
    ],
  },
  {
    id: 3,
    label: 'ANÁLISE TÉCNICA IN LOCO',
    value: 'ANÁLISE TÉCNICA IN LOCO',
    descriptions: [
      'Requisite uma análise técnica in loco ao nosso time de analistas.',
      'Clicando aqui, você prosseguirá para um formulário para a coleta de informações relevantes para a visita in loco.',
      'A análise pode contemplar análise de geração, sombreamento, necessidades de adequação de estrutura ou padrão de energia, etc.',
      'O prazo de análise é de até 72 horas úteis.',
    ],
  },
  {
    id: 4,
    label: 'ORÇAMENTAÇÃO',
    value: 'ORÇAMENTAÇÃO',
    descriptions: [
      'Requisite um orçamento de itens específicos ao nosso time de analistas.',
      'Clicando aqui, você prosseguirá para a especificação os itens a serem orçados.',
      'O prazo de análise é de até 72 horas úteis.',
    ],
  },
  {
    id: 5,
    label: 'DESENHO PERSONALIZADO',
    value: 'DESENHO PERSONALIZADO',
    descriptions: [
      'Requisite um desenho personalizado ao nosso time de analistas.',
      'Clicando aqui, você prosseguirá para um formulário para a coleta de informações relevantes para a execução do desenho.',
      'O prazo de análise é de até 72 horas úteis.',
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
