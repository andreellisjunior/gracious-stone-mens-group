'use client'
import Link from '@/components/Link'
import { useNextMeeting } from '@/components/useNextMeeting'

export default function NextMeetingCard() {
  const { label, isToday } = useNextMeeting()

  return (
    <div className="surface-card flex flex-col justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-700">
          Next meeting
        </p>
        <p
          className={`mt-4 text-3xl font-extrabold leading-tight ${
            isToday ? 'text-primary-300' : 'text-white'
          }`}
        >
          {label || '—'}
        </p>
        <p className="mt-2 text-sm text-gray-400">Every 2nd &amp; 4th Thursday</p>
      </div>
      <div className="mt-5 text-sm font-semibold text-primary-700 dark:text-primary-300">
        <Link href="/about">More info &rarr;</Link>
      </div>
    </div>
  )
}
