import { formatDecimalPlaces } from '@/lib/methods/formatting'
import { formatToMoney } from '@/utils/methods'
import { IProposeDisassemblyAssemblyInfo, InverterType, ModuleType } from '@/utils/models'
import { TClientDTO } from '@/utils/schemas/clients.schema'
import { TProject, TProjectDTOWithClient } from '@/utils/schemas/project.schema'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
dayjs.locale(ptBr)
export function getDisassemblyAndAssemblyTemplate2024Data(
  client: TClientDTO,
  project: TProjectDTOWithClient,
  propose: IProposeDisassemblyAssemblyInfo,
  seller?: {
    name: string
    phone: string
  }
) {
  return {
    title: propose.nome || 'PROPOSTA DESMONTAGEM E MONTAGEM',
    fontSize: 10,
    textColor: '#333333',
    data: {
      clientName: client.nome,
      clientRegistry: client.cpfCnpj,
      clientCity: `${project.localizacao.cidade} - ${project.localizacao.uf}`,
      proposePower: `${formatDecimalPlaces(propose.potenciaPico || 0)} kWp`,
      sellerName: seller?.name,
      sellerPhone: seller?.phone,
      proposeDate: dayjs().format('DD [de] MMMM [de] YYYY'),
      modules: getModulesStr({ modules: propose.kit?.modulos || [] }),
      inverters: getInverterStr({ inverters: propose.kit?.inversores || [] }),
      assemblyAddress: formatLocation({ location: propose.premissas.novoEndereco || project.localizacao }),
      investment: formatToMoney(propose.valorProposta || 0),
      proposeId: project._id,
    },
  }
}

function getModulesStr({ modules }: { modules: Omit<ModuleType, 'id' | 'garantia' | 'modelo'>[] }) {
  var str = ''
  for (let i = 0; i < modules.length; i++) {
    if (i < modules.length - 1) {
      str = str + `${modules[i].qtde}x ${modules[i].fabricante} (${modules[i].potencia}W) & `
    } else {
      str = str + `${modules[i].qtde}x ${modules[i].fabricante} (${modules[i].potencia}W)`
    }
  }
  return str
}
function getInverterStr({ inverters }: { inverters: Omit<InverterType, 'id' | 'garantia' | 'modelo'>[] }) {
  var str = ''
  for (let i = 0; i < inverters.length; i++) {
    if (i < inverters.length - 1) {
      str = str + `${inverters[i].qtde}x ${inverters[i].fabricante} (${inverters[i].potenciaNominal}W) & `
    } else {
      str = str + `${inverters[i].qtde}x ${inverters[i].fabricante} (${inverters[i].potenciaNominal}W)`
    }
  }
  return str
}

function formatLocation({ location }: { location: IProposeDisassemblyAssemblyInfo['premissas']['novoEndereco'] | TProject['localizacao'] }) {
  var addressStr = ''
  if (!location) return addressStr
  if (location.cidade) addressStr = addressStr + location.cidade
  if (location.uf) addressStr = addressStr + ` - ${location.uf}`
  if (location.endereco) addressStr = addressStr + `, ${location.endereco}`
  if (location.numeroOuIdentificador) addressStr = addressStr + `, Nº ${location.numeroOuIdentificador}`
  if (location.bairro) addressStr = addressStr + `, ${location.bairro}`
  return addressStr.toUpperCase()
}
