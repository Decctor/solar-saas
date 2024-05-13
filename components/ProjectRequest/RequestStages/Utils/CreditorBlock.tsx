import SelectInput from '@/components/Inputs/SelectInput'
import TextareaInput from '@/components/Inputs/TextareaInput'
import TextInput from '@/components/Inputs/TextInput'
import { formatToPhone } from '@/utils/methods'
import { useCreditors } from '@/utils/queries/utils'
import { TProject } from '@/utils/schemas/project.schema'
import React from 'react'

type CreditorBlockProps = {
  infoHolder: TProject
  setInfoHolder: React.Dispatch<React.SetStateAction<TProject>>
}
function CreditorBlock({ infoHolder, setInfoHolder }: CreditorBlockProps) {
  const { data: creditors } = useCreditors()
  return (
    <div className="flex w-full flex-col gap-2 rounded-md border border-blue-800">
      <h1 className="w-full rounded-tl-md rounded-tr-md bg-blue-500 p-1 text-center text-sm font-bold text-white">CRÉDITO</h1>
      <div className="flex w-full flex-col gap-2 p-2">
        <div className="my-1 flex w-full flex-col">
          <p className="w-full text-center text-sm font-light tracking-tighter text-gray-700">
            Para financiamentos, é necessário informações relacionadas ao credor e ao responsável/gerente em questão.
          </p>
        </div>
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-1/3">
            <SelectInput
              label="CREDOR"
              selectedItemLabel="NÃO DEFINIDO"
              options={creditors?.map((c) => ({ id: c._id, value: c.valor, label: c.valor })) || []}
              value={infoHolder.pagamento.credito.credor || null}
              handleChange={(value) =>
                setInfoHolder((prev) => ({
                  ...prev,
                  pagamento: { ...prev.pagamento, credito: { ...prev.pagamento.credito, credor: value } },
                }))
              }
              onReset={() => {
                setInfoHolder((prev) => ({
                  ...prev,
                  pagamento: { ...prev.pagamento, credito: { ...prev.pagamento.credito, credor: null } },
                }))
              }}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/3">
            <TextInput
              label="NOME DO GERENTE/RESPONSÁVEL"
              value={infoHolder.pagamento.credito.nomeResponsavel || ''}
              placeholder="Preencha aqui o nome do responsável/gerente primário."
              handleChange={(value) =>
                setInfoHolder((prev) => ({ ...prev, pagamento: { ...prev.pagamento, credito: { ...prev.pagamento.credito, nomeResponsavel: value } } }))
              }
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/3">
            <TextInput
              label="TELEFONE DO GERENTE/RESPONSÁVEL"
              value={infoHolder.pagamento.credito.nomeResponsavel || ''}
              placeholder="Preencha aqui o telefone do responsável/gerente primário."
              handleChange={(value) =>
                setInfoHolder((prev) => ({
                  ...prev,
                  pagamento: { ...prev.pagamento, credito: { ...prev.pagamento.credito, telefoneResponsavel: formatToPhone(value) } },
                }))
              }
              width="100%"
            />
          </div>
        </div>
        <TextareaInput
          label="OBSERVAÇÕES DO FINANCIAMENTO"
          placeholder="Preencha aqui informações relevantes a cerca do financiamento..."
          value={infoHolder.pagamento.credito.observacoes || ''}
          handleChange={(value) =>
            setInfoHolder((prev) => ({
              ...prev,
              pagamento: { ...prev.pagamento, credito: { ...prev.pagamento.credito, observacoes: value } },
            }))
          }
        />
      </div>
    </div>
  )
}

export default CreditorBlock
