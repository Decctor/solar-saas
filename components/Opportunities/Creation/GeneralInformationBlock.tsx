import SelectInput from '@/components/Inputs/SelectInput'
import SelectWithImages from '@/components/Inputs/SelectWithImages'
import TextInput from '@/components/Inputs/TextInput'
import { usePartnersSimplified } from '@/utils/queries/partners'
import { TOpportunity } from '@/utils/schemas/opportunity.schema'
import { TProjectTypeDTO } from '@/utils/schemas/project-types.schema'
import { TUser } from '@/utils/schemas/user.schema'
import { ComercialSegments } from '@/utils/select-options'
import { Session } from 'next-auth'
import React from 'react'

type GeneralInformationBlockProps = {
  opportunity: TOpportunity
  setOpportunity: React.Dispatch<React.SetStateAction<TOpportunity>>
  projectTypes?: TProjectTypeDTO[]
  session: Session
}
function GeneralInformationBlock({ opportunity, setOpportunity, projectTypes, session }: GeneralInformationBlockProps) {
  const partnersScope = session.user.permissoes.parceiros.escopo
  const { data: partners } = usePartnersSimplified()
  const vinculationPartners = partners ? (partnersScope ? partners?.filter((p) => partnersScope.includes(p._id)) : partners) : []
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
      <SelectWithImages
        label="VÍNCULO DE PARCEIRO"
        value={opportunity.idParceiro || null}
        options={vinculationPartners?.map((p) => ({ id: p._id, value: p._id, label: p.nome, url: p.logo_url || undefined })) || []}
        selectedItemLabel="TODOS"
        handleChange={(value) =>
          setOpportunity((prev) => ({
            ...prev,
            idParceiro: value,
          }))
        }
        onReset={() =>
          setOpportunity((prev) => ({
            ...prev,
            idParceiro: session.user.idParceiro,
          }))
        }
        width="100%"
      />
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
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
        <div className="w-full lg:w-1/2">
          <SelectInput
            label="SEGMENTO"
            value={opportunity.segmento}
            options={ComercialSegments}
            handleChange={(value) => {
              setOpportunity((prev) => ({
                ...prev,
                segmento: value as TOpportunity['segmento'],
              }))
            }}
            selectedItemLabel="NÃO DEFINIDO"
            onReset={() =>
              setOpportunity((prev) => ({
                ...prev,
                segmento: 'RESIDENCIAL',
              }))
            }
            width="100%"
          />
        </div>
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
