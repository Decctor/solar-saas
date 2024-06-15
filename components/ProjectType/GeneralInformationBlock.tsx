import { TProjectType } from '@/utils/schemas/project-types.schema'
import React from 'react'
import TextInput from '../Inputs/TextInput'
import SelectInput from '../Inputs/SelectInput'
import SelectWithImages from '../Inputs/SelectWithImages'
import { usePartnersSimplified } from '@/utils/queries/partners'

type GeneralInformationBlockProps = {
  infoHolder: TProjectType
  setInfoHolder: React.Dispatch<React.SetStateAction<TProjectType>>
}
function GeneralInformationBlock({ infoHolder, setInfoHolder }: GeneralInformationBlockProps) {
  return (
    <div className="flex w-full flex-col gap-y-2">
      <h1 className="w-full bg-gray-700  p-1 text-center font-medium text-white">INFORMAÇÕES GERAIS</h1>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <TextInput
            label="NOME DO TIPO DE PROJETO"
            placeholder="Preencha o nome a ser dado ao tipo de projeto..."
            value={infoHolder.nome}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nome: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <SelectInput
            label="CATEGORIA DE VENDA"
            value={infoHolder.categoriaVenda}
            options={[
              { id: 1, label: 'KIT', value: 'KIT' },
              { id: 2, label: 'PLANO', value: 'PLANO' },
              { id: 3, label: 'PRODUTOS', value: 'PRODUTOS' },
              { id: 4, label: 'SERVIÇOS', value: 'SERVIÇOS' },
            ]}
            selectedItemLabel="PADRÃO"
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, categoriaVenda: value }))}
            onReset={() => setInfoHolder((prev) => ({ ...prev, categoriaVenda: 'KIT' }))}
            width="100%"
          />
        </div>
      </div>
    </div>
  )
}

export default GeneralInformationBlock
