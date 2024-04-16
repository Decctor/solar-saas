import { useUsers } from '@/utils/queries/users'
import React, { useState } from 'react'
import LoadingComponent from '../utils/LoadingComponent'
import ErrorComponent from '../utils/ErrorComponent'
import CardUserControl from '../Cards/User'
import EditUser from '../Modals/User/EditUser'
import { Session } from 'next-auth'
import NewUserModal from '../Modals/User/NewUser'
type UsersProps = {
  session: Session
}
function Users({ session }: UsersProps) {
  const { data: users, isSuccess, isLoading, isError } = useUsers()
  const [newUserModalIsOpen, setUserModalIsOpen] = useState(false)
  const [editUserModal, setEditUserModal] = useState<{ isOpen: boolean; userId: string | null }>({
    isOpen: false,
    userId: null,
  })
  function handleOpenModal(id: string) {
    setEditUserModal({ isOpen: true, userId: id })
  }
  return (
    <div className="flex h-full grow flex-col">
      <div className="flex w-full items-center justify-between border-b border-gray-200 pb-2">
        <div className="flex flex-col">
          <h1 className="text-lg font-bold">Controle de usuários</h1>
          <p className="text-sm text-[#71717A]">Gerencie, adicione e edite os usuários</p>
          <p className="text-sm text-[#71717A]">{isSuccess ? users.length : '0'} usuários atualmente cadastrados</p>
        </div>
        <button
          onClick={() => setUserModalIsOpen(true)}
          className="h-9 whitespace-nowrap rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-gray-800 enabled:hover:text-white"
        >
          NOVO USUÁRIO
        </button>
      </div>
      <div className="flex w-full flex-col gap-2 py-2">
        {isLoading ? <LoadingComponent /> : null}
        {isError ? <ErrorComponent msg="Erro ao buscar usuários" /> : null}
        {isSuccess &&
          users.map((user, index: number) => (
            <CardUserControl key={user._id?.toString()} userInfo={user} admin={user.permissoes.usuarios.editar} openModal={handleOpenModal} />
          ))}
      </div>
      {newUserModalIsOpen ? (
        <NewUserModal
          closeModal={() => setUserModalIsOpen(false)}
          users={users}
          userId={session.user.id}
          partnerId={session.user.idParceiro}
          session={session}
        />
      ) : null}
      {editUserModal.isOpen && editUserModal.userId ? (
        <EditUser
          userId={editUserModal.userId}
          closeModal={() => setEditUserModal({ isOpen: false, userId: null })}
          partnerId={session.user.idParceiro}
          users={users}
          session={session}
        />
      ) : null}
    </div>
  )
}

export default Users
