import TextInput from '@/components/Inputs/TextInput'
import { TSolarCalculatorSimulation } from '@/pages/publico/simulacoes/calculadora-solar/[id]'
import { formatToPhone } from '@/utils/methods'
import React from 'react'

type ThirdStageProps = {
  simulation: TSolarCalculatorSimulation
  setSimulation: React.Dispatch<React.SetStateAction<TSolarCalculatorSimulation>>
  goToNextStage: () => void
}
function ThirdStage({ simulation, setSimulation, goToNextStage }: ThirdStageProps) {
  function handleGoToNextStage() {
    handleGoToNextStage
  }
  return (
    <div className="flex min-h-[450px] w-full flex-col items-center justify-between gap-8 py-4">
      <div className="flex w-full flex-col">
        <h3 className="w-full text-center text-sm tracking-tight text-gray-500 lg:text-base">
          E pra finalizarmos, gostaríamos de saber um pouco mais sobre você.
        </h3>
      </div>
      <div className="flex w-full grow flex-col gap-4">
        <TextInput
          label="SEU NOME"
          placeholder="Preencha aqui o seu nome ou como gosta de ser chamado..."
          value={simulation.nome}
          handleChange={(value) => setSimulation((prev) => ({ ...prev, nome: value }))}
          width="100%"
        />
        <TextInput
          label="SEU EMAIL"
          placeholder="Preencha aqui o seu melhor email para contato..."
          value={simulation.email}
          handleChange={(value) => setSimulation((prev) => ({ ...prev, email: value }))}
          width="100%"
        />
        <TextInput
          label="SEU NÚMERO DE CELULAR"
          placeholder="Preencha aqui o seu melhor número para contato..."
          value={simulation.telefone}
          handleChange={(value) => setSimulation((prev) => ({ ...prev, telefone: formatToPhone(value) }))}
          width="100%"
        />
      </div>
      <button
        onClick={() => handleGoToNextStage()}
        className="w-full self-center rounded bg-green-700 px-2 py-4 text-center text-sm font-bold text-white duration-500 ease-in-out hover:bg-green-600 lg:w-[70%]"
      >
        VER RESULTADO
      </button>
    </div>
  )
}

export default ThirdStage
