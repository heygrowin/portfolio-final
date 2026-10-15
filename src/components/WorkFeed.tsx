'use client'

import React, { useState } from 'react'
import Image from 'next/image'

export interface ProjectCardData {
  id: string
  title: string
  slug: string
  anonymousSlug: string
  oneLiner: string
  status: 'IN USE' | 'LIVE' | 'RUNNING' | 'BUILDING' | 'PIVOTED' | 'CONCEPT'
  tier: 'flagship' | 'supporting' | 'hidden'
  order: number
  audiences: ('hire' | 'client' | 'build')[]
  client: {
    clientName?: string
    clientDescription: string
    clientPermission?: boolean
  }
  postCard: {
    postStyle: 'photo-post' | 'team-message' | 'pro-post' | 'thread' | 'chat' | 'commit'
    postAuthorName?: string
    postAuthorAvatarUrl?: string
    postHeadline?: string
    postText?: string
    threadPosts?: { text: string }[]
    chatBubbles?: { sender: 'me' | 'them'; text: string }[]
    postImageUrl?: string
    postImageAlt?: string
    postImageIsConcept?: boolean
    postTime?: string
    codeSnippet?: string
  }
}

export interface WorkFeedProps<T extends ProjectCardData = ProjectCardData> {
  heading?: string
  description?: string
  projects: T[]
  onOpenStory: (project: T) => void
  anchorId?: string
}

export function getEffectiveSlug(project: ProjectCardData): string {
  if (project.client?.clientPermission) {
    return project.slug
  }
  return project.anonymousSlug || project.slug
}

export function getEffectiveClientName(project: ProjectCardData): string {
  if (project.client?.clientPermission && project.client?.clientName) {
    return project.client.clientName
  }
  return project.client?.clientDescription || project.title
}

