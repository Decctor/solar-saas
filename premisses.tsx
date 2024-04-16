import NumberInput from './components/Inputs/NumberInput'
import SelectInput from './components/Inputs/SelectInput'
import TextInput from './components/Inputs/TextInput'
import { orientations, structureTypes } from './utils/constants'
import { TProposalPremisses } from './utils/schemas/proposal.schema'

type PremissesFieldOptions<T extends keyof TProposalPremisses> = {
  label: string
  value: T
  field: (props: { value: TProposalPremisses[T]; handleChange: (value: TProposalPremisses[T]) => void }) => JSX.Element
}[]
const PremissesFields: PremissesFieldOptions<'consumoEnergiaMensal'> = [
  {
    label: '',
    value: 'consumoEnergiaMensal',
    field: ({ value, handleChange }) => (
      <NumberInput
        label="CONSUMO DE ENERGIA MENSAL"
        placeholder="Preencha aqui o consumo de energia mensal."
        value={value || null}
        handleChange={handleChange}
        width="100%"
      />
    ),
  },
]

export function renderProposalPremisseField<T extends keyof TProposalPremisses>({
  field,
  value,
  handleChange,
}: {
  field: T
  value: T extends keyof TProposalPremisses ? TProposalPremisses[T] : never
  handleChange: (value: TProposalPremisses[T]) => void
}) {
  console.log(value)
  if (field === 'consumoEnergiaMensal') {
    return (
      <NumberInput
        label="Consumo médio de energia mensal (kWh)"
        placeholder="Preencha aqui o consumo de energia mensal..."
        value={(value as number) || null} // Assuming 'consumoEnergiaMensal' is of type number
        handleChange={handleChange as (value: number) => void}
        width="100%"
      />
    )
  }
  if (field == 'fatorSimultaneidade') {
    return (
      <NumberInput
        label="Fator de simultaneidade (%)"
        placeholder="Preencha aqui o fator de simultaneidade..."
        value={(value as number) || null}
        handleChange={handleChange as (value: number) => void}
        width="100%"
      />
    )
  }
  if (field == 'tarifaEnergia') {
    return (
      <NumberInput
        label="Tarifa de energia (R$/kWh)"
        placeholder="Preencha aqui a tarifa de energia..."
        value={(value as number) || null}
        handleChange={handleChange as (value: number) => void}
        width="100%"
      />
    )
  }
  if (field == 'tarifaFioB') {
    return (
      <NumberInput
        label="Tarifa de fio B (R$/kWh)"
        placeholder="Preencha aqui a tarifa de Fio B..."
        value={(value as number) || null}
        handleChange={handleChange as (value: number) => void}
        width="100%"
      />
    )
  }
  if (field == 'tipoEstrutura') {
    return (
      <SelectInput
        label="Tipo de estrutura"
        value={value as TProposalPremisses['tipoEstrutura']}
        options={structureTypes.map((s, index) => ({ id: index + 1, label: s.label, value: s.value }))}
        handleChange={handleChange as (value: TProposalPremisses['tipoEstrutura']) => void}
        // @ts-ignore
        onReset={() => handleChange(null)}
        selectedItemLabel="NÃO DEFINIDO"
        width="100%"
      />
    )
  }
  if (field == 'orientacao') {
    return (
      <SelectInput
        label="Orientação"
        value={value as TProposalPremisses['orientacao']}
        options={orientations.map((s, index) => ({ id: index + 1, label: s, value: s }))}
        handleChange={handleChange as (value: TProposalPremisses['orientacao']) => void}
        // @ts-ignore
        onReset={() => handleChange(null)}
        selectedItemLabel="NÃO DEFINIDO"
        width="100%"
      />
    )
  }
  if (field == 'distancia') {
    return (
      <NumberInput
        label="Distância (km)"
        placeholder="Preencha aqui a distância até a localização de instalação..."
        value={(value as number) || null}
        handleChange={handleChange as (value: number) => void}
        width="100%"
      />
    )
  }
  if (field == 'topologia') {
    return (
      <SelectInput
        label="Topologia"
        value={value as TProposalPremisses['topologia']}
        handleChange={handleChange as (value: TProposalPremisses['topologia']) => void}
        onReset={() => handleChange(null)}
        selectedItemLabel="NÃO DEFINIDO"
        options={[
          { id: 1, label: 'INVERSOR', value: 'INVERSOR' },
          {
            id: 2,
            label: 'MICRO-INVERSOR',
            value: 'MICRO-INVERSOR',
          },
        ]}
        width="100%"
      />
    )
  }
  if (field == 'potenciaPico') {
    return (
      <NumberInput
        label="Potência pico do sistema (kWp)"
        placeholder="Preencha aqui a potência pico do sistema..."
        value={(value as number) || null}
        handleChange={handleChange as (value: number) => void}
        width="100%"
      />
    )
  }
  if (field == 'numModulos') {
    return (
      <NumberInput
        label="Número de módulos"
        placeholder="Preencha aqui o nº de módulos..."
        value={(value as number) || null}
        handleChange={handleChange as (value: number) => void}
        width="100%"
      />
    )
  }
  if (field == 'numInversores') {
    return (
      <NumberInput
        label="Número de inversores"
        placeholder="Preencha aqui o nº de inversores..."
        value={(value as number) || null}
        handleChange={handleChange as (value: number) => void}
        width="100%"
      />
    )
  }
}
