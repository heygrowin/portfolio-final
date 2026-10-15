'use client'

import React from 'react'

export function NightToDay() {
  return (
    <div
      className="relative w-full h-16 sm:h-24 -mt-8 sm:-mt-12 pointer-events-none z-10"
      aria-hidden="true"
      style={{
        background: 'linear-gradient(to bottom, transparent, var(--bg))',
      }}
    />
  )
}
