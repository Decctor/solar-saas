import { TProjectType } from '@/utils/schemas/project-types.schema'
import React, { useState } from 'react'
import TextInput from '../Inputs/TextInput'
import TextareaInput from '../Inputs/TextareaInput'
import CheckboxInput from '../Inputs/CheckboxInput'
import SelectInput from '../Inputs/SelectInput'
import { conditionsAlias, getConditionOptions, TDocumentationConditionData } from '@/utils/project-documentation/helpers'

function DocumentationInformationBlock() {
  const [newDocumentationHolder, setNewDocumentationHolder] = useState<TProjectType['documentacao'][number]>({
    obrigatorio: false,
    titulo: '',
    descricao: '',
    multiplo: false,
    condicao: {
      aplicavel: false,
      variavel: null,
      igual: null,
    },
  })
  return (
    <div className="flex w-full flex-col gap-y-2">
      <h1 className="w-full bg-gray-700  p-1 text-center font-medium text-white">DOCUMENTAÇÃO</h1>
      <TextInput
        label="TÍTULO DO DOCUMENTO"
        value={newDocumentationHolder.titulo}
        placeholder="Preencha o título a ser dado ao campo de anexo..."
        handleChange={(value) => setNewDocumentationHolder((prev) => ({ ...prev, titulo: value }))}
        width="100%"
      />
      <TextareaInput
        label="DESCRIÇÃO DO DOCUMENTO"
        value={newDocumentationHolder.descricao}
        placeholder="Preencha aqui uma descrição para a documentação em questão..."
        handleChange={(value) => setNewDocumentationHolder((prev) => ({ ...prev, descricao: value }))}
      />
      <div className="flex w-full items-center gap-2">
        <div className="flex w-full items-center justify-center lg:w-1/2">
          <div className="w-fit">
            <CheckboxInput
              labelFalse="OBRIGATÓRIO"
              labelTrue="OBRIGATÓRIO"
              checked={newDocumentationHolder.obrigatorio}
              handleChange={(value) => setNewDocumentationHolder((prev) => ({ ...prev, obrigatorio: value }))}
              justify="justify-center"
            />
          </div>
        </div>
        <div className="flex w-full items-center justify-center lg:w-1/2">
          <div className="w-fit">
            <CheckboxInput
              labelFalse="PERMITIR MÚLTIPLOS ARQUIVOS"
              labelTrue="PERMITIR MÚLTIPLOS ARQUIVOS"
              checked={newDocumentationHolder.multiplo}
              handleChange={(value) => setNewDocumentationHolder((prev) => ({ ...prev, multiplo: value }))}
              justify="justify-center"
            />
          </div>
        </div>
      </div>
      <h1 className="mt-4 w-full text-center font-Inter text-sm font-black leading-none tracking-tight">CONDIÇÃO DE COBRANÇA</h1>
      <div className="flex w-full items-center justify-center">
        <div className="w-fit">
          <CheckboxInput
            labelFalse="APLICAR CONDIÇÃO"
            labelTrue="APLICAR CONDIÇÃO"
            checked={newDocumentationHolder.condicao.aplicavel}
            handleChange={(value) => setNewDocumentationHolder((prev) => ({ ...prev, condicao: { ...prev.condicao, aplicavel: value } }))}
            justify="justify-center"
          />
        </div>
      </div>
      {newDocumentationHolder.condicao.aplicavel ? (
        <div className="flex w-full flex-col">
          <div className="my-2 flex flex-wrap items-center gap-2">
            {conditionsAlias.map((va, index) => (
              <button
                key={index}
                onClick={() => setNewDocumentationHolder((prev) => ({ ...prev, condicao: { ...prev.condicao, variavel: va.value, igual: null } }))}
                className={`grow ${
                  va.value == newDocumentationHolder.condicao.variavel ? 'bg-gray-700  text-white' : 'text-gray-700 '
                } rounded border border-gray-700  p-1 text-xs font-medium  duration-300 ease-in-out hover:bg-gray-700  hover:text-white`}
              >
                {va.label}
              </button>
            ))}
          </div>
          <SelectInput
            label="IGUAL A:"
            value={newDocumentationHolder.condicao.igual}
            options={getConditionOptions({
              variable: newDocumentationHolder.condicao.variavel as keyof TDocumentationConditionData,
            })}
            handleChange={(value) => setNewDocumentationHolder((prev) => ({ ...prev, condicao: { ...prev.condicao, igual: value } }))}
            selectedItemLabel="NÃO DEFINIDO"
            onReset={() => setNewDocumentationHolder((prev) => ({ ...prev, condicao: { ...prev.condicao, igual: null } }))}
            width="100%"
          />
        </div>
      ) : null}
    </div>
  )
}

export default DocumentationInformationBlock
