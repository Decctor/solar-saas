import React, { useState } from 'react'
import Logo from '@/utils/images/logo.png'
import Image from 'next/image'
import { AiFillThunderbolt } from 'react-icons/ai'
import TextInput from '@/components/Inputs/TextInput'
import FirstStage from '@/components/SignUp/FirstStage'

export type TSignUpHolder = {
  usuario: {
    nome: string
    email: string
  }
  parceiro: {
    id: string | null
    nome: string
    telefone: string
    email: string
    cpfCnpj: string
    cep: string | null
    uf: string | null
    cidade: string | null
  }
  estagiosCadastro: {
    inicio: string | null
    detalhesParceiro: string | null
    usuarios: string | null
    funis: string | null
  }
}

function SignUpPage() {
  const [signUpHolder, setSignUpHolder] = useState<TSignUpHolder>({
    usuario: {
      nome: 
    }
    estagiosCadastro: {
      inicio: null,
      detalhesParceiro: null,
      usuarios: null,
      funis: null,
    },
  })
  if (!signUpHolder.estagiosCadastro.inicio) return <FirstStage signUpHolder={signUpHolder} setSignUpHolder={setSignUpHolder} goToNextStage={() => {}} />
}

export default SignUpPage
