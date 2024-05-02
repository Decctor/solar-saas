import NumberInput from '@/components/Inputs/NumberInput'
import SelectInput from '@/components/Inputs/SelectInput'
import TextInput from '@/components/Inputs/TextInput'
import { renderProposalPremisseField } from '@/premisses'
import { orientations, ProjectTypes, structureTypes } from '@/utils/constants'
import { useDistanceData } from '@/utils/queries/utils'
import { TOpportunityDTOWithClient, TOpportunityDTOWithClientAndPartner } from '@/utils/schemas/opportunity.schema'
import { TProjectTypeDTO } from '@/utils/schemas/project-types.schema'
import { TProposal, TProposalPremisses } from '@/utils/schemas/proposal.schema'
import { useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import React, { SetStateAction, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
type GeneralSizingProps = {
  opportunity: TOpportunityDTOWithClientAndPartner
  projectTypes: TProjectTypeDTO[]
  infoHolder: TProposal
  setInfoHolder: React.Dispatch<React.SetStateAction<TProposal>>
  moveToNextStage: () => void
}
function GeneralSizing({ opportunity, projectTypes, infoHolder, setInfoHolder, moveToNextStage }: GeneralSizingProps) {
  // Using the vinculated opportunity partner location reference as the origin city and uf
  const originCity = opportunity.parceiro?.localizacao.cidade || 'ITUIUTABA'
  const originUF = opportunity.parceiro?.localizacao.uf || 'MG'
  // Using the opportunity city and uf
  const destinationCity = opportunity.localizacao.cidade
  const destinationUF = opportunity.localizacao.uf
  const { data: distance } = useDistanceData({ originCity: originCity, originUF: originUF, destinationCity: destinationCity, destinationUF: destinationUF })

  function validateFields() {
    // if (!infoHolder.premissas.consumoEnergiaMensal || infoHolder.premissas.consumoEnergiaMensal <= 0) return toast.error('Preencha um consumo válido.')
    // if (!infoHolder.premissas.fatorSimultaneidade || infoHolder.premissas.fatorSimultaneidade <= 0) return toast.error('Preencha o fator de simultaneidade.')
    // if (!infoHolder.premissas.tarifaEnergia || infoHolder.premissas.tarifaEnergia <= 0) return toast.error('Preencha a tarifa de energia.')
    // if (!infoHolder.premissas.tarifaFioB || infoHolder.premissas.tarifaFioB <= 0) return toast.error('Preencha a tarifa de Fio B.')
    // if (!infoHolder.premissas.tipoEstrutura) return toast.error('Preencha um tipo de estrutura válida.')
    // if (!infoHolder.premissas.orientacao) return toast.error('Preencha um orientação válida.')
    // if (!infoHolder.premissas.distancia || infoHolder.premissas.distancia < 0) return toast.error('Preencha uma distância válida.')

    return moveToNextStage()
  }
  useEffect(() => {
    if (distance) return setInfoHolder((prev) => ({ ...prev, premissas: { ...prev.premissas, distancia: distance } }))
  }, [distance])
  return (
    <>
      <div className="flex w-full flex-col gap-4 py-4">
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full items-center justify-center">
            <h1 className="text-center font-medium italic text-[#fead61]">
              Nessa etapa, por favor preencha informações que nos possibilitarão a realizar uma análise primária das necessidades e especificidades técnicas do
              projeto.
            </h1>
          </div>
          {projectTypes
            ?.find((type) => type._id == opportunity.tipo.id)
            ?.dimensionamento.map((category, categoryIndex) => (
              <div key={categoryIndex} className="flex w-full flex-col gap-1">
                <h1 className="justify-center text-center text-sm font-bold text-[#15599a]">{category.titulo}</h1>
                <div className="flex w-full flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                  {category.campos.map((field) => (
                    <div className="w-full lg:w-[48%]">
                      {renderProposalPremisseField({
                        field: field as keyof TProposalPremisses,
                        value: infoHolder.premissas[field as keyof TProposalPremisses],
                        handleChange: (value) => setInfoHolder((prev) => ({ ...prev, premissas: { ...prev.premissas, [field]: value } })),
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          {/* <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="flex w-full flex-col gap-1 lg:w-[50%]">
              <NumberInput
                label="Consumo médio de energia mensal (kWh)"
                placeholder="Preencha aqui o consumo médio de energia mensal..."
                value={infoHolder.premissas.consumoEnergiaMensal || null}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, premissas: { ...prev.premissas, consumoEnergiaMensal: value } }))}
                width="100%"
              />
            </div>
            <div className="flex w-full flex-col gap-1 lg:w-[50%]">
              <NumberInput
                label="Fator de simultaneidade (%)"
                placeholder="Preencha aqui o fator de simultaneidade..."
                value={infoHolder.premissas.fatorSimultaneidade || null}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, premissas: { ...prev.premissas, fatorSimultaneidade: value } }))}
                width="100%"
              />
            </div>
          </div>
          <h1 className="justify-center text-center text-sm font-bold text-[#15599a]">TARIFAS</h1>
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="flex w-full flex-col gap-1 lg:w-[50%]">
              <NumberInput
                label="Tarifa de energia (R$/kWh)"
                placeholder="Preencha aqui a tarifa de energia..."
                value={infoHolder.premissas.tarifaEnergia || null}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, premissas: { ...prev.premissas, tarifaEnergia: value } }))}
                width="100%"
              />
            </div>
            <div className="flex w-full flex-col gap-1 lg:w-[50%]">
              <NumberInput
                label="Tarifa de fio B (R$/kWh)"
                placeholder="Preencha aqui a tarifa de Fio B..."
                value={infoHolder.premissas.tarifaFioB || null}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, premissas: { ...prev.premissas, tarifaFioB: value } }))}
                width="100%"
              />
            </div>
          </div>
          <h1 className="justify-center text-center text-sm font-bold text-[#15599a]">ESPECIFICIDADES DA INSTALAÇÃO</h1>
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="flex w-full flex-col lg:w-1/3">
              <SelectInput
                label="Tipo de estrutura"
                value={infoHolder.premissas.tipoEstrutura}
                options={structureTypes.map((s, index) => ({ id: index + 1, label: s.label, value: s.value }))}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, premissas: { ...prev.premissas, tipoEstrutura: value } }))}
                onReset={() => setInfoHolder((prev) => ({ ...prev, premissas: { ...prev.premissas, tipoEstrutura: null } }))}
                selectedItemLabel="NÃO DEFINIDO"
                width="100%"
              />
            </div>
            <div className="flex w-full flex-col lg:w-1/3">
              <SelectInput
                label="Orientação"
                value={infoHolder.premissas.orientacao}
                options={orientations.map((orientation, index) => ({ id: index + 1, label: orientation, value: orientation }))}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, premissas: { ...prev.premissas, orientacao: value } }))}
                onReset={() => setInfoHolder((prev) => ({ ...prev, premissas: { ...prev.premissas, orientacao: null } }))}
                selectedItemLabel="NÃO DEFINIDO"
                width="100%"
              />
            </div>
            <div className="flex w-full flex-col gap-1 lg:w-1/3">
              <NumberInput
                label="Distância (Km)"
                placeholder="Preencha aqui a distância até a localização de instalação.."
                value={infoHolder.premissas.distancia || null}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, premissas: { ...prev.premissas, distancia: value } }))}
                width="100%"
              />
            </div>
          </div> */}
        </div>
      </div>
      <div className="flex w-full items-center justify-end gap-2 px-1">
        <button onClick={() => validateFields()} className="rounded p-2 font-bold hover:bg-black hover:text-white">
          Prosseguir
        </button>
      </div>
    </>
  )
}

export default GeneralSizing
