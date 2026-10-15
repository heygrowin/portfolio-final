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
    <section id={anchorId} className="w-full py-16 sm:py-20 px-5 max-w-[680px] mx-auto">
      <div className="mb-8 sm:mb-10">
        <h2 className="text-[32px] sm:text-[40px] font-bold text-[var(--ink)] tracking-[-0.03em] leading-tight m-0">
          {heading}
        </h2>
      </div>

      <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4"
          >
            <div>
              <h3 className="text-[17px] font-semibold text-[var(--ink)] leading-snug m-0">
                {item.title}
              </h3>
              <p className="mt-0.5 text-[14px] sm:text-[15px] text-[var(--muted)] leading-relaxed m-0">
                {item.detail}
              </p>
            </div>
            <span className="text-[13px] font-medium text-[var(--muted)] flex-none">
              {item.year}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
