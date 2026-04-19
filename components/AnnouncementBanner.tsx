'use client'
import { useNextMeeting } from '@/components/useNextMeeting'
import React from 'react'
import AlertModal from './AlertModal'

const AnnouncementBanner = () => {
  const { label } = useNextMeeting()
  const message = label ? `Next group meeting is: ${label}` : 'No announcements at the moment'

  return (
    <div className="flex h-8 w-full items-center justify-center bg-primary-300 dark:bg-primary-700">
      <p>{message}</p>
      <AlertModal />
    </div>
  )
}

export default AnnouncementBanner
