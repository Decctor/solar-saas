import TextareaInput from '@/components/Inputs/TextareaInput'
import Avatar from '@/components/utils/Avatar'
import { formatDateAsLocale, formatNameAsInitials } from '@/lib/methods/formatting'
import { TProject } from '@/utils/schemas/project.schema'
import { ProjectObservationTopics } from '@/utils/select-options'
import { Session } from 'next-auth'
import React, { useState } from 'react'
import { BsCalendarPlus } from 'react-icons/bs'
import { MdDelete } from 'react-icons/md'

type ProjectObservationsProps = {
  infoHolder: TProject
  setInfoHolder: React.Dispatch<React.SetStateAction<TProject>>
  session: Session
}
function ProjectObservations({ infoHolder, setInfoHolder, session }: ProjectObservationsProps) {
  const [observationHolder, setObservationHolder] = useState<TProject['observacoes'][number]>({
    assunto: 'SERVIÇOS',
    descricao: '',
    autor: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },
    data: new Date().toISOString(),
  })

  function addObservation(info: TProject['observacoes'][number]) {
    const currentObs = [...infoHolder.observacoes]
    currentObs.push(info)
    setInfoHolder((prev) => ({ ...prev, observacoes: currentObs }))
    setObservationHolder({
      assunto: 'SERVIÇOS',
      descricao: '',
      autor: {
        id: session.user.id,
        nome: session.user.nome,
        avatar_url: session.user.avatar_url,
      },
      data: new Date().toISOString(),
    })
  }
  function removeObservation(index: number) {
    const currentObs = [...infoHolder.observacoes]
    currentObs.splice(index, 1)
    setInfoHolder((prev) => ({ ...prev, observacoes: currentObs }))
  }
  return (
    <div className="flex w-full flex-col gap-1">
      <h1 className="w-full rounded-md bg-blue-500 p-1 text-center text-sm font-bold text-white">OBSERVAÇÕES DO PROJETO</h1>
      <p className="my-1 w-full text-center text-sm font-light tracking-tighter text-gray-700">
        Se houver alguma informação relevante em relação ao serviços a serem prestado, a detalhes dos produtos, da negociação, da suprimentação
        (compra/entrega), da execução do projeto, etc, escolha o tópico aplicavél e preencha a observação e clique em ADICIONAR.
      </p>
      <div className="my-1 flex w-full items-center justify-center gap-4 px-2">
        {ProjectObservationTopics.map((topic, index) => (
          <button
            key={index}
            onClick={() => setObservationHolder((prev) => ({ ...prev, assunto: topic }))}
            className={`rounded-lg ${
              observationHolder.assunto == topic ? 'bg-blue-500 text-white' : 'bg-transparent text-blue-500'
            } border border-blue-500 px-2 py-1 text-xs font-bold`}
          >
            {topic}
          </button>
        ))}
      </div>
      <TextareaInput
        label="DESCRIÇÃO DA OBSERVAÇÃO"
        placeholder="Preencha aqui informações relevantes, detalhes, lembretes, etc, sobre o assunto em questão..."
        value={observationHolder.descricao}
        handleChange={(value) => setObservationHolder((prev) => ({ ...prev, descricao: value }))}
      />
      <div className="mt-1 flex w-full items-center justify-end">
        <button
          onClick={() => addObservation(observationHolder)}
          className="rounded bg-black px-4 py-1 text-sm font-medium text-white duration-300 ease-in-out hover:bg-gray-700"
        >
          ADICIONAR
        </button>
      </div>
      <h1 className="text-[0.65rem] font-bold leading-none tracking-tight text-gray-500 lg:text-xs">LISTA DE OBSERVAÇÕES</h1>
      {infoHolder.observacoes.length > 0 ? (
        infoHolder.observacoes.map((obs, index) => (
          <div key={index} className="flex w-full flex-col rounded-md border border-gray-500">
            <div className="flex min-h-[25px] w-full flex-col items-start justify-between gap-1 lg:flex-row">
              <div className="flex w-full items-center justify-center rounded-br-md rounded-tl-md bg-cyan-700 lg:w-[40%]">
                <p className="w-full text-center text-xs font-medium text-white">{obs.assunto}</p>
              </div>
              <div className="flex grow items-center justify-end gap-2 p-2">
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1`}>
                    <BsCalendarPlus />
                    <p className="text-[0.6rem] font-medium">{formatDateAsLocale(obs.data)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Avatar fallback={formatNameAsInitials(obs.autor.nome)} url={obs.autor.avatar_url || undefined} height={20} width={20} />
                    <p className="text-[0.6rem] font-medium">{obs.autor.nome}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeObservation(index)}
                  type="button"
                  className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
                >
                  <MdDelete style={{ color: 'red' }} size={10} />
                </button>
              </div>
            </div>
            <h1 className="w-full p-2 text-center text-xs font-medium tracking-tight text-gray-500">{obs.descricao}</h1>
          </div>
        ))
      ) : (
        <p className="w-full text-center text-sm font-medium tracking-tight text-gray-500">Nenhuma observação adicionada ao projeto.</p>
      )}
    </div>
  )
}

export default ProjectObservations
