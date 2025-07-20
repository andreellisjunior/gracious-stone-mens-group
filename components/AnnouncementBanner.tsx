'use client'
import React, { useEffect, useState } from 'react'
import AlertModal from './AlertModal'

const AnnouncementBanner = () => {
  const [message, setMessage] = useState('No announcements at the moment')
  const [closestThursday, setClosestThursday] = useState({ month: 0, day: 0 })
  const noGroup = false

  // Add a list of canceled dates
  const canceledDates = [new Date(2025, 7, 24)] // June 12, 2024 (month is 0-indexed)

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
      // console.log(thursdays)

      let closest = new Date(year + 1, 0, 1) // Initialize to a date far in the future
      let closestThursday = { month: 0, day: 0, isToday: false }

      for (const { month, day } of thursdays) {
        for (const d of day) {
          const date = new Date(year, month - 1, d, 21) // 9 PM

          // Skip canceled dates
          if (
            canceledDates.some(
              (canceledDate) =>
                canceledDate.getFullYear() === date.getFullYear() &&
                canceledDate.getMonth() === date.getMonth() &&
                canceledDate.getDate() === date.getDate()
            )
          ) {
            continue
          }

          // Skip past dates
          if (date.getTime() < now.getTime()) continue

          // If today is Thursday and before 9 PM, keep current Thursday
          if (
            now.getDay() === 4 && // Thursday (0 = Sunday, 4 = Thursday)
            now.getHours() < 21 && // Changed from >= 21 to < 21
            now.toDateString() === date.toDateString()
          ) {
            closest = date
            closestThursday = { month, day: d, isToday: true }
            continue
          }

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

    setMessage(
      noGroup
        ? 'No more group until next year! Thanks to everyone that has joined and experienced. See you in 2025!'
        : `Next group meeting is: ${today} at 7:00 PM`
    )
  }, [noGroup])

  return (
    <div className="flex h-8 w-full items-center justify-center bg-primary-300 dark:bg-primary-700">
      <p>{message}</p>
      <AlertModal />
    </div>
  )
}

export default AnnouncementBanner
