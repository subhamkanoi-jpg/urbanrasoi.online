'use client'

import { useEffect, useState } from 'react'

export function MenuBuilderFloat() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.7)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      aria-hidden={!visible}
      className={[
        'fixed bottom-24 left-1/2 z-40 -translate-x-1/2 transition-all duration-300',
        visible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-4 opacity-0 pointer-events-none',
      ].join(' ')}
    >
      <a
        href="/menu.html"
        className="flex items-center gap-2.5 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-background shadow-xl ring-1 ring-ink/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-terracotta-deep hover:shadow-2xl active:scale-95"
        tabIndex={visible ? 0 : -1}
      >
        {/* Fork icon */}
        <svg viewBox="0 0 20 20" fill="currentColor" className="size-4 shrink-0" aria-hidden="true">
          <path d="M3 2a1 1 0 0 1 1 1v3.586l.293-.293a1 1 0 0 1 1.414 1.414l-2 2a1 1 0 0 1-1.414 0l-2-2A1 1 0 0 1 1.293 6.293L2 7V3a1 1 0 0 1 1-1Z" />
          <path fillRule="evenodd" d="M9 2a1 1 0 0 1 1 1v4.764l5.447 8.608A1 1 0 0 1 14.553 18H5.447a1 1 0 0 1-.894-1.447L10 7.764V3a1 1 0 0 1 1-1H9Z" clipRule="evenodd" />
        </svg>
        Build Your Menu
        <span className="font-light opacity-60" aria-hidden="true">→</span>
      </a>
    </div>
  )
}
