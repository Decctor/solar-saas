import React, { useEffect, useState } from 'react'
import SelectInput from '../Inputs/SelectInput'
import TextInput from '../Inputs/TextInput'
import DateInput from '../Inputs/DateInput'
import { formatDate, formatToCPForCNPJ, useResponsibles } from '@/utils/methods'

import { AiOutlineCheck } from 'react-icons/ai'
import { useQueryClient } from '@tanstack/react-query'

import { customersAcquisitionChannels } from '@/utils/constants'

import { Session } from 'next-auth'
import { TOpportunityDTOWithClient } from '@/utils/schemas/opportunity.schema'
import { useMutationWithFeedback } from '@/utils/mutations/general-hook'
import { updateOpportunity } from '@/utils/mutations/opportunities'
import { updateClient } from '@/utils/mutations/clients'

import OpportunityResponsiblesBlock from './OpportunityResponsiblesBlock'
import { stateCities } from '@/utils/estados_cidades'
import { ElectricalInstallationGroups } from '@/utils/select-options'
type DetailsBlockType = {
  info: TOpportunityDTOWithClient
  session: Session
  opportunityId: string
}

function DetailsBlock({ info, session, opportunityId }: DetailsBlockType) {
  const queryClient = useQueryClient()
  const [infoHolder, setInfoHolder] = useState<TOpportunityDTOWithClient>({ ...info })
  const [newFunnelHolder, setNewFunnelHolder] = useState<{
    id: number | null
    etapaId: number | null
  }>({
    id: null,
    etapaId: null,
  })
  const { data: responsibles } = useResponsibles()

  const { mutate: handleUpdateOpportunity } = useMutationWithFeedback({
    mutationKey: ['update-opportunity', opportunityId],
    mutationFn: updateOpportunity,
    queryClient: queryClient,
    affectedQueryKey: ['opportunity-by-id', opportunityId],
  })
  const { mutate: handleUpdateClient } = useMutationWithFeedback({
    mutationKey: ['update-client', opportunityId],
    mutationFn: updateClient,
    queryClient: queryClient,
    affectedQueryKey: ['opportunity-by-id', opportunityId],
  })

  useEffect(() => {
    setInfoHolder(info)
  }, [info])
  console.log(info.responsaveis, infoHolder.responsaveis)
  return (
    <div className="flex w-full flex-col gap-6 lg:flex-row">
      <div className="flex w-full flex-col rounded-md border border-gray-200 bg-[#fff] p-3 shadow-lg">
        <div className="flex h-[40px] items-center justify-between border-b border-gray-200 pb-2">
          <h1 className="font-bold text-black">Detalhes</h1>
        </div>
        <div className="mt-3 flex w-full flex-col gap-2">
          <div className="flex w-full gap-2">
            <div className="grow">
              <TextInput
                label="NOME DA OPORTUNIDADE"
                value={infoHolder?.cliente && infoHolder?.nome ? infoHolder?.nome : ''}
                handleChange={(value) => {
                  if (infoHolder)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      nome: value,
                    }))
                }}
                placeholder="Preencha aqui o nome da oportunidade..."
                width="100%"
              />
            </div>
            <button
              disabled={infoHolder?.nome == info.nome}
              onClick={() =>
                // @ts-ignore
                handleUpdateOpportunity({ id: opportunityId, changes: { nome: infoHolder.nome } })
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: '18px',
                  color: infoHolder?.nome != info.nome ? 'rgb(34,197,94)' : 'rgb(156,163,175)',
                }}
              />
            </button>
          </div>
          <OpportunityResponsiblesBlock
            infoHolder={infoHolder}
            setInfoHolder={setInfoHolder}
            session={session}
            handleUpdateOpportunity={handleUpdateOpportunity}
          />
          <h1 className="w-full rounded-md bg-[#fead41] p-1 text-center text-sm font-medium text-white">DADOS DA LOCALIZAÇÃO</h1>
          <div className="flex w-full gap-2">
            <div className="flex grow items-center gap-1">
              <div className="w-1/3">
                <SelectInput
                  width={'100%'}
                  label={'UF'}
                  editable={true}
                  options={Object.keys(stateCities).map((state, index) => ({
                    id: index + 1,
                    label: state,
                    value: state,
                  }))}
                  value={infoHolder.localizacao?.uf}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, localizacao: { ...(prev.localizacao || {}), uf: value } }))}
                  selectedItemLabel="NÃO DEFINIDO"
                  onReset={() => {
                    setInfoHolder((prev) => ({ ...prev, localizacao: { ...(prev.localizacao || {}), uf: '' } }))
                  }}
                />
              </div>
              <div className="w-2/3">
                <SelectInput
                  width={'100%'}
                  label={'CIDADE'}
                  editable={true}
                  options={
                    infoHolder.localizacao?.uf
                      ? stateCities[infoHolder.localizacao?.uf as keyof typeof stateCities].map((city, index) => {
                          return {
                            id: index,
                            value: city,
                            label: city,
                          }
                        })
                      : null
                  }
                  value={infoHolder.localizacao?.cidade}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, localizacao: { ...(prev.localizacao || {}), cidade: value } }))}
                  selectedItemLabel="NÃO DEFINIDO"
                  onReset={() => {
                    setInfoHolder((prev) => ({ ...prev, localizacao: { ...(prev.localizacao || {}), cidade: '' } }))
                  }}
                />
              </div>
            </div>
            <button
              disabled={infoHolder?.localizacao.uf == info.localizacao.uf && infoHolder?.localizacao.cidade == info.localizacao.cidade}
              onClick={() =>
                // @ts-ignore
                handleUpdateOpportunity({
                  id: opportunityId,
                  changes: { 'localizacao.cidade': infoHolder.localizacao.cidade, 'localizacao.uf': infoHolder.localizacao.uf },
                })
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: '18px',
                  color:
                    infoHolder?.localizacao.uf != info.localizacao.uf || infoHolder?.localizacao.cidade != info.localizacao.cidade
                      ? 'rgb(34,197,94)'
                      : 'rgb(156,163,175)',
                }}
              />
            </button>
          </div>
          <div className="flex w-full gap-2">
            <div className="grow">
              <TextInput
                label="BAIRRO"
                value={infoHolder?.localizacao?.bairro || ''}
                handleChange={(value) => {
                  setInfoHolder((prev) => ({ ...prev, localizacao: { ...(prev.localizacao || {}), bairro: value } }))
                }}
                placeholder="Preencha aqui o bairro da localização de instalação."
                width="100%"
              />
            </div>
            <button
              disabled={infoHolder?.localizacao.bairro == info.localizacao.bairro}
              onClick={() =>
                // @ts-ignore
                handleUpdateOpportunity({
                  id: opportunityId,
                  changes: { 'localizacao.bairro': infoHolder.localizacao.bairro },
                })
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: '18px',
                  color: infoHolder?.localizacao.bairro != info.localizacao.bairro ? 'rgb(34,197,94)' : 'rgb(156,163,175)',
                }}
              />
            </button>
          </div>
          <div className="flex w-full gap-2">
            <div className="grow">
              <TextInput
                label="ENDEREÇO"
                value={infoHolder?.localizacao?.endereco || ''}
                handleChange={(value) => {
                  setInfoHolder((prev) => ({ ...prev, localizacao: { ...(prev.localizacao || {}), endereco: value } }))
                }}
                placeholder="Preencha aqui o endereco da localização de instalação."
                width="100%"
              />
            </div>
            <button
              disabled={infoHolder?.localizacao.endereco == info.localizacao.endereco}
              onClick={() =>
                // @ts-ignore
                handleUpdateOpportunity({
                  id: opportunityId,
                  changes: { 'localizacao.endereco': infoHolder.localizacao.endereco },
                })
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: '18px',
                  color: infoHolder?.localizacao.endereco != info.localizacao.endereco ? 'rgb(34,197,94)' : 'rgb(156,163,175)',
                }}
              />
            </button>
          </div>
          <div className="flex w-full gap-2">
            <div className="grow">
              <TextInput
                label="NÚMERO OU IDENTIFICADOR"
                value={infoHolder?.localizacao?.numeroOuIdentificador || ''}
                handleChange={(value) => {
                  setInfoHolder((prev) => ({ ...prev, localizacao: { ...(prev.localizacao || {}), numeroOuIdentificador: value } }))
                }}
                placeholder="Preencha aqui o número/identificador da localização de instalação."
                width="100%"
              />
            </div>
            <button
              disabled={infoHolder?.localizacao.numeroOuIdentificador == info.localizacao.numeroOuIdentificador}
              onClick={() =>
                // @ts-ignore
                handleUpdateOpportunity({
                  id: opportunityId,
                  changes: { 'localizacao.numeroOuIdentificador': infoHolder.localizacao.numeroOuIdentificador },
                })
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: '18px',
                  color:
                    infoHolder?.localizacao.numeroOuIdentificador != info.localizacao.numeroOuIdentificador ? 'rgb(34,197,94)' : 'rgb(156,163,175)',
                }}
              />
            </button>
          </div>
          <h1 className="w-full rounded-md bg-[#fead41] p-1 text-center text-sm font-medium text-white">DADOS ADICIONAIS DO CLIENTE</h1>
          <div className="flex w-full gap-2">
            <div className="grow">
              <TextInput
                label="CPF ou CNPJ"
                placeholder="Preencha aqui o CPF ou CPNJ do cliente..."
                value={infoHolder.cliente.cpfCnpj || ''}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, cliente: { ...prev.cliente, cpfCnpj: formatToCPForCNPJ(value) } }))}
                width="100%"
              />
            </div>
            <button
              disabled={infoHolder?.cliente?.cpfCnpj == info.cliente?.cpfCnpj}
              onClick={() =>
                // @ts-ignore
                handleUpdateClient({ id: infoHolder.idCliente, changes: { cpfCnpj: infoHolder.cliente?.cpfCnpj } })
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: '18px',
                  color: infoHolder?.cliente?.cpfCnpj != info.cliente?.cpfCnpj ? 'rgb(34,197,94)' : 'rgb(156,163,175)',
                }}
              />
            </button>
          </div>
          <div className="flex w-full gap-2">
            <div className="grow">
              <TextInput
                label="RG"
                value={infoHolder?.cliente && infoHolder?.cliente.rg ? infoHolder?.cliente.rg : ''}
                handleChange={(value) => {
                  if (infoHolder)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      cliente: { ...prev?.cliente, rg: value },
                    }))
                }}
                placeholder="Preencha aqui o RG do cliente..."
                width="100%"
              />
            </div>
            <button
              disabled={infoHolder?.cliente?.rg == info.cliente?.rg}
              onClick={() =>
                // @ts-ignore
                handleUpdateClient({ id: infoHolder.idCliente, changes: { rg: infoHolder.cliente?.rg } })
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: '18px',
                  color: infoHolder?.cliente?.rg != info.cliente?.rg ? 'rgb(34,197,94)' : 'rgb(156,163,175)',
                }}
              />
            </button>
          </div>
          <div className="flex w-full gap-2">
            <div className="grow">
              <DateInput
                label="DATA DE NASCIMENTO"
                value={infoHolder?.cliente && infoHolder?.cliente.dataNascimento ? formatDate(infoHolder.cliente.dataNascimento) : undefined}
                handleChange={(value) => {
                  if (value)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      cliente: {
                        ...prev?.cliente,
                        dataNascimento: new Date(value).toISOString(),
                      },
                    }))
                  else
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      cliente: {
                        ...prev?.cliente,
                        dataNascimento: null,
                      },
                    }))
                }}
                width="100%"
              />
            </div>
            <button
              disabled={infoHolder?.cliente?.dataNascimento == info.cliente?.dataNascimento}
              onClick={() =>
                // @ts-ignore
                handleUpdateClient({ id: infoHolder.idCliente, changes: { dataNascimento: infoHolder.cliente?.dataNascimento } })
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: '18px',
                  color: infoHolder?.cliente?.dataNascimento != info.cliente?.dataNascimento ? 'rgb(34,197,94)' : 'rgb(156,163,175)',
                }}
              />
            </button>
          </div>
          <div className="flex w-full gap-2">
            <div className="grow">
              <SelectInput
                label="ESTADO CIVIL"
                value={infoHolder?.cliente ? infoHolder?.cliente.estadoCivil : null}
                options={[
                  {
                    id: 1,
                    label: 'SOLTEIRO(A)',
                    value: 'SOLTEIRO(A)',
                  },
                  {
                    id: 2,
                    label: 'CASADO(A)',
                    value: 'CASADO(A)',
                  },
                  {
                    id: 3,
                    label: 'UNIÃO ESTÁVEL',
                    value: 'UNIÃO ESTÁVEL',
                  },
                  {
                    id: 4,
                    label: 'DIVORCIADO(A)',
                    value: 'DIVORCIADO(A)',
                  },
                  {
                    id: 5,
                    label: 'VIUVO(A)',
                    value: 'VIUVO(A)',
                  },
                ]}
                handleChange={(value) => {
                  if (infoHolder)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      cliente: { ...prev?.cliente, estadoCivil: value },
                    }))
                }}
                onReset={() => {
                  if (infoHolder)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      cliente: { ...prev?.cliente, estadoCivil: null },
                    }))
                }}
                selectedItemLabel="NÃO DEFINIDO"
                width="100%"
              />
            </div>
            <button
              disabled={infoHolder?.cliente?.estadoCivil == info.cliente?.estadoCivil}
              onClick={() =>
                // @ts-ignore
                handleUpdateClient({ id: infoHolder.idCliente, changes: { estadoCivil: infoHolder.cliente?.estadoCivil } })
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: '18px',
                  color: infoHolder?.cliente?.estadoCivil != info.cliente?.estadoCivil ? 'rgb(34,197,94)' : 'rgb(156,163,175)',
                }}
              />
            </button>
          </div>
          <div className="flex w-full gap-2">
            <div className="grow">
              <TextInput
                label="PROFISSÃO"
                value={infoHolder?.cliente && infoHolder?.cliente.profissao ? infoHolder?.cliente.profissao : ''}
                handleChange={(value) => {
                  if (infoHolder)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      cliente: {
                        ...prev?.cliente,
                        profissao: value,
                      },
                    }))
                }}
                placeholder="Preencha aqui o profissão do cliente..."
                width="100%"
              />
            </div>
            <button
              disabled={infoHolder?.cliente?.profissao == info.cliente?.profissao}
              onClick={() =>
                // @ts-ignore
                handleUpdateClient({ id: infoHolder.idCliente, changes: { profissao: infoHolder.cliente?.profissao } })
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: '18px',
                  color: infoHolder?.cliente?.profissao != info.cliente?.profissao ? 'rgb(34,197,94)' : 'rgb(156,163,175)',
                }}
              />
            </button>
          </div>
          <div className="flex w-full gap-2">
            <div className="grow">
              <SelectInput
                label="CANAL DE AQUISIÇÃO"
                value={infoHolder?.cliente ? infoHolder?.cliente.canalAquisicao : null}
                // editable={session?.user.id == infoHolder?.responsavel?.id || session?.user.permissoes.projetos.editar}
                options={customersAcquisitionChannels.map((value) => value)}
                handleChange={(value) => {
                  if (infoHolder)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      cliente: { ...prev?.cliente, canalAquisicao: value },
                    }))
                }}
                onReset={() => {
                  if (infoHolder)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      cliente: { ...prev?.cliente, canalAquisicao: null },
                    }))
                }}
                selectedItemLabel="NÃO DEFINIDO"
                width="100%"
              />
            </div>
            <button
              disabled={infoHolder?.cliente?.canalAquisicao == info.cliente?.canalAquisicao}
              onClick={() =>
                // @ts-ignore
                handleUpdateClient({ id: infoHolder.idCliente, changes: { canalAquisicao: infoHolder.cliente?.canalAquisicao } })
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: '18px',
                  color: infoHolder?.cliente?.canalAquisicao != info.cliente?.canalAquisicao ? 'rgb(34,197,94)' : 'rgb(156,163,175)',
                }}
              />
            </button>
          </div>
          <h1 className="w-full rounded-md bg-[#fead41] p-1 text-center text-sm font-medium text-white">DADOS DA INSTALAÇÃO</h1>
          <div className="flex w-full gap-2">
            <div className="grow">
              <TextInput
                label="CONCESSIONÁRIA"
                value={infoHolder?.instalacao.concessionaria || ''}
                // editable={session?.user.id == infoHolder?.responsavel?.id || session?.user.permissoes.projetos.editar}
                handleChange={(value) => {
                  if (infoHolder)
                    setInfoHolder((prev) => ({
                      ...prev,
                      instalacao: {
                        ...prev.instalacao,
                        concessionaria: value,
                      },
                    }))
                }}
                placeholder="Preencha aqui a concessionária que atende a instalação..."
                width="100%"
              />
            </div>
            <button
              disabled={infoHolder?.instalacao.concessionaria == info.instalacao.concessionaria}
              onClick={() =>
                // @ts-ignore
                handleUpdateOpportunity({ id: opportunityId, changes: { 'instalacao.concessionaria': infoHolder.instalacao.concessionaria } })
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: '18px',
                  color: infoHolder?.instalacao.concessionaria != info.instalacao.concessionaria ? 'rgb(34,197,94)' : 'rgb(156,163,175)',
                }}
              />
            </button>
          </div>
          <div className="flex w-full gap-2">
            <div className="grow">
              <TextInput
                label="NÚMERO DE INSTALAÇÃO DA CONCESSIONÁRIA"
                value={infoHolder?.cliente && infoHolder?.instalacao.numero ? infoHolder?.instalacao.numero : ''}
                // editable={session?.user.id == infoHolder?.responsavel?.id || session?.user.permissoes.projetos.editar}
                handleChange={(value) => {
                  if (infoHolder)
                    setInfoHolder((prev) => ({
                      ...prev,
                      instalacao: {
                        ...prev.instalacao,
                        numero: value,
                      },
                    }))
                }}
                placeholder="Preencha aqui o número de instalação do cliente com a consessionária."
                width="100%"
              />
            </div>
            <button
              disabled={infoHolder?.instalacao.numero == info.instalacao.numero}
              onClick={() =>
                // @ts-ignore
                handleUpdateOpportunity({ id: opportunityId, changes: { 'instalacao.numero': infoHolder.instalacao.numero } })
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: '18px',
                  color: infoHolder?.instalacao.numero != info.instalacao.numero ? 'rgb(34,197,94)' : 'rgb(156,163,175)',
                }}
              />
            </button>
          </div>
          <div className="flex w-full gap-2">
            <div className="grow">
              <SelectInput
                label="TIPO DA INSTALAÇÃO"
                value={infoHolder?.instalacao.grupo}
                // editable={session?.user.id == infoHolder?.responsavel?.id || session?.user.permissoes.projetos.editar}
                options={ElectricalInstallationGroups}
                handleChange={(value) => {
                  if (infoHolder)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      instalacao: {
                        ...prev,
                        grupo: value,
                      },
                    }))
                }}
                onReset={() => {
                  if (infoHolder?.cliente)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      instalacao: {
                        ...prev,
                        grupo: null,
                      },
                    }))
                }}
                selectedItemLabel="NÃO DEFINIDO"
                width="100%"
              />
            </div>
            <button
              disabled={infoHolder?.instalacao.grupo == info.instalacao.grupo}
              onClick={() =>
                // @ts-ignore
                handleUpdateOpportunity({ id: opportunityId, changes: { 'instalacao.grupo': infoHolder.instalacao.grupo } })
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: '18px',
                  color: infoHolder?.instalacao.grupo != info.instalacao.grupo ? 'rgb(34,197,94)' : 'rgb(156,163,175)',
                }}
              />
            </button>
          </div>
          <div className="flex w-full gap-2">
            <div className="grow">
              <SelectInput
                label="TIPO DA LIGAÇÃO"
                value={infoHolder?.instalacao.tipoLigacao}
                // editable={session?.user.id == infoHolder?.responsavel?.id || session?.user.permissoes.projetos.editar}
                options={[
                  {
                    id: 1,
                    label: 'NOVA',
                    value: 'NOVA',
                  },
                  {
                    id: 2,
                    label: 'EXISTENTE',
                    value: 'EXISTENTE',
                  },
                ]}
                handleChange={(value) => {
                  if (infoHolder)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      instalacao: {
                        ...prev,
                        tipoLigacao: value,
                      },
                    }))
                }}
                onReset={() => {
                  if (infoHolder?.cliente)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      tipoLigacao: null,
                    }))
                }}
                selectedItemLabel="NÃO DEFINIDO"
                width="100%"
              />
            </div>
            <button
              disabled={infoHolder?.instalacao.tipoLigacao == info.instalacao.tipoLigacao}
              onClick={() =>
                // @ts-ignore
                handleUpdateOpportunity({ id: opportunityId, changes: { 'instalacao.tipoLigacao': infoHolder.instalacao.tipoLigacao } })
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: '18px',
                  color: infoHolder?.instalacao.tipoLigacao != info.instalacao.tipoLigacao ? 'rgb(34,197,94)' : 'rgb(156,163,175)',
                }}
              />
            </button>
          </div>
          <div className="flex w-full gap-2">
            <div className="grow">
              <SelectInput
                label="TIPO DO TITULAR"
                value={infoHolder?.instalacao.tipoTitular}
                // editable={session?.user.id == infoHolder?.responsavel?.id || session?.user.permissoes.projetos.editar}
                options={[
                  {
                    id: 1,
                    label: 'PESSOA FISICA',
                    value: 'PESSOA FISICA',
                  },
                  {
                    id: 2,
                    label: 'PESSOA JURIDICA',
                    value: 'PESSOA JURIDICA',
                  },
                ]}
                handleChange={(value) => {
                  if (infoHolder)
                    setInfoHolder((prev) => ({
                      ...prev,
                      instalacao: {
                        ...prev,
                        tipoTitular: value,
                      },
                    }))
                }}
                onReset={() => {
                  if (infoHolder?.cliente)
                    setInfoHolder((prev: any) => ({
                      ...prev,
                      instalacao: {
                        ...prev,
                        tipoTitular: null,
                      },
                    }))
                }}
                selectedItemLabel="NÃO DEFINIDO"
                width="100%"
              />
            </div>
            <button
              disabled={infoHolder?.instalacao.tipoTitular == info.instalacao.tipoTitular}
              className="flex items-end justify-center pb-4 text-green-200"
              onClick={() =>
                // @ts-ignore
                handleUpdateOpportunity({ id: opportunityId, changes: { 'instalacao.tipoTitular': infoHolder.instalacao.tipoTitular } })
              }
            >
              <AiOutlineCheck
                style={{
                  fontSize: '18px',
                  color: infoHolder?.instalacao.tipoTitular != info.instalacao.tipoTitular ? 'rgb(34,197,94)' : 'rgb(156,163,175)',
                }}
              />
            </button>
          </div>
          <div className="flex w-full gap-2">
            <div className="grow">
              <TextInput
                label="NOME DO TITULAR DA INSTALAÇÃO"
                value={infoHolder?.instalacao.nomeTitular || ''}
                // editable={session?.user.id == infoHolder?.responsavel?.id || session?.user.permissoes.projetos.editar}
                handleChange={(value) => {
                  if (infoHolder)
                    setInfoHolder((prev) => ({
                      ...prev,
                      instalacao: {
                        ...prev.instalacao,
                        nomeTitular: value,
                      },
                    }))
                }}
                placeholder="Preencha aqui o nome titular da instalação do cliente..."
                width="100%"
              />
            </div>
            <button
              disabled={infoHolder?.instalacao.nomeTitular == info.instalacao.nomeTitular}
              onClick={() =>
                // @ts-ignore
                handleUpdateOpportunity({ id: opportunityId, changes: { 'instalacao.nomeTitular': infoHolder.instalacao.nomeTitular } })
              }
              className="flex items-end justify-center pb-4 text-green-200"
            >
              <AiOutlineCheck
                style={{
                  fontSize: '18px',
                  color: infoHolder?.instalacao.nomeTitular != info.instalacao.nomeTitular ? 'rgb(34,197,94)' : 'rgb(156,163,175)',
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailsBlock
