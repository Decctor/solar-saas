import React, { useState } from 'react'
import Image from 'next/image'
import WorkingIllustration from '../../utils/svgs/working.svg'
import Logo from '../../utils/images/logo.png'
import { IMessage } from '@/utils/models'
import { signIn } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'
import { AiFillThunderbolt } from 'react-icons/ai'
import Link from 'next/link'

type LoginTypes = {
  email: string
  password: string
}

function SignIn() {
  const { push } = useRouter()

  const [user, setUser] = useState<LoginTypes>({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState<boolean>(false)

  async function handleLogin() {
    setLoading(true)
    let signInResponse = await signIn('credentials', {
      email: user.email,
      password: user.password,
      redirect: false,
    })
    console.log(signInResponse)
    if (!signInResponse?.ok) {
      toast.error(signInResponse?.error ? signInResponse?.error : 'Erro ao fazer login.')
      setLoading(false)
    }

    if (signInResponse?.ok) {
      push('/')
      setLoading(false)
    }
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#091c2e] p-3 lg:flex-row">
      <div className="flex h-fit w-full flex-col items-center justify-center px-2 py-4 lg:h-full lg:w-[60%] lg:px-4 lg:py-6">
        <Image src={Logo} height={250} width={250} alt="Logo CRM" />
        <h1 className="w-full text-center text-2xl font-black text-white lg:text-4xl">Sua experiência completa de vendas.</h1>
      </div>
      <div className="flex h-full w-full flex-col items-center rounded-md bg-[#fff] p-6 py-10 lg:w-[40%]">
        <div className="flex w-full items-center justify-center gap-2 font-Inter">
          <h1 className="text-3xl font-black text-cyan-500">Seja bem vindo !</h1>
          <AiFillThunderbolt size={27} color="#fead41" />
        </div>
        <div className="flex w-[80%] grow flex-col items-center justify-center self-center">
          <h1 className="mt-4 w-full text-start font-Inter text-xl font-bold leading-none tracking-tight">Faça aqui o seu login</h1>
          <div className="mt-12 w-full">
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Email
            </label>
            <input
              value={user.email}
              onChange={(e) => setUser((prev) => ({ ...prev, email: e.target.value }))}
              type="text"
              name="email"
              id="email"
              className="block w-full rounded-lg  border border-gray-300 p-2.5 text-gray-900 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
              placeholder="seuemail@email.com"
            />
          </div>
          <div className="mt-4 w-full">
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Senha
            </label>
            <input
              value={user.password}
              onChange={(e) => setUser((prev) => ({ ...prev, password: e.target.value }))}
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="block w-full rounded-lg  border border-gray-300 p-2.5 text-gray-900 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="mt-12 flex w-full items-end justify-end gap-2">
            <button
              onClick={() => handleLogin()}
              className="w-full rounded-md border border-black px-6 py-2 font-medium duration-300 ease-in-out hover:bg-black hover:text-white"
            >
              Entrar
            </button>
          </div>
          <div className="mt-4 flex w-full items-center justify-center">
            <p className="text-sm tracking-tight">
              Ainda não é parceiro ?{' '}
              <Link href={'/auth/signup'}>
                <strong className="text-cyan-500">Clique aqui para começar !</strong>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
