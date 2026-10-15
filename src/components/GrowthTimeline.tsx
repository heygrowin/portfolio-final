'use client'

import React, { useEffect, useRef, useState } from 'react'

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

function TimelineCard({
  item,
  isCurrent,
  index,
}: {
  item: TimelineItemData
  isCurrent: boolean
  index: number
}) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const meta = milestoneMeta[item.year] || {
    icon: '📌',
    badge: 'Milestone',
    badgeColor: 'border-slate-700 bg-slate-800/50 text-slate-300',
    tags: [],
  }

  return (
    <div
      ref={cardRef}
      className={`relative pl-8 sm:pl-10 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Node Marker on vertical line */}
      <div
        className={`absolute -left-[17px] top-4 w-9 h-9 rounded-full flex items-center justify-center text-sm shadow-md transition-transform duration-300 ${
          isCurrent
            ? 'bg-teal-500 text-slate-950 ring-4 ring-teal-500/30 scale-110 shadow-teal-500/40'
            : 'bg-slate-900 border-2 border-teal-500/60 text-white hover:scale-110'
        }`}
        aria-hidden="true"
      >
        <span>{meta.icon}</span>
      </div>

      {/* Card Content */}
      <div
        className={`rounded-2xl p-5 sm:p-6 border transition-all duration-300 ${
          isCurrent
            ? 'bg-gradient-to-br from-slate-900/95 via-teal-950/20 to-slate-900/95 border-teal-500/50 shadow-lg shadow-teal-950/40'
            : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800/90 hover:border-teal-500/40 shadow-sm hover:shadow-md'
        }`}
      >
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-extrabold uppercase tracking-wide border ${
              isCurrent
                ? 'bg-teal-400 text-slate-950 border-teal-300 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
            }`}
          >
            {item.year}
          </span>

          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${meta.badgeColor}`}
          >
            {meta.badge}
          </span>

          {isCurrent && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active now
            </span>
          )}
        </div>

        {/* Milestone Title */}
        <h3 className="text-[18px] sm:text-[21px] font-bold text-slate-900 dark:text-white leading-snug m-0">
          {item.title}
        </h3>

        {/* Milestone Description */}
        <p className="mt-2 text-[14px] sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed m-0">
          {item.line}
        </p>

        {/* Tags / Pills */}
        {meta.tags && meta.tags.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-1.5">
            {meta.tags.map((tag, tIdx) => (
              <span
                key={tIdx}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function GrowthTimeline({
  heading = 'Growth',
  items,
  anchorId = 'timeline',
}: GrowthTimelineProps) {
  if (!items || items.length === 0) return null

  // Ensure items are ordered
  const sortedItems = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  return (
    <section id={anchorId} className="w-full py-16 sm:py-24 px-5 max-w-[680px] mx-auto">
      {/* Section Header */}
      <div className="mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-400 text-[12px] font-bold mb-3 uppercase tracking-wider">
          Trajectory & Milestones
        </div>
        <h2 className="text-[34px] sm:text-[44px] font-extrabold text-white tracking-[-0.03em] leading-tight m-0 drop-shadow-sm">
          {heading}
        </h2>
        <p className="mt-2.5 text-[16px] sm:text-[17px] text-slate-300 leading-relaxed max-w-[52ch] font-medium">
          From stage audio-visual tech to architecting systems powering live businesses across Italy and India.
        </p>
      </div>

      {/* Vertical Spine Timeline */}
      <div className="relative border-l-2 border-gradient-to-b from-teal-500 via-emerald-400 to-cyan-500 dark:border-slate-800 ml-4 space-y-9 sm:space-y-11">
        {/* Luminous line overlay */}
        <div
          className="absolute top-0 bottom-0 -left-[2px] w-[3px] bg-gradient-to-b from-teal-400 via-emerald-400 to-cyan-500 opacity-80 shadow-[0_0_8px_rgba(45,212,191,0.5)] pointer-events-none"
          aria-hidden="true"
        />

        {sortedItems.map((item, idx) => {
          const isCurrent = item.year.toLowerCase() === 'now' || idx === sortedItems.length - 1
          return (
            <TimelineCard
              key={item.id || idx}
              item={item}
              isCurrent={isCurrent}
              index={idx}
            />
          )
        })}
      </div>
    </section>
  )
}
