import SelectInput from '@/components/Inputs/SelectInput'
import TextInput from '@/components/Inputs/TextInput'
import { TOpportunity } from '@/utils/schemas/opportunity.schema'
import { TProjectTypeDTO } from '@/utils/schemas/project-types.schema'
import React from 'react'

type GeneralInformationBlockProps = {
  opportunity: TOpportunity
  setOpportunity: React.Dispatch<React.SetStateAction<TOpportunity>>
  projectTypes?: TProjectTypeDTO[]
}
function GeneralInformationBlock({ opportunity, setOpportunity, projectTypes }: GeneralInformationBlockProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="w-full rounded bg-gray-800 p-1 text-center font-bold text-white">INFORMAÇÕES DO PROJETO</h1>
      <TextInput
        label="NOME DO PROJETO"
        value={opportunity.nome}
        placeholder="Preencha aqui o nome a ser dado ao projeto..."
        handleChange={(value) => setOpportunity((prev) => ({ ...prev, nome: value }))}
        width="100%"
      />
      <div className="flex w-full flex-col gap-1">
        <SelectInput
          label="TIPO DO PROJETO"
          value={opportunity.tipo.id}
          options={projectTypes?.map((type, index) => ({ id: index + 1, label: type.nome, value: type._id })) || []}
          handleChange={(value) => {
            const type = projectTypes?.find((t) => t._id == value)
            const saleCategory = type?.categoriaVenda || 'KIT'
            const typeTitle = type?.nome || 'SISTEMA FOTOVOLTAICO'
            setOpportunity((prev) => ({
              ...prev,
              tipo: {
                id: value,
                titulo: typeTitle,
              },
              categoriaVenda: saleCategory as TOpportunity['categoriaVenda'],
            }))
          }}
          selectedItemLabel="NÃO DEFINIDO"
          onReset={() =>
            setOpportunity((prev) => ({
              ...prev,
              tipo: {
                id: '6615785ddcb7a6e66ede9785',
                titulo: 'SISTEMA FOTOVOLTAICO',
              },
            }))
          }
          width="100%"
        />
      </div>
      <div className="flex w-full flex-col gap-1">
        <p className="font-Raleway font-bold text-gray-800">DESCRIÇÃO</p>
        <textarea
          value={opportunity.descricao}
          onChange={(e) =>
            setOpportunity((prev) => ({
              ...prev,
              descricao: e.target.value,
            }))
          }
          placeholder="Descreva aqui peculiaridades do cliente, da negociação, ou outras informações relevantes acerca desse projeto."
          className="w-full resize-none rounded-sm border border-gray-300 p-2 text-center text-sm text-gray-600 outline-none focus:border-blue-300 focus:ring focus:ring-[1]"
        />
      </div>
    </div>
  )
}

export default GeneralInformationBlock