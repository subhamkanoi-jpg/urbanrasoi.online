'use client'

import { useEffect, useState } from 'react'

export function StickyOrderBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling past 300px, and hide when user is actively inside the order card
      const scrollY = window.scrollY
      const orderCard = document.getElementById('order-card')
      let insideOrderCard = false

      if (orderCard) {
        const rect = orderCard.getBoundingClientRect()
        // If order card is largely within viewport, we can keep or hide it
        if (rect.top < window.innerHeight / 2 && rect.bottom > 100) {
          insideOrderCard = true
        }
      }

      if (scrollY > 320 && !insideOrderCard) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleScrollToOrder = () => {
    const el = document.getElementById('order-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 p-3.5 backdrop-blur-md transition-all duration-300 md:hidden shadow-2xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta">
            3rd & 4th Sept Only
          </span>
          <span className="text-xs font-semibold text-ink">
            Nariyal ke Laddu
          </span>
        </div>

        <button
          type="button"
          onClick={handleScrollToOrder}
          className="flex items-center gap-1.5 rounded-full bg-terracotta px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-md transition-transform active:scale-95 cursor-pointer"
        >
          <span>Order Nariyal ke Laddu</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  )
}
