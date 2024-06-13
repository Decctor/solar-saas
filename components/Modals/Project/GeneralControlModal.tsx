import { useProjectById } from '@/utils/queries/project'
import { TChangesControl, TProjectDTOWithClient } from '@/utils/schemas/project.schema'
import { Session } from 'next-auth'
import React, { useEffect, useState } from 'react'
import { VscChromeClose } from 'react-icons/vsc'
import ClientBlock from './Blocks/ClientBlock'
import LoadingComponent from '@/components/utils/LoadingComponent'
import ErrorComponent from '@/components/utils/ErrorComponent'
import GeneralInformationBlock from './Blocks/GeneralInformationBlock'

type GeneralControlModalProps = {
  projectId: string
  session: Session
  closeModal: () => void
}
function GeneralControlModal({ projectId, session, closeModal }: GeneralControlModalProps) {
  const userHasClientEditPermission = session.user.permissoes.clientes.editar
  const { data: project, isLoading, isError, isSuccess } = useProjectById({ id: projectId })
  const [infoHolder, setInfoHolder] = useState<TProjectDTOWithClient>({
    _id: '',
    indexador: 0,
    nome: '',
    idParceiro: '',
    identificador: '',
    tipo: {
      id: '',
      titulo: '',
    },
    venda: {
      tipo: 'ÚNICA',
    },
    responsaveis: [],
    oportunidade: {
      id: '',
      nome: '',
    },
    proposta: {
      id: '',
      nome: '',
    },
    cliente: {
      id: '',
      nome: '',
    },
    clienteDados: {
      _id: '',
      nome: '',
      idParceiro: '',
      cpfCnpj: '',
      telefonePrimario: '',
      telefoneSecundario: null,
      email: '',
      cep: '',
      uf: '',
      cidade: '',
      bairro: '',
      endereco: '',
      numeroOuIdentificador: '',
      complemento: '',
      dataNascimento: null,
      profissao: null,
      estadoCivil: null,
      canalAquisicao: '',
      idMarketing: null,
      indicador: {
        nome: '',
        contato: '',
      },
      autor: {
        id: '',
        nome: '',
        avatar_url: null,
      },
      dataInsercao: new Date().toISOString(),
    },
    observacoes: [],
    contatos: {
      email: '',
      nomePrimario: '',
      telefonePrimario: '',
      nomeSecundario: '',
      telefoneSecundario: '',
      observacoes: '',
    },
    acessos: [],
    localizacao: {
      cep: '',
      uf: '',
      cidade: '',
      bairro: '',
      endereco: '',
      numeroOuIdentificador: '',
      distancia: 0,
      complemento: '',
      latitude: null,
      longitude: null,
    },
    segmento: 'RESIDENCIAL',
    contrato: {
      status: 'SOLICITADO',
      dataSolicitacao: new Date().toISOString(),
      dataLiberacao: null,
      dataAssinatura: null,
      formaAssinatura: 'FÍSICA',
    },
    pagamento: {
      pagador: {
        nome: '',
        telefone: '',
        email: '',
        cpfCnpj: '',
      },
      metodo: {
        id: '',
        nome: '',
        descricao: '',
        fracionamento: [],
      },
      credito: {},
      observacoes: '',
    },
    faturamento: {
      observacoes: '',
      dataEfetivacao: null,
    },
    liberacoes: {},
    finalizacoes: {},
    produtos: [],
    servicos: [],
    valor: 0,
    potenciaPico: 0,
    aprovacao: {},
    autor: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },

    dataInsercao: new Date().toISOString(),
  })
  const [changes, setChanges] = useState<TChangesControl>({
    project: {},
    client: {},
  })
  useEffect(() => {
    if (project) setInfoHolder(project)
  }, [project])
  return (
    <div id="project-general-control" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <div className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:w-[70%]">
        <div className="flex h-full flex-col">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <h3 className="text-xl font-bold text-[#353432] dark:text-white ">CONTROLE GERAL DO PROJETO</h3>
            <button
              onClick={closeModal}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
          {isLoading ? <LoadingComponent /> : null}
          {isError ? <ErrorComponent msg="Houve um erro ao buscar informações do projeto." /> : null}
          {isSuccess ? (
            <div className="flex h-full flex-col gap-y-2 overflow-y-auto overscroll-y-auto p-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
              <GeneralInformationBlock session={session} infoHolder={infoHolder} setInfoHolder={setInfoHolder} changes={changes} setChanges={setChanges} />
              <ClientBlock
                infoHolder={infoHolder}
                setInfoHolder={setInfoHolder}
                changes={changes}
                setChanges={setChanges}
                userHasClientEditPermission={userHasClientEditPermission}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default GeneralControlModal
