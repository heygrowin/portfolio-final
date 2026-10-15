'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Hero, HeroProps } from './Hero'
import { NightToDay } from './NightToDay'
import { ThreeFacts, FactItem } from './ThreeFacts'
import { WorkFeed, ProjectCardData, getEffectiveSlug } from './WorkFeed'
import { StorySheet, FullProjectStory } from './StorySheet'
import { GrowthTimeline, TimelineItemData } from './GrowthTimeline'
import { AudienceTabs } from './AudienceTabs'
import { Cinema, CinemaProps } from './Cinema'
import { Achievements, AchievementItemData } from './Achievements'
import { Contact, ContactProps } from './Contact'
import { Education } from './Education'
import { FloatingNav, NavItem } from './FloatingNav'

export interface PortfolioPageProps {
  hero: HeroProps
  facts: FactItem[]
  projects: FullProjectStory[]
  timelineItems: TimelineItemData[]
  achievements: AchievementItemData[]
  cinema: CinemaProps
  audienceTabsData: {
    heading?: string
    hire: { heading: string; text: string; buttonText: string; buttonLink: string }
    client: { heading: string; text: string; buttonText: string; buttonLink: string }
    build: { heading: string; text: string; buttonText: string; buttonLink: string }
  }
  contact: ContactProps
  navItems: NavItem[]
  initialAudience?: 'hire' | 'client' | 'build'
  blockOrder?: string[]
}

export function PortfolioPage({
  hero,
  facts,
  projects,
  timelineItems,
  achievements,
  cinema,
  audienceTabsData,
  contact,
  navItems,
  initialAudience = 'hire',
  blockOrder,
}: PortfolioPageProps) {
  const [activeAudience, setActiveAudience] = useState<'hire' | 'client' | 'build'>(
    initialAudience
  )
  const [activeStory, setActiveStory] = useState<FullProjectStory | null>(null)
  const [isHeroComplete, setIsHeroComplete] = useState<boolean>(false)

  // 1. Sync URL query parameter ?for=hire|client|build
  const handleSelectAudience = useCallback((aud: 'hire' | 'client' | 'build') => {
    setActiveAudience(aud)
    try {
      const url = new URL(window.location.href)
      url.searchParams.set('for', aud)
      window.history.replaceState(null, '', url.toString())
    } catch {
      // ignore
    }
  }, [])

  // 2. Hash deep-linking logic with privacy redirect rules
  const handleHashChange = useCallback(() => {
    const rawHash = window.location.hash.replace(/^#/, '').trim()
    if (!rawHash) {
      setActiveStory(null)
      return
    }

    // Find project matching either real slug or anonymousSlug
    const matched = projects.find(
      (p) => p.slug === rawHash || p.anonymousSlug === rawHash
    )

    if (matched) {
      const permitted = Boolean(matched.client?.clientPermission)
      const correctSlug = permitted ? matched.slug : (matched.anonymousSlug || matched.slug)

      // If hash differs from the required privacy slug, update URL cleanly
      if (rawHash !== correctSlug) {
        try {
          window.history.replaceState(null, '', `#${correctSlug}`)
        } catch {
          // ignore
        }
      }

      setActiveStory(matched)
    } else {
      setActiveStory(null)
    }
  }, [projects])

  useEffect(() => {
    // Check initial hash on mount
    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [handleHashChange])

  // 3. Open and close story sheet
  const handleOpenStory = (project: FullProjectStory) => {
    const effectiveSlug = getEffectiveSlug(project)
    try {
      window.history.pushState(null, '', `#${effectiveSlug}`)
    } catch {
      // ignore
    }
    setActiveStory(project)
  }

  const handleCloseStory = () => {
    setActiveStory(null)
    try {
      const cleanUrl = window.location.pathname + window.location.search
      window.history.pushState(null, '', cleanUrl)
    } catch {
      // ignore
    }
  }

  // 4. Block reordering based on active audience
  // Audience tags priority: blocks that contain activeAudience are prioritized
  const blocks = useMemo(() => {
    const blockList = [
      {
        id: 'facts',
        audiences: ['hire', 'client', 'build'],
        component: <ThreeFacts key="facts" facts={facts} anchorId="facts" />,
      },
      {
        id: 'work',
        audiences: ['hire', 'client', 'build'],
        component: (
          <WorkFeed
            key="work"
            heading="Work"
            description="Real systems solving real problems for real people."
            projects={projects}
            onOpenStory={handleOpenStory}
            anchorId="work"
          />
        ),
      },
      {
        id: 'timeline',
        audiences: ['hire', 'build'],
        component: (
          <GrowthTimeline
            key="timeline"
            heading="Growth"
            items={timelineItems}
            anchorId="timeline"
          />
        ),
      },
      {
        id: 'services',
        audiences: ['hire', 'client', 'build'],
        component: (
          <AudienceTabs
            key="services"
            heading={audienceTabsData.heading}
            activeAudience={activeAudience}
            onSelectAudience={handleSelectAudience}
            hireTab={audienceTabsData.hire}
            clientTab={audienceTabsData.client}
            buildTab={audienceTabsData.build}
            anchorId="services"
          />
        ),
      },
      {
        id: 'cinema',
        audiences: ['build'],
        component: <Cinema key="cinema" {...cinema} anchorId="cinema" />,
      },
      {
        id: 'achievements',
        audiences: ['hire', 'client', 'build'],
        component: (
          <Achievements
            key="achievements"
            heading="Achievements"
            items={achievements}
            anchorId="achievements"
          />
        ),
      },
      {
        id: 'contact',
        audiences: ['hire', 'client', 'build'],
        component: (
          <Contact
            key="contact"
            activeAudience={activeAudience}
            {...contact}
            anchorId="contact"
          />
        ),
      },
      {
        id: 'education',
        audiences: ['hire', 'client', 'build'],
        component: <Education key="education" anchorId="education" />,
      },
    ]

    return blockList
  }, [
    facts,
    projects,
    timelineItems,
    achievements,
    cinema,
    audienceTabsData,
    contact,
    activeAudience,
    handleSelectAudience,
  ])

  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors">
      {/* 4.11 Floating Navigation */}
      <FloatingNav
        items={navItems}
        isHeroComplete={isHeroComplete}
        isSheetOpen={Boolean(activeStory)}
      />

      {/* 4.1 Hero Signature Moment */}
      <Hero
        {...hero}
        onHeroComplete={() => setIsHeroComplete(true)}
      />

      {/* 4.2 Night to Day Scroll Transition */}
      <NightToDay />

      {/* Main Dynamic Blocks Stream */}
      <main className="w-full">
        {blocks.map((b) => b.component)}
      </main>

      {/* 4.5 Full-screen Story Sheet */}
      <StorySheet
        project={activeStory}
        allProjects={projects}
        onClose={handleCloseStory}
        onSelectProject={handleOpenStory}
      />

      {/* Footer */}
      <footer className="w-full py-12 px-5 border-t border-[var(--line)] text-center text-[13px] text-[var(--muted)]">
        <p className="m-0 mb-1">
          Ansh Rajput · Messina, Italy · Built with Payload CMS & Next.js
        </p>
        <p className="m-0 text-[12px]">
          Honest by design. Client names displayed only with verified permission.
        </p>
      </footer>
    </div>
  )
}
