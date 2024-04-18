import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MdDashboard, MdLogout, MdNotifications, MdNotificationsActive, MdOutlineMiscellaneousServices } from 'react-icons/md'
import { FaProjectDiagram, FaTag, FaUser, FaUsers } from 'react-icons/fa'
import { TfiAngleRight } from 'react-icons/tfi'
import { BsBookmarksFill, BsCart, BsFillClipboardDataFill, BsFillGearFill, BsGraphUpArrow, BsPatchCheckFill } from 'react-icons/bs'
import SidebarItem from './SidebarItem'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Logo from '../utils/images/ampere-logo-azul.png'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

import { BiStats } from 'react-icons/bi'
import { IoMdSettings } from 'react-icons/io'
import { Session } from 'next-auth'

//react-icons.github.io/react-icons

type SidebarProps = {
  session: Session
}
export const Sidebar = ({ session }: SidebarProps) => {
  const { crm: userHasCRMAccess, projetos: userHasProjectsAccess } = session?.user.modulos || {}
  const [sidebarExtended, setSidebarExtended] = useState(false)
  const { pathname, push } = useRouter()
  if (pathname.includes('/auth/signin')) return null
  return (
    <AnimatePresence>
      <motion.div
        layout={true}
        transition={{
          type: 'keyframes',
          ease: 'easeInOut',
          delay: 0.1,
        }}
        style={{ maxHeight: '100vh' }}
        className={`overscroll-y sticky top-0 z-[90] hidden flex-col overflow-y-auto border-r border-gray-200 bg-[#fff] px-2  py-4 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 md:flex ${
          sidebarExtended ? 'w-[210px] min-w-[210px]' : 'w-[70px] min-w-[70px]'
        }`}
      >
        <div className="flex h-[70px] w-full items-start justify-center">
          <div className="relative h-[37px] w-[37px]">
            <Image src={Logo} alt="LOGO" title="LOGO" fill={true} />
          </div>
        </div>
        <div className="flex w-full grow flex-col">
          <motion.div
            animate={sidebarExtended ? 'active' : 'inactive'}
            variants={{
              inactive: {
                rotate: 0,
              },
              active: {
                rotate: 180,
              },
            }}
            onClick={() => setSidebarExtended((prev) => !prev)}
            className={`my-2  flex w-fit cursor-pointer items-center justify-center self-center rounded p-2  text-[#264653] duration-300 ease-in hover:scale-105`}
          >
            <TfiAngleRight />
          </motion.div>
          {sidebarExtended ? <h2 className="h-[18px] text-xs text-gray-500">PRINCIPAL</h2> : <div className="h-[18px] w-full "></div>}
          <SidebarItem text="Dashboard" isOpen={sidebarExtended} url="/" icon={<BiStats style={{ fontSize: '15px', color: '#264653' }} />} />
          <SidebarItem
            text="Projetos"
            isOpen={sidebarExtended}
            url="/comercial/oportunidades"
            icon={<MdDashboard style={{ fontSize: '15px', color: '#264653' }} />}
          />
          <SidebarItem text="Clientes" isOpen={sidebarExtended} url="/clientes" icon={<FaUser style={{ fontSize: '15px', color: '#264653' }} />} />
          {sidebarExtended ? <h2 className="mt-2 h-[18px] text-xs text-gray-500">COMPOSIÇÕES</h2> : <div className="mt-2 h-[18px]"></div>}
          <SidebarItem text="Kits" isOpen={sidebarExtended} url="/kits" icon={<FaTag style={{ fontSize: '15px', color: '#264653' }} />} />
          <SidebarItem
            text="Planos de assinatura"
            isOpen={sidebarExtended}
            url="/planos"
            icon={<BsBookmarksFill style={{ fontSize: '15px', color: '#264653' }} />}
          />
          <SidebarItem text="Produtos" isOpen={sidebarExtended} url="/produtos" icon={<BsCart style={{ fontSize: '15px', color: '#264653' }} />} />
          <SidebarItem
            text="Serviços"
            isOpen={sidebarExtended}
            url="/servicos"
            icon={<MdOutlineMiscellaneousServices style={{ fontSize: '15px', color: '#264653' }} />}
          />
          {sidebarExtended ? <h2 className="mt-2 h-[18px] text-xs text-gray-500">OPERACIONAL</h2> : <div className="mt-2 h-[18px]"></div>}
          <SidebarItem
            text="Homologações"
            isOpen={sidebarExtended}
            url="/operacional/homologacoes"
            icon={<FaProjectDiagram style={{ fontSize: '15px', color: '#264653' }} />}
          />
        </div>
        {/* <NotificationBlock sidebarExtended={sidebarExtended} /> */}
        {session?.user.avatar_url ? (
          <div className="flex w-full items-center justify-center">
            <Link href={`/auth/perfil?id=${session.user.id}`}>
              <div className="relative h-[37px] w-[37px]">
                <Image src={session?.user.avatar_url} alt="USUÁRIO" title="CONFIGURAÇÕES" fill={true} style={{ borderRadius: '100%' }} />
              </div>
            </Link>
          </div>
        ) : null}
        <div className="flex w-full flex-col">
          <SidebarItem
            text="Configurações"
            isOpen={sidebarExtended}
            url={'/configuracoes'}
            icon={<IoMdSettings style={{ fontSize: '15px', color: '#264653' }} />}
          />
          <div className={`mt-2 flex cursor-pointer items-center justify-center rounded p-2  duration-300 ease-in  hover:bg-blue-100`}>
            <MdLogout
              onClick={() => {
                signOut({ redirect: false })
                push('/auth/signin')
              }}
              style={{
                fontSize: '15px',
                color: '#264653',
                cursor: 'pointer',
                alignSelf: 'center',
              }}
            />
          </div>
        </div>
      </motion.div>
      <div
        className={`sticky  z-[90] flex flex-col ${
          sidebarExtended ? 'h-fit' : 'h-[50px] '
        } w-full items-center border-t border-gray-200 bg-[#fff] pb-4 md:hidden`}
      >
        <div className="grid h-[50px] w-full grid-cols-3">
          <div className="col-span-1 flex items-center justify-center gap-2">
            {session?.user.avatar_url ? (
              <div className="flex h-full w-fit items-center justify-center">
                <Link href={`/auth/perfil?id=${session.user.id}`}>
                  <div className="relative h-[33px] w-[33px]">
                    <Image src={session?.user.avatar_url} alt="USUÁRIO" title="CONFIGURAÇÕES" fill={true} style={{ borderRadius: '100%' }} />
                  </div>
                </Link>
              </div>
            ) : null}
            {/* <NotificationBlock sidebarExtended={sidebarExtended} /> */}
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <div className="flex h-[37px] w-full items-start justify-center">
              <Link href={'/'}>
                <div className="relative h-[37px] w-[37px]">
                  <Image src={Logo} alt="LOGO" title="LOGO" fill={true} />
                </div>
              </Link>
            </div>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <motion.div
              animate={sidebarExtended ? 'active' : 'inactive'}
              variants={{
                inactive: {
                  rotate: 90,
                },
                active: {
                  rotate: -90,
                },
              }}
              transition={{ duration: 0.1 }}
              onClick={() => setSidebarExtended((prev) => !prev)}
              className={`my-2 flex w-fit cursor-pointer items-center justify-center self-center rounded p-2  text-[#264653] duration-300 ease-in hover:scale-105`}
            >
              <TfiAngleRight />
            </motion.div>
          </div>
        </div>
        {sidebarExtended ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { opacity: 1, y: 0 },
              hidden: { opacity: 0, y: '-50%' },
            }}
            transition={{ duration: 0.25 }}
            className="flex h-[40px] w-full flex-wrap items-center justify-center gap-2"
          >
            <div className="flex items-center justify-center p-2 text-[#264653] duration-300 ease-in hover:scale-105 hover:bg-blue-100">
              <Link href={'/'}>
                <BiStats style={{ fontSize: '15px', color: '#264653' }} />
              </Link>
            </div>
            <div className="flex items-center justify-center p-2 text-[#264653] duration-300 ease-in hover:scale-105 hover:bg-blue-100">
              <Link href={'/comercial/oportunidades'}>
                <MdDashboard />
              </Link>
            </div>
            <div className="flex items-center justify-center p-2 text-[#264653] duration-300 ease-in hover:scale-105 hover:bg-blue-100">
              <Link href={'/clientes'}>
                <FaUser />
              </Link>
            </div>
            <div className="flex items-center justify-center p-2 text-[#264653] duration-300 ease-in hover:scale-105 hover:bg-blue-100">
              <Link href={'/kits'}>
                <FaTag />
              </Link>
            </div>
            <div className="flex items-center justify-center p-2 text-[#264653] duration-300 ease-in hover:scale-105 hover:bg-blue-100">
              <Link href={'/planos'}>
                <BsBookmarksFill />
              </Link>
            </div>
            <div className="flex items-center justify-center p-2 text-[#264653] duration-300 ease-in hover:scale-105 hover:bg-blue-100">
              <Link href={'/produtos'}>
                <BsCart />
              </Link>
            </div>
            <div className="flex items-center justify-center p-2 text-[#264653] duration-300 ease-in hover:scale-105 hover:bg-blue-100">
              <Link href={'/servicos'}>
                <MdOutlineMiscellaneousServices />
              </Link>
            </div>
          </motion.div>
        ) : null}
      </div>
    </AnimatePresence>
  )
  // return (
  //   <>
  //     <nav className="overscroll-y sticky top-0 z-[90] hidden h-screen w-24 flex-col space-y-8 overflow-y-auto border-r bg-white scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 md:flex">
  //       <div className="flex h-full flex-col">
  //         <div className="flex h-20 w-full items-center justify-center px-8">
  //           <Link href={'/'}>
  //             <div className="h-[30px] w-[30px]">
  //               <Image src={Logo} height={30} width={30} alt="LOGO" />
  //             </div>
  //           </Link>
  //         </div>
  //         <div className="flex grow flex-col gap-4 px-4 text-sm font-medium">
  //           <Link href={'/'}>
  //             <div className="group relative flex items-center justify-center gap-x-2 rounded-lg p-2  text-gray-600 duration-150 hover:bg-gray-50 active:bg-gray-100">
  //               <div className="text-gray-500">
  //                 <BiStats style={{ fontSize: '17px' }} />
  //               </div>
  //               <span className="absolute bottom-7 hidden whitespace-nowrap rounded-md bg-gray-800 p-1 px-1.5 text-[0.65rem] text-white duration-150 group-hover:inline-block group-focus:hidden">
  //                 Dashboard
  //               </span>
  //             </div>
  //           </Link>
  //           <Link href={'/comercial/oportunidades'}>
  //             <div className="group relative flex items-center justify-center gap-x-2 rounded-lg p-2  text-gray-600 duration-150 hover:bg-gray-50 active:bg-gray-100">
  //               <div className="text-gray-500">
  //                 <MdDashboard style={{ fontSize: '17px' }} />
  //               </div>
  //               <span className="absolute bottom-7 hidden whitespace-nowrap rounded-md bg-gray-800 p-1 px-1.5 text-[0.65rem] text-white duration-150 group-hover:inline-block group-focus:hidden">
  //                 Oportunidades
  //               </span>
  //             </div>
  //           </Link>
  //           <Link href={'/clientes'}>
  //             <div className="group relative flex items-center justify-center gap-x-2 rounded-lg p-2  text-gray-600 duration-150 hover:bg-gray-50 active:bg-gray-100">
  //               <div className="text-gray-500">
  //                 <FaUser style={{ fontSize: '17px' }} />
  //               </div>
  //               <span className="absolute bottom-7 hidden whitespace-nowrap rounded-md bg-gray-800 p-1 px-1.5 text-[0.65rem] text-white duration-150 group-hover:inline-block group-focus:hidden">
  //                 Clientes
  //               </span>
  //             </div>
  //           </Link>
  //           <Link href={'/kits'}>
  //             <div className="group relative flex items-center justify-center gap-x-2 rounded-lg p-2  text-gray-600 duration-150 hover:bg-gray-50 active:bg-gray-100">
  //               <div className="text-gray-500">
  //                 <FaTag style={{ fontSize: '17px' }} />
  //               </div>
  //               <span className="absolute bottom-7 hidden whitespace-nowrap rounded-md bg-gray-800 p-1 px-1.5 text-[0.65rem] text-white duration-150 group-hover:inline-block group-focus:hidden">
  //                 Kits
  //               </span>
  //             </div>
  //           </Link>
  //           {/* <Link href={'/planos'}>
  //             <div className="group relative flex items-center justify-center gap-x-2 rounded-lg p-2  text-gray-600 duration-150 hover:bg-gray-50 active:bg-gray-100">
  //               <div className="text-gray-500">
  //                 <BsBookmarksFill style={{ fontSize: '17px' }} />
  //               </div>
  //               <span className="absolute bottom-7 hidden whitespace-nowrap rounded-md bg-gray-800 p-1 px-1.5 text-[0.65rem] text-white duration-150 group-hover:inline-block group-focus:hidden">
  //                 Planos
  //               </span>
  //             </div>
  //           </Link> */}
  //           <Link href={'/operacional/analises-tecnicas'}>
  //             <div className="group relative flex items-center justify-center gap-x-2 rounded-lg p-2  text-gray-600 duration-150 hover:bg-gray-50 active:bg-gray-100">
  //               <div className="text-gray-500">
  //                 <BsFillClipboardDataFill style={{ fontSize: '17px' }} />
  //               </div>
  //               <span className="absolute bottom-7 hidden whitespace-nowrap rounded-md bg-gray-800 p-1 px-1.5 text-[0.65rem] text-white duration-150 group-hover:inline-block group-focus:hidden">
  //                 Análises
  //               </span>
  //             </div>
  //           </Link>
  //           {userHasProjectsAccess ? (
  //             <Link href={'/operacional/homologacoes'}>
  //               <div className="group relative flex items-center justify-center gap-x-2 rounded-lg p-2  text-gray-600 duration-150 hover:bg-gray-50 active:bg-gray-100">
  //                 <div className="text-gray-500">
  //                   <BsPatchCheckFill style={{ fontSize: '17px' }} />
  //                 </div>
  //                 <span className="absolute bottom-7 hidden whitespace-nowrap rounded-md bg-gray-800 p-1 px-1.5 text-[0.65rem] text-white duration-150 group-hover:inline-block group-focus:hidden">
  //                   Homologações
  //                 </span>
  //               </div>
  //             </Link>
  //           ) : null}
  //         </div>

  //         <div className="flex w-full flex-col gap-2 px-4  pb-4">
  //           <Link href={'/configuracoes'}>
  //             <div className="group relative flex items-center justify-center gap-x-2 rounded-lg p-2  text-gray-600 duration-150 hover:bg-gray-50 active:bg-gray-100">
  //               <div className="text-gray-500">
  //                 <BsFillGearFill style={{ fontSize: '17px' }} />
  //               </div>
  //               <span className="absolute bottom-7 hidden whitespace-nowrap rounded-md bg-gray-800 p-1 px-1.5 text-[0.65rem] text-white duration-150 group-hover:inline-block group-focus:hidden">
  //                 Configurações
  //               </span>
  //             </div>
  //           </Link>
  //           {session?.user.avatar_url ? (
  //             <div className="flex w-full items-center justify-center">
  //               <div className="relative h-[37px] w-[37px]">
  //                 <Image src={session?.user.avatar_url} alt="USUÁRIO" title="CONFIGURAÇÕES" fill={true} style={{ borderRadius: '100%' }} />
  //               </div>
  //             </div>
  //           ) : null}
  //           <button
  //             onClick={() => signOut({ redirect: true, callbackUrl: '/auth/signin' })}
  //             className="group relative flex items-center justify-center gap-x-2 rounded-lg p-2  text-gray-600 duration-150 hover:bg-gray-50 active:bg-gray-100"
  //           >
  //             <div className="text-gray-500">
  //               <MdLogout style={{ fontSize: '17px' }} />
  //             </div>
  //             <span className="absolute bottom-7 hidden whitespace-nowrap rounded-md bg-gray-800 p-1 px-1.5 text-[0.65rem] text-white duration-150 group-hover:inline-block group-focus:hidden">
  //               Sair
  //             </span>
  //           </button>
  //         </div>
  //       </div>
  //     </nav>
  //   </>
  // )
  // return (
  //   <divnimatePresence>
  //     <motion.div
  //       layout={true}
  //       transition={{
  //         type: 'keyframes',
  //         ease: 'easeInOut',
  //         delay: 0.1,
  //       }}
  //       style={{ maxHeight: '100vh' }}
  //       className={`overscroll-y sticky top-0 z-[90] hidden flex-col overflow-y-auto border-r border-gray-200 bg-[#fff] px-2  py-4 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 md:flex ${
  //         sidebarExtended ? 'w-[210px] min-w-[210px]' : 'w-[70px] min-w-[70px]'
  //       }`}
  //     >
  //       <div className="flex h-[70px] w-full items-start justify-center">
  //         <div className="relative h-[37px] w-[37px]">
  //           <Image src={Logo} alt="LOGO" title="LOGO" fill={true} />
  //         </div>
  //       </div>
  //       <div className="flex w-full grow flex-col">
  //         <motion.div
  //           animate={sidebarExtended ? 'active' : 'inactive'}
  //           variants={{
  //             inactive: {
  //               rotate: 0,
  //             },
  //             active: {
  //               rotate: 180,
  //             },
  //           }}
  //           onClick={() => setSidebarExtended((prev) => !prev)}
  //           className={`my-2 flex w-fit cursor-pointer items-center justify-center self-center rounded p-2  text-[#264653] duration-300 ease-in hover:scale-105`}
  //         >
  //           <TfiAngleRight />
  //         </motion.div>
  //         {sidebarExtended ? <h2 className="h-[18px] text-xs text-gray-500">PRINCIPAL</h2> : <div className="h-[18px] w-full "></div>}
  //         <SidebarItem text="Dashboard" isOpen={sidebarExtended} url="/" icon={<ImStatsDots style={{ fontSize: '17px', color: '#264653' }} />} />
  //         <SidebarItem
  //           text="Projetos"
  //           isOpen={sidebarExtended}
  //           url="/principal"
  //           icon={<MdDashboard style={{ fontSize: '17px', color: '#264653' }} />}
  //         />
  //         <SidebarItem
  //           text="Reativação"
  //           isOpen={sidebarExtended}
  //           url="/projeto/perdidos"
  //           icon={<RxReload style={{ fontSize: '17px', color: '#264653' }} />}
  //         />
  //         {sidebarExtended ? <h2 className="mt-2 h-[18px] text-xs text-gray-500">CADASTROS</h2> : <div className="mt-2 h-[18px]"></div>}
  //         <SidebarItem text="Clientes" isOpen={sidebarExtended} url="/clientes" icon={<FaUser style={{ fontSize: '17px', color: '#264653' }} />} />
  //         <SidebarItem text="Kits" isOpen={sidebarExtended} url="/kits" icon={<FaTag style={{ fontSize: '17px', color: '#264653' }} />} />
  //       </div>
  //       <NotificationBlock sidebarExtended={sidebarExtended} />
  //       {session?.user.image ? (
  //         <div className="flex w-full items-center justify-center">
  //           <Link href={`/auth/perfil?id=${session.user.id}`}>
  //             <div className="relative h-[37px] w-[37px]">
  //               <Image src={session?.user.image} alt="USUÁRIO" title="CONFIGURAÇÕES" fill={true} style={{ borderRadius: '100%' }} />
  //             </div>
  //           </Link>
  //         </div>
  //       ) : null}
  //       <div className="flex w-full flex-col">
  //         {session?.user.permissoes.usuarios.visualizar ? (
  //           <SidebarItem
  //             text="Controle de Usuários"
  //             isOpen={sidebarExtended}
  //             url={'/auth/usuarios'}
  //             icon={<FaUsers style={{ fontSize: '17px', color: '#264653' }} />}
  //           />
  //         ) : null}
  //         <div className={`mt-2 flex cursor-pointer items-center justify-center rounded p-2  duration-300 ease-in  hover:bg-blue-100`}>
  //           <MdLogout
  //             onClick={() => {
  //               signOut({ redirect: false })
  //               push('/auth/signin')
  //             }}
  //             style={{
  //               fontSize: '17px',
  //               color: '#264653',
  //               cursor: 'pointer',
  //               alignSelf: 'center',
  //             }}
  //           />
  //         </div>
  //       </div>
  //     </motion.div>
  //     <div
  //       className={`sticky  z-[90] flex flex-col ${
  //         sidebarExtended ? 'h-[90px]' : 'h-[50px] '
  //       } w-full items-center border-t border-gray-200 bg-[#fff] md:hidden`}
  //     >
  //       <div className="grid h-[50px] w-full grid-cols-3">
  //         <div className="col-span-1 flex items-center justify-center gap-2">
  //           {session?.user.image ? (
  //             <div className="flex h-full w-fit items-center justify-center">
  //               <Link href={`/auth/perfil?id=${session.user.id}`}>
  //                 <div className="relative h-[33px] w-[33px]">
  //                   <Image src={session?.user.image} alt="USUÁRIO" title="CONFIGURAÇÕES" fill={true} style={{ borderRadius: '100%' }} />
  //                 </div>
  //               </Link>
  //             </div>
  //           ) : null}
  //           <NotificationBlock sidebarExtended={sidebarExtended} />
  //         </div>
  //         <div className="col-span-1 flex items-center justify-center">
  //           <div className="flex h-[37px] w-full items-start justify-center">
  //             <Link href={'/'}>
  //               <div className="relative h-[37px] w-[37px]">
  //                 <Image src={Logo} alt="LOGO" title="LOGO" fill={true} />
  //               </div>
  //             </Link>
  //           </div>
  //         </div>
  //         <div className="col-span-1 flex items-center justify-center">
  //           <motion.div
  //             animate={sidebarExtended ? 'active' : 'inactive'}
  //             variants={{
  //               inactive: {
  //                 rotate: 90,
  //               },
  //               active: {
  //                 rotate: -90,
  //               },
  //             }}
  //             transition={{ duration: 0.1 }}
  //             onClick={() => setSidebarExtended((prev) => !prev)}
  //             className={`my-2 flex w-fit cursor-pointer items-center justify-center self-center rounded p-2  text-[#264653] duration-300 ease-in hover:scale-105`}
  //           >
  //             <TfiAngleRight />
  //           </motion.div>
  //         </div>
  //       </div>
  //       {sidebarExtended ? (
  //         <motion.div
  //           initial="hidden"
  //           animate="visible"
  //           variants={{
  //             visible: { opacity: 1, y: 0 },
  //             hidden: { opacity: 0, y: '-50%' },
  //           }}
  //           transition={{ duration: 0.25 }}
  //           className="flex h-[40px] w-full flex-wrap items-center justify-center gap-2"
  //         >
  //           <div className="flex items-center justify-center p-2 text-[#264653] duration-300 ease-in hover:scale-105 hover:bg-blue-100">
  //             <Link href={'/'}>
  //               <ImStatsDots style={{ fontSize: '17px', color: '#264653' }} />
  //             </Link>
  //           </div>
  //           <div className="flex items-center justify-center p-2 text-[#264653] duration-300 ease-in hover:scale-105 hover:bg-blue-100">
  //             <Link href={'/principal'}>
  //               <MdDashboard />
  //             </Link>
  //           </div>
  //           <div className="flex items-center justify-center p-2 text-[#264653] duration-300 ease-in hover:scale-105 hover:bg-blue-100">
  //             <Link href={'/projeto/perdidos'}>
  //               <RxReload style={{ fontSize: '17px', color: '#264653' }} />
  //             </Link>
  //           </div>
  //           <div className="flex items-center justify-center p-2 text-[#264653] duration-300 ease-in hover:scale-105 hover:bg-blue-100">
  //             <Link href={'/clientes'}>
  //               <FaUser />
  //             </Link>
  //           </div>
  //           <div className="flex items-center justify-center p-2 text-[#264653] duration-300 ease-in hover:scale-105 hover:bg-blue-100">
  //             <Link href={'/kits'}>
  //               <FaTag />
  //             </Link>
  //           </div>
  //         </motion.div>
  //       ) : null}
  //     </div>
  //   </AnimatePresence>
  // )
}
{
  /**
    <divnimatePresence>
      <motion.div
        variants={{
          hidden: {
            transform: "translateX(-100%)",
          },
          visible: {
            transform: "translateX(0%)",
            transition: { ease: [0.08, 0.65, 0.53, 0.96], duration: 0.6 },
          },
        }}
        initial="hidden"
        animate={sidebarExtended ? "visible" : "hidden"}
        exit={{
          opacity: 0,
          transform: "translateX(-100%)",
          transition: { duration: 100 },
        }}
        style={{ maxHeight: "calc(100vh - 70px)" }}
        className="overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 sticky top-[70px] flex w-full flex-col overflow-y-auto border-r border-gray-200 bg-[#fff] px-2 py-4 md:w-[250px]"
      ></motion.div>
    </AnimatePresence> */
}
