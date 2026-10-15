import React from 'react'

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

export function Achievements({
  heading = 'Achievements',
  items,
  anchorId = 'achievements',
}: AchievementsProps) {
  if (!items || items.length === 0) return null

  return (
    <section id={anchorId} className="w-full py-16 sm:py-24 px-5 max-w-[680px] mx-auto">
      {/* Section Header */}
      <div className="mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-400 text-[12px] font-bold mb-3 uppercase tracking-wider">
          Recognitions & Milestones
        </div>
        <h2 className="text-[34px] sm:text-[44px] font-extrabold text-white tracking-[-0.03em] leading-tight m-0 drop-shadow-sm">
          {heading}
        </h2>
      </div>

      {/* High-contrast list */}
      <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="py-5 sm:py-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-4 group hover:bg-slate-800/20 px-3 -mx-3 rounded-xl transition-colors"
          >
            <div>
              <h3 className="text-[17px] sm:text-[18px] font-bold text-slate-900 dark:text-white leading-snug m-0 group-hover:text-teal-400 transition-colors">
                {item.title}
              </h3>
              <p className="mt-1 text-[14px] sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed m-0">
                {item.detail}
              </p>
            </div>
            <span className="text-[12px] font-extrabold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-teal-300 border border-slate-200 dark:border-slate-700/80 flex-none self-start sm:self-auto">
              {item.year}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
