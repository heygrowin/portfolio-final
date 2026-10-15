'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import { soundManager } from '../lib/audio'

export interface TimelineItemData {
  id?: string
  year: string
  title: string
  line: string
  order?: number
}

export interface GrowthTimelineProps {
  heading?: string
  items: TimelineItemData[]
  anchorId?: string
}

const milestoneMeta: Record<
  string,
  {
    icon: string
    badge: string
    badgeColor: string
    tags: string[]
  }
> = {
  '2022': {
    icon: '🎬',
    badge: 'Stage & Media Systems',
    badgeColor: 'border-purple-500/30 bg-purple-500/10 text-purple-300',
    tags: ['Annual Functions', 'Video & Web', 'Certified 2022 & 2023'],
  },
  '2024': {
    icon: '⚡',
    badge: 'First Production System',
    badgeColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    tags: ['Inventory Architecture', '2+ Years Daily Uptime', 'Zero Quiet Failures'],
  },
  '2025': {
    icon: '🌱',
    badge: 'Social Impact Leadership',
    badgeColor: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    tags: ['Samarpit NGO', 'Girl Rising Project', '4 Months Outreach'],
  },
  '2026': {
    icon: '🎓',
    badge: 'BSc in Data Analysis',
    badgeColor: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
    tags: ['University of Messina, Italy', 'HeyGrowin Expansion', 'Cross-Border Clients'],
  },
  'Now': {
    icon: '🚀',
    badge: 'Actively Building',
    badgeColor: 'border-teal-500/40 bg-teal-500/15 text-teal-300',
    tags: ['Available for Internships', 'Data & Software Engineering', 'Applied AI Systems'],
  },
}

export function GrowthTimeline({
  heading = 'Growth',
  items,
  anchorId = 'timeline',
}: GrowthTimelineProps) {
  if (!items || items.length === 0) return null

  // Ensure items are ordered by their order field
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [items]
  )

  const [activeStep, setActiveStep] = useState<number>(-1)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const lastPlayedStepRef = useRef<number>(-1)

  // Dynamic Scroll-Linked Active Marker
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return

      // Trigger threshold line: 62% down the viewport
      const triggerY = window.innerHeight * 0.62
      let highestReached = -1

      cardRefs.current.forEach((el, idx) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        // If the card has scrolled up into the active viewing area
        if (rect.top <= triggerY) {
          highestReached = idx
        }
      })

      // When a card turns completely white and blown up into view, play Sound 2 (public/2.mp3)
      if (highestReached > lastPlayedStepRef.current && highestReached >= 0) {
        lastPlayedStepRef.current = highestReached
        soundManager.playSubsequentNotification()
      }

      setActiveStep(highestReached)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sortedItems.length])

  return (
    <section id={anchorId} className="w-full py-16 sm:py-24 px-5 max-w-[680px] mx-auto">
      {/* Section Header */}
      <div className="mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-400 text-[12px] font-bold mb-3 uppercase tracking-wider shadow-sm">
          <span>🚀</span>
          <span>Trajectory & Milestones</span>
        </div>
        <h2 className="text-[34px] sm:text-[44px] font-extrabold text-white tracking-[-0.03em] leading-tight m-0 drop-shadow-sm">
          {heading}
        </h2>
        <p className="mt-2.5 text-[16px] sm:text-[17px] text-slate-300 leading-relaxed max-w-[52ch] font-medium">
          From stage audio-visual tech to architecting systems powering live businesses across Italy and India.
        </p>
      </div>

      {/* Vertical Spine Timeline */}
      <div className="relative border-l-2 border-slate-800 ml-4 space-y-10 sm:space-y-12">
        {/* Dynamic Glowing Emerald Path */}
        <div
          className="absolute top-0 -left-[2px] w-[3px] bg-gradient-to-b from-emerald-400 via-teal-400 to-emerald-500 shadow-[0_0_14px_rgba(16,185,129,0.9)] transition-all duration-300 pointer-events-none"
          style={{
            height:
              activeStep >= 0
                ? `${Math.min(100, ((activeStep + 0.6) / sortedItems.length) * 100)}%`
                : '0%',
          }}
          aria-hidden="true"
        />

        {sortedItems.map((item, idx) => {
          const isReached = idx <= activeStep
          const isCurrentActive = idx === activeStep
          const isNowMilestone = item.year.toLowerCase() === 'now'

          const meta = milestoneMeta[item.year] || {
            icon: '📌',
            badge: 'Milestone',
            badgeColor: 'border-slate-700 bg-slate-800/50 text-slate-300',
            tags: [],
          }

          return (
            <div
              key={item.id || idx}
              ref={(el) => {
                cardRefs.current[idx] = el
              }}
              className={`relative pl-8 sm:pl-10 transition-all duration-500 ease-out ${
                isReached ? 'opacity-100 translate-y-0' : 'opacity-60 translate-y-3'
              }`}
            >
              {/* Left Spine Icon Node Marker */}
              <div
                className={`absolute -left-[18px] top-4 w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all duration-500 ${
                  isReached
                    ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-400/50 shadow-[0_0_24px_rgba(16,185,129,0.95)] scale-120 border-2 border-emerald-300 font-extrabold z-10'
                    : 'bg-slate-900 border-2 border-slate-700 text-slate-400 opacity-60 scale-95 z-0'
                } ${isCurrentActive ? 'ring-8 ring-emerald-400/25' : ''}`}
                aria-hidden="true"
              >
                <span className={isReached ? 'drop-shadow-sm scale-110' : ''}>
                  {meta.icon}
                </span>
              </div>

              {/* Card Container - starts dark black before scroll, turns bright white on scroll */}
              <div
                className={`rounded-2xl p-5 sm:p-6 border transition-all duration-500 ${
                  isReached
                    ? 'bg-white dark:bg-[#162032] text-slate-950 dark:text-white border-2 border-emerald-500/80 shadow-2xl shadow-emerald-500/15 scale-[1.01]'
                    : 'bg-[#0B1220] border-slate-800/90 text-slate-400 shadow-sm'
                }`}
              >
                {/* Top Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-extrabold uppercase tracking-wide border transition-colors ${
                      isReached
                        ? 'bg-emerald-500 text-white border-emerald-400 shadow-xs'
                        : 'bg-slate-800/80 text-slate-400 border-slate-700/80'
                    }`}
                  >
                    {item.year}
                  </span>

                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${meta.badgeColor}`}
                  >
                    {meta.badge}
                  </span>

                  {isNowMilestone && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active now
                    </span>
                  )}
                </div>

                {/* Milestone Title */}
                <h3
                  className={`text-[18px] sm:text-[21px] font-extrabold leading-snug m-0 transition-colors ${
                    isReached ? 'text-slate-950 dark:text-white' : 'text-slate-400'
                  }`}
                >
                  {item.title}
                </h3>

                {/* Milestone Description */}
                <p
                  className={`mt-2 text-[14px] sm:text-[15px] leading-relaxed m-0 transition-colors ${
                    isReached ? 'text-slate-700 dark:text-slate-200' : 'text-slate-500'
                  }`}
                >
                  {item.line}
                </p>

                {/* Tags / Pills */}
                {meta.tags && meta.tags.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-1.5">
                    {meta.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-md border transition-colors ${
                          isReached
                            ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700/80'
                            : 'bg-slate-900/60 text-slate-500 border-slate-800'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
