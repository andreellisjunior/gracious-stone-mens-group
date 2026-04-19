'use client'
import { useEffect, useState } from 'react'

// Dates when the group is canceled (YYYY, MM-1, DD)
const CANCELED_DATES: Date[] = [new Date(2026, 0, 22)]

function getThursdays(year: number) {
  const result: { month: number; day: number[] }[] = []
  for (let month = 0; month < 12; month++) {
    let count = 0
    const days: number[] = []
    for (let day = 1; day <= 31; day++) {
      const date = new Date(year, month, day)
      if (date.getMonth() !== month) break
      if (date.getDay() === 4) {
        count++
        if (count === 2 || count === 4) days.push(day)
      }
    }
    if (days.length > 0) result.push({ month: month + 1, day: days })
  }
  return result
}

export function useNextMeeting() {
  const [label, setLabel] = useState<string>('')
  const [isToday, setIsToday] = useState(false)

  useEffect(() => {
    const now = new Date()
    const year = now.getFullYear()
    const thursdays = getThursdays(year)

    let closest = new Date(year + 1, 0, 1)
    let result = { month: 0, day: 0, isToday: false }

    for (const { month, day } of thursdays) {
      for (const d of day) {
        const date = new Date(year, month - 1, d, 21)

        if (
          CANCELED_DATES.some(
            (c) =>
              c.getFullYear() === date.getFullYear() &&
              c.getMonth() === date.getMonth() &&
              c.getDate() === date.getDate()
          )
        )
          continue

        if (date.getTime() < now.getTime()) continue

        const today =
          now.getDay() === 4 && now.getHours() < 21 && now.toDateString() === date.toDateString()

        if (today) {
          closest = date
          result = { month, day: d, isToday: true }
          continue
        }

        if (
          Math.abs(now.getTime() - date.getTime()) < Math.abs(now.getTime() - closest.getTime())
        ) {
          closest = date
          result = { month, day: d, isToday: now.toDateString() === date.toDateString() }
        }
      }
    }

    setIsToday(result.isToday)

    if (result.isToday) {
      setLabel('TODAY at 7:00 PM')
    } else if (result.month) {
      const monthName = new Date(year, result.month - 1, result.day).toLocaleDateString('en', {
        month: 'long',
      })
      setLabel(`${monthName} ${result.day} at 7:00 PM`)
    } else {
      setLabel('Coming soon')
    }
  }, [])

  return { label, isToday }
}
