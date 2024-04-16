import { IKit, ITechnicalAnalysis, InverterType, ModuleType } from '@/utils/models'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import TextInput from '@/components/Inputs/TextInput'
import { formatLongString, formatToCEP, formatToMoney, formatToPhone, getCEPInfo, getPeakPotByModules } from '@/utils/methods'
import SelectInput from '@/components/Inputs/SelectInput'
import { stateCities } from '@/utils/estados_cidades'

import { IoMdAdd, IoMdRemoveCircle } from 'react-icons/io'
import MultipleSelectInput from '@/components/Inputs/MultipleSelectInput'
import { AiFillDelete, AiOutlineSearch } from 'react-icons/ai'

import { BsCheckCircleFill, BsClipboardCheckFill } from 'react-icons/bs'
import { fileTypes } from '@/utils/constants'
import { UploadResult, getDownloadURL, ref, uploadBytes } from 'firebase/storage'

import { GiReturnArrow } from 'react-icons/gi'
import { TTechnicalAnalysis } from '@/utils/schemas/technical-analysis.schema'
import { AdditionalCostsCategories, Units } from '@/utils/select-options'
import NumberInput from '@/components/Inputs/NumberInput'
import { FaBox } from 'react-icons/fa'
import { ImPriceTag } from 'react-icons/im'
import { useKits } from '@/utils/queries/kits'
import { TKitDTO } from '@/utils/schemas/kits.schema'

type BudgetingProps = {
  requestInfo: TTechnicalAnalysis
  setRequestInfo: React.Dispatch<React.SetStateAction<TTechnicalAnalysis>>
  resetSolicitationType: () => void
  projectId?: string
  projectCode?: string
}
type Filters = {
  suppliers: string[]
  topology: string[]
  search: string
  potOrder: null | 'ASC' | 'DESC'
}
type SelectedKitsState = {
  kitId: string | string[]
  tipo?: 'TRADICIONAL' | 'PROMOCIONAL'
  nome: string
  topologia: 'INVERSOR' | 'MICRO-INVERSOR'
  modulos: ModuleType[]
  inversores: InverterType[]
  fornecedor: string
  preco: number
}[]

function getSelectedKitsPowerPeak(selectedKits: SelectedKitsState) {
  var totalSum = 0
  selectedKits.forEach((kit) => {
    const kitPeakPower = getPeakPotByModules(kit.modulos)
    totalSum = totalSum + kitPeakPower
  })
  return totalSum
}

