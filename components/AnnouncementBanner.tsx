'use client'
import React, { useEffect, useState } from 'react'

const AnnouncementBanner = () => {
  const [message, setMessage] = useState('No announcements at the moment')
  const [closestThursday, setClosestThursday] = useState({ month: 0, day: 0 })
  const noGroup = false

  function getThursdays(year: number) {
    const result = [] as { month: number; day: number[] }[]

    for (let month = 0; month < 12; month++) {
      let count = 0
      const days: number[] = []
      for (let day = 1; day <= 31; day++) {
        const date = new Date(year, month, day)
        if (date.getMonth() !== month) break // Exceeded last day of the month
        if (date.getDay() === 4) {
          // 4 stands for Thursday
          count++
          if (count === 2 || count === 4) {
            days.push(day)
          }
        }
      }
      if (days.length > 0) {
        result.push({ month: month + 1, day: days })
      }
    }

    return result
  }

  useEffect(() => {
    function getClosestThursday() {
      const now = new Date()
      const year = now.getFullYear()
      const thursdays = getThursdays(year)

      let closest = new Date(year + 1, 0, 1) // Initialize to a date far in the future
      let closestThursday

      for (const { month, day } of thursdays) {
        for (const d of day) {
          const date = new Date(year, month - 1, d)
          if (date.getTime() < now.getTime()) continue
          if (
            Math.abs(now.getTime() - date.getTime()) < Math.abs(now.getTime() - closest.getTime())
          ) {
            closest = date
            closestThursday = { month, day: d }
          }
        }
      }

      return closestThursday
    }

    const nextThursday = getClosestThursday()
    setClosestThursday(nextThursday)

    setMessage(
      noGroup
        ? 'No group this week'
        : `Next group meeting is: ${new Date(
            new Date().getFullYear(),
            nextThursday.month - 1
          ).toLocaleDateString('en', {
            month: 'long',
          })} ${nextThursday.day}th at 7:00 PM`
    )
  }, [])

  return (
    <div className="flex h-8 w-full items-center justify-center bg-primary-300 dark:bg-primary-700">
      <p>{message}</p>
    </div>
  )
}

export default AnnouncementBanner
