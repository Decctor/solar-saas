import SelectInput from '@/components/Inputs/SelectInput'
import { TSolarCalculatorSimulation } from '@/pages/publico/simulacoes/calculadora-solar/[id]'
import { stateCities } from '@/utils/estados_cidades'
import React from 'react'
import toast from 'react-hot-toast'

type SecondStageProps = {
  simulation: TSolarCalculatorSimulation
  setSimulation: React.Dispatch<React.SetStateAction<TSolarCalculatorSimulation>>
  goToNextStage: () => void
}
function SecondStage({ simulation, setSimulation, goToNextStage }: SecondStageProps) {
  function handleGoToNextStage() {
    if (!simulation.estado) return toast.error('Oops, não é possível prosseguir sem um Estado válido.')
    if (!simulation.cidade) return toast.error('Oops, não é possível prosseguir sem uma Cidade válido.')
    return goToNextStage()
  }
  return (
    <div className="flex min-h-[450px] w-full flex-col items-center justify-between gap-8 py-4">
      <div className="flex w-full flex-col">
        <h3 className="w-full text-center text-sm tracking-tight text-gray-500 lg:text-base">Agora, precisamos que conte pra gente a sua localidade.</h3>
        <h3 className="w-full text-center text-sm tracking-tight text-gray-500 lg:text-base">
          Essa informação é importante para dimensionar adequadamente o seu futuro sistema fotovoltaico.
        </h3>
      </div>
      <div className="flex w-full grow flex-col gap-4">
        <SelectInput
          label="ESTADO"
          value={simulation.estado}
          handleChange={(value) => {
            setSimulation((prev) => ({
              ...prev,
              estado: value,
              cidade: stateCities[value as keyof typeof stateCities][0] as string,
            }))
          }}
          selectedItemLabel="NÃO DEFINIDO"
          onReset={() => {
            setSimulation((prev) => ({
              ...prev,
              estado: '',
              cidade: '',
            }))
          }}
          options={Object.keys(stateCities).map((state, index) => ({
            id: index + 1,
            label: state,
            value: state,
          }))}
          width="100%"
        />
        <SelectInput
          label="CIDADE"
          value={simulation.cidade}
          handleChange={(value) => {
            setSimulation((prev) => ({ ...prev, cidade: value }))
          }}
          options={
            simulation.estado
              ? stateCities[simulation.estado as keyof typeof stateCities].map((city, index) => ({ id: index + 1, value: city, label: city }))
              : null
          }
          selectedItemLabel="NÃO DEFINIDO"
          onReset={() => {
            setSimulation((prev) => ({ ...prev, cidade: '' }))
          }}
          width="100%"
        />
      </div>
      <button
        onClick={() => handleGoToNextStage()}
        className="w-full self-center rounded bg-black px-2 py-4 text-center text-sm font-bold text-white duration-500 ease-in-out hover:bg-gray-800 lg:w-[70%]"
      >
        PROSSEGUIR
      </button>
    </div>
  )
}

export default SecondStage
