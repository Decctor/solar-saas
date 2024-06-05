import React from 'react'
import SelectInput from '../Inputs/SelectInput'
import { TPricingMethodConditionType, TPricingMethodItemResultItem } from '@/utils/schemas/pricing-method.schema'
import { PricingMethodConditionTypeOptions } from '@/utils/select-options'
import { conditionsAlias, getConditionOptions } from '@/utils/pricing/helpers'
import { TPricingConditionData } from '@/utils/pricing/methods'
import { TPartnerSimplifiedDTO } from '@/utils/schemas/partner.schema'
import NumberInput from '../Inputs/NumberInput'
import MultipleSelectInput from '../Inputs/MultipleSelectInput'

type ConditionMenuProps = {
  resultHolder: TPricingMethodItemResultItem
  setResultHolder: React.Dispatch<React.SetStateAction<TPricingMethodItemResultItem>>
  partners: TPartnerSimplifiedDTO[] | undefined
}
function ConditionMenu({ resultHolder, setResultHolder, partners }: ConditionMenuProps) {
  return (
    <div className="flex w-full flex-col">
      <div className="my-2 flex flex-wrap items-center gap-2">
        {PricingMethodConditionTypeOptions.map((va, index) => (
          <button
            key={va.id}
            onClick={() =>
              setResultHolder((prev) => ({
                ...prev,
                condicao: {
                  ...prev.condicao,
                  tipo: va.value,
                  variavel: undefined,
                  igual: undefined,
                  maiorQue: undefined,
                  menorQue: undefined,
                  entre: undefined,
                  inclui: undefined,
                },
              }))
            }
            className={`grow ${
              va.value == resultHolder.condicao.tipo ? 'bg-blue-700  text-white' : 'text-blue-700 '
            } rounded border border-blue-700  p-1 text-xs font-medium  duration-300 ease-in-out hover:bg-blue-700  hover:text-white`}
          >
            {va.label}
          </button>
        ))}
      </div>
      <h1 className="w-full text-start text-xs font-black text-blue-500">VARIÁVEL</h1>
      <div className="my-2 flex flex-wrap items-center gap-2">
        {!!resultHolder.condicao.tipo
          ? conditionsAlias
              .filter((c) => c.types.includes(resultHolder.condicao.tipo as TPricingMethodConditionType))
              .map((va, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setResultHolder((prev) => ({
                      ...prev,
                      condicao: {
                        ...prev.condicao,
                        variavel: va.value,
                        igual: undefined,
                        maiorQue: undefined,
                        menorQue: undefined,
                        entre: undefined,
                        inclui: undefined,
                      },
                    }))
                  }
                  className={`grow ${
                    va.value == resultHolder.condicao.variavel ? 'bg-gray-700  text-white' : 'text-gray-700 '
                  } rounded border border-gray-700  p-1 text-xs font-medium  duration-300 ease-in-out hover:bg-gray-700  hover:text-white`}
                >
                  {va.label}
                </button>
              ))
          : null}
      </div>
      {resultHolder.condicao.tipo == 'IGUAL_TEXTO' ? (
        <SelectInput
          label="IGUAL A:"
          value={resultHolder.condicao.igual}
          // options={options[resultHolder.condicao.variavel as keyof typeof options]?.map((op, index) => ({ id: index + 1, label: op, value: op })) || []}
          options={getConditionOptions({ variable: resultHolder.condicao.variavel as keyof TPricingConditionData, additional: { partners: partners || [] } })}
          handleChange={(value) => setResultHolder((prev) => ({ ...prev, condicao: { ...prev.condicao, igual: value } }))}
          selectedItemLabel="NÃO DEFINIDO"
          onReset={() => setResultHolder((prev) => ({ ...prev, condicao: { ...prev.condicao, igual: null } }))}
          width="100%"
        />
      ) : null}
      {resultHolder.condicao.tipo == 'IGUAL_NÚMERICO' ? (
        <NumberInput
          label="IGUAL A:"
          placeholder="Preencha o valor para comparação."
          value={resultHolder.condicao.igual != null && resultHolder.condicao.igual != undefined ? Number(resultHolder.condicao.igual) : null}
          handleChange={(value) => setResultHolder((prev) => ({ ...prev, condicao: { ...prev.condicao, igual: value.toString() } }))}
          width="100%"
        />
      ) : null}
      {resultHolder.condicao.tipo == 'MAIOR_QUE_NÚMERICO' ? (
        <NumberInput
          label="MAIOR QUE:"
          placeholder="Preencha o valor para comparação."
          value={resultHolder.condicao.maiorQue != null && resultHolder.condicao.maiorQue != undefined ? Number(resultHolder.condicao.maiorQue) : null}
          handleChange={(value) => setResultHolder((prev) => ({ ...prev, condicao: { ...prev.condicao, maiorQue: value } }))}
          width="100%"
        />
      ) : null}
      {resultHolder.condicao.tipo == 'MENOR_QUE_NÚMERICO' ? (
        <NumberInput
          label="MENOR QUE:"
          placeholder="Preencha o valor para comparação."
          value={resultHolder.condicao.menorQue != null && resultHolder.condicao.menorQue != undefined ? Number(resultHolder.condicao.menorQue) : null}
          handleChange={(value) => setResultHolder((prev) => ({ ...prev, condicao: { ...prev.condicao, menorQue: value } }))}
          width="100%"
        />
      ) : null}
      {resultHolder.condicao.tipo == 'INTERVALO_NÚMERICO' ? (
        <div className="flex w-full flex-col gap-2 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <NumberInput
              label="MAIOR QUE:"
              placeholder="Preencha o valor mínimo do intervalo."
              value={
                resultHolder.condicao.entre?.minimo != null && resultHolder.condicao.entre?.minimo != undefined
                  ? Number(resultHolder.condicao.entre?.minimo)
                  : null
              }
              handleChange={(value) =>
                setResultHolder((prev) => ({
                  ...prev,
                  condicao: { ...prev.condicao, entre: prev.condicao.entre ? { ...prev.condicao.entre, minimo: value } : { minimo: value, maximo: 0 } },
                }))
              }
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <NumberInput
              label="MENOR QUE:"
              placeholder="Preencha o valor máximo do intervalo."
              value={
                resultHolder.condicao.entre?.maximo != null && resultHolder.condicao.entre?.maximo != undefined
                  ? Number(resultHolder.condicao.entre?.maximo)
                  : null
              }
              handleChange={(value) =>
                setResultHolder((prev) => ({
                  ...prev,
                  condicao: { ...prev.condicao, entre: prev.condicao.entre ? { ...prev.condicao.entre, maximo: value } : { minimo: 0, maximo: value } },
                }))
              }
              width="100%"
            />
          </div>
        </div>
      ) : null}
      {resultHolder.condicao.tipo == 'INCLUI_LISTA' ? (
        <MultipleSelectInput
          label="INCLUSO EM:"
          selected={resultHolder.condicao.inclui || null}
          options={getConditionOptions({ variable: resultHolder.condicao.variavel as keyof TPricingConditionData, additional: { partners: partners || [] } })}
          handleChange={(value) => setResultHolder((prev) => ({ ...prev, condicao: { ...prev.condicao, inclui: value as string[] } }))}
          onReset={() => setResultHolder((prev) => ({ ...prev, condicao: { ...prev.condicao, inclui: [] } }))}
          selectedItemLabel="NÃO DEFINIDO"
          width="100%"
        />
      ) : null}
    </div>
  )
}

export default ConditionMenu