export function StatusPill({ status }: { status: ProjectCardData['status'] }) {
  const styles: Record<ProjectCardData['status'], string> = {
    'IN USE': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800',
    LIVE: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800',
    RUNNING: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/70 dark:text-teal-300 dark:border-teal-800',
    BUILDING: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800',
    PIVOTED: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    CONCEPT: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-800',
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border shadow-xs ${
        styles[status] || styles['IN USE']
      }`}
    >
      {status}
    </span>
  )
}

export function ConceptBadge() {
  return (
    <span className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-md pointer-events-none z-10 border border-white/15 shadow-sm">
      Concept visual
    </span>
  )
}

export function WorkFeed<T extends ProjectCardData = ProjectCardData>({
  heading = 'Work',
  description = 'Real systems solving real problems for real people.',
  projects,
  onOpenStory,
  anchorId = 'work',
}: WorkFeedProps<T>) {
  const [showSupporting, setShowSupporting] = useState(false)

  const flagshipProjects = projects.filter(
    (p) => p.tier === 'flagship' || !p.tier
  )
  const supportingProjects = projects.filter((p) => p.tier === 'supporting')

  const visibleProjects = showSupporting
    ? [...flagshipProjects, ...supportingProjects]
    : flagshipProjects

  return (
    <section id={anchorId} className="w-full py-16 sm:py-24 px-5 max-w-[680px] mx-auto">
      {/* Section Header */}
      <div className="mb-10 sm:mb-14">
        <h2 className="text-[32px] sm:text-[40px] font-bold text-[var(--ink)] tracking-[-0.03em] leading-tight m-0">
          {heading}
        </h2>
        {description && (
          <p className="mt-2 text-[17px] text-[var(--muted)] leading-relaxed max-w-[50ch]">
            {description}
          </p>
        )}
      </div>

      {/* Feed of Project Posts */}
      <div className="flex flex-col gap-9 sm:gap-11">
        {visibleProjects.map((project) => {
          const effectiveName = getEffectiveClientName(project)
          const { postCard } = project
          const initials = effectiveName.slice(0, 2).toUpperCase()

          return (
            <article
              key={project.id}
              onClick={() => onOpenStory(project)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onOpenStory(project)
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View story for ${effectiveName}`}
              className="group relative cursor-pointer text-left rounded-[22px] bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--brand)]/50 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              {/* ========================================================
                  STYLE 1: PHOTO-POST (Instagram aesthetic)
                  ======================================================== */}
              {postCard.postStyle === 'photo-post' && (
                <div className="flex flex-col">
                  {/* Instagram-style Top Header */}
                  <div className="p-4 flex items-center justify-between border-b border-[var(--line)]/50 bg-white dark:bg-[#131B2E]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex-none">
                        <div className="w-full h-full rounded-full bg-white dark:bg-[#0F172A] grid place-items-center text-[12px] font-bold text-[var(--ink)]">
                          {initials}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-bold text-[var(--ink)] leading-none">
                            {postCard.postAuthorName?.toLowerCase().replace(/\s+/g, '_') || effectiveName.toLowerCase().replace(/\s+/g, '_')}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-[var(--muted)]" />
                          <span className="text-[12px] font-medium text-[var(--brand)]">Follow</span>
                        </div>
                        <span className="text-[11px] text-[var(--muted)] leading-tight mt-0.5">
                          Messina, Italy · System in daily use
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusPill status={project.status} />
                      <div className="text-[var(--muted)] px-1 font-bold">•••</div>
                    </div>
                  </div>

                  {/* Photo Visual Frame */}
                  <div className="relative w-full aspect-[4/3] sm:aspect-square bg-gradient-to-br from-emerald-950/80 via-slate-900 to-teal-950 overflow-hidden flex items-center justify-center">
                    {postCard.postImageUrl ? (
                      <Image
                        src={postCard.postImageUrl}
                        alt={postCard.postImageAlt || effectiveName}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="text-center p-6 text-white/90">
                        <span className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 grid place-items-center mx-auto mb-3 border border-emerald-500/30">
                          🌱
                        </span>
                        <p className="font-semibold text-[17px] text-white m-0">
                          {effectiveName}
                        </p>
                        <p className="text-[13px] text-slate-300 mt-1 max-w-[32ch]">
                          Custom online store & live counter pot tracking
                        </p>
                      </div>
                    )}
                    {postCard.postImageIsConcept && <ConceptBadge />}
                  </div>

                  {/* Instagram Action Row */}
                  <div className="p-4 pt-3 pb-4 bg-white dark:bg-[#131B2E]">
                    <div className="flex items-center justify-between text-[var(--ink)] mb-3">
                      <div className="flex items-center gap-4">
                        {/* Heart */}
                        <svg className="w-5 h-5 hover:text-rose-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {/* Comment */}
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {/* Share */}
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </div>
                      {/* Bookmark */}
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </div>

                    <p className="text-[14px] leading-relaxed text-[var(--ink)] m-0">
                      <b className="font-bold mr-1.5">
                        {postCard.postAuthorName?.toLowerCase().replace(/\s+/g, '_') || 'raja_nursery'}
                      </b>
                      {postCard.postText || project.oneLiner}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--muted)] uppercase tracking-wider font-semibold">
                      <span>{postCard.postTime || 'ACTIVE SYSTEM'}</span>
                      <span className="text-[var(--brand)] font-semibold lowercase">Tap to read full story &rarr;</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================
                  STYLE 2: PRO-POST (LinkedIn professional post)
                  ======================================================== */}
              {postCard.postStyle === 'pro-post' && (
                <div className="p-5 flex flex-col bg-white dark:bg-[#131B2E]">
                  {/* LinkedIn Header */}
                  <div className="flex items-start justify-between mb-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-700 text-white font-bold text-[13px] grid place-items-center flex-none shadow-sm">
                        SK
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 leading-tight">
                          <span className="text-[14px] font-bold text-[var(--ink)]">
                            {postCard.postAuthorName || 'SKOLAR'}
                          </span>
                          <span className="text-[11px] font-semibold text-[var(--muted)]">· 1st</span>
                        </div>
                        <span className="text-[12px] text-[var(--muted)] line-clamp-1">
                          {postCard.postHeadline || 'International Study Advisory · University Admissions in Italy'}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-[var(--muted)] mt-0.5">
                          <span>{postCard.postTime || '1w'}</span>
                          <span>·</span>
                          <svg className="w-3 h-3 fill-current" viewBox="0 0 16 16">
                            <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 0110.82-4.83L6.5 8.99 4.3 6.8 3 8.1l2.5 2.5a1 1 0 001.4 0l6.3-6.3A6.5 6.5 0 011.5 8z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <StatusPill status={project.status} />
                  </div>

                  {/* Body Text */}
                  <p className="text-[14px] text-[var(--ink)] leading-relaxed m-0 mb-3.5">
                    {postCard.postText || project.oneLiner}
                  </p>

                  {/* Attached Media / Card Preview */}
                  <div className="rounded-[14px] overflow-hidden border border-[var(--line)] bg-[var(--surface)] relative mb-3">
                    {postCard.postImageUrl ? (
                      <div className="relative w-full aspect-video">
                        <Image
                          src={postCard.postImageUrl}
                          alt={effectiveName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="p-6 bg-gradient-to-r from-blue-900/20 via-slate-900/10 to-teal-900/20 border-b border-[var(--line)]">
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-[13px] mb-1">
                          <span>🎓</span>
                          <span>Student Portal & Application Tracker</span>
                        </div>
                        <h4 className="text-[16px] font-bold text-[var(--ink)] m-0">
                          {effectiveName}
                        </h4>
                        <p className="text-[13px] text-[var(--muted)] mt-1 m-0">
                          Automated document management pipeline for Bachelor’s and Master’s applicants.
                        </p>
                      </div>
                    )}
                    {postCard.postImageIsConcept && <ConceptBadge />}
                  </div>

                  {/* LinkedIn Action Bar */}
                  <div className="pt-2 border-t border-[var(--line)]/60 flex items-center justify-between text-[12px] font-semibold text-[var(--muted)]">
                    <span className="flex items-center gap-1.5 hover:text-[var(--brand)]">
                      👍 Like
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-[var(--brand)]">
                      💬 Comment
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-[var(--brand)]">
                      🔄 Repost
                    </span>
                    <span className="text-[var(--brand)] font-bold">
                      Read story &rarr;
                    </span>
                  </div>
                </div>
              )}

              {/* ========================================================
                  STYLE 3: TEAM-MESSAGE (Slack workspace style)
                  ======================================================== */}
              {postCard.postStyle === 'team-message' && (
                <div className="p-5 flex flex-col bg-white dark:bg-[#131B2E]">
                  {/* Slack Channel Pill Header */}
                  <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-[var(--line)]/50">
                    <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--muted)]">
                      <span className="text-[14px] text-teal-600 dark:text-teal-400 font-bold">#</span>
                      <span className="text-[var(--ink)]">operations-inventory</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <StatusPill status={project.status} />
                  </div>

                  {/* Slack Message Layout */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-[var(--brand)] text-white font-bold text-[13px] grid place-items-center flex-none shadow-sm">
                      {initials}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 leading-none">
                        <span className="text-[14px] font-bold text-[var(--ink)]">
                          {postCard.postAuthorName || effectiveName}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          APP
                        </span>
                        <span className="text-[11px] text-[var(--muted)]">
                          {postCard.postTime || '10:42 AM'}
                        </span>
                      </div>

                      <p className="text-[14px] text-[var(--ink)] leading-relaxed mt-2 mb-3">
                        {postCard.postText || project.oneLiner}
                      </p>

                      {/* Slack Quote Accent Block */}
                      <div className="border-l-4 border-[var(--brand)] bg-[var(--surface)] p-3 rounded-r-lg text-[13px] text-[var(--muted)] mb-3">
                        <div className="font-semibold text-[var(--ink)] mb-0.5">
                          Daily Reconciliation Status
                        </div>
                        <div>Continuous 2+ years daily inventory tracking · Zero stockouts</div>
                      </div>

                      {/* Slack Emoji Reaction Chips */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)]">
                          <span>📦</span>
                          <span>2+ years</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)]">
                          <span>⚡</span>
                          <span>same-day support</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                          <span>✅</span>
                          <span>verified</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================
                  STYLE 4: THREAD (X / Twitter thread style)
                  ======================================================== */}
              {postCard.postStyle === 'thread' && (
                <div className="p-5 flex flex-col bg-white dark:bg-[#131B2E]">
                  {/* Thread Header */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-[13px] grid place-items-center flex-none">
                        AR
                      </div>
                      <div className="flex items-center gap-1.5 leading-none">
                        <span className="text-[14px] font-bold text-[var(--ink)]">
                          Ansh Rajput
                        </span>
                        <svg className="w-4 h-4 text-sky-500 fill-current" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-[13px] text-[var(--muted)]">@heygrowin · 24h</span>
                      </div>
                    </div>
                    <StatusPill status={project.status} />
                  </div>

                  {/* Connected Thread Items with Vertical Line */}
                  <div className="flex flex-col relative pl-6 space-y-4 my-1">
                    <div className="absolute left-[11px] top-2 bottom-3 w-[2px] bg-[var(--line)]" />
                    {(postCard.threadPosts && postCard.threadPosts.length > 0
                      ? postCard.threadPosts
                      : [
                          { text: '1/ Built an autonomous publishing blog running on an 8 GB Mac mini at zero API cost.' },
                          { text: '2/ Trending topic discovery -> Ollama local LLM draft -> strict three-model evaluation gate.' },
                          { text: '3/ Pages rank in Google Search for 300+ queries. Taught me impressions != readers, directing my effort to client systems.' },
                        ]
                    ).map((tPost, tIdx) => (
                      <div key={tIdx} className="relative flex items-start gap-3 z-10">
                        <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-slate-700 text-white text-[10px] font-bold grid place-items-center flex-none mt-0.5 shadow-xs">
                          {tIdx + 1}
                        </span>
                        <p className="text-[14px] text-[var(--ink)] leading-relaxed m-0">
                          {tPost.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Twitter Action Row */}
                  <div className="pt-3 mt-3 border-t border-[var(--line)]/60 flex items-center justify-between text-[12px] text-[var(--muted)]">
                    <span className="flex items-center gap-1.5 hover:text-sky-500">
                      💬 3 replies
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-emerald-500">
                      🔁 100% autonomous
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-rose-500">
                      ❤️ 300+ queries
                    </span>
                    <span className="text-[var(--brand)] font-semibold">
                      Show full story &rarr;
                    </span>
                  </div>
                </div>
              )}

              {/* ========================================================
                  STYLE 5: CHAT (WhatsApp dialog style)
                  ======================================================== */}
              {postCard.postStyle === 'chat' && (
                <div className="flex flex-col bg-[#EFEAE2] dark:bg-[#0B141A] rounded-[22px] overflow-hidden">
                  {/* WhatsApp Chat Top Header */}
                  <div className="px-4 py-3 bg-[#075E54] dark:bg-[#1F2C34] text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-white/20 grid place-items-center font-bold text-[13px] text-white">
                        {initials}
                      </div>
                      <div>
                        <div className="text-[14px] font-bold leading-tight">{effectiveName}</div>
                        <div className="text-[11px] text-emerald-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                          <span>online</span>
                        </div>
                      </div>
                    </div>
                    <StatusPill status={project.status} />
                  </div>

                  {/* WhatsApp Bubbles Container */}
                  <div className="p-4 sm:p-5 flex flex-col gap-3">
                    {/* Incoming Client Bubble */}
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-[14px] rounded-tl-none px-3.5 py-2.5 bg-white dark:bg-[#1F2C34] text-[var(--ink)] shadow-sm text-[14px] leading-snug">
                        <p className="m-0 text-[14px]">
                          Can we change the festive sale banner and add discounts tonight before the weekend rush?
                        </p>
                        <span className="block text-right text-[10px] text-[var(--muted)] mt-1">
                          08:14 PM
                        </span>
                      </div>
                    </div>

                    {/* Outgoing Ansh Reply */}
                    <div className="flex justify-end">
                      <div className="max-w-[85%] rounded-[14px] rounded-tr-none px-3.5 py-2.5 bg-[#DCF8C6] dark:bg-[#005C4B] text-slate-900 dark:text-white shadow-sm text-[14px] leading-snug">
                        <p className="m-0 text-[14px]">
                          You can edit banners directly from your phone in 10 seconds — no code needed. Changes appear live on the site immediately!
                        </p>
                        <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500 dark:text-emerald-200 mt-1">
                          <span>08:15 PM</span>
                          <span className="text-blue-500 font-bold">✓✓</span>
                        </div>
                      </div>
                    </div>

                    {/* Follow-up Client reaction */}
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-[14px] rounded-tl-none px-3.5 py-2 bg-white dark:bg-[#1F2C34] text-[var(--ink)] shadow-sm text-[13px]">
                        <span>Done! Banner is live. Incredible how simple it is 🙌</span>
                        <span className="block text-right text-[10px] text-[var(--muted)] mt-0.5">08:16 PM</span>
                      </div>
                    </div>
                  </div>

                  {/* Chat Tap Prompt Footer */}
                  <div className="px-4 py-2.5 bg-white/70 dark:bg-[#1F2C34]/80 border-t border-[var(--line)] flex items-center justify-between text-[12px] text-[var(--muted)]">
                    <span>Zero-code CMS for retail store</span>
                    <span className="text-[var(--brand)] font-bold">View full story &rarr;</span>
                  </div>
                </div>
              )}

              {/* ========================================================
                  STYLE 6: COMMIT (GitHub & Developer Terminal style)
                  ======================================================== */}
              {postCard.postStyle === 'commit' && (
                <div className="rounded-[22px] bg-[#0D1117] text-white overflow-hidden border border-slate-800 shadow-2xl flex flex-col font-mono">
                  {/* macOS Terminal Window Header */}
                  <div className="px-4 py-3 bg-[#161B22] border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#FF5F56] inline-block" />
                      <span className="w-3 h-3 rounded-full bg-[#FFBD2E] inline-block" />
                      <span className="w-3 h-3 rounded-full bg-[#27C93F] inline-block" />
                      <span className="text-slate-400 text-[12px] ml-2 font-mono">
                        bash — {project.slug} / main
                      </span>
                    </div>
                    <StatusPill status={project.status} />
                  </div>

                  {/* Git Commit Metadata */}
                  <div className="p-4 sm:p-5 pb-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/40 text-[11px]">
                          ✓ 138/138 tests passing
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                          commit 8b0c5e9
                        </span>
                      </div>
                      <span className="text-slate-400 text-[11px]">master branch</span>
                    </div>

                    <p className="text-slate-200 font-sans text-[14px] leading-relaxed m-0 mb-3">
                      {postCard.postText || project.oneLiner}
                    </p>

                    {/* Code Snippet / Terminal Diff Block */}
                    <div className="rounded-xl bg-[#030712] p-3.5 border border-slate-800 text-[12px] text-teal-300 leading-normal overflow-x-auto shadow-inner">
                      <pre className="m-0 font-mono">
                        <code>
                          {postCard.codeSnippet ||
                            `class SpendGuard:\n    def evaluate(self, proposal: Action) -> Decision:\n        if proposal.amount > 0 and not proposal.has_human_approval:\n            return Decision.BLOCK_PENDING_APPROVAL`}
                        </code>
                      </pre>
                    </div>
                  </div>

                  {/* Terminal Footer */}
                  <div className="px-4 py-2.5 bg-[#161B22] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-sans">
                    <span>100% deterministic code & append-only ledger</span>
                    <span className="text-emerald-400 font-mono font-semibold">Inspect architecture &rarr;</span>
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>

      {/* "More work" toggle for supporting projects */}
      {supportingProjects.length > 0 && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setShowSupporting((prev) => !prev)}
            className="px-6 py-2.5 rounded-full text-[14px] font-semibold border border-[var(--line)] hover:border-[var(--brand)] bg-[var(--surface)] text-[var(--ink)] hover:text-[var(--brand)] transition-all cursor-pointer shadow-sm hover:shadow"
          >
            {showSupporting
              ? 'Show fewer projects'
              : `More work (${supportingProjects.length} more systems)`}
          </button>
        </div>
      )}
    </section>
  )
}
