'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { ProjectCardData, getEffectiveSlug, getEffectiveClientName, StatusPill, ConceptBadge } from './WorkFeed'

export interface FullProjectStory extends ProjectCardData {
  atAGlance: {
    role?: string
    duration?: string
    stack?: { tag: string }[]
    result?: string
  }
  story: {
    heroImageUrl?: string
    heroImageAlt?: string
    heroImageIsConcept?: boolean
    person?: string
    struggle?: string
    built?: string
    turningPoint?: string
    today?: string
  }
  gallery?: {
    imageUrl: string
    caption?: string
    alt?: string
    isConcept?: boolean
  }[]
  quote?: {
    quoteText?: string
    quoteName?: string
    quotePhotoUrl?: string
    quotePermission?: boolean
  }
  tradeOffs?: { point: string }[]
  links?: { label: string; url: string }[]
}

export interface StorySheetProps {
  project: FullProjectStory | null
  allProjects: FullProjectStory[]
  onClose: () => void
  onSelectProject: (p: FullProjectStory) => void
}

export function StorySheet({
  project,
  allProjects,
  onClose,
  onSelectProject,
}: StorySheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const prevActiveElementRef = useRef<HTMLElement | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchDelta, setTouchDelta] = useState<number>(0)

  // 1. Accessibility: Focus trap & return focus on close
  useEffect(() => {
    if (project) {
      prevActiveElementRef.current = document.activeElement as HTMLElement

      // Lock body scrolling while sheet is open
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      // Focus close button inside sheet
      const timer = setTimeout(() => {
        const closeBtn = sheetRef.current?.querySelector<HTMLButtonElement>('#sheet-close-btn')
        closeBtn?.focus()
      }, 50)

      return () => {
        clearTimeout(timer)
        document.body.style.overflow = originalOverflow
        prevActiveElementRef.current?.focus()
      }
    }
  }, [project])

  // 2. Keyboard listener: Escape closes sheet
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && project) {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [project, onClose])

  // 3. Touch swipe-down handler
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const currentY = e.targetTouches[0].clientY
    const delta = currentY - touchStart
    if (delta > 0) {
      setTouchDelta(delta)
    }
  }

  const handleTouchEnd = () => {
    if (touchDelta > 90) {
      onClose()
    }
    setTouchStart(null)
    setTouchDelta(0)
  }

  // Next story calculation
  const handleNextStory = useCallback(() => {
    if (!project || allProjects.length <= 1) return
    const currentIndex = allProjects.findIndex((p) => p.id === project.id)
    const nextIndex = (currentIndex + 1) % allProjects.length
    onSelectProject(allProjects[nextIndex])
  }, [project, allProjects, onSelectProject])

  if (!project) return null

  const effectiveName = getEffectiveClientName(project)
  const showQuote = Boolean(
    project.quote?.quotePermission && project.quote?.quoteText
  )

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="story-sheet-title"
      className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={sheetRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: touchDelta > 0 ? `translateY(${touchDelta}px)` : undefined,
        }}
        className="w-full max-w-[760px] h-[92vh] sm:h-[88vh] max-h-[860px] bg-[#0F172A] border border-slate-700/80 rounded-t-[28px] sm:rounded-[24px] shadow-2xl flex flex-col overflow-hidden text-white animate-in slide-in-from-bottom-8 duration-300"
      >
        {/* Grab Handle & Top Navigation Bar */}
        <div className="flex-none pt-3 pb-2 px-5 flex flex-col items-center border-b border-slate-800 bg-[#0F172A] sticky top-0 z-20">
          <div className="w-10 h-1.5 rounded-full bg-slate-700 mb-2.5 cursor-grab" aria-hidden="true" />
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <StatusPill status={project.status} />
              <span className="text-[13px] font-semibold text-slate-400">
                Project Story
              </span>
            </div>
            <button
              id="sheet-close-btn"
              type="button"
              onClick={onClose}
              aria-label="Close story sheet"
              className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Story Content Area */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-8 bg-[#0F172A]">
          {/* 1. Hero Image of the Real Result */}
          {project.story?.heroImageUrl && (
            <div className="relative w-full h-64 sm:h-80 rounded-[18px] overflow-hidden bg-slate-900 border border-slate-700/80">
              <Image
                src={project.story.heroImageUrl}
                alt={project.story.heroImageAlt || effectiveName}
                fill
                className="object-cover"
                priority
              />
              {project.story.heroImageIsConcept && <ConceptBadge />}
            </div>
          )}

          {/* Title & One-Liner */}
          <div>
            <h2
              id="story-sheet-title"
              className="text-[28px] sm:text-[34px] font-extrabold text-white tracking-[-0.03em] leading-tight m-0"
            >
              {effectiveName}
            </h2>
            <p className="mt-2 text-[16px] sm:text-[17px] text-slate-300 font-medium leading-relaxed">
              {project.oneLiner}
            </p>
          </div>

          {/* 2. At A Glance Row: Role · Duration · Stack · Result */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 sm:p-5 rounded-[18px] bg-slate-900/95 border border-slate-700/80 shadow-md text-[13px]">
            <div>
              <span className="block text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                Role
              </span>
              <span className="font-semibold text-white leading-snug">
                {project.atAGlance?.role || 'Designed & built'}
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                Duration
              </span>
              <span className="font-semibold text-white leading-snug">
                {project.atAGlance?.duration || 'In continuous use'}
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                Stack
              </span>
              <span className="font-semibold text-white leading-snug">
                {project.atAGlance?.stack && project.atAGlance.stack.length > 0
                  ? project.atAGlance.stack.map((s) => s.tag).join(', ')
                  : 'Full-stack'}
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                Result
              </span>
              <span className="font-semibold text-white leading-snug">
                {project.atAGlance?.result || 'Still in daily use'}
              </span>
            </div>
          </div>

          {/* 3. The Story — Five Chapters */}
          <div className="space-y-6">
            {/* Chapter 1: The person */}
            {project.story?.person && (
              <section className="space-y-1.5">
                <h3 className="text-[13px] font-bold text-emerald-400 uppercase tracking-wider m-0">
                  The person
                </h3>
                <p className="text-[15px] sm:text-[16px] leading-relaxed text-slate-200 m-0 font-normal">
                  {project.story.person}
                </p>
              </section>
            )}

            {/* Chapter 2: The struggle */}
            {project.story?.struggle && (
              <section className="space-y-1.5">
                <h3 className="text-[13px] font-bold text-emerald-400 uppercase tracking-wider m-0">
                  The struggle
                </h3>
                <p className="text-[15px] sm:text-[16px] leading-relaxed text-slate-200 m-0 font-normal">
                  {project.story.struggle}
                </p>
              </section>
            )}

            {/* Chapter 3: What I built */}
            {project.story?.built && (
              <section className="space-y-3">
                <h3 className="text-[13px] font-bold text-emerald-400 uppercase tracking-wider m-0">
                  What I built
                </h3>
                <p className="text-[15px] sm:text-[16px] leading-relaxed text-slate-200 m-0 font-normal">
                  {project.story.built}
                </p>

                {/* Image Gallery */}
                {project.gallery && project.gallery.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {project.gallery.map((img, gIdx) => (
                      <div
                        key={gIdx}
                        className="relative rounded-[14px] overflow-hidden bg-slate-900 border border-slate-700/80 aspect-video"
                      >
                        <Image
                          src={img.imageUrl}
                          alt={img.alt || `${effectiveName} screenshot ${gIdx + 1}`}
                          fill
                          className="object-cover"
                        />
                        {img.isConcept && <ConceptBadge />}
                        {img.caption && (
                          <div className="absolute inset-x-0 bottom-0 bg-black/75 backdrop-blur-sm p-2 text-center text-slate-200 text-[11px] font-medium">
                            {img.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Chapter 4: The moment it changed */}
            {project.story?.turningPoint && (
              <section className="space-y-1.5">
                <h3 className="text-[13px] font-bold text-emerald-400 uppercase tracking-wider m-0">
                  The moment it changed
                </h3>
                <p className="text-[15px] sm:text-[16px] leading-relaxed text-slate-200 m-0 font-normal">
                  {project.story.turningPoint}
                </p>
              </section>
            )}

            {/* Chapter 5: Today */}
            {project.story?.today && (
              <section className="space-y-3">
                <h3 className="text-[13px] font-bold text-emerald-400 uppercase tracking-wider m-0">
                  Today
                </h3>
                <p className="text-[15px] sm:text-[16px] leading-relaxed text-slate-200 m-0 font-normal">
                  {project.story.today}
                </p>

                {/* Customer quote (strictly conditional on quotePermission) */}
                {showQuote && (
                  <blockquote className="my-4 border-l-4 border-emerald-500 pl-4 py-3 bg-slate-900/80 rounded-r-[14px] text-[15px] italic text-slate-100">
                    &ldquo;{project.quote?.quoteText}&rdquo;
                    {project.quote?.quoteName && (
                      <cite className="block text-[13px] font-semibold not-italic text-emerald-400 mt-1.5">
                        — {project.quote.quoteName}
                      </cite>
                    )}
                  </blockquote>
                )}
              </section>
            )}
          </div>

          {/* 4. Trade-offs I made */}
          {project.tradeOffs && project.tradeOffs.length > 0 && (
            <div className="p-4 sm:p-5 rounded-[18px] bg-slate-900/95 border border-slate-700/80">
              <h4 className="text-[13px] font-bold text-emerald-400 uppercase tracking-wider m-0 mb-2.5">
                Trade-offs I made
              </h4>
              <ul className="list-disc pl-5 space-y-1.5 text-[14px] sm:text-[15px] text-slate-200 m-0">
                {project.tradeOffs.map((to, toIdx) => (
                  <li key={toIdx}>{to.point}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 5. External Links (optional) */}
          {project.links && project.links.length > 0 && (
            <div className="flex flex-wrap gap-2.5 pt-2">
              {project.links.map((link, lIdx) => (
                <a
                  key={lIdx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-sm"
                >
                  <span>{link.label}</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          )}

          {/* 6. Next Story Button */}
          {allProjects.length > 1 && (
            <div className="pt-4 pb-2 border-t border-slate-800 flex justify-between items-center">
              <span className="text-[13px] text-slate-400">
                Interested in other systems?
              </span>
              <button
                type="button"
                onClick={handleNextStory}
                className="px-5 py-2.5 rounded-full text-[13px] font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 transition-colors cursor-pointer shadow-sm"
              >
                Next story &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
