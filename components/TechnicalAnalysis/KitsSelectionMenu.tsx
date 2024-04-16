import { useActiveKits, useKits } from '@/utils/queries/kits'
import React, { useState } from 'react'
import TechnicalAnalysisKit from '../Cards/TechAnalysisKitItem'
import { TKitDTO } from '@/utils/schemas/kits.schema'

type KitsSelectionMenuProps = {
  selectedKitId: string | null
  handleSelect: (kit: TKitDTO) => void
}
function KitsSelectionMenu({ selectedKitId, handleSelect }: KitsSelectionMenuProps) {
  const { data: kits, isFetching, isSuccess, filters, setFilters } = useActiveKits()
  return (
    <div className="flex w-full flex-col gap-1">
      {kits?.map((kit) => (
        <TechnicalAnalysisKit
          selectedId={selectedKitId}
          key={kit._id}
          kit={kit}
          handleClick={(kit) => {
            handleSelect(kit)
          }}
        />
      ))}
    </div>
  )
}

export default KitsSelectionMenu