function Budgeting({ resetSolicitationType, requestInfo, setRequestInfo, projectId, projectCode }: BudgetingProps) {
  const [costHolder, setCostHolder] = useState<TTechnicalAnalysis['custos'][number]>({
    categoria: null,
    descricao: '',
    qtde: 0,
    grandeza: 'UN',
    custoUnitario: 0,
    total: 0,
  })
  const [files, setFiles] = useState<{
    [key: string]: {
      title: string
      file: File | null | string
    }
  }>()
  const queryClient = useQueryClient()
  async function setAddressDataByCEP(cep: string) {
    const addressInfo = await getCEPInfo(cep)
    const toastID = toast.loading('Buscando informações sobre o CEP...', {
      duration: 2000,
    })
    setTimeout(() => {
      if (addressInfo) {
        toast.dismiss(toastID)
        toast.success('Dados do CEP buscados com sucesso.', {
          duration: 1000,
        })
        setRequestInfo((prev) => ({
          ...prev,
          localizacao: {
            ...prev.localizacao,
            endereco: addressInfo.logradouro,
            bairro: addressInfo.bairro,
            uf: addressInfo.uf as keyof typeof stateCities,
            cidade: addressInfo.localidade.toUpperCase(),
          },
        }))
      }
    }, 1000)
  }
  const { data: kits = [], isFetching: kitsFetching, isSuccess: kitsSuccess } = useKits()
  const [filteredKits, setFilteredKits] = useState<TKitDTO[] | undefined>(kits)
  const [filters, setFilters] = useState<Filters>({
    suppliers: [],
    topology: [],
    search: '',
    potOrder: null,
  })
  const [selectedKits, setSelectedKits] = useState<SelectedKitsState>([])

  function handleOptionFilters() {
    var newArr
    if (filters.suppliers.length > 0) {
      if (!newArr) newArr = kits
      newArr = newArr?.filter((x) => filters.suppliers.includes(x.fornecedor))
    }
    if (filters.topology.length > 0) {
      if (!newArr) newArr = kits
      newArr = newArr?.filter((x) => filters.topology.includes(x.topologia))
    }
    if (!newArr) {
      setFilteredKits(kits)
      return kits
    } else {
      setFilteredKits(newArr)
      return newArr
    }
  }

  function handleSearchFilter(value: string) {
    setFilters((prev) => ({ ...prev, search: value }))
    if (value.trim().length > 0) {
      if (filters.search.trim().length > 0) {
        let filtered = handleOptionFilters()
        let newArr = filtered?.filter((x) => x.nome.toUpperCase().includes(value.toUpperCase()))
        setFilteredKits(newArr)
      }
    } else {
      setFilteredKits(kits)
    }
  }
  function ordenateKitsByPower(param: string) {
    if (!filteredKits) return
    var dumpyCopyOfKits = [...filteredKits]
    var newArr
    console.log('PARAMETRO', param)
    switch (param) {
      case 'ASC':
        newArr = dumpyCopyOfKits.sort((a, b) => getPeakPotByModules(a.modulos) - getPeakPotByModules(b.modulos))
        setFilteredKits(newArr)
        setFilters((prev) => ({ ...prev, potOrder: 'ASC', order: null }))
        break
      case 'DESC':
        newArr = dumpyCopyOfKits.sort((a, b) => getPeakPotByModules(b.modulos) - getPeakPotByModules(a.modulos))
        setFilteredKits(newArr)
        setFilters((prev) => ({ ...prev, potOrder: 'DESC', order: null }))
        break
      default:
        setFilters((prev) => ({ ...prev, potOrder: null, order: null }))
        setFilteredKits(dumpyCopyOfKits)
        break
    }
  }
  function selectKit(kit: TKitDTO) {
    const modules = kit.modulos
    const inverters = kit.inversores
    const price = kit.preco
    const topology = kit.topologia
    const supplier = kit.fornecedor
    if (selectedKits.some((prevKit) => prevKit.topologia != topology)) {
      toast.error('Não é possível selecionar kits de topologia diferente.')
      return
    }
    if (selectedKits.some((prevKit) => prevKit.tipo != kit.tipo)) {
      toast.error('Não é possível selecionar kits tradicionais e promocionais numa única proposta.')
      return
    }
    if (selectedKits.some((prevKit) => prevKit.fornecedor != kit.fornecedor)) {
      toast.error('Não é possível selecionar kits de diferentes fornecedores numa única proposta.')
      return
    }
    var currentSelectedKitsCopy = [...selectedKits]
    currentSelectedKitsCopy.push({
      kitId: kit._id ? kit._id : '',
      tipo: kit.tipo,
      nome: kit.nome,
      topologia: topology,
      modulos: modules,
      inversores: inverters,
      fornecedor: supplier,
      preco: price,
    })
    toast.success('Kit adicionado !')
    setSelectedKits(currentSelectedKitsCopy)
  }
  function handleRequest() {
    if (requestInfo.nome.trim().length < 4) {
      toast.error('Por favor, preencha um nome de ao menos 4 letras para o cliente.')
      return
    }
    if (!requestInfo.localizacao.uf) {
      toast.error('Por favor, preencha o estado do cliente.')
      return
    }
    if (!requestInfo.localizacao.cidade) {
      toast.error('Por favor, preencha a cidade do cliente.')
      return
    }

    if (requestInfo.localizacao.bairro.trim().length < 2) {
      toast.error('Por favor, preencha um bairro válido.')
      return
    }
    if (requestInfo.localizacao.endereco.trim().length < 2) {
      toast.error('Por favor, preencha um logradouro válido.')
      return
    }
    if (requestInfo.localizacao.numeroOuIdentificador.trim().length < 1) {
      toast.error('Por favor, preencha um número/identificador de residência válido.')
      return
    }

    if (selectedKits.length < 1) {
      toast.error('Por favor, selecione ao menos um kit.')
      return
    }
    var selectedKitsCopy = [...selectedKits]
    var kitIdsArr = selectedKitsCopy.flatMap((x) => x.kitId)
    var invQtdeArr = selectedKitsCopy.flatMap((x) => x.inversores).map((inv) => inv.qtde)
    var invPotArr = selectedKitsCopy.flatMap((x) => x.inversores).map((inv) => inv.potenciaNominal)
    var invBrandArr = selectedKitsCopy.flatMap((x) => x.inversores).map((inv) => `(${inv.fabricante}) ${inv.modelo}`)
    var modQtdeArr = selectedKitsCopy.flatMap((x) => x.modulos).map((mod) => mod.qtde)
    var modPotArr = selectedKitsCopy.flatMap((x) => x.modulos).map((mod) => mod.potencia)
    var modBrandArr = selectedKitsCopy.flatMap((x) => x.modulos).map((mod) => `(${mod.fabricante}) ${mod.modelo}`)

    // Joining into string
    var joinedInvQtdeArr = invQtdeArr.join('/')
    var joinedInvPotArr = invPotArr.join('/')
    var joinedInvBrandArr = invBrandArr.join('/')
    var joinedModQtdeArr = modQtdeArr.join('/')
    var joinedModPotArr = modPotArr.join('/')
    var joinedModBrandArr = modBrandArr.join('/')

    // console.log({ joinedInvQtdeArr, joinedInvPotArr, joinedInvBrandArr });
    setRequestInfo((prev) => ({
      ...prev,
      kitIds: kitIdsArr,
      equipamentos: {
        ...prev.equipamentos,
        modulos: {
          modelo: joinedModBrandArr,
          potencia: joinedModPotArr,
          qtde: joinedModQtdeArr,
        },
        inversor: { modelo: joinedInvBrandArr, potencia: joinedInvPotArr, qtde: joinedInvQtdeArr },
      },
      detalhes: {
        ...prev.detalhes,
        topologia: selectedKitsCopy[0].topologia == 'MICRO-INVERSOR' ? 'MICRO-INVERSOR' : 'INVERSOR',
      },
    }))
    createTechAnalysisRequest()
  }
  async function uploadFiles() {
    if (!files) return

    try {
      var links: { descricao: string; url: string; formato: string }[] = []

      // Create an array to store all the promises for file uploads
      const uploadPromises = Object.keys(files).map(async (key, index) => {
        const fileObj = files[key]
        var fileRef = ref(
          storage,
          `clientes/${requestInfo.nome}-${requestInfo.projeto.identificador || 'NA'}/analiseTecnica-auxilioOrcamento-${index + 1}-${(
            Math.random() * 10000
          ).toFixed(0)}`
        )

        if (typeof fileObj.file == 'string' || fileObj.file == null) return
        const firebaseRes = await uploadBytes(fileRef, fileObj.file)
        const uploadResult = firebaseRes as UploadResult
        const fileUrl = await getDownloadURL(ref(storage, firebaseRes.metadata.fullPath))

        links.push({
          descricao: fileObj.title,
          url: fileUrl,
          formato:
            uploadResult.metadata.contentType && fileTypes[uploadResult.metadata.contentType]
              ? fileTypes[uploadResult.metadata.contentType].title
              : 'INDEFINIDO',
        })
      })

      // Wait for all file upload promises to resolve
      await Promise.all(uploadPromises)

      setRequestInfo((prev) => ({ ...prev, arquivos: links }))

      // Return the links array after all files are uploaded
      return links
    } catch (error) {
      toast.error('Houve um erro ao fazer upload dos arquivos, por favor, tente novamente.')
    }
  }
  const {
    mutate: createTechAnalysisRequest,
    isPending,
    isSuccess, //64adb93249f94d9354becb64
  } = useMutation({
    mutationKey: ['createTechAnalysisRequest'],
    mutationFn: async () => {
      try {
        const links = await uploadFiles()
        const { data } = await axios.post(`/api/integration/app-ampere/technical-analysis`, {
          ...requestInfo,
          // idProjetoCRM: projectId,
          arquivos: links,
        })
        if (data.message) toast.success(data.message)
      } catch (error) {
        if (error instanceof AxiosError) {
          let errorMsg = error.response?.data.error.message
          toast.error(errorMsg)
          return
        }
        if (error instanceof Error) {
          let errorMsg = error.message
          toast.error(errorMsg)
          return
        }
      }
    },
  })
  function addCost() {
    if (!costHolder.categoria) {
      return toast.error('Preencha uma categoria de custo.')
    }
    if (costHolder.descricao.trim().length < 3) {
      return toast.error('Preencha um nome/descrição válida ao custo.')
    }
    if (!costHolder.grandeza) {
      return toast.error('Preencha a grandeza do custo.')
    }
    if (costHolder.qtde <= 0) {
      return toast.error('Preencha uma quantidade válida para o item de custo.')
    }
    const costsList = requestInfo.custos ? [...requestInfo.custos] : []
    const newCost = { ...costHolder }
    costsList.push(newCost)
    setRequestInfo((prev) => ({ ...prev, custos: costsList }))
    setCostHolder({
      categoria: null,
      descricao: '',
      qtde: 0,
      grandeza: 'UN',
      custoUnitario: 0,
      total: 0,
    })
    toast.success('Item adicionado aos custos com sucesso !')
  }
  function removeCost(index: number) {
    const costsList = [...requestInfo.custos]
    costsList.splice(index, 1)
    setRequestInfo((prev) => ({ ...prev, custos: costsList }))

    toast.success('Custo removido!')
  }
  console.log(files)
  useEffect(() => {
    setFilteredKits(kits)
  }, [kits])
  if (isSuccess)
    return (
      <div className="flex w-full grow flex-col items-center justify-center gap-4">
        <BsClipboardCheckFill style={{ color: 'rgb(34,197,94)', fontSize: '60px' }} />
        <h1 className="text-lg font-medium italic text-gray-600">Solicitação criada com sucesso !</h1>
      </div>
    )
  else
    return (
      <div className="flex w-full grow flex-col">
        <div className="flex w-full flex-col bg-[#fff] px-2">
          <span className="py-2 text-center text-lg font-bold uppercase text-[#15599a]">DADOS GERAIS</span>
          <div className="flex w-full grow flex-col gap-2">
            <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="flex w-full items-center justify-center lg:w-[50%]">
                <TextInput
                  label={'NOME DO CLIENTE'}
                  placeholder="Digite aqui o nome do cliente..."
                  width={'100%'}
                  value={requestInfo.nome}
                  handleChange={(value) =>
                    setRequestInfo((prev) => ({
                      ...prev,
                      nomeDoCliente: value,
                    }))
                  }
                />
              </div>
              <div className="flex w-full items-center justify-center lg:w-[50%]">
                <TextInput
                  label={'CEP'}
                  placeholder="Digite aqui o nome do cliente..."
                  width={'100%'}
                  value={requestInfo.localizacao.cep || ''}
                  handleChange={(value) => {
                    if (value.length == 9) {
                      setAddressDataByCEP(value)
                    }
                    setRequestInfo((prev) => ({ ...prev, localizacao: { ...prev.localizacao, cep: formatToCEP(value) } }))
                  }}
                />
              </div>
            </div>

            <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="flex w-full items-center justify-center lg:w-[50%]">
                <SelectInput
                  width={'100%'}
                  label={'UF'}
                  editable={true}
                  options={Object.keys(stateCities).map((state, index) => ({
                    id: index + 1,
                    label: state,
                    value: state,
                  }))}
                  value={requestInfo.localizacao.uf}
                  handleChange={(value) => setRequestInfo((prev) => ({ ...prev, localizacao: { ...prev.localizacao, uf: value } }))}
                  selectedItemLabel="NÃO DEFINIDO"
                  onReset={() => {
                    setRequestInfo((prev) => ({ ...prev, localizacao: { ...prev.localizacao, uf: null } }))
                  }}
                />
              </div>
              <div className="flex w-full items-center justify-center lg:w-[50%]">
                <SelectInput
                  width={'100%'}
                  label={'CIDADE'}
                  editable={true}
                  value={requestInfo.localizacao.cidade}
                  options={
                    requestInfo.localizacao.uf
                      ? stateCities[requestInfo.localizacao.uf as keyof typeof stateCities].map((city, index) => {
                          return {
                            id: index,
                            value: city,
                            label: city,
                          }
                        })
                      : null
                  }
                  handleChange={(value) => setRequestInfo((prev) => ({ ...prev, localizacao: { ...prev.localizacao, cidade: value } }))}
                  onReset={() => {
                    setRequestInfo((prev) => ({ ...prev, localizacao: { ...prev.localizacao, cidade: null } }))
                  }}
                  selectedItemLabel="NÃO DEFINIDO"
                />
              </div>
            </div>
            <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="flex w-full items-center justify-center lg:w-[50%]">
                <TextInput
                  label={'BAIRRO'}
                  placeholder="Digite aqui o bairro do cliente.."
                  width={'100%'}
                  value={requestInfo.localizacao.bairro}
                  handleChange={(value) => setRequestInfo((prev) => ({ ...prev, localizacao: { ...prev.localizacao, bairro: value } }))}
                />
              </div>
              <div className="flex w-full items-center justify-center lg:w-[50%]">
                <TextInput
                  label={'LOGRADOURO'}
                  placeholder="Digite o logradouro do cliente..."
                  width={'100%'}
                  value={requestInfo.localizacao.endereco}
                  handleChange={(value) => setRequestInfo((prev) => ({ ...prev, localizacao: { ...prev.localizacao, endereco: value } }))}
                />
              </div>
            </div>
            <div className="flex w-full items-center justify-center">
              <div className="w-full lg:w-[450px]">
                <TextInput
                  label={'NÚMERO OU IDENTIFICADOR'}
                  placeholder="Digite aqui o número/identificador da residência..."
                  width={'100%'}
                  value={requestInfo.localizacao.numeroOuIdentificador}
                  handleChange={(value) => {
                    setRequestInfo((prev) => ({ ...prev, localizacao: { ...prev.localizacao, numeroOuIdentificador: value } }))
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex w-full flex-col bg-[#fff] px-2">
          <span className="py-2 text-center text-lg font-bold uppercase text-[#15599a]">DADOS DO SISTEMA</span>
          <div className="flex w-full grow flex-col gap-2">
            <div className="mt-2 flex w-full flex-wrap items-center justify-between gap-1">
              <div className="flex w-full items-end gap-2">
                <div className="w-full lg:w-[50%]">
                  <TextInput
                    label="PESQUISA"
                    value={filters.search}
                    handleChange={(value) => {
                      handleSearchFilter(value)
                    }}
                    placeholder="Pesquisa aqui o nome do kit..."
                    width="100%"
                  />
                </div>
                <div className="w-full lg:w-[50%]">
                  <div className="flex w-full justify-center gap-2">
                    <div
                      onClick={() => ordenateKitsByPower('ASC')}
                      className={`flex h-[46px] w-full cursor-pointer items-center justify-center rounded-md border border-[#FEAD41] p-1 text-center lg:w-fit ${
                        filters.potOrder == 'ASC' ? 'bg-[#FEAD41] text-white' : 'bg-transparent text-[#FEAD41]'
                      }`}
                    >
                      POTÊNCIA CRESCENTE
                    </div>
                    <div
                      onClick={() => ordenateKitsByPower('DESC')}
                      className={`flex h-[46px] w-full cursor-pointer items-center justify-center rounded-md border border-[#FEAD41] p-1 text-center lg:w-fit ${
                        filters.potOrder == 'DESC' ? 'bg-[#FEAD41] text-white' : 'bg-transparent text-[#FEAD41]'
                      }`}
                    >
                      POTÊNCIA DECRESCENTE
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex w-full items-end justify-center gap-2">
                <MultipleSelectInput
                  label="FORNECEDORES"
                  selected={filters.suppliers.length > 0 ? filters.suppliers.map((supplier) => supplier) : null}
                  options={Suppliers.map((supplier) => {
                    return {
                      id: supplier.id,
                      label: supplier.nome,
                      value: supplier.nome,
                    }
                  })}
                  selectedItemLabel="NÃO DEFINIDO"
                  handleChange={(value: string[] | []) => {
                    setFilters((prev) => ({
                      ...prev,
                      suppliers: value,
                    }))
                  }}
                  onReset={() => {
                    setFilters((prev) => ({
                      ...prev,
                      suppliers: [],
                    }))
                  }}
                />
                <MultipleSelectInput
                  label="TOPOLOGIA"
                  selected={filters.topology.length > 0 ? filters.topology.map((supplier) => supplier) : null}
                  options={[
                    { id: 1, label: 'INVERSOR', value: 'INVERSOR' },
                    {
                      id: 2,
                      label: 'MICRO-INVERSOR',
                      value: 'MICRO-INVERSOR',
                    },
                  ]}
                  selectedItemLabel="NÃO DEFINIDO"
                  handleChange={(value: string[] | []) => {
                    setFilters((prev) => ({
                      ...prev,
                      topology: value,
                    }))
                  }}
                  onReset={() => {
                    setFilters((prev) => ({
                      ...prev,
                      topology: [],
                    }))
                  }}
                />
                <button
                  onClick={() => handleOptionFilters()}
                  className="flex h-[46px] w-full items-center justify-center rounded border border-[#fead61] p-3 text-[#fead61] hover:bg-[#fead61] hover:text-black lg:w-fit"
                >
                  <AiOutlineSearch />
                </button>
              </div>
            </div>
            <div className="flex max-h-[500px] grow flex-wrap items-center justify-between gap-2 overflow-y-auto overscroll-y-auto p-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
              {kitsSuccess && filteredKits
                ? filteredKits.map((kit) => <TechAnalysisKit key={kit._id} kit={kit} handleSelect={(value) => selectKit(value)} />)
                : null}
              {kitsFetching ? <LoadingComponent /> : null}
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-between gap-2 px-1">
            <h1 className="w-full text-start font-bold">KITS SELECIONADOS</h1>
            {selectedKits.length > 0 ? (
              <>
                {selectedKits.map((kit, index) => (
                  <div key={index} className="flex w-full items-center justify-between pb-1">
                    <p className="italic text-gray-500">{kit.nome}</p>
                    <button
                      onClick={() => {
                        var currentSelectedKitsCopy = [...selectedKits]
                        currentSelectedKitsCopy.splice(index, 1)
                        setSelectedKits(currentSelectedKitsCopy)
                      }}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <IoMdRemoveCircle />
                    </button>
                  </div>
                ))}
                <div className="flex w-full items-center justify-center gap-2">
                  <div className="flex flex-col rounded border border-[#15599a] p-2 text-[#15599a]">
                    <h1 className="text-center">POTÊNCIA PICO TOTAL</h1>
                    <h1 className="text-center font-medium">
                      {getSelectedKitsPowerPeak(selectedKits).toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kWp{' '}
                    </h1>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-[80px] w-full items-center justify-center">
                <p className="text-sm italic text-gray-500">Sem kits selecionados...</p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex w-full flex-col bg-[#fff] px-2">
          <span className="py-2 text-center text-sm font-bold uppercase text-[#15599a]">ORÇAMENTAÇÃO</span>
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/4">
              <SelectInput
                label={'CATEGORIA DO CUSTO'}
                selectedItemLabel={'NÃO DEFINIDO'}
                options={AdditionalCostsCategories}
                value={costHolder.categoria}
                handleChange={(value) => setCostHolder((prev) => ({ ...prev, categoria: value }))}
                onReset={() => setCostHolder((prev) => ({ ...prev, categoria: null }))}
                width={'100%'}
              />
            </div>
            <div className="w-full lg:w-1/4">
              <TextInput
                label={'DESCRIÇÃO DO CUSTO'}
                placeholder={'Preencha o nome ou descreva o custo...'}
                value={costHolder.descricao}
                handleChange={(value) => setCostHolder((prev) => ({ ...prev, descricao: value }))}
                width={'100%'}
              />
            </div>
            <div className="w-full lg:w-1/4">
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
            <div className="w-full lg:w-1/4">
              <NumberInput
                label={'QUANTIDADE'}
                placeholder={'Preencha a quantidade o item de custo...'}
                value={costHolder.qtde}
                handleChange={(value) => setCostHolder((prev) => ({ ...prev, qtde: value }))}
                width={'100%'}
              />
            </div>
          </div>
          <div className="mt-4 flex w-full items-center justify-end">
            <button
              onClick={() => addCost()}
              className="flex w-fit items-center gap-2 rounded border border-green-500 p-1 text-green-500 duration-300 ease-in-out hover:bg-green-500 hover:text-white"
            >
              <p className="font-bold">ADICIONAR ITEM</p>
              <IoMdAdd />
            </button>
          </div>
          {requestInfo.custos?.length > 0 ? (
            <div className="mt-2 flex w-full flex-col gap-2">
              {requestInfo.custos.map((cost, index) => (
                <div key={index} className="flex w-full flex-col rounded-md border border-gray-300 p-3">
                  <div className="flex w-full justify-between">
                    <h1 className="text-start font-bold leading-none tracking-tight">{cost.categoria}</h1>
                    <div className="flex items-center gap-2">
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <div className="mt-4 flex w-full flex-col items-center justify-center self-center">
          <div className="flex items-center gap-2">
            <label className="ml-2 text-center text-sm font-bold text-[#15599a]" htmlFor="laudo">
              ARQUIVOS DE AUXÍLIO PARA ORÇAMENTAÇÃO
            </label>
            {files ? <BsCheckCircleFill style={{ color: 'rgb(34,197,94)' }} /> : null}
          </div>
          <div className="relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 bg-gray-100 p-2">
            <div className="absolute">
              {files && Object.keys(files).length > 0 ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center font-normal text-gray-400">ARQUIVOS ADICIONADOS</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block font-normal text-gray-400">Adicione o arquivo aqui...</span>
                </div>
              )}
            </div>
            <input
              multiple={true}
              onChange={(e) => {
                let obj = {}
                Array.prototype.forEach.call(e.target.files, function (file, index) {
                  obj = {
                    ...obj,
                    [`orcamentacao${index + 1}`]: {
                      title: `AUXÍLIO PARA ORÇAMENTAÇÃO (${index + 1})`,
                      file: file,
                    },
                  }
                })

                setFiles((prev) => ({ ...prev, ...obj }))
                /*e.target.files.forEach((value, index) => {
                  obj = { ...obj, [`${index + 1}desenho`]: value };
                });*/
              }}
              className="h-full w-full opacity-0"
              type="file"
              accept=".png, .jpeg, .pdf"
            />
          </div>
        </div>
        <div className="mt-2 flex w-full justify-between px-2">
          <button onClick={() => resetSolicitationType()} className="rounded p-2 font-bold text-gray-500 duration-300 ease-in-out hover:scale-105">
            Voltar
          </button>
          <button
            disabled={isPending || isSuccess}
            className="rounded p-2 font-bold hover:bg-black hover:text-white"
            onClick={() => {
              handleRequest()
            }}
          >
            {isPending ? 'Criando solicitação...' : null}
            {isSuccess ? 'Criação concluida!' : null}
            {!isPending && !isSuccess ? 'Criar solicitação' : null}
          </button>
        </div>
      </div>
    )
}

export default Budgeting
