'use client'

import React, { useEffect, useRef, useState } from 'react'

export interface AchievementItemData {
  id?: string
  title: string
  detail: string
  year: string
  order?: number
}

export interface AchievementsProps {
  heading?: string
  items: AchievementItemData[]
  anchorId?: string
}

interface AwardMetadata {
  icon: string
  medal: string
  medalColor: string
  category: string
  highlight?: boolean
}

function getAwardMeta(title: string, detail: string): AwardMetadata {
  const lower = (title + ' ' + detail).toLowerCase()

  if (lower.includes('cyber olympiad') || lower.includes('gold medal')) {
    return {
      icon: '🥇',
      medal: 'Gold Medal of Distinction',
      medalColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/20',
      category: 'National Cyber Olympiad',
      highlight: true,
    }
  }
  if (lower.includes('robotics') || lower.includes('ai')) {
    return {
      icon: '🤖',
      medal: '🥈 2nd Place',
      medalColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/20',
      category: 'AI & Robotics Competition',
    }
  }
  if (lower.includes('cyber in-charge') || lower.includes('evolv')) {
    return {
      icon: '🛡️',
      medal: 'Technical Leadership',
      medalColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-blue-500/20',
      category: 'Event Organizer & In-Charge',
    }
  }
  if (lower.includes('video')) {
    return {
      icon: '🎬',
      medal: '🥉 3rd Place',
      medalColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-purple-500/20',
      category: 'Multimedia & Direction',
    }
  }
  if (lower.includes('snapshot') || lower.includes('photography')) {
    return {
      icon: '📷',
      medal: '🥈 2nd Place',
      medalColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-500/20',
      category: 'Snapshot Photography',
    }
  }

  return {
    icon: '🏆',
    medal: 'Honored Distinction',
    medalColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-teal-500/20',
    category: 'Competitive Recognition',
  }
}

export function Achievements({
  heading = 'Achievements',
  items,
  anchorId = 'achievements',
}: AchievementsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  if (!items || items.length === 0) return null

  // Ensure items are ordered
  const sortedItems = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  const flagshipItem = sortedItems.find((i) =>
    (i.title + i.detail).toLowerCase().includes('cyber olympiad')
  ) || sortedItems[0]

  const supportingItems = sortedItems.filter((i) => i !== flagshipItem)

  const flagshipMeta = getAwardMeta(flagshipItem.title, flagshipItem.detail)

  return (
    <section
      ref={sectionRef}
      id={anchorId}
      className="w-full py-16 sm:py-24 px-5 max-w-[680px] mx-auto"
    >
      {/* Section Header */}
      <div className="mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[12px] font-bold mb-3 uppercase tracking-wider shadow-sm">
          <span>🏆</span>
          <span>Honors & Distinctions</span>
        </div>
        <h2 className="text-[34px] sm:text-[44px] font-extrabold text-white tracking-[-0.03em] leading-tight m-0 drop-shadow-sm">
          {heading}
        </h2>
        <p className="mt-2.5 text-[16px] sm:text-[17px] text-slate-300 leading-relaxed max-w-[50ch] font-medium">
          National Olympiad ranks, technical competitions, and school technology leadership.
        </p>
      </div>

      <div
        className={`flex flex-col gap-5 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* ========================================================
            FEATURED FLAGSHIP: SOF NATIONAL CYBER OLYMPIAD
            ======================================================== */}
        {flagshipItem && (
          <div className="relative rounded-[24px] p-6 sm:p-7 bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-900 border-2 border-amber-500/40 shadow-xl shadow-amber-950/20 overflow-hidden group hover:border-amber-400 transition-all">
            {/* Ambient gold glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col gap-4 relative z-10">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-extrabold border uppercase tracking-wider ${flagshipMeta.medalColor}`}
                >
                  <span>{flagshipMeta.icon}</span>
                  <span>{flagshipMeta.medal}</span>
                </span>
                <span className="text-[12px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
                  {flagshipItem.year}
                </span>
              </div>

              <div>
                <h3 className="text-[20px] sm:text-[23px] font-extrabold text-white leading-snug m-0">
                  {flagshipItem.title}
                </h3>
                <p className="mt-2 text-[14px] sm:text-[15px] text-slate-200 leading-relaxed m-0 font-medium">
                  {flagshipItem.detail}
                </p>
              </div>

              {/* Distinction Ranks Bar */}
              <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-amber-500/20">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-amber-500/30 text-center">
                  <span className="block text-[11px] font-medium text-amber-300/80 uppercase">
                    School
                  </span>
                  <span className="text-[16px] sm:text-[18px] font-black text-white">
                    Rank 1
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-amber-500/30 text-center">
                  <span className="block text-[11px] font-medium text-amber-300/80 uppercase">
                    Zonal
                  </span>
                  <span className="text-[16px] sm:text-[18px] font-black text-white">
                    Rank 24
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-amber-500/30 text-center">
                  <span className="block text-[11px] font-medium text-amber-300/80 uppercase">
                    International
                  </span>
                  <span className="text-[16px] sm:text-[18px] font-black text-white">
                    Rank 275
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SUPPORTING HONORS GRID
            ======================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {supportingItems.map((item, idx) => {
            const meta = getAwardMeta(item.title, item.detail)

            return (
              <div
                key={item.id || idx}
                className="rounded-[20px] p-5 sm:p-6 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-md hover:border-teal-500/60 transition-all flex flex-col justify-between gap-4 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${meta.medalColor}`}
                    >
                      <span>{meta.icon}</span>
                      <span>{meta.medal}</span>
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      {item.year}
                    </span>
                  </div>

                  <h3 className="text-[17px] font-bold text-slate-900 dark:text-white leading-snug m-0 group-hover:text-teal-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-[13px] sm:text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed m-0">
                    {item.detail}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                  {meta.category}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
