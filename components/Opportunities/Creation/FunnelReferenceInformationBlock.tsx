import DropdownSelect from '@/components/Inputs/DropdownSelect'
import { TFunnelReference } from '@/utils/schemas/funnel-reference.schema'
import { TFunnelDTO } from '@/utils/schemas/funnel.schema'
import React from 'react'

function getCurrentActiveFunnelOptions(funnelId: number | string, funnels: TFunnelDTO[]) {
  let funnel = funnels.filter((funnel) => funnel._id.toString() == funnelId)[0]
  return funnel.etapas.map((stage) => {
    return {
      id: stage.id,
      label: stage.nome,
      value: stage.id,
    }
  })
}

type FunnelReferenceInformationBlockProps = {
  funnelReference: TFunnelReference
  setFunnelReference: React.Dispatch<React.SetStateAction<TFunnelReference>>
  funnels: TFunnelDTO[]
}
function FunnelReferenceInformationBlock({ funnelReference, setFunnelReference, funnels }: FunnelReferenceInformationBlockProps) {
  return (
    <div className="flex w-full items-center gap-1">
      <div className="w-[50%]">
        <DropdownSelect
          categoryName="FUNIL"
          selectedItemLabel="FUNIL NÃO DEFINIDO"
          options={funnels.map((funnel) => {
            return {
              id: funnel._id.toString(),
              label: funnel.nome,
              value: funnel._id.toString(),
            }
          })}
          value={funnelReference.idFunil || null}
          onChange={(selected) => {
            const selectedFunnel = funnels.find((f) => f._id == selected.value)
            const firstStage = selectedFunnel?.etapas[0].id || ''
            setFunnelReference((prev) => ({ ...prev, idFunil: selected.value, idEstagioFunil: firstStage.toString() }))
          }}
          onReset={() => setFunnelReference((prev) => ({ ...prev, idFunil: '', idEstagioFunil: '' }))}
          width="100%"
        />
      </div>
      <div className="w-[50%]">
        <DropdownSelect
          categoryName="ETAPA"
          selectedItemLabel="ETAPA NÃO DEFINIDA"
          options={funnelReference.idFunil ? getCurrentActiveFunnelOptions(funnelReference.idFunil, funnels) : null}
          value={funnelReference.idEstagioFunil || null}
          onChange={(selected) => setFunnelReference((prev) => ({ ...prev, idEstagioFunil: selected.value.toString() }))}
          onReset={() => setFunnelReference((prev) => ({ ...prev, idEstagioFunil: '' }))}
          width="100%"
        />
      </div>
    </div>
  )
}

export default FunnelReferenceInformationBlock
