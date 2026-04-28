'use client'

import dynamic from 'next/dynamic'

const ScrollFeatures = dynamic(() => import('./ScrollFeatures'), { ssr: false })

export default function ScrollFeaturesWrapper() {
  return <ScrollFeatures />
}
