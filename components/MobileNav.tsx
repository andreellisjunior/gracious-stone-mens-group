'use client'

import { useEffect, useState } from 'react'
import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false)

  useEffect(() => {
    document.body.style.overflow = navShow ? 'hidden' : 'auto'

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setNavShow(false)
      }
    }

    window.addEventListener('keydown', onEscape)
    return () => {
      document.body.style.overflow = 'auto'
      window.removeEventListener('keydown', onEscape)
    }
  }, [navShow])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 640) {
        setNavShow(false)
      }
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const onToggleNav = () => {
    setNavShow((status) => !status)
  }

  return (
    <>
      <button
        aria-label="Toggle Menu"
        onClick={onToggleNav}
        className="rounded-lg border border-primary-900 bg-[#0f2347] p-2 text-gray-100 md:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-6 w-6"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {navShow && (
        <aside className="fixed inset-0 z-50 flex h-screen flex-col bg-[#020814] px-5 pb-6 pt-4 md:hidden">
          <div className="mb-4 flex items-center justify-between border-b border-primary-900 pb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">
              Menu
            </p>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-800 bg-[#172d57] text-gray-100"
              aria-label="Close Menu"
              onClick={onToggleNav}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto">
            <div className="space-y-3 pb-8">
              {headerNavLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="flex min-h-14 w-full items-center rounded-xl border border-primary-900 bg-[#0f2347] px-5 py-4 text-xl font-bold tracking-wide text-gray-100"
                  onClick={() => setNavShow(false)}
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </nav>
        </aside>
      )}
    </>
  )
}

export default MobileNav
