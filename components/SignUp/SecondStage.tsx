import React from 'react'
import Logo from '@/utils/images/logo.png'
import Image from 'next/image'
import TextInput from '../Inputs/TextInput'
import { formatToCEP, formatToCPForCNPJ, getCEPInfo } from '@/utils/methods'
import toast from 'react-hot-toast'
import { stateCities } from '@/utils/estados_cidades'
import SelectInput from '../Inputs/SelectInput'
import { TSignUpSetup, TSignUpSetupWithHolder } from '@/utils/schemas/sign-up-setup.schema'
import { editSignUpSetup } from '@/utils/mutations/sign-up-setup'
type SecondStageProps = {
  signUpHolder: TSignUpSetupWithHolder
  setSignUpHolder: React.Dispatch<React.SetStateAction<TSignUpSetupWithHolder>>
  goToNextStage: () => void
}
function SecondStage({ signUpHolder, setSignUpHolder, goToNextStage }: SecondStageProps) {
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
        setSignUpHolder((prev) => ({
          ...prev,
          parceiro: { ...prev.parceiro, uf: addressInfo.uf as keyof typeof stateCities, cidade: addressInfo.localidade.toUpperCase() },
        }))
      }
    }, 1000)
  }
  async function handleGoToNextStage() {
    if (signUpHolder.parceiro.nome.trim().length < 3) return toast.error('Oops, preencha um nome da ao menos 2 caractéres para prosseguir.')
    if (signUpHolder.parceiro.cpfCnpj.length < 14) return toast.error('Oops, preencha um CNPJ válido para prosseguir.')
    if (signUpHolder.parceiro.email.trim().length < 10) return toast.error('Oops, preencha um email válido para prosseguir.')
    setSignUpHolder((prev) => ({ ...prev, estagiosCadastro: { ...prev.estagiosCadastro, detalhesParceiro: new Date().toISOString() } }))
    if (!!signUpHolder.setupId)
      await editSignUpSetup({
        id: signUpHolder.setupId,
        changes: { ...signUpHolder, estagiosCadastro: { ...signUpHolder.estagiosCadastro, detalhesParceiro: new Date().toISOString() } },
      })
    goToNextStage()
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#091c2e] p-3 lg:flex-row">
      <div className="flex h-fit w-full flex-col items-center justify-center px-2 py-4 lg:h-full lg:w-[60%] lg:px-4 lg:py-6">
        <Image src={Logo} height={250} width={250} alt="Logo CRM" />
        <h1 className="w-full text-center text-2xl font-black text-white lg:text-4xl">Começe agora sua jornada conosco.</h1>
        <h1 className="w-full text-center font-medium text-white">Conheça a plataforma de experiência completa em energia solar.</h1>
      </div>
      <div className="flex h-full w-full flex-col items-center rounded-md bg-[#fff] p-6 py-36 lg:w-[40%]">
        <h1 className="text-3xl font-black text-cyan-500">SOBRE A SUA EMPRESA</h1>
        <div className="flex w-[90%] grow flex-col items-center justify-center gap-6 self-center lg:w-[70%]">
          <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col">
              <h1 className="mt-4 text-xl font-black">Preencha as informações abaixo</h1>
              <p className="mt-2 text-sm leading-none tracking-tight">Nos conte um pouco sobre a sua empresa.</p>
            </div>
            <TextInput
              label="Nome da empresa"
              placeholder="Preencha aqui o nome da empresa para qual você trabalha..."
              value={signUpHolder.parceiro.nome}
              handleChange={(value) => setSignUpHolder((prev) => ({ ...prev, parceiro: { ...prev.parceiro, nome: value } }))}
              width="100%"
            />
            <TextInput
              label="Cnpj da empresa"
              placeholder="Preencha aqui o CNPJ da empresa..."
              value={signUpHolder.parceiro.cpfCnpj}
              handleChange={(value) => setSignUpHolder((prev) => ({ ...prev, parceiro: { ...prev.parceiro, cpfCnpj: formatToCPForCNPJ(value) } }))}
              width="100%"
            />
            <TextInput
              label="Email principal"
              placeholder="Preencha aqui o email de contato da empresa..."
              value={signUpHolder.parceiro.email}
              handleChange={(value) => setSignUpHolder((prev) => ({ ...prev, parceiro: { ...prev.parceiro, email: value } }))}
              width="100%"
            />
            <p className="mt-2 text-sm leading-none tracking-tight">Qual a a localidade de atuação de vocês ?</p>
            <TextInput
              label="CEP"
              placeholder="Preencha aqui o CEP da matriz da empresa..."
              value={signUpHolder.parceiro.cep || ''}
              handleChange={(value) => {
                if (value.length == 9) {
                  setAddressDataByCEP(value)
                }
                setSignUpHolder((prev) => ({ ...prev, parceiro: { ...prev.parceiro, cep: formatToCEP(value) } }))
              }}
              width="100%"
            />
            <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="w-full lg:w-1/3">
                <SelectInput
                  label="ESTADO"
                  value={signUpHolder.parceiro.uf}
                  handleChange={(value) => {
                    setSignUpHolder((prev) => ({
                      ...prev,
                      parceiro: { ...prev.parceiro, uf: value, cidade: stateCities[value as keyof typeof stateCities][0] as string },
                    }))
                  }}
                  selectedItemLabel="UF"
                  onReset={() => {
                    setSignUpHolder((prev) => ({
                      ...prev,
                      parceiro: { ...prev.parceiro, uf: '', cidade: '' },
                    }))
                  }}
                  options={Object.keys(stateCities).map((state, index) => ({
                    id: index + 1,
                    label: state,
                    value: state,
                  }))}
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-2/3">
                <SelectInput
                  label="CIDADE"
                  value={signUpHolder.parceiro.cidade}
                  handleChange={(value) => {
                    setSignUpHolder((prev) => ({ ...prev, parceiro: { ...prev.parceiro, cidade: value } }))
                  }}
                  options={
                    signUpHolder.parceiro.uf
                      ? stateCities[signUpHolder.parceiro.uf as keyof typeof stateCities].map((city, index) => ({ id: index + 1, value: city, label: city }))
                      : null
                  }
                  selectedItemLabel="NÃO DEFINIDO"
                  onReset={() => {
                    setSignUpHolder((prev) => ({ ...prev, parceiro: { ...prev.parceiro, cidade: '' } }))
                  }}
                  width="100%"
                />
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2">
            <button
              onClick={() => handleGoToNextStage()}
              className="h-12 w-full self-center rounded bg-black px-2 py-3 text-center text-xs font-bold text-white duration-500 ease-in-out hover:bg-gray-800"
            >
              PROSSEGUIR
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecondStage
