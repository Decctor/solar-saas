import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import { AiFillDelete, AiFillEdit, AiOutlineSearch } from 'react-icons/ai'

import { IoMdAdd } from 'react-icons/io'
import { FaBox, FaSave } from 'react-icons/fa'
import { ImPriceTag } from 'react-icons/im'
import { TTechnicalAnalysisDTO } from '@/utils/schemas/technical-analysis.schema'
import SelectInput from '@/components/Inputs/SelectInput'
import { AdditionalCostsCategories, Units } from '@/utils/select-options'
import TextInput from '@/components/Inputs/TextInput'
import NumberInput from '@/components/Inputs/NumberInput'
import { formatToMoney } from '@/lib/methods/formatting'

type AdditionalCostsBlockProps = {
  infoHolder: TTechnicalAnalysisDTO
  setInfoHolder: React.Dispatch<React.SetStateAction<TTechnicalAnalysisDTO>>
  changes: object
  setChanges: React.Dispatch<React.SetStateAction<object>>
}
function AdditionalCostsBlock({ infoHolder, setInfoHolder, changes, setChanges }: AdditionalCostsBlockProps) {
  // Costs holder
  const [activeCostIndex, setActiveCostIndex] = useState<number | undefined>(undefined)
  const [costHolder, setCostHolder] = useState<TTechnicalAnalysisDTO['custos'][number]>({
    categoria: 'INSTALAÇÃO',
    descricao: '',
    grandeza: 'UN',
    qtde: 0,
    custoUnitario: null,
  })
  function addCost() {
    if (!costHolder.categoria) {
      toast.error('Preencha uma categoria de custo.')
      return
    }
    if (costHolder.descricao.trim().length < 3) {
      toast.error('Preencha um nome/descrição válida ao custo.')
      return
    }
    if (!costHolder.grandeza) {
      toast.error('Preencha a grandeza do custo.')
      return
    }
    if (costHolder.qtde <= 0) {
      toast.error('Preencha uma quantidade válida para o item de custo.')
      return
    }
    if (!costHolder.custoUnitario || costHolder.custoUnitario <= 0) {
      toast.error('Preencha o custo unitário do item de custo.')
      return
    }
    const costsList = infoHolder.custos ? [...infoHolder.custos] : []
    const newCost = {
      categoria: costHolder.categoria,
      descricao: costHolder.descricao,
      grandeza: costHolder.grandeza,
      qtde: costHolder.qtde,
      custoUnitario: costHolder.custoUnitario,
      total: costHolder.qtde * costHolder.custoUnitario,
    }
    costsList.push(newCost)
    setInfoHolder((prev) => ({ ...prev, custos: costsList }))
    setChanges((prev) => ({ ...prev, custos: costsList }))
    setCostHolder({
      categoria: 'INSTALAÇÃO',
      descricao: '',
      grandeza: 'UN',
      qtde: 0,
      custoUnitario: null,
    })
    toast.success('Item adicionado aos custos com sucesso !')
  }
  function removeCost(index: number) {
    const costsList = [...infoHolder.custos]
    costsList.splice(index, 1)
    setInfoHolder((prev) => ({ ...prev, custos: costsList }))
    setChanges((prev) => ({ ...prev, custos: costsList }))

    toast.success('Custo removido!')
  }
  function saveChanges({ index }: { index: number }) {
    const costsList = [...infoHolder.custos]
    const cost = {
      //
      categoria: costHolder.categoria,
      descricao: costHolder.descricao,
      grandeza: costHolder.grandeza,
      qtde: costHolder.qtde,
      custoUnitario: costHolder.custoUnitario,
      total: costHolder.qtde * (costHolder.custoUnitario || 0),
    }
    costsList[index] = cost
    setInfoHolder((prev) => ({ ...prev, custos: costsList }))
    setChanges((prev) => ({ ...prev, custos: costsList }))
    setCostHolder({
      categoria: 'INSTALAÇÃO',
      descricao: '',
      grandeza: 'UN',
      qtde: 0,
      custoUnitario: null,
    })
    toast.success('Custo atualizado!')
    setActiveCostIndex(undefined)
  }
  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-800 p-2">
        <h1 className="font-bold text-white">CUSTOS ADICIONAIS</h1>
      </div>
      <div className="mt-2 flex w-full flex-col gap-2">
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-1/3">
            <SelectInput
              label={'CATEGORIA DO CUSTO'}
              selectedItemLabel={'NÃO DEFINIDO'}
              options={AdditionalCostsCategories}
              value={costHolder.categoria}
              handleChange={(value) => setCostHolder((prev) => ({ ...prev, categoria: value }))}
              onReset={() => setCostHolder((prev) => ({ ...prev, categoria: 'INSTALAÇÃO' }))}
              width={'100%'}
            />
          </div>
          <div className="w-full lg:w-1/3">
            <TextInput
              label={'DESCRIÇÃO DO CUSTO'}
              placeholder={'Preencha o nome ou descreva o custo...'}
              value={costHolder.descricao}
              handleChange={(value) => setCostHolder((prev) => ({ ...prev, descricao: value }))}
              width={'100%'}
            />
          </div>
          <div className="w-full lg:w-1/3">
            <SelectInput
              label={'GRANDEZA DO CUSTO'}
              selectedItemLabel={'NÃO DEFINIDO'}
              options={Units}
              value={costHolder.grandeza}
              handleChange={(value) => setCostHolder((prev) => ({ ...prev, grandeza: value }))}
              onReset={() => setCostHolder((prev) => ({ ...prev, grandeza: 'UN' }))}
              width={'100%'}
            />
          </div>
        </div>
        <div className="mt-2 flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-1/3">
            <NumberInput
              label={'QUANTIDADE'}
              placeholder={'Preencha a quantidade o item de custo...'}
              value={costHolder.qtde}
              handleChange={(value) => setCostHolder((prev) => ({ ...prev, qtde: value }))}
              width={'100%'}
            />
          </div>
          <div className="w-full lg:w-1/3">
            <NumberInput
              label={'PREÇO UNITÁRIO'}
              placeholder={'Preencha a preço unitário do item de custo...'}
              value={costHolder.custoUnitario || null}
              handleChange={(value) => setCostHolder((prev) => ({ ...prev, custoUnitario: value }))}
              width={'100%'}
            />
          </div>
          <div className="w-full lg:w-1/3">
            <NumberInput
              label={'TOTAL'}
              editable={false}
              placeholder={'Valor total do item de custo...'}
              value={costHolder.qtde && costHolder.custoUnitario ? costHolder.qtde * costHolder.custoUnitario : null}
              handleChange={(value) => console.log('NO')}
              width={'100%'}
            />
          </div>
        </div>
        <div className="mt-4 flex w-full items-center justify-end">
          {!!activeCostIndex && activeCostIndex >= 0 ? (
            <button
              onClick={() => saveChanges({ index: activeCostIndex })}
              className="flex w-fit items-center gap-2 rounded border border-blue-500 p-1 text-blue-500 duration-300 ease-in-out hover:bg-blue-500 hover:text-white"
            >
              <p className="font-bold">SALVAR</p>
              <FaSave />
            </button>
          ) : (
            <button
              onClick={() => addCost()}
              className="flex w-fit items-center gap-2 rounded border border-green-500 p-1 text-green-500 duration-300 ease-in-out hover:bg-green-500 hover:text-white"
            >
              <p className="font-bold">ADICIONAR ITEM</p>
              <IoMdAdd />
            </button>
          )}
        </div>
        {infoHolder.custos?.length > 0 ? (
          <div className="mt-2 flex w-full flex-col gap-2">
            {infoHolder.custos.map((cost, index) => (
              <div key={index} className="flex w-full flex-col rounded-md border border-gray-300 p-3">
                <div className="flex w-full justify-between">
                  <h1 className="text-start font-bold leading-none tracking-tight">{cost.categoria}</h1>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const holder = {
                          categoria: cost.categoria,
                          descricao: cost.descricao,
                          grandeza: cost.grandeza,
                          qtde: cost.qtde,
                          custoUnitario: cost.custoUnitario,
                        }
                        setActiveCostIndex(index)
                        setCostHolder(holder)
                      }}
                      className="text-red-400 duration-300 ease-in-out hover:text-red-500"
                    >
                      <AiFillEdit />
                    </button>
                    <button onClick={() => removeCost(index)} className="text-red-400 duration-300 ease-in-out hover:text-red-500">
                      <AiFillDelete />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{cost.descricao}</p>
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <FaBox color="#fead41" />
                      <p className="text-sm font-medium text-gray-500">
                        {cost.qtde} {cost.grandeza}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-green-500">
                      <ImPriceTag color="rgb(34,197,94)" />
                      <p className="text-sm font-medium text-gray-500">
                        {cost.custoUnitario ? formatToMoney(cost.custoUnitario) : 'R$ 0,00'} / {cost.grandeza}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* <MdAttachMoney /> */}
                    <p className="text-lg font-black">{formatToMoney(cost.total || 0)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default AdditionalCostsBlock
