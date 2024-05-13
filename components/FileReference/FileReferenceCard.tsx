import { useKey } from '@/lib/hooks'
import { handleDownload } from '@/lib/methods/download'
import { formatDateAsLocale } from '@/lib/methods/formatting'
import { renderIcon } from '@/lib/methods/rendering'
import { storage } from '@/services/firebase/storage-config'
import { fileTypes } from '@/utils/constants'
import { TFileReferenceDTO } from '@/utils/schemas/file-reference.schema'
import axios from 'axios'
import { FullMetadata, getMetadata, ref } from 'firebase/storage'
import JSZip from 'jszip'
import { basename } from 'path'
import React from 'react'
import toast from 'react-hot-toast'
import { AiFillFile } from 'react-icons/ai'
import { BsCalendarPlus } from 'react-icons/bs'
import { TbDownload } from 'react-icons/tb'
import Avatar from '../utils/Avatar'

function handleRenderIcon(format: string) {
  //   useKey('Escape', () => setSelectMenuIsOpen(false))
  const extensionInfo = Object.values(fileTypes).find((f) => f.title == format)
  if (!extensionInfo)
    return (
      <div className="text-lg text-black">
        <AiFillFile />
      </div>
    )
  return <div className="text-lg text-black">{renderIcon(extensionInfo.icon)}</div>
}
type FileReferenceCardProps = {
  info: TFileReferenceDTO
}
function FileReferenceCard({ info }: FileReferenceCardProps) {
  return (
    <div className="flex w-full flex-col rounded-md border border-cyan-500 p-2">
      <div className="flex w-full items-center gap-2">
        {handleRenderIcon(info.formato)}
        <a href={info.url} className="text-sm font-bold leading-none tracking-tight text-gray-500 duration-300 ease-in-out hover:text-cyan-500">
          {info.titulo}
        </a>
      </div>
      <div className="mt-1 flex  w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <h1 className="text-center text-xs font-medium italic text-gray-500">{info.formato}</h1>
        <div className="flex flex-col items-center gap-2 lg:flex-row">
          <div className={`flex items-center gap-1`}>
            <BsCalendarPlus />
            <p className="text-[0.65rem] font-medium text-gray-500">{formatDateAsLocale(info.dataInsercao, true)}</p>
          </div>
          <div className="flex items-center gap-1">
            <Avatar fallback={'R'} url={info.autor.avatar_url || undefined} height={20} width={20} />
            <p className="text-[0.65rem] font-medium text-gray-500">{info.autor.nome}</p>
          </div>
          <div
            onClick={() => handleDownload({ fileName: info.titulo, fileUrl: info.url })}
            className="flex cursor-pointer items-center justify-center text-blue-700 duration-300 ease-in-out hover:scale-105 hover:text-blue-500"
          >
            <TbDownload />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileReferenceCard
