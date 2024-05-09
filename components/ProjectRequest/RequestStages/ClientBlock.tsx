import DateInput from '@/components/Inputs/DateInput'
import SelectInput from '@/components/Inputs/SelectInput'
import TextInput from '@/components/Inputs/TextInput'
import { formatDateInputChange } from '@/lib/methods/formatting'
import { stateCities } from '@/utils/estados_cidades'
import { formatDate, formatToCEP, formatToCPForCNPJ, formatToPhone, getCEPInfo } from '@/utils/methods'
import { useClientById } from '@/utils/queries/clients'
import { TClient, TClientDTO } from '@/utils/schemas/client.schema'
import { CustomersAcquisitionChannels, MaritalStatus } from '@/utils/select-options'
import { useQueryClient } from '@tanstack/react-query'
import { Session } from 'next-auth'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

type ClientBlockProps = {
  clientId: string
  session: Session
}
function ClientBlock({ clientId, session }: ClientBlockProps) {
  const queryClient = useQueryClient()
  const { data: client, isSuccess, isError, isLoading } = useClientById({ id: clientId })
  const [clientInfo, setClientInfo] = useState<TClientDTO>({
    _id: 'id-holder',
    nome: '',
    idParceiro: '',
    cpfCnpj: '',
    telefonePrimario: '',
    telefoneSecundario: null,
    email: '',
    cep: '',
    uf: '',
    cidade: '',
    bairro: '',
    endereco: '',
    numeroOuIdentificador: '',
    complemento: '',
    dataNascimento: null,
    profissao: null,
    ondeTrabalha: null,
    estadoCivil: null,
    canalAquisicao: '',
    idMarketing: null,
    indicador: {
      nome: '',
      contato: '',
    },
    autor: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },
    dataInsercao: new Date().toISOString(),
  })
  async function setAddressDataByCEP(cep: string) {
    const addressInfo = await getCEPInfo(cep)
    const toastID = toast.loading('Buscando informações sobre o CEP...', {
      duration: 2000,
    })
    setTimeout(() => {
      if (addressInfo) {
        toast.dismiss(toastID)
        toast.success('Dados do CEP buscados com sucesso.', {
          duration: 1000,
        })
        setClientInfo((prev) => ({
          ...prev,
          endereco: addressInfo.logradouro,
          bairro: addressInfo.bairro,
          uf: addressInfo.uf as keyof typeof stateCities,
          cidade: addressInfo.localidade.toUpperCase(),
        }))
      }
    }, 1000)
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="w-full rounded bg-gray-800 p-1 text-center font-bold text-white">INFORMAÇÕES DO CLIENTE</h1>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <TextInput
            label="NOME (*)"
            value={clientInfo.nome}
            placeholder="Preencha aqui o nome do cliente."
            handleChange={(value) => setClientInfo((prev) => ({ ...prev, nome: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <TextInput
            label="CPF/CNPJ"
            value={clientInfo.cpfCnpj || ''}
            placeholder="Preencha aqui o CPF ou CNPJ do cliente."
            handleChange={(value) =>
              setClientInfo((prev) => ({
                ...prev,
                cpfCnpj: formatToCPForCNPJ(value),
              }))
            }
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <DateInput
            label={'DATA DE NASCIMENTO'}
            editable={true}
            value={clientInfo.dataNascimento ? formatDate(clientInfo.dataNascimento) : undefined}
            handleChange={(value) =>
              setClientInfo((prev) => ({
                ...prev,
                dataDeNascimento: formatDateInputChange(value),
              }))
            }
            width={'100%'}
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label="PROFISSÃO"
            value={clientInfo.profissao || ''}
            placeholder="Preencha aqui a profissão do cliente."
            handleChange={(value) =>
              setClientInfo((prev) => ({
                ...prev,
                profissao: value,
              }))
            }
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label="ONDE TRABALHA"
            value={clientInfo.ondeTrabalha || ''}
            placeholder="Preencha aqui o lugar de trabalho do cliente."
            handleChange={(value) =>
              setClientInfo((prev) => ({
                ...prev,
                ondeTrabalha: value,
              }))
            }
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <SelectInput
            label="ESTADO CIVIL"
            value={clientInfo.estadoCivil}
            options={MaritalStatus}
            handleChange={(value) =>
              setClientInfo((prev) => ({
                ...prev,
                estadoCivil: value,
              }))
            }
            onReset={() =>
              setClientInfo((prev) => ({
                ...prev,
                estadoCivil: null,
              }))
            }
            selectedItemLabel="NÃO DEFINIDO"
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <SelectInput
            label="CANAL DE AQUISIÇÃO"
            value={clientInfo.canalAquisicao}
            options={CustomersAcquisitionChannels}
            handleChange={(value) =>
              setClientInfo((prev) => ({
                ...prev,
                canalAquisicao: value,
              }))
            }
            onReset={() =>
              setClientInfo((prev) => ({
                ...prev,
                canalAquisicao: '',
              }))
            }
            selectedItemLabel="NÃO DEFINIDO"
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TextInput
            label="NOME DO INDICADOR (SE INDICAÇÃO)"
            value={clientInfo.indicador.nome || ''}
            placeholder="Preencha aqui o nome do indicador..."
            handleChange={(value) => setClientInfo((prev) => ({ ...prev, indicador: { ...prev.indicador, nome: value } }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TextInput
            label="TELEFONE DO INDICADOR (SE INDICAÇÃO)"
            value={clientInfo.indicador.contato || ''}
            placeholder="Preencha aqui o contato do indicador..."
            handleChange={(value) => setClientInfo((prev) => ({ ...prev, indicador: { ...prev.indicador, contato: formatToPhone(value) } }))}
            width="100%"
          />
        </div>
      </div>
      <h1 className="w-full rounded bg-gray-800 p-1 text-center font-bold text-white">INFORMAÇÕES DE CONTATO</h1>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <TextInput
            label="TELEFONE PRIMÁRIO (*)"
            value={clientInfo.telefonePrimario}
            placeholder="Preencha aqui o telefone primário do cliente."
            handleChange={(value) =>
              setClientInfo((prev) => ({
                ...prev,
                telefonePrimario: formatToPhone(value),
              }))
            }
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TextInput
            label="TELEFONE SECUNDÁRIO"
            value={clientInfo.telefoneSecundario || ''}
            placeholder="Preencha aqui o telefone secundário do cliente."
            handleChange={(value) =>
              setClientInfo((prev) => ({
                ...prev,
                telefoneSecundario: formatToPhone(value),
              }))
            }
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TextInput
            label="EMAIL"
            value={clientInfo.email || ''}
            placeholder="Preencha aqui o email do cliente."
            handleChange={(value) => setClientInfo((prev) => ({ ...prev, email: value }))}
            width="100%"
          />
        </div>
      </div>
      <h1 className="w-full rounded bg-gray-800 p-1 text-center font-bold text-white">INFORMAÇÕES DE ENDEREÇO</h1>
      <div className="grid grid-cols-1 grid-rows-3 items-center gap-6 px-2 lg:grid-cols-3 lg:grid-rows-1">
        <TextInput
          label="CEP"
          value={clientInfo.cep || ''}
          placeholder="Preencha aqui o CEP do cliente."
          handleChange={(value) => {
            if (value.length == 9) {
              setAddressDataByCEP(value)
            }
            setClientInfo((prev) => ({
              ...prev,
              cep: formatToCEP(value),
            }))
          }}
          width="100%"
        />
        <SelectInput
          label="ESTADO"
          value={clientInfo.uf}
          handleChange={(value) => setClientInfo((prev) => ({ ...prev, uf: value, cidade: stateCities[value as keyof typeof stateCities][0] as string }))}
          selectedItemLabel="NÃO DEFINIDO"
          onReset={() => setClientInfo((prev) => ({ ...prev, uf: '', cidade: '' }))}
          options={Object.keys(stateCities).map((state, index) => ({
            id: index + 1,
            label: state,
            value: state,
          }))}
          width="100%"
        />
        <SelectInput
          label="CIDADE"
          value={clientInfo.cidade}
          handleChange={(value) => setClientInfo((prev) => ({ ...prev, cidade: value }))}
          options={
            clientInfo.uf ? stateCities[clientInfo.uf as keyof typeof stateCities].map((city, index) => ({ id: index + 1, value: city, label: city })) : null
          }
          selectedItemLabel="NÃO DEFINIDO"
          onReset={() => setClientInfo((prev) => ({ ...prev, cidade: '' }))}
          width="100%"
        />
      </div>
      <div className="grid grid-cols-1 grid-rows-2 items-center gap-6 px-2 lg:grid-cols-2 lg:grid-rows-1">
        <TextInput
          label="BAIRRO"
          value={clientInfo.bairro || ''}
          placeholder="Preencha aqui o bairro do cliente."
          handleChange={(value) => setClientInfo((prev) => ({ ...prev, bairro: value }))}
          width="100%"
        />
        <TextInput
          label="LOGRADOURO/RUA"
          value={clientInfo.endereco || ''}
          placeholder="Preencha aqui o logradouro do cliente."
          handleChange={(value) => setClientInfo((prev) => ({ ...prev, endereco: value }))}
          width="100%"
        />
      </div>
      <div className="mb-2 grid grid-cols-1 grid-rows-2 items-center gap-6 px-2 lg:grid-cols-2 lg:grid-rows-1">
        <TextInput
          label="NÚMERO/IDENTIFICADOR"
          value={clientInfo.numeroOuIdentificador || ''}
          placeholder="Preencha aqui o número ou identificador da residência do cliente."
          handleChange={(value) =>
            setClientInfo((prev) => ({
              ...prev,
              numeroOuIdentificador: value,
            }))
          }
          width="100%"
        />
        <TextInput
          label="COMPLEMENTO"
          value={clientInfo.complemento || ''}
          placeholder="Preencha aqui algum complemento do endereço."
          handleChange={(value) =>
            setClientInfo((prev) => ({
              ...prev,
              complemento: value,
            }))
          }
          width="100%"
        />
      </div>
    </div>
  )
}

export default ClientBlock
