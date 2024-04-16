import React from 'react'

import CheckboxInput from '../Inputs/CheckboxInput'
import { TUser, TUserDTO, TUserEntity } from '@/utils/schemas/user.schema'
import ScopeSelection from './ScopeSelection'
import { Session } from 'next-auth'

type PermissionsPannelProps = {
  userInfo: TUser
  setUserInfo: React.Dispatch<React.SetStateAction<TUser>>
  users?: TUserDTO[]
  session: Session
}
function PermissionsPannel({ userInfo, setUserInfo, users, session }: PermissionsPannelProps) {
  return (
    <>
      <h1 className="w-full pt-4 text-center text-sm font-medium">PERMISSÕES DO USUÁRIO</h1>
      {/**USUÁRIOS */}

      <h1 className="w-full text-start text-sm text-gray-500">USUÁRIOS</h1>
      <CheckboxInput
        labelFalse="APTO A CRIAR USUÁRIOS"
        labelTrue="APTO A CRIAR USUÁRIOS"
        checked={userInfo.permissoes.usuarios.criar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              usuarios: { ...prev.permissoes.usuarios, criar: value },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A EDITAR USUÁRIOS"
        labelTrue="APTO A EDITAR USUÁRIOS"
        checked={userInfo.permissoes.usuarios.editar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              usuarios: { ...prev.permissoes.usuarios, editar: value },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR TODOS OS USUÁRIOS"
        labelTrue="APTO A VISUALIZAR TODOS OS USUÁRIOS"
        checked={userInfo.permissoes.usuarios.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              usuarios: {
                ...prev.permissoes.usuarios,
                visualizar: value,
              },
            },
          }))
        }
      />
      {/**COMISSÕES */}
      <h1 className="w-full text-start text-sm text-gray-500">COMISSÕES</h1>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR COMISSÕES"
        labelTrue="APTO A VISUALIZAR COMISSÕES"
        checked={userInfo.permissoes.comissoes.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              comissoes: { ...prev.permissoes.comissoes, visualizar: value },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A EDITAR COMISSÕES"
        labelTrue="APTO A EDITAR COMISSÕES"
        checked={userInfo.permissoes.comissoes.editar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              comissoes: { ...prev.permissoes.comissoes, editar: value },
            },
          }))
        }
      />
      {/**KITS */}
      <h1 className="w-full text-start text-sm text-gray-500">KITS</h1>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR TODOS OS KITS"
        labelTrue="APTO A VISUALIZAR TODOS OS KITS"
        checked={userInfo.permissoes.kits.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              kits: { ...prev.permissoes.kits, visualizar: value },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A EDITAR KITS"
        labelTrue="APTO A EDITAR KITS"
        checked={userInfo.permissoes.kits.editar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              kits: { ...prev.permissoes.kits, editar: value },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A CRIAR KITS"
        labelTrue="APTO A CRIAR KITS"
        checked={userInfo.permissoes.kits.criar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              kits: { ...prev.permissoes.kits, criar: value },
            },
          }))
        }
      />
      {/**PRODUTOS */}
      <h1 className="w-full text-start text-sm text-gray-500">PRODUTOS</h1>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR TODOS OS PRODUTOS"
        labelTrue="APTO A VISUALIZAR TODOS OS PRODUTOS"
        checked={userInfo.permissoes.produtos.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              produtos: { ...prev.permissoes.produtos, visualizar: value },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A EDITAR PRODUTOS"
        labelTrue="APTO A EDITAR PRODUTOS"
        checked={userInfo.permissoes.produtos.editar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              produtos: { ...prev.permissoes.produtos, editar: value },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A CRIAR PRODUTOS"
        labelTrue="APTO A CRIAR PRODUTOS"
        checked={userInfo.permissoes.produtos.criar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              produtos: { ...prev.permissoes.produtos, criar: value },
            },
          }))
        }
      />
      {/**SERVIÇOS */}
      <h1 className="w-full text-start text-sm text-gray-500">SERVIÇOS</h1>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR TODOS OS SERVIÇOS"
        labelTrue="APTO A VISUALIZAR TODOS OS SERVIÇOS"
        checked={userInfo.permissoes.servicos.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              servicos: { ...prev.permissoes.servicos, visualizar: value },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A EDITAR SERVIÇOS"
        labelTrue="APTO A EDITAR SERVIÇOS"
        checked={userInfo.permissoes.servicos.editar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              servicos: { ...prev.permissoes.servicos, editar: value },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A CRIAR SERVIÇOS"
        labelTrue="APTO A CRIAR SERVIÇOS"
        checked={userInfo.permissoes.servicos.criar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              servicos: { ...prev.permissoes.servicos, criar: value },
            },
          }))
        }
      />
      {/**PLANOS */}
      <h1 className="w-full text-start text-sm text-gray-500">PLANOS</h1>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR TODOS OS PLANOS"
        labelTrue="APTO A VISUALIZAR TODOS OS PLANOS"
        checked={userInfo.permissoes.planos.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              planos: { ...prev.permissoes.planos, visualizar: value },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A EDITAR PLANOS"
        labelTrue="APTO A EDITAR PLANOS"
        checked={userInfo.permissoes.planos.editar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              planos: { ...prev.permissoes.planos, editar: value },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A CRIAR PLANOS"
        labelTrue="APTO A CRIAR PLANOS"
        checked={userInfo.permissoes.planos.criar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              planos: { ...prev.permissoes.planos, criar: value },
            },
          }))
        }
      />
      {/**CLIENTES */}
      <div className="flex w-full items-center justify-between">
        <h1 className="w-full text-start text-sm text-gray-500">CLIENTES</h1>
        <ScopeSelection
          users={users || []}
          userId={null}
          selected={userInfo.permissoes.clientes.escopo}
          handleScopeSelection={(selected) =>
            setUserInfo((prev) => ({
              ...prev,
              permissoes: { ...prev.permissoes, clientes: { ...prev.permissoes.clientes, escopo: selected } },
            }))
          }
        />
      </div>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR TODOS OS CLIENTES"
        labelTrue="APTO A VISUALIZAR TODOS OS CLIENTES"
        checked={userInfo.permissoes.clientes.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              clientes: {
                ...prev.permissoes.clientes,
                visualizar: value,
              },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A CRIAR CLIENTES"
        labelTrue="APTO A CRIAR CLIENTES"
        checked={userInfo.permissoes.clientes.criar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              clientes: { ...prev.permissoes.clientes, criar: value },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A EDITAR QUALQUER CLIENTE"
        labelTrue="APTO A EDITAR QUALQUER CLIENTE"
        checked={userInfo.permissoes.clientes.editar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              clientes: { ...prev.permissoes.clientes, editar: value },
            },
          }))
        }
      />
      {/**OPORTUNIDADES */}
      <div className="flex w-full items-center justify-between">
        <h1 className="w-full text-start text-sm text-gray-500">OPORTUNIDADES</h1>
        <ScopeSelection
          users={users || []}
          userId={null}
          selected={userInfo.permissoes.oportunidades.escopo}
          handleScopeSelection={(selected) =>
            setUserInfo((prev) => ({
              ...prev,
              permissoes: { ...prev.permissoes, oportunidades: { ...prev.permissoes.oportunidades, escopo: selected } },
            }))
          }
        />
      </div>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR OPORTUNIDADES"
        labelTrue="APTO A VISUALIZAR OPORTUNIDADES"
        checked={userInfo.permissoes.oportunidades.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              oportunidades: { ...prev.permissoes.oportunidades, visualizar: value },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A CRIAR OPORTUNIDADES"
        labelTrue="APTO A CRIAR OPORTUNIDADES"
        checked={userInfo.permissoes.oportunidades.criar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              oportunidades: { ...prev.permissoes.oportunidades, criar: value },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A EDITAR OPORTUNIDADES"
        labelTrue="APTO A EDITAR OPORTUNIDADES"
        checked={userInfo.permissoes.oportunidades.editar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              oportunidades: { ...prev.permissoes.oportunidades, editar: value },
            },
          }))
        }
      />
      {/**ANÁLISES TÉCNICAS */}
      <div className="flex w-full items-center justify-between">
        <h1 className="w-full text-start text-sm text-gray-500">ANÁLISES TÉCNICAS</h1>
        <ScopeSelection
          users={users || []}
          userId={null}
          selected={userInfo.permissoes.analisesTecnicas.escopo}
          handleScopeSelection={(selected) =>
            setUserInfo((prev) => ({
              ...prev,
              permissoes: { ...prev.permissoes, analisesTecnicas: { ...prev.permissoes.analisesTecnicas, escopo: selected } },
            }))
          }
        />
      </div>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR ANÁLISES TÉCNICAS"
        labelTrue="APTO A VISUALIZAR ANÁLISES TÉCNICAS"
        checked={userInfo.permissoes.analisesTecnicas.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              analisesTecnicas: { ...prev.permissoes.analisesTecnicas, visualizar: value },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A CRIAR ANÁLISES TÉCNICAS"
        labelTrue="APTO A CRIAR ANÁLISES TÉCNICAS"
        checked={userInfo.permissoes.analisesTecnicas.criar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              analisesTecnicas: { ...prev.permissoes.analisesTecnicas, criar: value },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A EDITAR ANÁLISES TÉCNICAS"
        labelTrue="APTO A EDITAR ANÁLISES TÉCNICAS"
        checked={userInfo.permissoes.analisesTecnicas.editar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              analisesTecnicas: { ...prev.permissoes.analisesTecnicas, editar: value },
            },
          }))
        }
      />
      {/**PROPOSTAS */}
      <div className="flex w-full items-center justify-between">
        <h1 className="w-full text-start text-sm text-gray-500">PROPOSTAS</h1>
        <ScopeSelection
          users={users || []}
          userId={null}
          selected={userInfo.permissoes.propostas.escopo}
          handleScopeSelection={(selected) =>
            setUserInfo((prev) => ({
              ...prev,
              permissoes: { ...prev.permissoes, propostas: { ...prev.permissoes.propostas, escopo: selected } },
            }))
          }
        />
      </div>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR PROPOSTAS"
        labelTrue="APTO A VISUALIZAR PROPOSTAS"
        checked={userInfo.permissoes.propostas.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              propostas: { ...prev.permissoes.propostas, visualizar: value },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A CRIAR PROPOSTAS"
        labelTrue="APTO A CRIAR PROPOSTAS"
        checked={userInfo.permissoes.propostas.criar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              propostas: { ...prev.permissoes.propostas, criar: value },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A EDITAR PROPOSTAS"
        labelTrue="APTO A EDITAR PROPOSTAS"
        checked={userInfo.permissoes.propostas.editar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              propostas: { ...prev.permissoes.propostas, editar: value },
            },
          }))
        }
      />
      {/**PREÇOS */}
      <h1 className="w-full text-start text-sm text-gray-500">PREÇOS</h1>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR DESCRITIVO DE PRECIFICAÇÃO"
        labelTrue="APTO A VISUALIZAR DESCRITIVO DE PRECIFICAÇÃO"
        checked={userInfo.permissoes.precos.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              precos: { ...prev.permissoes.precos, visualizar: value },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A EDITAR PRECIFICAÇÃO"
        labelTrue="APTO A EDITAR PRECIFICAÇÃO"
        checked={userInfo.permissoes.precos.editar}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              precos: { ...prev.permissoes.precos, editar: value },
            },
          }))
        }
      />
      {/**RESULTADOS */}
      <div className="flex w-full items-center justify-between">
        <h1 className="w-full text-start text-sm text-gray-500">RESULTADOS</h1>
        <ScopeSelection
          users={users || []}
          userId={null}
          selected={userInfo.permissoes.resultados.escopo}
          handleScopeSelection={(selected) =>
            setUserInfo((prev) => ({
              ...prev,
              permissoes: { ...prev.permissoes, resultados: { ...prev.permissoes.resultados, escopo: selected } },
            }))
          }
        />
      </div>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR RESULTADOS COMERCIAIS"
        labelTrue="APTO A VISUALIZAR RESULTADOS COMERCIAIS"
        checked={userInfo.permissoes.resultados.visualizarComercial}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              resultados: { ...prev.permissoes.resultados, visualizarComercial: value },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR RESULTADOS OPERACIONAIS"
        labelTrue="APTO A VISUALIZAR RESULTADOS OPERACIONAIS"
        checked={userInfo.permissoes.resultados.visualizarOperacional}
        justify="justify-start"
        handleChange={(value) =>
          setUserInfo((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              resultados: { ...prev.permissoes.resultados, visualizarOperacional: value },
            },
          }))
        }
      />
      <h1 className="w-full text-start text-sm text-gray-500">CONFIGURAÇÕES</h1>
      {session.user.permissoes.configuracoes.parceiro ? (
        <CheckboxInput
          labelFalse="APTO A CONFIGURAR PARCEIRO"
          labelTrue="APTO A CONFIGURAR PARCEIRO"
          checked={userInfo.permissoes.configuracoes.parceiro}
          justify="justify-start"
          handleChange={(value) =>
            setUserInfo((prev) => ({
              ...prev,
              permissoes: {
                ...prev.permissoes,
                configuracoes: { ...prev.permissoes.configuracoes, parceiro: value },
              },
            }))
          }
        />
      ) : null}
      {session.user.permissoes.configuracoes.precificacao ? (
        <CheckboxInput
          labelFalse="APTO A CONFIGURAR MÉTODOS DE PRECIFICAÇÃO"
          labelTrue="APTO A CONFIGURAR MÉTODOS DE PRECIFICAÇÃO"
          checked={userInfo.permissoes.configuracoes.precificacao}
          justify="justify-start"
          handleChange={(value) =>
            setUserInfo((prev) => ({
              ...prev,
              permissoes: {
                ...prev.permissoes,
                configuracoes: { ...prev.permissoes.configuracoes, precificacao: value },
              },
            }))
          }
        />
      ) : null}
      {session.user.permissoes.configuracoes.funis ? (
        <CheckboxInput
          labelFalse="APTO A CONFIGURAR FUNIS"
          labelTrue="APTO A CONFIGURAR FUNIS"
          checked={userInfo.permissoes.configuracoes.funis}
          justify="justify-start"
          handleChange={(value) =>
            setUserInfo((prev) => ({
              ...prev,
              permissoes: {
                ...prev.permissoes,
                configuracoes: { ...prev.permissoes.configuracoes, funis: value },
              },
            }))
          }
        />
      ) : null}
      {session.user.permissoes.configuracoes.metodosPagamento ? (
        <CheckboxInput
          labelFalse="APTO A CONFIGURAR MÉTODOS DE PAGAMENTO"
          labelTrue="APTO A CONFIGURAR MÉTODOS DE PAGAMENTO"
          checked={userInfo.permissoes.configuracoes.metodosPagamento}
          justify="justify-start"
          handleChange={(value) =>
            setUserInfo((prev) => ({
              ...prev,
              permissoes: {
                ...prev.permissoes,
                configuracoes: { ...prev.permissoes.configuracoes, metodosPagamento: value },
              },
            }))
          }
        />
      ) : null}
      {session.user.permissoes.configuracoes.tiposProjeto ? (
        <CheckboxInput
          labelFalse="APTO A CONFIGURAR TIPOS DE PROJETO"
          labelTrue="APTO A CONFIGURAR TIPOS DE PROJETO"
          checked={userInfo.permissoes.configuracoes.tiposProjeto}
          justify="justify-start"
          handleChange={(value) =>
            setUserInfo((prev) => ({
              ...prev,
              permissoes: {
                ...prev.permissoes,
                configuracoes: { ...prev.permissoes.configuracoes, tiposProjeto: value },
              },
            }))
          }
        />
      ) : null}
    </>
  )
}

export default PermissionsPannel
