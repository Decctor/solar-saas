import React, { useState } from 'react'
import Logo from '@/utils/images/logo.png'
import Image from 'next/image'
import { AiFillThunderbolt } from 'react-icons/ai'
import TextInput from '@/components/Inputs/TextInput'
import FirstStage from '@/components/SignUp/FirstStage'
import SecondStage from '@/components/SignUp/SecondStage'
import ThirdStage from '@/components/SignUp/ThirdStage'
import axios from 'axios'
import { useRouter } from 'next/router'
import { TSignUpSetup, TSignUpSetupWithHolder } from '@/utils/schemas/sign-up-setup.schema'
import { editSignUpSetup } from '@/utils/mutations/sign-up-setup'

function SignUpPage() {
  const router = useRouter()
  const [signUpHolder, setSignUpHolder] = useState<TSignUpSetupWithHolder>({
    usuario: {
      nome: '',
      email: '',
      telefone: '',
    },
    parceiro: {
      id: null,
      nome: '',
      telefone: '',
      email: '',
      cpfCnpj: '',
      cep: null,
      uf: null,
      cidade: null,
    },
    quantidadeUsuarios: 1,
    estagiosCadastro: {
      inicio: null,
      detalhesParceiro: null,
      usuarios: null,
    },
  })

  async function handleFinishSetup() {
    try {
      if (!signUpHolder.setupId) return
      router.push(`/api/signup-setup/subscription?setupId=${signUpHolder.setupId}`)
    } catch (error) {
      throw error
    }
  }
  if (!signUpHolder.estagiosCadastro.inicio) return <FirstStage signUpHolder={signUpHolder} setSignUpHolder={setSignUpHolder} goToNextStage={() => {}} />
  if (!signUpHolder.estagiosCadastro.detalhesParceiro)
    return <SecondStage signUpHolder={signUpHolder} setSignUpHolder={setSignUpHolder} goToNextStage={() => {}} />
  if (!signUpHolder.estagiosCadastro.usuarios)
    return <ThirdStage signUpHolder={signUpHolder} setSignUpHolder={setSignUpHolder} goToNextStage={() => handleFinishSetup()} />
}

export default SignUpPage
