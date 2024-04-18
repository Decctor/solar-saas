import { THomologation } from '@/utils/schemas/homologation.schema'
import React from 'react'
import TextInput from '../Inputs/TextInput'
import { ElectricalInstallationGroups, EnergyDistributorsOptions, SigningForms } from '@/utils/select-options'
import SelectInput from '../Inputs/SelectInput'

type InstallationInformationProps = {
  infoHolder: THomologation
  setInfoHolder: React.Dispatch<React.SetStateAction<THomologation>>
}
function InstallationInformation({ infoHolder, setInfoHolder }: InstallationInformationProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="w-full rounded bg-gray-800 p-1 text-center font-bold text-white">INFORMAÇÕES DA INSTALAÇÃO ELÉTRICA</h1>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <SelectInput
            label="CONCESSIONÁRIA/DISTRIBUIDORA"
            value={infoHolder.distribuidora}
            options={EnergyDistributorsOptions.map((d) => d)}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, distribuidora: value }))}
            selectedItemLabel="NÃO DEFINIDO"
            onReset={() => setInfoHolder((prev) => ({ ...prev, distribuidora: '' }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label="NÚMERO DA INSTALAÇÃO ELÉTRICA"
            placeholder="Preencha o número da instalação elétrica..."
            value={infoHolder.instalacao.numeroInstalacao}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, instalacao: { ...prev.instalacao, numeroInstalacao: value } }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label="NÚMERO DO CLIENTE"
            placeholder="Preencha o número do cliente junto a concessionária..."
            value={infoHolder.instalacao.numeroCliente}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, instalacao: { ...prev.instalacao, numeroCliente: value } }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <SelectInput
            label="GRUPO DA INSTALAÇÃO"
            value={infoHolder.instalacao.grupo}
            options={ElectricalInstallationGroups}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, instalacao: { ...prev.instalacao, grupo: value } }))}
            selectedItemLabel="NÃO DEFINIDO"
            onReset={() => setInfoHolder((prev) => ({ ...prev, instalacao: { ...prev.instalacao, grupo: 'RESIDENCIAL' } }))}
            width="100%"
          />
        </div>
      </div>
    </div>
  )
}

export default InstallationInformation
