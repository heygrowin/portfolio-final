'use client'

import React, { useState } from 'react'

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
  const [cvViewMode, setCvViewMode] = useState<'preview' | 'structured'>('preview')

  const tabs = [
    { key: 'hire' as const, label: 'Hire me', icon: '💼', data: hireTab },
    { key: 'client' as const, label: 'Your business', icon: '🏢', data: clientTab },
    { key: 'build' as const, label: 'Build together', icon: '⚡', data: buildTab },
  ]

  const currentTab = tabs.find((t) => t.key === activeAudience) || tabs[0]

  return (
    <section id={anchorId} className="w-full py-16 sm:py-24 px-5 max-w-[680px] mx-auto">
      {/* Section Header */}
      <div className="mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-400 text-[12px] font-bold mb-3 uppercase tracking-wider">
          Collaboration & Roles
        </div>
        <h2 className="text-[34px] sm:text-[44px] font-extrabold text-white tracking-[-0.03em] leading-tight m-0 drop-shadow-sm">
          {heading}
        </h2>
      </div>

      {/* Tab Segment Controls */}
      <div
        role="tablist"
        aria-label="Audience filters"
        className="grid grid-cols-3 w-full p-1 sm:p-1.5 rounded-[18px] bg-slate-900/80 border border-slate-800 gap-1 sm:gap-1.5 mb-8 backdrop-blur-md"
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
              className={`w-full min-h-[44px] px-1 sm:px-3 py-1.5 sm:py-2 rounded-[14px] text-[11.5px] xs:text-[12.5px] sm:text-[14.5px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span className="text-[13px] sm:text-[15px] shrink-0">{tab.icon}</span>
              <span className="truncate">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Active Tab Content */}
      <div
        role="tabpanel"
        className="p-6 sm:p-8 rounded-[24px] bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-start gap-6 animate-in fade-in duration-300"
      >
        <div>
          <h3 className="text-[22px] sm:text-[27px] font-extrabold text-slate-900 dark:text-white leading-snug m-0">
            {currentTab.data.heading}
          </h3>
          <p className="mt-2 text-[15px] sm:text-[16px] text-slate-600 dark:text-slate-300 leading-relaxed m-0 max-w-[54ch]">
            {currentTab.data.text}
          </p>
        </div>

        {/* SPECIAL CASE: 'hire' TAB -> INTERACTIVE RESUME PREVIEW */}
        {activeAudience === 'hire' ? (
          <div className="w-full flex flex-col gap-5 pt-2">
            {/* Document Header & Toggle */}
            <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 overflow-hidden shadow-inner">
              <div className="px-4 py-3 bg-slate-100 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-[12px] font-mono font-bold text-slate-700 dark:text-slate-300 ml-2">
                    📄 cv-ansh-rajput.pdf
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-400 border border-teal-500/30">
                    Verified
                  </span>
                </div>

                {/* Switch between Live Document and Fast Highlights */}
                <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800/80 p-0.5 rounded-lg text-[12px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setCvViewMode('preview')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      cvViewMode === 'preview'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Interactive PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setCvViewMode('structured')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      cvViewMode === 'structured'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Quick Summary
                  </button>
                </div>
              </div>

              {/* View 1: Embedded Interactive PDF */}
              {cvViewMode === 'preview' ? (
                <div className="relative w-full h-[460px] sm:h-[540px] bg-slate-200 dark:bg-slate-950">
                  <iframe
                    src="/cv-ansh-rajput.pdf#toolbar=0&navpanes=0"
                    title="Ansh Rajput Curriculum Vitae"
                    className="w-full h-full border-0"
                  />
                  <div className="absolute bottom-3 right-3">
                    <a
                      href="/cv-ansh-rajput.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-900/90 text-white text-[12px] font-bold shadow-md hover:bg-slate-800 border border-slate-700 inline-flex items-center gap-1.5 backdrop-blur-sm"
                    >
                      <span>Open fullscreen ↗</span>
                    </a>
                  </div>
                </div>
              ) : (
                /* View 2: High-density Structured Highlights */
                <div className="p-5 sm:p-6 space-y-4 text-left">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                      <div className="text-[12px] font-bold text-teal-600 dark:text-teal-400 mb-1">
                        🎓 Education
                      </div>
                      <div className="text-[14px] font-bold text-slate-900 dark:text-white">
                        BSc in Data Analysis
                      </div>
                      <div className="text-[12px] text-slate-500 dark:text-slate-400">
                        University of Messina (Italy) · 2026–Present
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                      <div className="text-[12px] font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                        🚀 Production Track Record
                      </div>
                      <div className="text-[14px] font-bold text-slate-900 dark:text-white">
                        Founder, HeyGrowin
                      </div>
                      <div className="text-[12px] text-slate-500 dark:text-slate-400">
                        4 live business systems · 2+ years daily uptime
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                    <div className="text-[12px] font-bold text-blue-600 dark:text-blue-400 mb-1.5">
                      🛠️ Core Stack & Competencies
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-[12px]">
                      {[
                        'Python',
                        'Data Analysis',
                        'Next.js 15',
                        'TypeScript',
                        'PostgreSQL / SQLite',
                        'Payload CMS',
                        'Automation Workflows',
                        'Zero-downtime Systems',
                      ].map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                    <div className="text-[12px] font-bold text-amber-600 dark:text-amber-400 mb-1">
                      🌍 Languages & Relocation
                    </div>
                    <p className="text-[13px] text-slate-600 dark:text-slate-300 m-0">
                      English (Fluent) · Italian (Learning & residing in Messina, Sicily) · Hindi (Native). Ready for European internships and remote roles globally.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Resume Download Action Strip */}
            <div className="w-full flex flex-wrap items-center gap-3 pt-2">
              <a
                href="/cv-ansh-rajput.pdf"
                download="cv-ansh-rajput.pdf"
                className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-[14px] text-[15px] font-bold bg-teal-600 hover:bg-teal-500 text-white transition-all shadow-md hover:shadow-lg cursor-pointer gap-2"
              >
                <span>📥</span>
                <span>Download CV (Standard PDF)</span>
              </a>

              <a
                href="/cv-europass-ansh-rajput.pdf"
                download="cv-europass-ansh-rajput.pdf"
                className="inline-flex items-center justify-center min-h-[48px] px-5 rounded-[14px] text-[14px] font-bold border border-slate-300 dark:border-slate-700 hover:border-teal-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all shadow-xs cursor-pointer gap-2"
              >
                <span>🇪🇺</span>
                <span>Europass CV (EU Standard)</span>
              </a>

              <a
                href="https://in.linkedin.com/in/ansh-rajput-529328428"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-h-[48px] px-4 rounded-[14px] text-[14px] font-bold text-slate-500 dark:text-slate-400 hover:text-teal-400 transition-colors ml-auto"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>
        ) : (
          /* STANDARD TAB ACTION BUTTON FOR 'client' & 'build' */
          <a
            href={currentTab.data.buttonLink}
            className="mt-2 inline-flex items-center justify-center min-h-[48px] px-6 rounded-[14px] text-[15px] font-bold bg-teal-600 hover:bg-teal-500 text-white transition-colors shadow-md"
          >
            {currentTab.data.buttonText} &rarr;
          </a>
        )}
      </div>
    </section>
  )
}
