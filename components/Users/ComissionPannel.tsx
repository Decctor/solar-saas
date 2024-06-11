import React, { useState } from 'react'
import CheckboxInput from '../Inputs/CheckboxInput'
import { TPricingMethodConditionType, TPricingMethodItemResultItem } from '@/utils/schemas/pricing-method.schema'
import ComissionScenariosMenu from './Utils/ComissionScenariosMenu'
import { AnimatePresence, motion } from 'framer-motion'
import RotativeIconButton from '../Buttons/RotativeIconButton'
import { IoMdArrowDropdownCircle } from 'react-icons/io'
import { GeneralVisibleHiddenExitMotionVariants } from '@/utils/constants'
import { TUserComission } from '@/utils/schemas/user.schema'

export type TComissionSpecs = {
  aplicavel: boolean
  resultados: {
    condicao: TPricingMethodItemResultItem['condicao']
    formulaArr: string[]
  }[]
}
function ComissionPannel() {
  const [pannelIsOpen, setPannelIsOpen] = useState<boolean>(true)
  const [comission, setComission] = useState<TUserComission>({
    aplicavel: false,
    resultados: [],
  })
  const [resultHolder, setResultHolder] = useState<TUserComission['resultados'][number]>({
    condicao: {
      aplicavel: false,
      variavel: null,
      igual: null,
    },
    formulaArr: [],
  })
  return (
    <div className="flex w-full flex-col gap-2 rounded border border-orange-500">
      <AnimatePresence>
        <div className="flex w-full items-center justify-center gap-1 rounded bg-orange-500 p-2 text-white">
          <h1 className="text-sm font-medium text-white">PAINEL DE COMISSÃO</h1>
          <RotativeIconButton active={pannelIsOpen} setActive={setPannelIsOpen} icon={<IoMdArrowDropdownCircle size={20} />} />
        </div>
        {pannelIsOpen ? (
          <motion.div
            key={'pannel'}
            variants={GeneralVisibleHiddenExitMotionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mt-1 flex w-full flex-col gap-2 bg-transparent p-2"
          >
            <div className="flex w-full items-center justify-center">
              <div className="w-fit">
                <CheckboxInput
                  labelFalse="USUÁRIO COMISSIONADO"
                  labelTrue="USUÁRIO COMISSIONADO"
                  checked={comission.aplicavel}
                  handleChange={(value) => setComission((prev) => ({ ...prev, aplicavel: value }))}
                />
              </div>
            </div>
            {comission.aplicavel ? (
              <ComissionScenariosMenu comission={comission} setComission={setComission} resultHolder={resultHolder} setResultHolder={setResultHolder} />
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default ComissionPannel
