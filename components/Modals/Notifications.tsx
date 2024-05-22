import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import dayjs from 'dayjs'
import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { BsCheck, BsCheckAll, BsFillCalendar3Fill, BsFillCalendarFill } from 'react-icons/bs'
import { FaRobot, FaUserAlt } from 'react-icons/fa'
import { VscChromeClose } from 'react-icons/vsc'
import NotificationCard from '../Cards/Notification'
import { TNotificationDTO } from '@/utils/schemas/notification.schema'
import { Session } from 'next-auth'

type NotificationsProps = {
  notifications: TNotificationDTO[] | undefined
  session: Session
  sidebarExtended: boolean
  closeModal: () => void
}
function Notifications({ sidebarExtended, session, closeModal, notifications }: NotificationsProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.25 }}
        variants={{
          visible: { opacity: 1, scale: 1, borderRadius: '5%' },
          hidden: { opacity: 0, scale: 0.5, borderRadius: '100%' },
        }}
        id="defaultModal"
        className={`fixed ${
          sidebarExtended ? 'bottom-[20%] left-10 md:left-[220px]' : 'bottom-[57%] left-10 md:left-[100px]'
        }  z-[2000] flex h-[350px] w-[350px] flex-col rounded-lg border border-gray-200 bg-[#fff] py-3 shadow-lg md:bottom-[10px]`}
      >
        <div className="flex items-center justify-between border-b border-gray-300 px-3 pb-1">
          <h1 className="text-center text-sm font-medium text-[#15599a]">PAINEL DE NOTIFICAÇÕES</h1>
          <button
            onClick={closeModal}
            type="button"
            className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
          >
            <VscChromeClose style={{ color: 'red' }} />
          </button>
        </div>
        <div className="flex grow flex-col overflow-y-auto overscroll-y-auto p-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
          {notifications ? (
            notifications?.length > 0 ? (
              notifications.map((notification, index) => <NotificationCard key={index} notification={notification} session={session} />)
            ) : (
              <div className="flex grow items-center justify-center">
                <h1 className="text-sm italic text-gray-500">Sem notificações encontradas.</h1>
              </div>
            )
          ) : null}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Notifications
