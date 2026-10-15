import React from 'react'

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

export function GrowthTimeline({
  heading = 'Growth',
  items,
  anchorId = 'timeline',
}: GrowthTimelineProps) {
  if (!items || items.length === 0) return null

  return (
    <section id={anchorId} className="w-full py-16 sm:py-20 px-5 max-w-[680px] mx-auto">
      <div className="mb-10 sm:mb-12">
        <h2 className="text-[32px] sm:text-[40px] font-bold text-[var(--ink)] tracking-[-0.03em] leading-tight m-0">
          {heading}
        </h2>
      </div>

      <div className="relative pl-6 sm:pl-8 border-l border-[var(--line)] space-y-8 sm:space-y-10">
        {items.map((item, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline node marker */}
            <div
              className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-[var(--surface)] border-2 border-[var(--brand)] shadow-sm group-hover:scale-125 transition-transform"
              aria-hidden="true"
            />

            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-md text-[12px] font-semibold bg-[var(--surface)] text-[var(--brand)] border border-[var(--line)] mb-1.5">
                {item.year}
              </span>
              <h3 className="text-[18px] sm:text-[20px] font-semibold text-[var(--ink)] leading-snug m-0">
                {item.title}
              </h3>
              <p className="mt-1 text-[15px] sm:text-[16px] text-[var(--text)] leading-relaxed m-0 max-w-[56ch]">
                {item.line}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
