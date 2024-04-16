import { useProjects, useResponsibles } from '@/utils/methods'
import { Funnel, IProject, IResponsible } from '@/utils/models'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { Session } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import toast from 'react-hot-toast'
import LoadingPage from '../utils/LoadingPage'
import { Sidebar } from '../Sidebar'
import PeriodDropdownFilter from '../Inputs/PeriodDropdownFilter'
import SelectInput from '../Inputs/SelectInput'
import SeachProjects from '../ProjectBlocks/SeachProjects'
import { AiOutlinePlus } from 'react-icons/ai'
import LoadingComponent from '../utils/LoadingComponent'
import { funnels } from '@/utils/constants'
import FunnelList from '../dnd/FunnelList'
import Link from 'next/link'
import { MdWhatsapp } from 'react-icons/md'
import NewProject from '../Modals/Opportunity/NewOpportunity'
type Options = {
  activeResponsible: string | null
  activeFunnel: number | null
  responsibleOptions:
    | {
        id: string
        label: string
        value: string
      }[]
    | null
  funnelOptions:
    | {
        id: number
        label: string
        value: number
      }[]
    | null
}
type ParamFilter = {
  status: 'GANHOS' | 'PERDIDOS' | undefined
  mode: 'GERAL' | 'ATIVO' | 'LEAD'
}
type UpdateObjFunnelStage = {
  updateObjId: string
  funnelId: string
  newStageId: string
  responsibleId: string
}
type DateFilterType = {
  after: string | undefined
  before: string | undefined
}
function getStageProjects(funnelId: number | null, stageId: number, projects: IProject[] | undefined) {
  if (projects) {
    let stageProjects = projects.filter((project) => project.funis?.filter((funnel) => funnel.id == funnelId)[0].etapaId == stageId)
    return stageProjects
  } else return []
}
function getOptions(session: Session | null, responsibles: IResponsible[] | undefined) {
  const responsibleFilterPreference = typeof window != 'undefined' ? localStorage.getItem('responsible') : null
  const funnelFilterPreference = typeof window != 'undefined' ? localStorage.getItem('funnel') : null
  const modeFilterPreference = typeof window != 'undefined' ? localStorage.getItem('mode') : null
  var options: Options = {
    activeResponsible: null,
    activeFunnel: null,
    responsibleOptions: null,
    funnelOptions: null,
  }
  if (!session || !responsibles) return options
  if (session.user.visibilidade == 'GERAL') {
    options.activeResponsible = null

    if (responsibleFilterPreference) options.activeResponsible = responsibleFilterPreference

    options.responsibleOptions = responsibles.map((resp) => {
      return {
        id: resp.id,
        label: resp.nome,
        value: resp.id,
      }
    })
  }
  if (session.user.visibilidade == 'PRÓPRIA') {
    var filteredResponsibles = responsibles.filter((responsible) => responsible.id == session.user.id)
    options.activeResponsible = session.user.id
    options.responsibleOptions = filteredResponsibles.map((resp) => {
      return {
        id: resp.id,
        label: resp.nome,
        value: resp.id,
      }
    })
  }
  if (typeof session.user.visibilidade == 'object') {
    var filteredResponsibles = responsibles.filter((responsible) => session.user.visibilidade.includes(responsible.id) || responsible.id == session.user.id)
    options.activeResponsible = session.user.id

    if (responsibleFilterPreference) options.activeResponsible = responsibleFilterPreference

    options.responsibleOptions = filteredResponsibles.map((resp) => {
      return {
        id: resp.id,
        label: resp.nome,
        value: resp.id,
      }
    })
  }
  if (session.user.funisVisiveis == 'TODOS') {
    options.activeFunnel = 1

    if (funnelFilterPreference) options.activeFunnel = Number(funnelFilterPreference)

    options.funnelOptions = funnels.map((funnel) => {
      return {
        id: funnel.id,
        label: funnel.nome,
        value: funnel.id,
      }
    })
  } else {
    var filteredFunnels: Funnel[] | [] = []
    const allFunnels: Funnel[] = funnels
    filteredFunnels = allFunnels.filter((funnel) => session.user.funisVisiveis != 'TODOS' && session.user.funisVisiveis.includes(funnel.id))
    options.activeFunnel = filteredFunnels[0] ? filteredFunnels[0].id : null

    if (funnelFilterPreference) options.activeFunnel = Number(funnelFilterPreference)

    options.funnelOptions = filteredFunnels.map((funnel) => {
      return {
        id: funnel.id,
        label: funnel.nome,
        value: funnel.id,
      }
    })
  }
  return options
}
function ProjectsFunnelPage() {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const [newProjectModalIsOpen, setNewProjectModalIsOpen] = useState<boolean>(false)

  const { data: responsibles } = useResponsibles()

  const [responsible, setResponsible] = useState<string | null>(getOptions(session, responsibles).activeResponsible)
  const [dateParam, setDateParam] = useState<DateFilterType>({
    after: undefined,
    before: undefined,
  })
  const [funnel, setFunnel] = useState<number | null>(getOptions(session, responsibles).activeFunnel)
  const [params, setParams] = useState<ParamFilter>({
    status: undefined,
    mode: 'GERAL',
  })

  const { data: projects, isLoading: projectsLoading } = useProjects(
    funnel,
    responsible,
    params.mode,
    dateParam.after,
    dateParam.before,
    session,
    params.status
  )

  const { mutate } = useMutation({
    mutationKey: ['updateObjFunnelStage'],
    mutationFn: async (info: UpdateObjFunnelStage) => {
      try {
        await axios.put('/api/projects/funnel', info)
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
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['projects', funnel, responsible, dateParam.after, dateParam.before, params.mode, params.status] })
      // Getting current projects snapshot
      const projectsSnapshot: any = queryClient.getQueryData(['projects', funnel, responsible, dateParam.after, dateParam.before, params.mode, params.status])
      // Updating project reference
      let project = projectsSnapshot.filter((x: any) => x._id == variables.updateObjId)[0]
      let indexOfProject = projectsSnapshot.map((e: any) => e._id).indexOf(variables.updateObjId)
      project.funis[variables.funnelId].etapaId = Number(variables.newStageId)
      // Generating NewProjects array
      var newProjects = [...projectsSnapshot]
      newProjects[indexOfProject] = project
      queryClient.setQueryData(['projects', funnel, responsible, dateParam.after, dateParam.before, params.mode, params.status], newProjects)

      // Returning snapshot as context for OnSuccess or OnError
      return { projectsSnapshot }
    },
    onError: async (err, variables, context) => {
      queryClient.setQueryData(['projects', funnel, responsible, dateParam.after, dateParam.before, params.mode, params.status], context?.projectsSnapshot)
    },
    onSettled: async () => {
      queryClient.invalidateQueries({ queryKey: ['projects', funnel, responsible, dateParam.after, dateParam.before, params.mode, params.status] })
    },
  })

  function handleFunnelChange(value: number) {
    setFunnel(value)
    localStorage.setItem('funnel', value.toString())
    return
  }
  async function onDragEnd(result: DropResult) {
    console.log('FUI CHAMADO')
    const { source, destination, draggableId } = result
    if (!destination) return
    if (destination.droppableId == source.droppableId) return

    let project = projects?.filter((x) => x._id == draggableId)[0]
    if (project && funnel) {
      const setOfFunnelsInProject = project.funis?.map((funnel) => funnel.id)
      const indexOfFunnelInProject = setOfFunnelsInProject?.indexOf(funnel)
      const projectResponsibleId = project.responsavel.id
      console.log('INDEX', indexOfFunnelInProject)
      const newStageId = destination.droppableId
      if (indexOfFunnelInProject != undefined) {
        mutate({
          updateObjId: draggableId,
          funnelId: indexOfFunnelInProject.toString(),
          newStageId: newStageId,
          responsibleId: projectResponsibleId,
        })
      }
    }
  }

  useEffect(() => {
    if (!funnel) {
      setFunnel(getOptions(session, responsibles).activeFunnel)
    }
    if (!responsible) {
      setResponsible(getOptions(session, responsibles).activeResponsible)
    }
  }, [session, responsibles])
  if (!!session?.user)
    return (
      <div className="flex h-full flex-col md:flex-row">
        <Sidebar />
        <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa] p-6">
          <div className="flex flex-col items-center border-b border-[#000] pb-2 xl:flex-row">
            <div className="flex font-Poppins text-2xl font-black text-black">FUNIL</div>
            <div className="flex grow flex-col items-center justify-end  gap-2 xl:flex-row">
              <PeriodDropdownFilter initialAfter={dateParam.after} initialBefore={dateParam.before} setDateParam={setDateParam} />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setParams((prev) => ({ ...prev, mode: 'GERAL' }))}
                  className={`min-h-[46.6px] w-fit rounded border border-gray-500 p-2 text-sm font-medium ${
                    params.mode === 'GERAL' ? 'bg-gray-500 text-white' : 'bg-transparent text-gray-500'
                  } duration-300 ease-in-out hover:bg-gray-500 hover:text-white`}
                >
                  GERAL
                </button>
                <button
                  onClick={() => setParams((prev) => ({ ...prev, mode: 'ATIVO' }))}
                  className={`min-h-[46.6px] w-fit rounded border border-[#15599a] p-2 text-sm font-medium ${
                    params.mode === 'ATIVO' ? 'bg-[#15599a] text-white' : 'bg-transparent text-[#15599a]'
                  } duration-300 ease-in-out hover:bg-[#15599a] hover:text-white`}
                >
                  ATIVO
                </button>
                <button
                  onClick={() => setParams((prev) => ({ ...prev, mode: 'LEAD' }))}
                  className={`min-h-[46.6px] w-fit rounded border border-[#fead41] p-2 text-sm font-medium ${
                    params.mode === 'LEAD' ? 'bg-[#fead41] text-white' : 'bg-transparent text-[#fead41]'
                  } duration-300 ease-in-out hover:bg-[#fead41] hover:text-white`}
                >
                  LEAD
                </button>
              </div>
              <div className="w-full lg:w-[200px]">
                <SelectInput
                  showLabel={false}
                  label="STATUS"
                  selectedItemLabel="EM ANDAMENTO"
                  value={params.status}
                  options={[
                    { id: 1, label: 'GANHOS', value: 'GANHOS' },
                    { id: 2, label: 'PERDIDOS', value: 'PERDIDOS' },
                  ]}
                  handleChange={(selected) => {
                    setParams((prev) => ({ ...prev, status: selected }))
                  }}
                  onReset={() => setParams((prev) => ({ ...prev, status: undefined }))}
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-[200px]">
                <SelectInput
                  label="Usuários"
                  showLabel={false}
                  selectedItemLabel="Todos"
                  value={responsible}
                  options={getOptions(session, responsibles).responsibleOptions}
                  handleChange={(selected) => {
                    localStorage.setItem('responsible', selected)
                    setResponsible(selected)
                  }}
                  onReset={() => {
                    if (session.user.visibilidade == 'GERAL') {
                      setResponsible(null)
                      localStorage.removeItem('responsible')
                    } else {
                      setResponsible(session.user.id)
                      localStorage.setItem('responsible', session.user.id)
                    }
                  }}
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-[200px]">
                <SelectInput
                  label="Funis"
                  showLabel={false}
                  selectedItemLabel="NÃO DEFINIDO"
                  value={funnel}
                  options={getOptions(session, responsibles).funnelOptions}
                  handleChange={(selected) => {
                    handleFunnelChange(selected)
                    // setFunnel(selected.value)
                  }}
                  onReset={() => handleFunnelChange(1)}
                  width="100%"
                />
              </div>

              <SeachProjects />
              <button
                onClick={() => setNewProjectModalIsOpen(true)}
                className="flex h-[46.6px] items-center justify-center gap-2 rounded-md border bg-[#15599a] p-2 px-3 text-sm font-medium text-white shadow-sm duration-300 ease-in-out hover:scale-105"
              >
                <AiOutlinePlus style={{ fontSize: '18px' }} />
              </button>
            </div>
          </div>
          {session ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="1.5xl:max-h- mt-2 flex w-full overflow-x-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 md:max-h-[500px] lg:max-h-[600px]  2.25xl:max-h-[800px]">
                {projectsLoading ? (
                  <div className="flex min-h-[600px] w-full items-center justify-center">
                    <LoadingComponent />
                  </div>
                ) : funnels.filter((funn) => funn.id == funnel)[0] ? (
                  funnels
                    .filter((funn) => funn.id == funnel)[0]
                    .etapas.map((stage) => (
                      <FunnelList
                        key={stage.id}
                        id={stage.id}
                        stageName={stage.nome}
                        items={getStageProjects(funnel, stage.id, projects).map((item, index) => {
                          return {
                            id: item._id ? item._id : '',
                            name: item.nome,
                            identificador: item.identificador,
                            responsavel: item.responsavel.nome,
                            responsavel_avatar: responsibles?.filter((resp) => resp.id == item.responsavel.id)[0]?.avatar_url,
                            atividades: item.atividades,
                            nomeProposta: item.proposta && item.proposta?.length > 0 ? item.proposta[0].nome : undefined,
                            valorProposta: item.proposta && item.proposta?.length > 0 ? item.proposta[0].valorProposta : undefined,
                            potenciaPicoProposta: item.proposta && item.proposta?.length > 0 ? item.proposta[0].potenciaPico : undefined,
                            contratoSolicitado: !!item.solicitacaoContrato?.id,
                            idOportunidade: item.idOportunidade,
                            assinado: !!item.contrato?.dataAssinatura,
                            perdido: !!item.dataPerda,
                          }
                        })}
                      />
                    ))
                ) : null}
              </div>
            </DragDropContext>
          ) : null}
          <Link href={'https://forms.office.com/Pages/ResponsePage.aspx?id=8eMER-Xc8UymdamsboG6_zOKWJXTTFJBqfYnVlq8djNUOVA3MTdBNzYwQldIUlNFTFNZWTJBVk9LRS4u'}>
            <div className="fixed bottom-10 right-[30px] cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]">
              <p className="text-xs font-bold uppercase">Sugestões</p>
            </div>
          </Link>
          <Link href={'https://wa.me/5534984064658'}>
            <div className="fixed bottom-10 right-[140px] flex cursor-pointer items-center gap-2 rounded-lg bg-[#15599a] p-3 text-xs text-white hover:bg-[#fead61] hover:text-[#15599a]">
              <p className="text-xs font-bold uppercase">Volts</p>
              <MdWhatsapp />
            </div>
          </Link>
        </div>
        {newProjectModalIsOpen ? <NewProject responsibles={responsibles ? responsibles : []} closeModal={() => setNewProjectModalIsOpen(false)} /> : null}
      </div>
    )
}

export default ProjectsFunnelPage
