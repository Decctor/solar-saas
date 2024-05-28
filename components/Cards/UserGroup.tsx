import { TUserGroupDTOWithUsers } from '@/utils/schemas/user-groups.schema'
import React from 'react'
import { FaUserGroup } from 'react-icons/fa6'
import Avatar from '../utils/Avatar'
import { formatDateAsLocale, formatNameAsInitials } from '@/lib/methods/formatting'
import { FaRegUserCircle } from 'react-icons/fa'
import { BsCalendarPlus } from 'react-icons/bs'

type UserGroupProps = {
  group: TUserGroupDTOWithUsers
  openModal: (id: string) => void
}
function UserGroup({ group, openModal }: UserGroupProps) {
  return (
    <div className="flex w-full flex-col rounded-md border border-gray-200 p-2">
      <div className="flex grow items-center gap-1">
        <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full border border-black p-1">
          <FaUserGroup />
        </div>
        {true ? (
          <p
            onClick={() => openModal(group._id)}
            className="cursor-pointer text-sm font-medium leading-none tracking-tight duration-300 ease-in-out hover:text-cyan-500"
          >
            {group.titulo}
          </p>
        ) : (
          <p className="text-sm font-medium leading-none tracking-tight">{group.titulo}</p>
        )}
      </div>
      <div className="my-2 text-start text-xs tracking-tight text-gray-500">{group.descricao || 'NENHUMA DESCRIÇÃO DEFINIDA.'}</div>
      {group.usuarios ? (
        <>
          <div className="mt-2 flex w-full items-center justify-start gap-2">
            <div className="flex items-center gap-1 text-blue-500">
              <FaRegUserCircle />
              <h1 className="font-Inter text-xs font-bold">{group.usuarios.length}</h1>
            </div>
            <h1 className="font-Inter text-xs text-gray-500">USUÁRIOS</h1>
          </div>
          <div className="mt-2 flex w-full flex-wrap items-start justify-start gap-2">
            {group.usuarios.map((user, index) => {
              if (index < 10)
                return (
                  <div key={user._id} className="flex items-center gap-1">
                    <Avatar url={user.avatar_url || undefined} fallback={formatNameAsInitials(user.nome)} height={15} width={15} />
                    <p className="font-Inter text-xs font-medium text-gray-500">{user.nome}</p>
                  </div>
                )
            })}
            {group.usuarios.length > 10 ? <p className="font-Inter text-xs font-medium text-gray-500">E MAIS...</p> : null}
          </div>
        </>
      ) : null}
      <div className="flex w-full items-center justify-end gap-2">
        <div className={`flex items-center gap-1`}>
          <BsCalendarPlus />
          <p className="text-[0.65rem] font-medium text-gray-500">{formatDateAsLocale(group.dataInsercao, true)}</p>
        </div>
        <div className="flex items-center gap-1">
          <Avatar fallback={formatNameAsInitials(group.autor.nome)} url={group.autor.avatar_url || undefined} height={20} width={20} />
          <p className="text-[0.65rem] font-medium text-gray-500">{group.autor.nome}</p>
        </div>
      </div>
    </div>
  )
}

export default UserGroup
