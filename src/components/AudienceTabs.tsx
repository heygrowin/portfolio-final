'use client'

import React from 'react'

export interface AudienceTabsProps {
  heading?: string
  activeAudience: 'hire' | 'client' | 'build'
  onSelectAudience: (aud: 'hire' | 'client' | 'build') => void
  hireTab: {
    heading: string
    text: string
    buttonText: string
    buttonLink: string
  }
  clientTab: {
    heading: string
    text: string
    buttonText: string
    buttonLink: string
  }
  buildTab: {
    heading: string
    text: string
    buttonText: string
    buttonLink: string
  }
  anchorId?: string
}

export function AudienceTabs({
  heading = 'What I can do for you',
  activeAudience,
  onSelectAudience,
  hireTab,
  clientTab,
  buildTab,
  anchorId = 'services',
}: AudienceTabsProps) {
  const tabs = [
    { key: 'hire' as const, label: 'Hire me', data: hireTab },
    { key: 'client' as const, label: 'Your business', data: clientTab },
    { key: 'build' as const, label: 'Build together', data: buildTab },
  ]

  const currentTab = tabs.find((t) => t.key === activeAudience) || tabs[0]

  return (
    <section id={anchorId} className="w-full py-16 sm:py-20 px-5 max-w-[680px] mx-auto">
      <div className="mb-8 sm:mb-10">
        <h2 className="text-[32px] sm:text-[40px] font-bold text-[var(--ink)] tracking-[-0.03em] leading-tight m-0">
          {heading}
        </h2>
      </div>

      {/* Tab Segment Controls */}
      <div
        role="tablist"
        aria-label="Audience filters"
        className="flex p-1.5 rounded-[16px] bg-[var(--surface)] border border-[var(--line)] gap-1 mb-8 overflow-x-auto"
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeAudience
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => onSelectAudience(tab.key)}
              className={`flex-1 min-h-[44px] px-3.5 py-2 rounded-[12px] text-[15px] font-semibold transition-all cursor-pointer whitespace-nowrap text-center ${
                isActive
                  ? 'bg-white dark:bg-[#1E293B] text-[var(--brand)] shadow-sm border border-[var(--line)]/60'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Active Tab Content */}
      <div
        role="tabpanel"
        className="p-6 sm:p-8 rounded-[20px] bg-[var(--surface)] border border-[var(--line)] shadow-sm flex flex-col items-start gap-4 animate-in fade-in duration-200"
      >
        <h3 className="text-[22px] sm:text-[26px] font-bold text-[var(--ink)] leading-snug m-0">
          {currentTab.data.heading}
        </h3>
        <p className="text-[16px] sm:text-[17px] text-[var(--text)] leading-relaxed m-0 max-w-[50ch]">
          {currentTab.data.text}
        </p>
        <a
          href={currentTab.data.buttonLink}
          className="mt-2 inline-flex items-center justify-center min-h-[48px] px-6 rounded-[14px] text-[15px] font-semibold bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90 transition-colors shadow-sm"
        >
          {currentTab.data.buttonText}
        </a>
      </div>
    </section>
  )
}
