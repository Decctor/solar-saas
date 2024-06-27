import NumberInput from '@/components/Inputs/NumberInput'
import { formatToMoney } from '@/lib/methods/formatting'
import { TSolarCalculatorSimulation } from '@/pages/publico/simulacoes/calculadora-solar/[id]'
import React from 'react'
import toast from 'react-hot-toast'
import { FaMinus, FaPlus } from 'react-icons/fa'

type FirstStageProps = {
  simulation: TSolarCalculatorSimulation
  setSimulation: React.Dispatch<React.SetStateAction<TSolarCalculatorSimulation>>
  goToNextStage: () => void
}
function FirstStage({ simulation, setSimulation, goToNextStage }: FirstStageProps) {
  function handleGoToNextStage() {
    if (!simulation.valorFaturaEnergia || simulation.valorFaturaEnergia <= 0)
      return toast.error('Oops, não é possível prosseguir com um valor inválido de fatura de energia.')

    return goToNextStage()
  }
  return (
    <div className="flex min-h-[450px] w-full flex-col items-center justify-between">
      <div className="flex w-full grow flex-col justify-center gap-2">
        <h1 className="w-full text-center text-xs font-bold text-[#353432]">QUANTO VOCÊ GASTA DE ENERGIA POR MÊS ? </h1>
        <div className="flex w-full items-center justify-between gap-4 self-center">
          <button
            onClick={() =>
              setSimulation((prev) => ({ ...prev, valorFaturaEnergia: (prev.valorFaturaEnergia || 0) - 10 < 0 ? 0 : (prev.valorFaturaEnergia || 0) - 10 }))
            }
            className="flex items-center justify-center rounded-full border border-gray-500 bg-[#fff] p-3 text-xs duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:text-lg"
          >
            <FaMinus />
          </button>
          <h1 className="text-3xl font-black lg:text-4xl ">{formatToMoney(simulation.valorFaturaEnergia || 0)}</h1>
          <button
            onClick={() => setSimulation((prev) => ({ ...prev, valorFaturaEnergia: (prev.valorFaturaEnergia || 0) + 10 }))}
            className="flex items-center justify-center rounded-full border border-gray-500 bg-[#fff] p-3 text-xs duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:text-lg"
          >
            <FaPlus />
          </button>
        </div>
        <div className="flex w-full items-center justify-between gap-3">
          <button
            onClick={() => setSimulation((prev) => ({ ...prev, valorFaturaEnergia: 100 }))}
            className="min-w-1/5 flex w-[40%] items-center justify-center rounded-md border border-gray-500 bg-white p-2 py-4 text-xs font-bold duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:w-1/4 lg:p-3 lg:py-6 lg:text-lg"
          >
            R$ 100
          </button>
          <button
            onClick={() => setSimulation((prev) => ({ ...prev, valorFaturaEnergia: 250 }))}
            className="min-w-1/5 flex w-[40%] items-center justify-center rounded-md border border-gray-500 bg-white p-2 py-4 text-xs font-bold duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:w-1/4 lg:p-3 lg:py-6 lg:text-lg"
          >
            R$ 250
          </button>
          <button
            onClick={() => setSimulation((prev) => ({ ...prev, valorFaturaEnergia: 500 }))}
            className="min-w-1/5 flex w-[40%] items-center justify-center rounded-md border border-gray-500 bg-white p-2 py-4 text-xs font-bold duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:w-1/4 lg:p-3 lg:py-6 lg:text-lg"
          >
            R$ 500
          </button>
          <button
            onClick={() => setSimulation((prev) => ({ ...prev, valorFaturaEnergia: 1000 }))}
            className="min-w-1/5 flex w-[40%] items-center justify-center rounded-md border border-gray-500 bg-white p-2 py-4 text-xs font-bold duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:w-1/4 lg:p-3 lg:py-6 lg:text-lg"
          >
            R$ 1000
          </button>
        </div>
        <div className="flex w-full items-center justify-between gap-3">
          <button
            onClick={() => setSimulation((prev) => ({ ...prev, valorFaturaEnergia: 2500 }))}
            className="min-w-1/5 flex w-1/2 items-center justify-center rounded-md border border-gray-500 bg-white p-2 py-4 text-xs font-bold duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:w-1/2 lg:p-3 lg:py-6 lg:text-lg"
          >
            R$ 2500
          </button>
          <button
            onClick={() => setSimulation((prev) => ({ ...prev, valorFaturaEnergia: 5000 }))}
            className="min-w-1/5 flex w-1/2 items-center justify-center rounded-md border border-gray-500 bg-white p-2 py-4 text-xs font-bold duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:w-1/2 lg:p-3 lg:py-6 lg:text-lg"
          >
            R$ 5000
          </button>
        </div>
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

export default FirstStage
