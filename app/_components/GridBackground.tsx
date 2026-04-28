'use client'

import { useEffect, useRef } from 'react'

export default function GridBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      ref.current?.style.setProperty('--mx', `${e.clientX}px`)
      ref.current?.style.setProperty('--my', `${e.clientY}px`)
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <div
      ref={ref}
      className="grid-bg"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  )
}
