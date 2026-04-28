'use client'

import dynamic from 'next/dynamic'

const ScrollStory = dynamic(() => import('./ScrollStory'), { ssr: false })

export default function HeroWrapper() {
  return <ScrollStory />
}
