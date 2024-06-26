import { UseQueryResult, useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { AiOutlineSearch } from 'react-icons/ai'
import { useDebounce } from 'usehooks-ts'
import LoadingComponent from '../utils/LoadingComponent'
import Link from 'next/link'
import { useOpportunitiesBySearch } from '@/utils/queries/opportunities'

type ISearchProjects = {
  _id: string
  nome: string
  identificador: string
  responsavel: {
    nome: string
    id: string
  }
}

function SearchOpportunities() {
  const [searchMenuIsOpen, setSearchMenuIsOpen] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const debouncedFilter = useDebounce(searchText, 1000)
  const { data: opportunities, isLoading, isError, isSuccess, isFetching, error } = useOpportunitiesBySearch({ param: debouncedFilter })

  return (
    <div className="relative flex items-center justify-center">
      <button
        onClick={() => setSearchMenuIsOpen((prev) => !prev)}
        className={`h-[46.6px] w-fit rounded-md border border-[#fead61] p-2 px-3 ${
          searchMenuIsOpen ? 'bg-[#fead61]' : 'bg-transparent text-[#fead41]'
        } bg-[#fead61]`}
      >
        <AiOutlineSearch />
      </button>
      {searchMenuIsOpen ? (
        <div className="absolute right-[30] top-[60px] z-[2000] flex h-[150px] w-[270px] flex-col self-center rounded-md border border-gray-200 bg-[#fff] p-2 shadow-sm lg:-top-[5px] lg:right-[110%] lg:w-[350px]">
          <input
            type="text"
            autoFocus={true}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full  bg-transparent p-2 text-center text-sm outline-none"
            placeholder="Preencha aqui o nome do projeto..."
          />
          <div className="overscroll-y flex w-full grow flex-col overflow-y-auto py-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            {isLoading || isFetching ? <LoadingComponent /> : null}
            {isSuccess ? (
              <>
                {opportunities?.map((project) => (
                  <Link href={`/comercial/oportunidades/id/${project._id}`}>
                    <div className="flex w-full cursor-pointer flex-col border-y border-gray-100 px-2 py-2 hover:bg-blue-50">
                      <h1 className="w-full text-start text-sm font-medium text-gray-700">{project.nome}</h1>
                      <div className="flex w-full justify-between">
                        {/* <h1 className="w-full text-start text-xs text-gray-500">{project.responsavel.nome}</h1> */}
                        <h1 className="w-full text-end text-xs text-[#fead61]">{project.identificador}</h1>
                      </div>
                    </div>
                  </Link>
                ))}
              </>
            ) : null}
            {isError ? (
              <div className="flex grow items-center justify-center">
                {error instanceof AxiosError ? (
                  //
                  error.response?.status != undefined && error.response?.status < 500 ? (
                    <p className="text-center text-sm italic text-gray-500">{error.response?.data.error.message}</p>
                  ) : (
                    <p className="text-center text-sm italic text-gray-500">Houve um erro de servidor na busca de projetos. Por favor, tente novamente.</p>
                  )
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default SearchOpportunities
