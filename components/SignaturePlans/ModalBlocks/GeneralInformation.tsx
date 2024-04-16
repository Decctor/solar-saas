import CheckboxInput from '@/components/Inputs/CheckboxInput'
import SelectInput from '@/components/Inputs/SelectInput'
import TextInput from '@/components/Inputs/TextInput'
import { TSignaturePlan } from '@/utils/schemas/signature-plans.schema'
import { SignaturePlanIntervalTypes } from '@/utils/select-options'
import React from 'react'

type GeneralInformationProps = {
  infoHolder: TSignaturePlan
  setInfoHolder: React.Dispatch<React.SetStateAction<TSignaturePlan>>
}
function GeneralInformation({ infoHolder, setInfoHolder }: GeneralInformationProps) {
  return (
    <div className="flex w-full flex-col gap-1">
      <h1 className="w-full bg-gray-700  p-1 text-center font-medium text-white">INFORMAÇÕES GERAIS</h1>
      <div className="my-2 flex w-full items-center justify-center gap-2">
        <div className="w-fit">
          <CheckboxInput
            checked={infoHolder.ativo}
            labelFalse="PLANO ATIVADO"
            labelTrue="PLANO ATIVADO"
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, ativo: value }))}
            justify="justify-center"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <TextInput
            label="NOME DO PLANO"
            placeholder="Preencha o nome do plano..."
            value={infoHolder.nome}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nome: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TextInput
            label="DESCRIÇÃO DO PLANO"
            placeholder="Preencha uma descrição para proposta..."
            value={infoHolder.descricao}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, descricao: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <SelectInput
            label="TIPO DE RECORRÊNCIA"
            options={SignaturePlanIntervalTypes}
            value={infoHolder.intervalo.tipo}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, intervalo: { ...prev.intervalo, tipo: value } }))}
            selectedItemLabel="PADRÃO"
            onReset={() => setInfoHolder((prev) => ({ ...prev, intervalo: { ...prev.intervalo, tipo: 'MENSAL' } }))}
            width="100%"
          />
        </div>
      </div>
    </div>
  )
}

export default GeneralInformation
