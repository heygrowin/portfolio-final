'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export interface CinemaProps {
  title?: string
  credit?: string
  line?: string
  videoUrl?: string
  posterUrl?: string
  filmUrl?: string
  hidden?: boolean
  anchorId?: string
}

export function Cinema({
  title = 'Crossing the Genesis',
  credit = 'Written and directed by Harshita & Ansh Rajput',
  line = 'An AI-generated sci-fi film made for the Future Vision XPRIZE competition.',
  videoUrl,
  posterUrl,
  filmUrl = 'https://heygrow.in',
  hidden = true,
  anchorId = 'cinema',
}: CinemaProps) {
  // If hidden is true and there is no video uploaded, keep block hidden
  if (hidden && !videoUrl) {
    return null
  }

  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check reduced motion or Save-Data
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const nav = navigator as any
    const saveData = Boolean(nav.connection && nav.connection.saveData)

    if (prefersReducedMotion || saveData) {
      setShouldLoadVideo(false)
      return
    }

    // IntersectionObserver: lazy load only near viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoadVideo(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id={anchorId}
      ref={containerRef}
      className="w-full py-16 sm:py-20 bg-[#0A2A2A] text-white my-12"
    >
      <div className="max-w-[760px] mx-auto px-5">
        <div className="relative aspect-video rounded-[20px] overflow-hidden bg-black/60 border border-white/10 shadow-2xl">
          {shouldLoadVideo && videoUrl ? (
            <video
              src={videoUrl}
              poster={posterUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            posterUrl && (
              <Image
                src={posterUrl}
                alt={title}
                fill
                className="object-cover"
              />
            )
          )}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-[24px] sm:text-[28px] font-bold text-white tracking-[-0.02em] m-0">
              {title}
            </h3>
            <p className="text-[14px] text-teal-300/80 font-medium mt-1 mb-1">
              {credit}
            </p>
            <p className="text-[15px] text-slate-300 m-0 max-w-[50ch]">
              {line}
            </p>
          </div>

          {filmUrl && (
            <a
              href={filmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-[14px] font-semibold text-[15px] bg-[var(--accent)] text-[#04261C] hover:bg-[#34D399] transition-colors flex-none shadow-sm"
            >
              Watch the film
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
