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

  // 1. calculate how many days away the next Thursday is, via getDay()
  // 1b. handle if it's today, but after 7pm
  // 2. setDate(getDate() + #1)
  // 3. getDate() to check whether it is an odd or even Thursday
  // 4. If odd, add 7 days to the date
  useEffect(() => {
    function getClosestThursday() {
      const now = new Date()
      const year = now.getFullYear()
      const thursdays = getThursdays(year)
      console.log(thursdays)

      let closest = new Date(year + 1, 0, 1) // Initialize to a date far in the future
      let closestThursday = { month: 0, day: 0, isToday: false }

      for (const { month, day } of thursdays) {
        for (const d of day) {
          const date = new Date(year, month - 1, d, 19)
          if (date.getTime() < now.getTime()) continue // Skip past dates
          if (
            Math.abs(now.getTime() - date.getTime()) < Math.abs(now.getTime() - closest.getTime())
          ) {
            closest = date
            closestThursday = { month, day: d, isToday: now.toDateString() === date.toDateString() }
          }
        }
      }

      return closestThursday
    }

    const nextThursday = getClosestThursday()
    setClosestThursday(nextThursday)

    const todayDate = new Date()

    const today = nextThursday.isToday
      ? 'TODAY'
      : `${new Date(
          todayDate.getFullYear(),
          nextThursday.month - 1,
          nextThursday.day
        ).toLocaleDateString('en', { month: 'long' })} ${nextThursday.day}th`

    setMessage(noGroup ? 'No group this week' : `Next group meeting is: ${today} at 7:00 PM`)
  }, [noGroup])

  return (
    <div className="flex h-8 w-full items-center justify-center bg-primary-300 dark:bg-primary-700">
      <p>{message}</p>
    </div>
  )
}

export default AnnouncementBanner
